from __future__ import annotations

import json
import re
import subprocess
import threading
import traceback
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[3]
OUT = Path(__file__).resolve().parent
DECK = ROOT / "docs/python/v2/slides/w07.html"
LAB = ROOT / "docs/python/demos/w07-visualization-lab.html"
RESULTS: list[dict] = []
SCREENSHOTS: list[str] = []
HEALTH: list[dict] = []


def expect(name: str, condition: bool, detail: str = "") -> None:
    row = {"name": name, "passed": bool(condition), "detail": detail}
    RESULTS.append(row)
    print(("PASS" if condition else "FAIL") + " | " + name + (" | " + detail if detail else ""), flush=True)


def run_block(name: str, fn) -> None:
    try:
        fn()
    except Exception as exc:
        expect(name, False, f"{type(exc).__name__}: {exc}")
        print(traceback.format_exc(), flush=True)


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, fmt, *args):
        return


def shot(page, name: str, full_page: bool = False) -> None:
    path = OUT / name
    page.screenshot(path=str(path), full_page=full_page)
    SCREENSHOTS.append(name)


def static_checks() -> None:
    deck = DECK.read_text(encoding="utf-8")
    lab = LAB.read_text(encoding="utf-8")
    slides = re.findall(r'<section class="slide(?:\s|\")', deck)
    expect("deck has 13 slides", len(slides) == 13, f"found={len(slides)}")
    expect("week-level title retained", "<title>W7 数据可视化与虚拟环境 | Python V2</title>" in deck)
    expect("WEEKMAP marker pair retained", deck.count("WEEKMAP:BEGIN button") == 1 and deck.count("WEEKMAP:END button") == 1)
    expect("canonical legacy chapter retained", 'href="../../data-process-and-visualization/slideshow.html"' in deck)
    expect("100-minute schedule and A 0–58 boundary", "今日课表（100 分钟）" in deck and "0–58 分钟" in deck and 'class="seg-b"' in deck)
    expect("A/B cover and final primary next link", deck.count('href="w07-venv.html"') >= 4 and "主下一步 · 58–100 分钟" in deck)
    expect("no phantom weather.csv read", not re.search(r"read_csv\s*\([^)]*weather\.csv", deck))
    expect("browser Pandas wording is scoped", "当前浏览器 Python 运行场尚未加载 Pandas" in deck and "浏览器运行场装不了 Pandas" not in deck)
    for mode in ("pipeline", "charts", "mapping"):
        pattern = rf'<iframe src="../../demos/w07-visualization-lab\.html\?mode={mode}" loading="lazy" title="[^"]+"></iframe>'
        expect(f"deck iframe contract: {mode}", bool(re.search(pattern, deck)))
        expect(f"new-window link: {mode}", f'href="../../demos/w07-visualization-lab.html?mode={mode}" target="_blank" rel="noopener"' in deck)
    quiz_match = re.search(r'<script type="application/json" class="quiz-data">(.*?)</script>', deck, re.S)
    quiz = json.loads(quiz_match.group(1)) if quiz_match else {}
    expect("visualization quiz has exactly 3 questions", len(quiz.get("questions", [])) == 3)
    expect("no virtual-environment question remains in A quiz", all("requirements" not in q["q"] and "venv" not in q["q"] for q in quiz.get("questions", [])))
    expect("lab is self-contained without external assets", "<script src=" not in lab and "<link " not in lab and "https://" not in lab and "http://" not in lab)
    expect("lab discloses simulation and no file writes", "教学仿真" in lab and "不写本地文件" in lab)
    script_body = re.search(r"<script>(.*?)</script>", lab, re.S)
    expect("one inline JavaScript block", script_body is not None)
    if script_body:
        js_path = OUT / "lab-inline.js"
        js_path.write_text(script_body.group(1), encoding="utf-8")
        proc = subprocess.run(["node", "--check", str(js_path)], capture_output=True, text=True)
        expect("inline JavaScript passes node --check", proc.returncode == 0, (proc.stderr or proc.stdout).strip())
    expect("no external chart/runtime libraries", all(token not in lab.lower() for token in ("echarts", "chart.js", "d3.min", "pyodide", "gsap")))


