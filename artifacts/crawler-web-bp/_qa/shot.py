#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""QA 截图：用系统 Chrome (Playwright channel=chrome) 打开单文件 HTML，
逐个场景等待动画播完后截图，并收集 console / pageerror。

用法：
  python shot.py                     # 全部场景，输出到 _qa/
  python shot.py --idx 1 5 10        # 指定场景（1-based）
  python shot.py --theme paper       # 纸面主题
  python shot.py --wait 3000         # 每屏等待毫秒
"""
import argparse
import json
import pathlib
import shutil
import sys

HERE = pathlib.Path(__file__).parent
HTML = HERE.parent / "index.html"
OUT = HERE


def freeze():
    """冻结一份快照再截图，避免与 builder 的并发 build.py 竞态。"""
    if not HTML.exists():
        raise SystemExit("index.html missing, run build.py first")
    snap = HERE / "_snapshot.html"
    shutil.copyfile(HTML, snap)
    return snap


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--idx", nargs="*", type=int, default=None)
    ap.add_argument("--theme", default="paper")
    ap.add_argument("--wait", type=int, default=2400)
    ap.add_argument("--width", type=int, default=1600)
    ap.add_argument("--height", type=int, default=900)
    ap.add_argument("--prefix", default="")
    args = ap.parse_args()

    from playwright.sync_api import sync_playwright

    outdir = OUT / (args.prefix or args.theme)
    outdir.mkdir(parents=True, exist_ok=True)

    problems = []
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)
        page = browser.new_page(
            viewport={"width": args.width, "height": args.height},
            device_scale_factor=1,
        )
        page.on("console", lambda m: problems.append("[console.%s] %s" % (m.type, m.text))
                if m.type in ("error", "warning") else None)
        page.on("pageerror", lambda e: problems.append("[pageerror] %s" % e))

        url = freeze().as_uri()
        page.goto(url, wait_until="load")
        page.wait_for_timeout(600)

        n = page.eval_on_selector_all(".scene", "els => els.length")
        page.evaluate("(t) => document.documentElement.setAttribute('data-theme', t)", args.theme)
        idxs = args.idx if args.idx else list(range(1, n + 1))

        print("scenes=%d  theme=%s  wait=%dms" % (n, args.theme, args.wait))
        for i in idxs:
            page.evaluate("(i) => { location.hash = '#/' + i; }", i)
            page.evaluate("() => { const s = document.querySelector('.scene.is-active'); if (s) s.scrollTop = 0; }")
            page.wait_for_timeout(args.wait)
            title = page.evaluate(
                "() => { const s=document.querySelector('.scene.is-active'); return s ? (s.getAttribute('data-nav')||s.id) : 'NONE'; }")
            nav = page.evaluate("() => document.querySelectorAll('.rail-item.is-active').length")
            name = "%02d-%s" % (i, str(title).replace("/", "_").replace(" ", ""))
            path = outdir / (name + ".png")
            page.screenshot(path=str(path), full_page=False)
            size = path.stat().st_size // 1024
            print("  [%02d] %-28s -> %s (%d KB) activeNav=%d" % (i, title, path.name, size, nav))

        browser.close()

    if problems:
        print("\nPROBLEMS:")
        for x in problems[:40]:
            print("  " + x)
        (outdir / "_problems.json").write_text(json.dumps(problems, ensure_ascii=False, indent=1), "utf-8")
    else:
        print("\nno console/page errors")
    return 0


if __name__ == "__main__":
    sys.exit(main())
