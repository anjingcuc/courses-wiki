"""sync-week-map.py — week-map.json 单一事实源 → 四处静态消费点同步器。

背景：ADR-0001 / issue #15。改映射只改 week-map.json，然后跑本脚本；
--check 模式校验漂移（有差异退出码 1），供提交前/CI 使用。

消费点（首次运行自动包 marker，之后幂等重写 marker 间内容）：
  A. docs/python.md                 各幕周卡片    <!-- WEEKMAP:BEGIN cards:mX --> … <!-- WEEKMAP:END cards:mX -->
  B. docs/python/v2/slides/wXX.html 顶栏对照按钮  <!-- WEEKMAP:BEGIN button --> … <!-- WEEKMAP:END button -->
  C. docs/python/v2/mX.md           页脚周次对照  <!-- WEEKMAP:BEGIN footer --> … <!-- WEEKMAP:END footer -->
  D. material/slideshow.html        播放器反向映射 // WEEKMAP:BEGIN legacy-map … // WEEKMAP:END legacy-map
"""

import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))


def load_map():
    with open(os.path.join(ROOT, "week-map.json"), encoding="utf-8") as f:
        return json.load(f)


WM = load_map()
WEEKS = WM["weeks"]
CHAPTERS = WM["chapters"]


def wnum(w):  # "w05" -> 5
    return int(w["week"][1:])


def wpad(w):  # "w05" -> "W05"
    return "W" + w["week"][1:]


def chap_label(slug):
    c = CHAPTERS[slug]
    return f"第 {c['num']} 章 {c['name']}"


# ---------- A. 主页周卡片 ----------

def gen_card(w):
    wk = w["week"]
    badge = "          <span class=\"wk-badge\">全新内容</span>\n" if w["primary"] is None else ""
    ref = ""
    if w["primary"] is not None:
        pri = f'<a class="pri" href="{w["primary"]}/slideshow.html">{chap_label(w["primary"])}</a>'
        secs = "".join(
            f'<a href="{s}/slideshow.html">{chap_label(s)}</a>' for s in w["secondary"]
        )
        ref = f'          <span class="wk-ref">对照章节 {pri}{secs}</span>\n'
    return (
        '      <div class="pyv2-week-card" data-anim>\n'
        '        <div class="wk-head">\n'
        f'          <span class="wk-no">{wpad(w)}</span>\n'
        f'          <span class="wk-lessons">{w["lessons"]}</span>\n'
        f'{badge}'
        '        </div>\n'
        f'        <b class="wk-title">{w["title"]}</b>\n'
        f'        <p class="wk-summary">{w["summary"]}</p>\n'
        '        <div class="wk-links">\n'
        f'          <a class="wk-go" href="v2/slides/{wk}.html">周课件 →</a>\n'
        f'{ref}'
        '        </div>\n'
        '      </div>\n'
    )


def gen_cards_block(mod):
    cards = "".join(gen_card(w) for w in WEEKS if w["modules"][0] == mod)
    return (
        f'      <!-- WEEKMAP:BEGIN cards:{mod} -->\n'
        f'{cards}'
        f'      <!-- WEEKMAP:END cards:{mod} -->'
    )


# ---------- B. 顶栏「旧版对照」按钮 ----------

def gen_button_block(w):
    inner = ""
    if w["primary"] is not None:
        inner = f'    <a class="legacy" href="../../{w["primary"]}/slideshow.html">旧版对照</a>\n'
    return f'    <!-- WEEKMAP:BEGIN button -->\n{inner}    <!-- WEEKMAP:END button -->'


# ---------- C. 模块页页脚周次对照 ----------

def gen_footer_block(mod):
    ws = [w for w in WEEKS if mod in w["modules"]]
    nums = [wnum(w) for w in ws]
    rng = f"{min(nums)}" if len(nums) == 1 else f"{min(nums)}–{max(nums)}"
    links = " · ".join(
        f'<a href="../slides/{w["week"]}.html" style="color:#0284c7;font-weight:600;">'
        f"W{wnum(w)} {w['title']}</a>"
        for w in ws
    )
    return (
        "<!-- WEEKMAP:BEGIN footer -->\n"
        f'<p style="margin:4px 0 0;font-size:13.5px;color:#64748b;">📽️ 本模块对应第 {rng} 周：{links}</p>\n'
        "<!-- WEEKMAP:END footer -->"
    )


# ---------- D. 播放器反向映射 ----------

def gen_legacy_map_block():
    # 章节 → 周：primary 优先，否则取 secondary 中出现的最小周次（class 章因此归 W4）
    targets = {}
    for slug in CHAPTERS:
        cands = [w for w in WEEKS if w["primary"] == slug]
        if not cands:
            cands = [w for w in WEEKS if slug in w["secondary"]]
        if cands:
            targets[slug] = min(cands, key=wnum)
    lines = [
        f'        "{slug}": {{ w: {wnum(w)}, t: "{w["title"]}" }},'
        for slug, w in targets.items()
    ]
    lines[-1] = lines[-1].rstrip(",")  # 末行去逗号
    return (
        "      // WEEKMAP:BEGIN legacy-map\n"
        "      var LEGACY_TO_WEEK = {\n"
        + "\n".join(lines)
        + "\n      };\n"
        "      // WEEKMAP:END legacy-map"
    )