def attach_health(page, label: str, port: int) -> None:
    state = {"label": label, "console_errors": [], "page_errors": [], "http_errors": [], "external_requests": []}
    HEALTH.append(state)
    page.on("console", lambda msg: state["console_errors"].append(msg.text) if msg.type == "error" else None)
    page.on("pageerror", lambda err: state["page_errors"].append(str(err)))
    page.on("response", lambda response: state["http_errors"].append(f"{response.status} {response.url}") if response.status >= 400 else None)
    def request_handler(request):
        parsed = urlparse(request.url)
        if parsed.scheme in ("http", "https") and not (parsed.hostname == "127.0.0.1" and parsed.port == port):
            state["external_requests"].append(request.url)
    page.on("request", request_handler)


def overflow_detail(page) -> str:
    return json.dumps(page.evaluate("""() => ({
      inner: innerWidth,
      doc: document.documentElement.scrollWidth,
      body: document.body.scrollWidth
    })"""), ensure_ascii=False)


def target_sizes(page) -> list[dict]:
    return page.evaluate("""() => Array.from(document.querySelectorAll('button, .mode-link'))
      .filter(el => !el.closest('[hidden]') && !el.classList.contains('skip-link'))
      .filter(el => { const s=getComputedStyle(el), r=el.getBoundingClientRect(); return s.display!=='none' && s.visibility!=='hidden' && r.width>0 && r.height>0; })
      .map(el => ({name:el.textContent.trim().slice(0,30), w:Math.round(el.getBoundingClientRect().width), h:Math.round(el.getBoundingClientRect().height)}))
      .filter(x => x.w < 44 || x.h < 44)""")


def deck_target_sizes(page) -> list[dict]:
    return page.evaluate("""() => Array.from(document.querySelectorAll('.sl-top a, .sl-bar button, .w07-action, .demo-open, .pyv2-quiz .opt'))
      .filter(el => { const s=getComputedStyle(el), r=el.getBoundingClientRect(); return s.display!=='none' && s.visibility!=='hidden' && r.width>0 && r.height>0; })
      .map(el => ({name:el.textContent.trim().slice(0,30), w:Math.round(el.getBoundingClientRect().width), h:Math.round(el.getBoundingClientRect().height)}))
      .filter(x => x.w < 44 || x.h < 44)""")


