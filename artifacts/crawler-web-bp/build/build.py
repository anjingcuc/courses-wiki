#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""把 build/shell.html + build/scenes/* 组装成单文件 index.html（无外链、可离线）。

场景文件约定（同一 stem 三件套，按文件名排序决定顺序）：
  scenes/02-flow.html   片段：<section class="scene" id="sc-flow" data-nav="…" data-kicker="…"> … </section>
  scenes/02-flow.css    样式：必须以 #sc-flow 或 .sc-flow 作用域开头
  scenes/02-flow.js     JS：BP.scene('sc-flow', function(root, gsap, api){ … return {replay(), onKey()} })
"""
import pathlib
import re
import sys
import os

ROOT = pathlib.Path(__file__).parent
PROJ = ROOT.parent
REPO = PROJ.parent.parent
SHELL = ROOT / "shell.html"
SCENE_DIR = ROOT / os.environ.get("BP_SCENE_DIR", "scenes-v3")
GSAP = REPO / "docs" / "javascripts" / "vendor" / "gsap.min.js"
OUT = PROJ / "index.html"


def fail(msg):
    print("BUILD FAILED: " + msg, file=sys.stderr)
    sys.exit(1)


def main():
    if not SHELL.exists():
        fail("missing shell.html")
    shell = SHELL.read_text("utf-8")
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

    out = shell
    out = out.replace("<!--@SCENE_STYLES-->", "\n".join(styles))
    out = out.replace("<!--@SCENES-->", "\n\n".join(sections))
    out = out.replace("<!--@SCENE_SCRIPTS-->", "\n".join(scripts))
    out = out.replace("<!--@GSAP-->", gsap)

    for ph in ("@SCENE_STYLES", "@SCENES", "@SCENE_SCRIPTS", "@GSAP"):
        if "<!--" + ph + "-->" in out:
            fail("placeholder not replaced: " + ph)

    OUT.write_text(out, "utf-8")
    kb = len(out.encode("utf-8")) / 1024
    print("OK  ->  %s" % OUT)
    print("    scenes : %d  (%s)" % (len(stems), ", ".join(stems)))
    print("    size   : %.0f KB" % kb)
    if warns:
        print("\nWARN:")
        for w in warns:
            print("  - " + w)
    return 0


if __name__ == "__main__":
    sys.exit(main())