# ---------- 通用 marker 替换 ----------

def replace_marked(text, begin, end, block, bootstrap):
    """替换 begin…end marker 区间；无 marker 时调用 bootstrap 生成带 marker 的文本。
    注意：pattern 必须吞掉 BEGIN 行的行首缩进（含在替换块内），否则每次运行缩进会累加。"""
    pat = re.compile(
        r"^[ \t]*" + re.escape(begin) + r"[\s\S]*?^[ \t]*" + re.escape(end) + r"[ \t]*$",
        re.M,
    )
    if pat.search(text):
        return pat.sub(lambda _: block, text, count=1)
    return bootstrap(text)


def sync_homepage(text):
    for mod in ["m0", "m1", "m2", "m3", "m4", "m5", "m6"]:
        begin = f"<!-- WEEKMAP:BEGIN cards:{mod} -->"
        end = f"<!-- WEEKMAP:END cards:{mod} -->"
        block = gen_cards_block(mod)

        def bootstrap(t, mod=mod, block=block):
            # 无 marker：定位该幕的 act-weeks 卡片区（act-weeks 以行首 4 空格 </div> 收尾；
            # 卡片内部闭合是 6/8 空格，必须锚定 \n 防止误配）
            pat = re.compile(
                r'(<section class="pyv2-act" id="act-' + mod + r'">[\s\S]*?<div class="act-weeks">\n)'
                r"[\s\S]*?(\n    </div>\n)"
            )
            return pat.sub(lambda m: m.group(1) + block + "\n" + m.group(2).lstrip("\n"), t, count=1)

        text = replace_marked(text, begin, end, block, bootstrap)
    return text


def sync_slide(text, w):
    begin, end = "<!-- WEEKMAP:BEGIN button -->", "<!-- WEEKMAP:END button -->"
    block = gen_button_block(w)

    def bootstrap(t):
        t = re.sub(r'^\s*<a class="legacy"[^>]*>旧版对照</a>\n', "", t, count=1, flags=re.M)
        anchor = '    <a href="../../#weeks">课件总览</a>\n'
        assert anchor in t, f"课件总览 anchor missing in w{w['week']}"
        return t.replace(anchor, anchor + block + "\n", 1)

    return replace_marked(text, begin, end, block, bootstrap)


def sync_module(text, mod):
    begin, end = "<!-- WEEKMAP:BEGIN footer -->", "<!-- WEEKMAP:END footer -->"
    block = gen_footer_block(mod)

    def bootstrap(t):
        pat = re.compile(r'^<p style="margin:4px 0 0;[^"]*">📽️[^\n]*</p>$', re.M)
        m = pat.search(t)
        assert m, f"📽️ footer missing in {mod}"
        return t[: m.start()] + block + t[m.end():]

    return replace_marked(text, begin, end, block, bootstrap)


def sync_player(text):
    begin, end = "// WEEKMAP:BEGIN legacy-map", "// WEEKMAP:END legacy-map"
    block = gen_legacy_map_block()

    def bootstrap(t):
        pat = re.compile(r"      var LEGACY_TO_WEEK = \{[\s\S]*?\n      \};")
        m = pat.search(t)
        assert m, "LEGACY_TO_WEEK missing in material/slideshow.html"
        return t[: m.start()] + block + t[m.end():]

    return replace_marked(text, begin, end, block, bootstrap)


# ---------- 驱动 ----------

def collect():
    """返回 {路径: 新内容}（全部消费点）。"""
    out = {}

    p = os.path.join(ROOT, "docs", "python.md")
    out[p] = sync_homepage(open(p, encoding="utf-8").read())

    for w in WEEKS:
        p = os.path.join(ROOT, "docs", "python", "v2", "slides", f"{w['week']}.html")
        out[p] = sync_slide(open(p, encoding="utf-8").read(), w)

    for mod in ["m0", "m1", "m2", "m3", "m4", "m5", "m6", "m7"]:
        p = os.path.join(ROOT, "docs", "python", "v2", f"{mod}.md")
        out[p] = sync_module(open(p, encoding="utf-8").read(), mod)

    p = os.path.join(ROOT, "material", "slideshow.html")
    out[p] = sync_player(open(p, encoding="utf-8").read())

    return out


def main():
    check = "--check" in sys.argv
    diff = []
    for path, new in collect().items():
        old = open(path, encoding="utf-8").read()
        if old != new:
            diff.append(path)
            if not check:
                with open(path, "w", encoding="utf-8", newline="\n") as f:
                    f.write(new)
    if check:
        if diff:
            print("DRIFT detected (run: uv run python sync-week-map.py):")
            for d in diff:
                print(" ", os.path.relpath(d, ROOT))
            sys.exit(1)
        print("OK: 4 类消费点与 week-map.json 一致，无漂移")
    else:
        print(f"synced {len(diff)} file(s)" if diff else "OK: already in sync")
        for d in diff:
            print(" ", os.path.relpath(d, ROOT))


if __name__ == "__main__":
    main()