def test_pipeline(port: int) -> None:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1366, "height": 768})
        page = context.new_page(); attach_health(page, "pipeline-desktop", port)
        page.goto(f"http://127.0.0.1:{port}/docs/python/demos/w07-visualization-lab.html?mode=pipeline", wait_until="networkidle")
        expect("pipeline initial raw 9 rows", page.locator("#pipe-table tbody tr").count() == 9)
        expect("normal-motion pipeline autoplay remains enabled", not page.locator("#pipe-play").is_disabled())
        expect("pipeline initial chart has 8 real bars + missing marker", page.locator("#pipe-svg .bar-shape").count() == 8 and "缺失" in page.locator("#pipe-svg").text_content())
        expect("pipeline initial code defines records and df", "records = [" in page.locator("#pipe-code").inner_text() and "pd.DataFrame(records)" in page.locator("#pipe-code").inner_text())
        shot(page, "pipeline-1366.png")
        page.locator("#pipe-next").click()
        expect("pipeline clean synchronizes 8 rows and 8 bars", page.locator("#pipe-table tbody tr").count() == 8 and page.locator("#pipe-svg .bar-shape").count() == 8)
        expect("pipeline clean readout is synchronized", "9 行" in page.locator("#pipe-readout").inner_text() or "剩余 8 行" in page.locator("#pipe-readout").inner_text())
        page.locator("#pipe-next").click()
        summary = page.locator("#pipe-table").inner_text()
        expect("pipeline group has 3 sorted rows", page.locator("#pipe-table tbody tr").count() == 3 and all(x in summary for x in ("32.0", "29.0", "27.3")))
        expect("pipeline group chart has 3 bars", page.locator("#pipe-svg .bar-shape").count() == 3)
        page.locator("#pipe-next").click()
        expect("pipeline final exposes save simulation", page.locator("#pipe-save").is_visible() and "savefig" in page.locator("#pipe-code").inner_text())
        page.locator("#pipe-save").click()
        expect("save simulation does not claim a real file", "未生成本地文件" in page.locator("#pipe-save-state").inner_text())
        page.locator("#pipe-reset").click()
        expect("pipeline reset restores step 1 and raw rows", page.locator("#pipe-table tbody tr").count() == 9 and page.locator('[data-pipe-step="0"]').get_attribute("aria-current") == "step")
        page.locator("#pipe-play").click()
        page.wait_for_timeout(3900)
        expect("pipeline play reaches plot/save and stops", page.locator("#pipe-step-no").inner_text() == "STEP 04 / 04" and page.locator("#pipe-play").get_attribute("aria-pressed") == "false")
        page.locator("#pipe-reset").click(); page.locator("#pipe-play").click(); page.wait_for_timeout(1000)
        page.evaluate("""() => {
          Object.defineProperty(document, 'hidden', {configurable:true, get:() => true});
          document.dispatchEvent(new Event('visibilitychange'));
        }""")
        hidden_step = page.locator("#pipe-step-no").inner_text()
        expect("page hidden event stops normal autoplay state", page.locator("#pipe-play").get_attribute("aria-pressed") == "false")
        page.wait_for_timeout(1100)
        expect("page hidden clears timer so step cannot advance", page.locator("#pipe-step-no").inner_text() == hidden_step)
        page.evaluate("""() => {
          Object.defineProperty(document, 'hidden', {configurable:true, get:() => false});
          document.dispatchEvent(new Event('visibilitychange'));
        }""")
        expect("pipeline desktop has no page-level horizontal overflow", page.evaluate("document.documentElement.scrollWidth <= innerWidth"), overflow_detail(page))
        expect("pipeline visible controls meet 44px targets", not target_sizes(page), json.dumps(target_sizes(page), ensure_ascii=False))
        page.set_viewport_size({"width": 390, "height": 844})
        page.locator("#pipe-reset").click()
        page.wait_for_timeout(150)
        expect("pipeline 390px has no page-level horizontal overflow", page.evaluate("document.documentElement.scrollWidth <= innerWidth"), overflow_detail(page))
        expect("pipeline 390px controls meet 44px targets", not target_sizes(page), json.dumps(target_sizes(page), ensure_ascii=False))
        shot(page, "pipeline-390.png", full_page=True)
        context.close(); browser.close()


def test_charts(port: int) -> None:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1920, "height": 1080})
        page = context.new_page(); attach_health(page, "charts-desktop", port)
        page.goto(f"http://127.0.0.1:{port}/docs/python/demos/w07-visualization-lab.html?mode=charts", wait_until="networkidle")
        expect("charts initial comparison/bar is complete", page.locator("#chart-svg .bar-shape").count() == 3 and "推荐：柱状图" in page.locator("#chart-feedback").inner_text())
        page.locator('[data-task="trend"]').click()
        expect("task switch retains readable data while awaiting chart", page.locator("#chart-table tbody tr").count() == 3 and "先选择一种图型" in page.locator("#chart-svg").text_content())
        page.locator('[data-chart="pie"]').click()
        expect("wrong pie choice redraws and explains false whole", page.locator("#chart-svg path").count() == 3 and "再想想" in page.locator("#chart-feedback").inner_text() and "整体" in page.locator("#chart-feedback").inner_text())
        page.locator('[data-chart="line"]').click()
        expect("trend line and reason synchronize", page.locator("#chart-svg polyline").count() == 1 and "推荐：折线图" in page.locator("#chart-feedback").inner_text())
        page.locator('[data-task="proportion"]').click(); page.locator('[data-chart="pie"]').click()
        expect("proportion pie uses record counts, not temperature", all(x in page.locator("#chart-summary").inner_text() for x in ("25%", "37.5%", "记录数占比")))
        shot(page, "charts-1920.png")
        page.locator('[data-chart="line"]').click()
        expect("wrong proportion line gives teaching feedback", "城市类别没有连续顺序" in page.locator("#chart-feedback").inner_text())
        page.locator("#chart-reset").click()
        expect("charts reset restores comparison/bar", page.locator('[data-task="comparison"]').get_attribute("aria-pressed") == "true" and page.locator('[data-chart="bar"]').get_attribute("aria-pressed") == "true")
        expect("charts desktop has no page-level horizontal overflow", page.evaluate("document.documentElement.scrollWidth <= innerWidth"), overflow_detail(page))
        expect("charts desktop controls meet 44px targets", not target_sizes(page), json.dumps(target_sizes(page), ensure_ascii=False))
        page.set_viewport_size({"width": 390, "height": 844}); page.wait_for_timeout(150)
        expect("charts 390px has no page-level horizontal overflow", page.evaluate("document.documentElement.scrollWidth <= innerWidth"), overflow_detail(page))
        expect("charts 390px controls meet 44px targets", not target_sizes(page), json.dumps(target_sizes(page), ensure_ascii=False))
        shot(page, "charts-390.png", full_page=True)
        # Standalone file:// opening is a hard requirement.
        file_page = context.new_page(); attach_health(file_page, "charts-file-url", port)
        file_page.goto(LAB.as_uri() + "?mode=charts", wait_until="load")
        expect("standalone demo opens via file://", file_page.locator("#mode-charts").is_visible() and file_page.locator("#chart-svg .bar-shape").count() == 3)
        context.close(); browser.close()


