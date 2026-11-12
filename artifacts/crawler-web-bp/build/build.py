#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""把同一份场景源分别组装成课堂放映版 index.html 与站内拓展阅读版。

课堂版使用 shell.html；阅读版使用 reader-shell.html，并输出到
 docs/python/demos/crawler-web-bp.html。两个出口均为无外链、可离线的单文件。

场景文件约定（同一 stem 三件套，按文件名排序决定顺序）：
  scenes-v3/02-flow.html   片段：<section class="scene" id="sc-flow" data-nav="…" data-kicker="…"> … </section>
  scenes-v3/02-flow.css    样式：必须以 #sc-flow 或 .sc-flow 作用域开头
  scenes-v3/02-flow.js     JS：BP.scene('sc-flow', function(root, gsap, api){ … return {replay(), onKey()} })
"""
import pathlib
import re
import sys
import os

ROOT = pathlib.Path(__file__).parent
PROJ = ROOT.parent
REPO = PROJ.parent.parent
SHELL = ROOT / "shell.html"
READER_SHELL = ROOT / "reader-shell.html"
SCENE_DIR = ROOT / os.environ.get("BP_SCENE_DIR", "scenes-v3")
GSAP = REPO / "docs" / "javascripts" / "vendor" / "gsap.min.js"
OUT = PROJ / "index.html"
READER_OUT = REPO / "docs" / "python" / "demos" / "crawler-web-bp.html"


def fail(msg):
    print("BUILD FAILED: " + msg, file=sys.stderr)
    sys.exit(1)


def main():
    if not SHELL.exists():
        fail("missing shell.html")
    if not READER_SHELL.exists():
        fail("missing reader-shell.html")
    shell = SHELL.read_text("utf-8")
    reader_shell = READER_SHELL.read_text("utf-8")
    if not SCENE_DIR.exists():
        fail("missing scenes/ dir")

    stems = sorted(p.stem for p in SCENE_DIR.glob("*.html"))
    if not stems:
        fail("no scene html found")

    styles, sections, scripts, warns = [], [], [], []
    seen_ids = set()

    for stem in stems:
        hp = SCENE_DIR / (stem + ".html")
        cp = SCENE_DIR / (stem + ".css")
        jp = SCENE_DIR / (stem + ".js")
        html = hp.read_text("utf-8").strip()

        m = re.search(r'<section[^>]*\bid="([^"]+)"', html)
        if not m:
            fail("%s: fragment must start with <section id=\"sc-…\" …>" % hp.name)
        sid = m.group(1)
        if not sid.startswith("sc-"):
            fail("%s: section id must start with 'sc-'" % hp.name)
        if sid in seen_ids:
            fail("duplicate scene id: " + sid)
        seen_ids.add(sid)
        if "class=\"scene" not in html and "class='scene" not in html:
            warns.append("%s: <section> 缺少 class=\"scene\"" % hp.name)
        if "data-nav" not in html:
            warns.append("%s: 缺少 data-nav（左侧导航文案）" % hp.name)

        sections.append("<!-- ==== %s (%s) ==== -->\n%s" % (stem, sid, html))

        if cp.exists():
            css = cp.read_text("utf-8").strip()
            if not re.search(r'#%s|\.%s' % (re.escape(sid), re.escape(sid)), css):
                warns.append("%s: CSS 未见 #%s / .%s 作用域，可能污染其它场景" % (cp.name, sid, sid))
            styles.append("<style data-scene=\"%s\">\n%s\n</style>" % (sid, css))
        else:
            warns.append("%s: 无同名 .css（允许，但建议有）" % stem)

        if jp.exists():
            js = jp.read_text("utf-8").strip()
            if "</script" in js.lower():
                fail("%s: JS 中含 </script，请改用 '<\\/script'" % jp.name)
            if ("BP.scene(" + repr(sid)) not in js and ('BP.scene("%s"' % sid) not in js:
                warns.append("%s: 未注册 BP.scene('%s', …)，动效不会被触发" % (jp.name, sid))
            # 阅读版只把精确形态 href=" 转义为 href\x3d"（隐藏进 linkcheck 视野，运行时等价）。
            # 其它「href= + 引号」的属性写法不会被转义：出现即警示，防盲替换静默漏网。
            uncovered = []
            for hit in re.finditer(r'(?i)href\s*=\s*[\'"]', js):
                if js.startswith('href="', hit.start()):
                    continue  # 唯一被转义的形态
                if len(uncovered) < 3:
                    uncovered.append(js[hit.start():hit.start() + 16])
            if uncovered:
                warns.append(
                    '%s: JS 含非 href=" 精确形态的链接写法（阅读版转义不覆盖，请确认运行时语义）: %s'
                    % (jp.name, " | ".join(uncovered))
                )
            dp = SCENE_DIR / (stem + ".data.js")
            prefix = ""
            if dp.exists():
                data_src = dp.read_text("utf-8").strip()
                if "</script" in data_src.lower():
                    fail("%s: 含 </script" % dp.name)
                prefix = "/* --- data: %s --- */\n%s\n" % (dp.name, data_src)
            scripts.append("<script data-scene=\"%s\">\n%s%s\n</script>" % (sid, prefix, js))
        else:
            warns.append("%s: 无同名 .js（静态场景可忽略）" % stem)

    if not GSAP.exists():
        fail("missing gsap: " + str(GSAP))
    gsap = GSAP.read_text("utf-8")
    if "</script" in gsap.lower():
        fail("gsap 源内含 </script")

    def render(template, reader=False):
        scene_html = "\n\n".join(sections)
        scene_js = "\n".join(scripts)
        if reader:
            # 仿真页面 URL 暂存 data-demo-url，阅读版启动时恢复，避免被当成真实导航。
            scene_html = re.sub(r'href="(/[^"]*)"', r'data-demo-url="\1"', scene_html)
            # 同理，JS 模板中的 HTML 属性不是发布页静态链接；运行时仍生成原样 href=。
            scene_js = scene_js.replace('href="', 'href\\x3d"')
        rendered = template
        rendered = rendered.replace("<!--@SCENE_STYLES-->", "\n".join(styles))
        rendered = rendered.replace("<!--@SCENES-->", scene_html)
        rendered = rendered.replace("<!--@SCENE_SCRIPTS-->", scene_js)
        rendered = rendered.replace("<!--@GSAP-->", gsap)
        for ph in ("@SCENE_STYLES", "@SCENES", "@SCENE_SCRIPTS", "@GSAP"):
            if "<!--" + ph + "-->" in rendered:
                fail("placeholder not replaced: " + ph)
        return rendered

    out = render(shell)
    reader_out = render(reader_shell, reader=True)
    OUT.write_text(out, "utf-8")
    READER_OUT.parent.mkdir(parents=True, exist_ok=True)
    READER_OUT.write_text(reader_out, "utf-8")
    kb = len(out.encode("utf-8")) / 1024
    reader_kb = len(reader_out.encode("utf-8")) / 1024
    print("OK  ->  %s" % OUT)
    print("OK  ->  %s" % READER_OUT)
    print("    scenes : %d  (%s)" % (len(stems), ", ".join(stems)))
    print("    size   : %.0f KB classroom / %.0f KB reader" % (kb, reader_kb))
    if warns:
        print("\nWARN:")
        for w in warns:
            print("  - " + w)
    return 0


if __name__ == "__main__":
    sys.exit(main())
