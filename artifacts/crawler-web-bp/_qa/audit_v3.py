#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""v3 七屏：布局、导航与图内交互的一体化回归。"""
import pathlib
import shutil
import sys
import os

HERE = pathlib.Path(__file__).parent
HTML = HERE.parent / "index.html"
EXPECTED = ["sc-overview", "sc-flow", "sc-complete", "sc-dynamic", "sc-selectors", "sc-practice", "sc-summary"]
KEY = {
    "sc-overview": "#ovMap",
    "sc-flow": "#flStage",
    "sc-complete": "#graph",
    "sc-dynamic": "#dgm",
    "sc-selectors": ".sel-main",
    "sc-practice": ".pr-flow",
    "sc-summary": '[data-block="map"]',
}
results = []


def check(name, ok, detail=""):
    results.append((name, bool(ok), detail))
    print(("  PASS  " if ok else "  FAIL  ") + name + (("  — " + str(detail)) if detail else ""))


def main():
    from playwright.sync_api import sync_playwright
    snap = HERE / "_snapshot_v3.html"
    shutil.copyfile(HTML, snap)
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)
        width = int(os.environ.get("BP_QA_WIDTH", "1920"))
        height = int(os.environ.get("BP_QA_HEIGHT", "1080"))
        pg = browser.new_page(viewport={"width": width, "height": height})
        errors = []
        pg.on("pageerror", lambda e: errors.append(str(e)))
        pg.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        pg.goto(snap.as_uri())
        pg.wait_for_timeout(900)

        ids = pg.eval_on_selector_all(".scene", "els => els.map(e => e.id)")
        check("7 屏及顺序正确", ids == EXPECTED, ids)
        check("默认主题与课件站一致（paper）", pg.evaluate("() => document.documentElement.dataset.theme") == "paper")

        def goto(sid, wait=1500):
            idx = EXPECTED.index(sid) + 1
            pg.evaluate("(i) => { location.hash = '#/' + i; }", idx)
            pg.evaluate("() => { const s = document.querySelector('.scene.is-active'); if (s) s.scrollTop = 0; }")
            pg.wait_for_timeout(wait)

        # 导航：滚轮绝不翻张，空格优先页内滚动。
        goto("sc-overview", 800)
        i0 = pg.evaluate("() => BP.idx")
        pg.mouse.move(1100, 600)
        pg.mouse.wheel(0, 700)
        pg.wait_for_timeout(500)
        check("滚轮只滚动不翻张", pg.evaluate("() => BP.idx") == i0)
        pg.keyboard.press("t")
        pg.wait_for_timeout(200)
        check("T 切到深色蓝图", pg.evaluate("() => document.documentElement.dataset.theme") == "blueprint")
        pg.keyboard.press("t")
        pg.wait_for_timeout(200)
        pg.keyboard.press("o")
        pg.wait_for_timeout(200)
        check("目录为 7 张", pg.eval_on_selector_all(".toc-card", "e => e.length") == 7)
        pg.keyboard.press("o")

        # 首屏关键图完整性与横向溢出。
        for sid in EXPECTED:
            goto(sid)
            m = pg.evaluate("""({sid, sel}) => {
              const s = document.getElementById(sid), k = s.querySelector(sel);
              const sr = s.getBoundingClientRect(), r = k.getBoundingClientRect();
              return {overflowX:s.scrollWidth-s.clientWidth, scrollY:s.scrollHeight-s.clientHeight,
                      top:Math.round(r.top-sr.top), bottom:Math.round(r.bottom-sr.top),
                      viewport:s.clientHeight, visible:r.bottom <= sr.top + s.clientHeight + 2 && r.top >= sr.top - 2};
            }""", {"sid": sid, "sel": KEY[sid]})
            check(sid + " 无横向溢出", m["overflowX"] <= 2, m)
            check(sid + " 关键图首屏完整", m["visible"], m)

        # 01：图内阶段节点联动读数。
        goto("sc-overview")
        before = pg.inner_text("#ovRoA")
        pg.click('#sc-overview [data-stage="2"]')
        pg.wait_for_timeout(250)
        check("总图阶段节点驱动读数", pg.inner_text("#ovRoA") != before, before + " → " + pg.inner_text("#ovRoA"))

        # 02：点 SVG 节点打开报文抽屉。
        goto("sc-flow")
        pg.click('#sc-flow [data-step="1"] .fl-box')
        pg.wait_for_timeout(300)
        check("往返图节点展开报文", pg.eval_on_selector("#flDrawer", "e => e.classList.contains('is-open')"))

        # 03：模板节点 + username 参数按钮。
        goto("sc-complete")
        pg.click('#sc-complete [data-node="tpl"]')
        pg.wait_for_timeout(250)
        pg.click('#sc-complete [data-user="小王"]')
        pg.wait_for_timeout(250)
        check("模板案例切换到小王", "username=小王" in pg.inner_text("#inspResp"))

        # 04：点击图内 API 分岔，页内定位到 B 区而不换场景。
        goto("sc-dynamic")
        pg.click('#sc-dynamic .route.is-b')
        pg.wait_for_timeout(700)
        check("动态图分岔定位接口细节", pg.evaluate("() => BP.idx") == 3 and pg.eval_on_selector("#blkB", "e => e.classList.contains('is-flash') || e.getBoundingClientRect().top < innerHeight"))

        # 05：同一工作台执行 CSS 与 XPath。
        goto("sc-selectors")
        pg.fill("#selInput", ".title")
        pg.dispatch_event("#selInput", "input")
        pg.wait_for_timeout(300)
        css_n = int(pg.inner_text("#selN"))
        pg.click('#sc-selectors [data-mode="xpath"]')
        pg.fill("#selInput", "//h3[@class='title']")
        pg.dispatch_event("#selInput", "input")
        pg.wait_for_timeout(300)
        xp_n = int(pg.inner_text("#selN"))
        check("CSS/XPath 命中同一批 3 个标题", css_n == 3 and xp_n == 3, {"css": css_n, "xpath": xp_n})
        rows = pg.locator("#selTree .tr[data-nid]")
        if rows.count() > 5:
            rows.nth(5).click()
            pg.wait_for_timeout(250)
            body = pg.inner_text("#selNodeBody")
            check("点 DOM 节点同时生成两种写法", "CSS" in body and "XPath" in body)

        # 06：案例 A 正确选择后才解锁结果。
        goto("sc-practice")
        pg.click('#sc-practice .pr-opt[data-k="2"]')
        pg.wait_for_timeout(300)
        check("案例 A 即时反馈并解锁代码", pg.locator("#sc-practice .pr-res .pr-ok").count() == 1 and pg.locator("#sc-practice .pr-res .pr-code").count() == 1)
        pg.click('#sc-practice [data-case="B"]')
        pg.wait_for_timeout(200)
        pg.click('#sc-practice .pr-opt[data-k="2"]')
        pg.wait_for_timeout(300)
        check("案例 B 选择直取 JSON", pg.locator("#sc-practice .pr-res .pr-ok").count() == 1 and pg.locator("#sc-practice .pr-res .pr-code").count() == 1)

        # 07：深链、决策树与答题计分。
        goto("sc-summary")
        if pg.get_attribute('#sc-summary .tr-b[data-b="1"]', "aria-expanded") != "true":
            pg.click('#sc-summary .tr-b[data-b="1"]')
        check("决策树分支可展开", pg.get_attribute('#sc-summary .tr-b[data-b="1"]', "aria-expanded") == "true")
        pg.click('#sc-summary .qz-card[data-ans="B"] .qz-opt[data-k="B"]')
        pg.wait_for_timeout(250)
        check("自测答题即时判分", "1" in pg.inner_text("#sc-summary .qz-score"))

        pg.click("#btnReplay")
        pg.wait_for_timeout(500)
        check("重播不产生运行时错误", len(errors) == 0, errors[:3])
        browser.close()

    bad = [r for r in results if not r[1]]
    print("\n%d/%d passed" % (len(results) - len(bad), len(results)))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