def test_mapping(port: int) -> None:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1366, "height": 768})
        page = context.new_page(); attach_health(page, "mapping-desktop", port)
        page.goto(f"http://127.0.0.1:{port}/docs/python/demos/w07-visualization-lab.html?mode=mapping", wait_until="networkidle")
        expect("mapping has 8 table buttons and 8 SVG keyboard buttons", page.locator("[data-map-row]").count() == 8 and page.locator('#mapping-svg g[role="button"]').count() == 8)
        page.locator('[data-map-row="r05"]').click()
        expect("table row selects corresponding SVG element", page.locator('#mapping-svg [data-row-id="r05"]').get_attribute("aria-pressed") == "true" and "27℃" in page.locator("#map-record").inner_text())
        shot(page, "mapping-1366.png")
        svg_r02 = page.locator('#mapping-svg [data-row-id="r02"]')
        svg_r02.focus(); svg_r02.press("Enter")
        expect("SVG keyboard selection selects corresponding table row", page.locator('[data-map-row="r02"]').get_attribute("aria-pressed") == "true" and "30℃" in page.locator("#map-record").inner_text())
        page.locator('[data-map-row="r04"]').focus(); page.locator('[data-map-row="r04"]').press("Space")
        expect("table button Space selection works", page.locator('#mapping-svg [data-row-id="r04"]').get_attribute("aria-pressed") == "true")
        expect("mapping has explicit missing-row explanation", "r03" in page.locator(".mapping-table .table-note").inner_text())
        page.locator("#map-reset").click()
        expect("mapping reset selects r01 on both sides", page.locator('[data-map-row="r01"]').get_attribute("aria-pressed") == "true" and page.locator('#mapping-svg [data-row-id="r01"]').get_attribute("aria-pressed") == "true")
        expect("mapping desktop has no page-level horizontal overflow", page.evaluate("document.documentElement.scrollWidth <= innerWidth"), overflow_detail(page))
        expect("mapping desktop controls meet 44px targets", not target_sizes(page), json.dumps(target_sizes(page), ensure_ascii=False))
        page.set_viewport_size({"width": 390, "height": 844}); page.wait_for_timeout(150)
        expect("mapping 390px has no page-level horizontal overflow", page.evaluate("document.documentElement.scrollWidth <= innerWidth"), overflow_detail(page))
        expect("mapping 390px controls meet 44px targets", not target_sizes(page), json.dumps(target_sizes(page), ensure_ascii=False))
        shot(page, "mapping-390.png", full_page=True)
        context.close(); browser.close()


def test_reduced_motion(port: int) -> None:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1366, "height": 768}, reduced_motion="reduce")
        page = context.new_page(); attach_health(page, "pipeline-reduced", port)
        page.goto(f"http://127.0.0.1:{port}/docs/python/demos/w07-visualization-lab.html?mode=pipeline", wait_until="networkidle")
        expect("reduced-motion disables autoplay with visible explanation", page.locator("#pipe-play").is_disabled() and page.locator("#pipe-motion-note").is_visible() and "自动播放已停用" in page.locator("#pipe-motion-note").inner_text() and page.locator("#pipe-play").get_attribute("aria-describedby") == "pipe-motion-note")
        page.wait_for_timeout(1100)
        expect("reduced-motion never advances on a timer", page.locator("#pipe-step-no").inner_text() == "STEP 01 / 04" and page.locator("#pipe-table tbody tr").count() == 9)
        page.locator("#pipe-next").click()
        expect("reduced-motion next step is immediate", page.locator("#pipe-step-no").inner_text() == "STEP 02 / 04" and page.locator("#pipe-table tbody tr").count() == 8)
        page.locator('[data-pipe-step="2"]').click()
        expect("reduced-motion step buttons jump immediately", page.locator("#pipe-step-no").inner_text() == "STEP 03 / 04" and page.locator("#pipe-table tbody tr").count() == 3)
        expect("reduced-motion pipeline has no active CSS/Web animations", page.evaluate("document.getAnimations().length") == 0)
        shot(page, "pipeline-reduced.png")
        context.close(); browser.close()


def test_deck(port: int) -> None:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1366, "height": 768})
        page = context.new_page(); attach_health(page, "deck-1366", port)
        page.goto(f"http://127.0.0.1:{port}/docs/python/v2/slides/w07.html#/1", wait_until="networkidle")
        expect("slides.js initializes 13 pages", page.locator(".sl-count").inner_text() == "1 / 13")
        expect("deck desktop primary controls meet 44px targets", not deck_target_sizes(page), json.dumps(deck_target_sizes(page), ensure_ascii=False))
        shot(page, "deck-cover-1366.png")
        page.evaluate("location.hash='#/2'"); page.wait_for_timeout(150)
        expect("deck schedule shows A highlighted and B link", page.locator(".slide.active tr.seg-a").count() == 6 and page.locator('.slide.active tr.seg-b a[href="w07-venv.html"]').count() == 1)
        shot(page, "deck-schedule-1366.png")
        page.evaluate("location.hash='#/6'"); page.wait_for_timeout(400)
        frame = page.frame_locator(".slide.active iframe")
        frame.locator("#pipe-next").click()
        expect("iframe pipeline works inside deck", frame.locator("#pipe-table tbody tr").count() == 8)
        expect("iframe click does not advance deck", page.url.endswith("#/6"), page.url)
        frame.locator("#pipe-next").press("ArrowRight")
        expect("iframe ArrowRight does not advance parent deck", page.url.endswith("#/6"), page.url)
        frame.locator("#pipe-next").press("Space")
        expect("iframe Space activates lab only", frame.locator("#pipe-table tbody tr").count() == 3 and page.url.endswith("#/6"))
        shot(page, "deck-pipeline-1366.png")
        page.locator(".slide.active h2").click(); page.keyboard.press("ArrowRight"); page.wait_for_timeout(250)
        expect("deck keyboard navigation still works outside iframe", page.url.endswith("#/7"), page.url)
        page.set_viewport_size({"width": 1920, "height": 1080}); page.wait_for_timeout(350)
        expect("charts iframe visible on deck page 7", page.frame_locator(".slide.active iframe").locator("#mode-charts").is_visible())
        shot(page, "deck-charts-1920.png")
        page.evaluate("location.hash='#/11'"); page.wait_for_timeout(200)
        expect("deck renders 3 quiz cards", page.locator(".slide.active .pyv2-q").count() == 3)
        correct = [2, 0, 1]
        for i, answer in enumerate(correct):
            page.locator(".slide.active .pyv2-q").nth(i).locator(".opt").nth(answer).click()
        expect("quiz scoring reaches 3/3", "正确 3" in page.locator(".slide.active .quiz-score").inner_text() and "100 分" in page.locator(".slide.active .quiz-score").inner_text())
        page.set_viewport_size({"width": 1366, "height": 768}); shot(page, "deck-quiz-1366.png")
        page.evaluate("location.hash='#/13'"); page.wait_for_timeout(150)
        expect("final page primary next is W07-B", page.locator('.slide.active .w07-next a[href="w07-venv.html"]').count() == 1)
        shot(page, "deck-final-1366.png")
        page.evaluate("location.hash='#/8'"); page.set_viewport_size({"width": 390, "height": 844}); page.wait_for_timeout(350)
        expect("mapping iframe usable at 390px deck width", page.frame_locator(".slide.active iframe").locator("[data-map-row]").count() == 8)
        expect("deck 390px has no page-level horizontal overflow", page.evaluate("document.documentElement.scrollWidth <= innerWidth"), overflow_detail(page))
        expect("deck 390px primary controls meet 44px targets", not deck_target_sizes(page), json.dumps(deck_target_sizes(page), ensure_ascii=False))
        shot(page, "deck-mapping-390.png")
        # Direct deep link, Home and End remain framework-owned.
        page.keyboard.press("End"); page.wait_for_timeout(100)
        expect("deck End reaches final page", page.url.endswith("#/13"), page.url)
        page.keyboard.press("Home"); page.wait_for_timeout(100)
        expect("deck Home returns to cover", page.url.endswith("#/1"), page.url)
        for width, height in ((1366, 768), (1920, 1080), (390, 844)):
            page.set_viewport_size({"width": width, "height": height})
            for number in range(1, 14):
                page.evaluate(f"location.hash='#/{number}'"); page.wait_for_timeout(60)
                dims = page.locator(".slide.active").evaluate("el => ({scroll:el.scrollWidth,client:el.clientWidth})")
                expect(f"deck page {number} has no active-slide horizontal overflow at {width}px", dims["scroll"] <= dims["client"] + 1, json.dumps(dims))
            geometry = page.evaluate("""() => { const h=document.querySelector('.sl-top').getBoundingClientRect(), r=document.querySelector('.pyv2-slides').getBoundingClientRect(); return {headerBottom:h.bottom,rootTop:r.top,rootBottom:r.bottom,innerHeight}; }""")
            expect(f"deck flex shell stays within viewport at {width}px", geometry["headerBottom"] <= geometry["rootTop"] + 1 and geometry["rootBottom"] <= height + 1, json.dumps(geometry))
        context.close(); browser.close()


def health_checks() -> None:
    for state in HEALTH:
        expect(state["label"] + " has no console/page/http errors", not state["console_errors"] and not state["page_errors"] and not state["http_errors"], json.dumps(state, ensure_ascii=False))
        expect(state["label"] + " makes no external requests", not state["external_requests"], json.dumps(state["external_requests"], ensure_ascii=False))


def main() -> None:
    server = ThreadingHTTPServer(("127.0.0.1", 0), partial(QuietHandler, directory=str(ROOT)))
    port = server.server_address[1]
    thread = threading.Thread(target=server.serve_forever, daemon=True); thread.start()
    print(f"Temporary server: http://127.0.0.1:{port} root={ROOT}", flush=True)
    try:
        run_block("static checks exception", static_checks)
        run_block("pipeline browser exception", lambda: test_pipeline(port))
        run_block("charts browser exception", lambda: test_charts(port))
        run_block("mapping browser exception", lambda: test_mapping(port))
        run_block("reduced-motion browser exception", lambda: test_reduced_motion(port))
        run_block("deck browser exception", lambda: test_deck(port))
        health_checks()
    finally:
        server.shutdown(); server.server_close(); thread.join(timeout=3)
    passed = sum(1 for r in RESULTS if r["passed"])
    failed = len(RESULTS) - passed
    summary = {
        "passed": passed,
        "failed": failed,
        "total": len(RESULTS),
        "results": RESULTS,
        "screenshots": SCREENSHOTS,
        "health": HEALTH,
        "scope": [str(DECK.relative_to(ROOT)), str(LAB.relative_to(ROOT))],
        "notes": [
            "Source-tree temporary HTTP server only; no MkDocs build and no site/ writes.",
            "Chromium headless; desktop 1366×768 and 1920×1080; mobile 390×844; reduced-motion context.",
            "w07-venv.html is a sibling deliverable outside this agent's write scope; its content was not executed by this suite."
        ]
    }
    (OUT / "summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"SUMMARY: {passed}/{len(RESULTS)} passed; failed={failed}; screenshots={len(SCREENSHOTS)}", flush=True)
    raise SystemExit(1 if failed else 0)


if __name__ == "__main__":
    main()
