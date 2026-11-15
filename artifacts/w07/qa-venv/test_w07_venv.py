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
DECK = ROOT / "docs/python/v2/slides/w07-venv.html"
LAB = ROOT / "docs/python/demos/w07-venv-lab.html"
MODES = ("case", "conflict", "principles", "ecosystem", "practice", "diagnostics")
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
      .map(el => ({name:el.textContent.trim().slice(0,36), w:Math.round(el.getBoundingClientRect().width), h:Math.round(el.getBoundingClientRect().height)}))
      .filter(x => x.w < 44 || x.h < 44)""")


def deck_target_sizes(page) -> list[dict]:
    return page.evaluate("""() => Array.from(document.querySelectorAll('.sl-top a, .sl-bar button, .w07-action, .demo-open, .pyv2-quiz .opt'))
      .filter(el => { const s=getComputedStyle(el), r=el.getBoundingClientRect(); return s.display!=='none' && s.visibility!=='hidden' && r.width>0 && r.height>0; })
      .map(el => ({name:el.textContent.trim().slice(0,36), w:Math.round(el.getBoundingClientRect().width), h:Math.round(el.getBoundingClientRect().height)}))
      .filter(x => x.w < 44 || x.h < 44)""")


def static_checks() -> None:
    deck = DECK.read_text(encoding="utf-8")
    lab = LAB.read_text(encoding="utf-8")
    slides = re.findall(r'<section class="slide(?:\s|\")', deck)
    expect("deck has 18 slides", len(slides) == 18, f"found={len(slides)}")
    expect("cover identifies W07-B L16 and A link", "W07-B · L16 · 58–100 分钟" in deck and 'href="w07.html"' in deck)
    expect("schedule is shared 100 minutes with B 58–100 highlighted", "今日课表（100 分钟）" in deck and "不是 B 段单独 100 分钟" in deck and deck.count('class="seg-b"') == 4)
    schedule_tokens = ["58–70", "70–86", "86–94", "94–100", "case 58–63", "conflict 63–70", "principles 73–79", "ecosystem 79–86", "practice 88–94", "94–98 四题 Quiz", "98–100 作业说明"]
    expect("B schedule uses exact final-review timing", all(token in deck for token in schedule_tokens), json.dumps([x for x in schedule_tokens if x not in deck], ensure_ascii=False))
    obsolete_times = ["58–64 分钟", "64–72 分钟", "72–80 分钟", "80–86 分钟", "86–92 分钟", "92–96 分钟", "88–95", "95–100"]
    expect("obsolete B page timings are removed", not any(token in deck for token in obsolete_times))
    expect("diagnostics is backup and static recaps add no minutes", "备用 / 课后，不占课内分钟" in deck and deck.count("不另增分钟") >= 7)
    expect("cover distinguishes A weather micro-sample from B answers case", "A 用 9 行天气 records 微样例" in deck and "B 用 10 行 answers.csv 教学合成数据" in deck and "两份课件的数据并不相同" in deck)
    expect("practice page exposes complete UV project archive and instructions", 'href="../../demos/w07-case.zip" download' in deck and 'href="../../demos/w07-case/"' in deck and "下载完整 UV 项目并解压" in deck and "教学合成数据" in deck)
    expect("no WEEKMAP marker or second primary legacy mapping", "WEEKMAP:" not in deck and 'class="legacy"' not in deck)
    expect("final page primary next is W08", 'class="w07-action primary" href="w08.html"' in deck)
    expect("L16 is explicitly regular instruction", "L16 正课副课件 · 不是拓展阅读" in deck)
    for mode in MODES:
        pattern = rf'<iframe src="../../demos/w07-venv-lab\.html\?mode={mode}" loading="lazy" title="[^"]+"></iframe>'
        expect(f"deck iframe contract: {mode}", bool(re.search(pattern, deck)))
        expect(f"new-window link: {mode}", f'href="../../demos/w07-venv-lab.html?mode={mode}" target="_blank" rel="noopener"' in deck)
    quiz_match = re.search(r'<script type="application/json" class="quiz-data">(.*?)</script>', deck, re.S)
    quiz = json.loads(quiz_match.group(1)) if quiz_match else {}
    expect("B quiz has four questions", len(quiz.get("questions", [])) == 4)
    required_deck = [
        "uv init --bare --python 3.12 .", "uv python pin 3.12", "uv add numpy==2.2.6 pandas==2.2.3 matplotlib==3.10.3",
        "uv run --locked python visualize.py", "uv sync --locked", "sys.executable", "sys.prefix != sys.base_prefix",
        "numpy.__file__", "PATH ≠ sys.path", "PYTHONPATH ≠ venv", "fresh shell", "requirements.txt 的正确位置",
        "numpy==1.26.4", "numpy==2.0.2", "GOTOOLCHAIN", "GOMODCACHE", "rustup", "NVM",
        "uv run --no-sync --locked python -c", "README.md 与 .gitignore", "数据来源", "中文字体候选与负号"
    ]
    expect("required commands and conceptual boundaries are present", all(token in deck for token in required_deck), json.dumps([x for x in required_deck if x not in deck], ensure_ascii=False))
    expect("lab is self-contained without external assets", "<script src=" not in lab and "<link " not in lab and "https://" not in lab and "http://" not in lab)
    expect("lab discloses simulation and separates measured excerpts", "教学仿真" in lab and "实测摘录 · 非本页执行" in lab and "模拟输出" in lab)
    script_tokens = ["plt.rcParams[\"font.sans-serif\"]", "Microsoft YaHei", "SimHei", "Noto Sans CJK SC", "Arial Unicode MS", "DejaVu Sans", "plt.rcParams[\"axes.unicode_minus\"] = False", "matplotlib.use(\"Agg\")", "Path(__file__).resolve().parent", "def load_and_summarize", "def draw_chart", "def main()"]
    expect("practice embeds the measured visualization script essentials", all(token in lab for token in script_tokens), json.dumps([x for x in script_tokens if x not in lab], ensure_ascii=False))
    expect("DSH prompt requires README gitignore provenance and run instructions", all(token in lab for token in ("README.md 与 .gitignore", "教学合成数据", "来源/授权", "uv sync --locked", "uv run --locked python visualize.py")))
    expect("observation commands disclose sync cache and build effects", "uv run --no-sync --locked python -c" in lab and "普通 uv run 可能同步" in lab and "cargo +stable build --locked 是构建验证，会写 target/" in lab and "只读观察命令" not in lab and "先执行只读诊断" not in lab)
    expect("reduced-motion disables autoplay and hidden page stops timers", "play.disabled = reduced" in lab and "document.addEventListener(\"visibilitychange\"" in lab and "if (!document.hidden) return" in lab and "practiceState.step = practiceSteps.length - 1; renderPractice(false); return;" not in lab)
    expect("practice file trees are generated cumulatively", "function makePracticeTree(step)" in lab and "baseTree.concat" not in lab and 'tree.push(["├─ README.md"' in lab and 'tree.push(["├─ .gitignore"' in lab)
    expect("lab exposes all six URL modes", all(f'data-mode-link="{mode}"' in lab and f'id="mode-{mode}"' in lab for mode in MODES))
    script_body = re.search(r"<script>(.*?)</script>", lab, re.S)
    expect("one inline JavaScript block", script_body is not None)
    if script_body:
        js_path = OUT / "lab-inline.js"
        js_path.write_text(script_body.group(1), encoding="utf-8")
        proc = subprocess.run(["node", "--check", str(js_path)], capture_output=True, text=True)
        expect("inline JavaScript passes node --check", proc.returncode == 0, (proc.stderr or proc.stdout).strip())
    expect("no external runtime libraries", all(token not in lab.lower() for token in ("echarts", "chart.js", "d3.min", "pyodide", "gsap", "react")))


def open_mode(browser, port: int, mode: str, width: int = 1366, height: int = 768, reduced: bool = False):
    context = browser.new_context(viewport={"width": width, "height": height}, reduced_motion="reduce" if reduced else "no-preference")
    page = context.new_page()
    attach_health(page, f"{mode}-{width}" + ("-reduced" if reduced else ""), port)
    page.goto(f"http://127.0.0.1:{port}/docs/python/demos/w07-venv-lab.html?mode={mode}", wait_until="networkidle")
    return context, page


def check_lab_layout(page, label: str, mobile: bool = False) -> None:
    expect(f"{label} has no page-level horizontal overflow", page.evaluate("document.documentElement.scrollWidth <= innerWidth"), overflow_detail(page))
    expect(f"{label} visible controls meet 44px targets", not target_sizes(page), json.dumps(target_sizes(page), ensure_ascii=False))
    if mobile:
        expect(f"{label} document width remains 390px", page.evaluate("document.documentElement.scrollWidth") == 390, overflow_detail(page))


def test_case(browser, port: int) -> None:
    context, page = open_mode(browser, port, "case")
    expect("case initial CSV contract is complete", page.locator("#case-facts li").count() == 5 and page.locator('[data-case-layout="independent"]').get_attribute("aria-pressed") == "true")
    expect("case independent topology has two env nodes and local links", page.locator("#case-map").get_attribute("data-layout") == "independent" and page.locator(".case-node.env:visible").count() == 2 and page.locator("[data-case-local-flow]:visible").count() == 2 and not page.locator("#case-global-flow").is_visible())
    page.locator('[data-case-node="viz-env"]').click()
    expect("case environment node updates inspector", "可视化自己的环境" in page.locator("#case-inspector-title").inner_text() and "uv.lock" in page.locator("#case-facts").inner_text())
    shot(page, "case-1366.png")
    page.locator('[data-case-layout="global"]').click()
    expect("case global switch really converges dependency topology", page.locator("#case-map").get_attribute("data-layout") == "global" and page.locator(".case-node.env:visible").count() == 0 and page.locator("[data-case-local-flow]:visible").count() == 0 and page.locator("#case-global-flow").is_visible() and page.locator("[data-case-shared-flow]:visible").count() == 2)
    expect("case global switch changes project node states and flow explanation", page.locator('[data-case-node="crawler"].shared').count() == 1 and page.locator('[data-case-node="viz"].shared').count() == 1 and "拓扑已改变" in page.locator("#case-flow-note").inner_text())
    expect("case global counterexample avoids inevitability claim", "不一定" in page.locator("#case-inspector-text").inner_text() or "可能" in page.locator("#case-inspector-text").inner_text())
    expect("case global counterexample synchronizes verdict", "不保证立刻出错" in page.locator("#case-verdict").inner_text())
    shot(page, "case-global-1366.png")
    page.locator('[data-case-node="csv"]').focus(); page.locator('[data-case-node="csv"]').press("Enter")
    expect("case graph node supports keyboard activation", page.locator('[data-case-node="csv"]').get_attribute("aria-pressed") == "true")
    page.locator("#case-reset").click()
    expect("case reset restores independent CSV view and two-env topology", page.locator('[data-case-layout="independent"]').get_attribute("aria-pressed") == "true" and page.locator("#case-facts li").count() == 5 and page.locator(".case-node.env:visible").count() == 2 and not page.locator("#case-global-flow").is_visible())
    check_lab_layout(page, "case desktop")
    page.set_viewport_size({"width": 390, "height": 844}); page.wait_for_timeout(150)
    check_lab_layout(page, "case mobile", True)
    shot(page, "case-390.png", full_page=True)
    context.close()


def test_conflict(browser, port: int) -> None:
    context, page = open_mode(browser, port, "conflict")
    expect("conflict starts with unsatisfiable measured excerpt", "unsatisfiable" in page.locator("#compile-output").inner_text() and "实测摘录" in page.locator("#conflict-resolve .tag.measured").inner_text())
    page.locator('[data-conflict-view="probe"]').click()
    page.locator('[data-numpy="2.0.2"]').click()
    output = page.locator("#numpy-output").inner_text()
    expect("NumPy 2.0.2 shows removed alias and working mean", "removed" in output and "MEAN_OK: 2.0" in output and "PORTABLE_FIX_OK: float64" in output)
    expect("NumPy explanation avoids total-crash exaggeration", "不等于 NumPy 整体必崩" in page.locator("#numpy-explanation").inner_text())
    expect("probe command follows selected version", "--with numpy==2.0.2 python" in page.locator("#probe-command").inner_text())
    shot(page, "conflict-202-1366.png")
    page.locator('[data-numpy="1.26.4"]').click()
    expect("NumPy 1.26.4 shows legacy alias and same mean", "LEGACY_API_OK" in page.locator("#numpy-output").inner_text() and "MEAN_OK: 2.0" in page.locator("#numpy-output").inner_text())
    page.locator("#conflict-reset").click()
    expect("conflict reset returns to resolver", page.locator("#conflict-resolve").is_visible() and not page.locator("#conflict-probe").is_visible())
    check_lab_layout(page, "conflict desktop")
    page.locator('[data-conflict-view="probe"]').click(); page.locator('[data-numpy="2.0.2"]').click()
    page.set_viewport_size({"width": 390, "height": 844}); page.wait_for_timeout(150)
    check_lab_layout(page, "conflict mobile", True)
    shot(page, "conflict-390.png", full_page=True)
    context.close()


def test_principles(browser, port: int) -> None:
    context, page = open_mode(browser, port, "principles")
    expect("uv run leaves outer PATH unchanged but selects project interpreter", "外层 shell PATH 未被前置修改" in page.locator("#path-value").inner_text() and "crawler-viz/.venv/Scripts/python.exe" in page.locator("#exe-value").inner_text())
    expect("uv run package path is project site-packages", "crawler-viz/.venv/Lib/site-packages/numpy" in page.locator("#package-value").inner_text())
    page.locator('[data-runtime="activated"]').click()
    expect("activation prepends PATH and sets VIRTUAL_ENV", "激活把项目 Scripts 前置" in page.locator("#path-value").inner_text() and "VIRTUAL_ENV=" in page.locator("#config-value").inner_text())
    page.locator('[data-runtime="global"]').click()
    expect("global interpreter is not venv", "sys.prefix == sys.base_prefix" in page.locator("#exe-value").inner_text() and "False" in page.locator("#principle-terminal").inner_text())
    page.locator('[data-runtime="fault"]').click()
    expect("fault separates python and pip targets", "python →" in page.locator("#path-value").inner_text() and "pip →" in page.locator("#path-value").inner_text())
    expect("fault reproduces ModuleNotFoundError preset", "ModuleNotFoundError" in page.locator("#principle-terminal").inner_text() and page.locator("#principle-fix").is_visible())
    shot(page, "principles-fault-1366.png")
    page.locator('[data-principle-layer="module"]').click()
    expect("layer inspector explains PATH versus sys.path", "负责 import" in page.locator("#principle-inspector-title").inner_text() and "PYTHONPATH" in page.locator("#principle-inspector-text").inner_text())
    page.locator("#principle-fix").click()
    expect("fault fix returns to uv run evidence", page.locator('[data-runtime="uv"]').get_attribute("aria-pressed") == "true" and not page.locator("#principle-fix").is_visible())
    page.locator('[data-runtime="activated"]').focus(); page.locator('[data-runtime="activated"]').press("Space")
    expect("runtime buttons support Space", page.locator('[data-runtime="activated"]').get_attribute("aria-pressed") == "true")
    page.locator("#principle-reset").click()
    check_lab_layout(page, "principles desktop")
    page.locator('[data-runtime="fault"]').click(); page.set_viewport_size({"width": 390, "height": 844}); page.wait_for_timeout(150)
    check_lab_layout(page, "principles mobile", True)
    shot(page, "principles-390.png", full_page=True)
    context.close()


def test_ecosystem(browser, port: int) -> None:
    context, page = open_mode(browser, port, "ecosystem", 1920, 1080)
    languages = ("python", "node", "rust", "go")
    layers = ("command", "toolchain", "dependencies", "config")
    for lang in languages:
        page.locator(f'[data-lang="{lang}"]').click()
        for layer in layers:
            page.locator(f'[data-layer="{layer}"]').click()
            title = page.locator("#eco-title").inner_text()
            expect(f"ecosystem {lang}/{layer} synchronizes all views", layer != "command" or "命令查找" in title)
            expect(f"ecosystem {lang}/{layer} has tool counterexample and observation", bool(page.locator("#eco-tool").inner_text().strip()) and bool(page.locator("#eco-counter").inner_text().strip()) and bool(page.locator("#eco-observe").inner_text().strip()))
    page.locator('[data-lang="python"]').click(); page.locator('[data-layer="dependencies"]').click()
    expect("Python observation uses no-sync with explicit preconditions", "uv run --no-sync --locked python -c" in page.locator("#eco-observe").inner_text() and "普通 uv run 可能同步" in page.locator("#eco-side-effect").inner_text() and "依赖齐全" in page.locator("#eco-side-effect").inner_text())
    page.locator('[data-lang="node"]').click(); page.locator('[data-layer="dependencies"]').click()
    expect("Node dependency view separates NVM and npm", "NVM 选 Node，npm 管项目依赖" in page.locator("#eco-counter").inner_text() and "require.resolve" in page.locator("#eco-observe").inner_text())
    page.locator('[data-lang="go"]').click(); page.locator('[data-layer="config"]').click()
    expect("Go cache view separates GOPATH GOMODCACHE GOROOT", all(x in page.locator("#eco-tool").inner_text() for x in ("GOPATH", "GOMODCACHE", "GOROOT")) and "不会完成版本隔离" in page.locator("#eco-counter").inner_text())
    shot(page, "ecosystem-go-1920.png")
    page.locator('[data-lang="rust"]').click(); page.locator('[data-layer="toolchain"]').click()
    expect("Rust toolchain view uses rustup not Cargo", "rustup" in page.locator("#eco-tool").inner_text() and "+stable" in page.locator("#eco-tool").inner_text())
    page.locator('[data-layer="dependencies"]').click()
    expect("Rust build verification explicitly writes target", "cargo +stable build --locked" in page.locator("#eco-observe").inner_text() and "会写 target/" in page.locator("#eco-side-effect").inner_text() and "只限制改锁" in page.locator("#eco-side-effect").inner_text())
    page.locator("#eco-reset").click()
    expect("ecosystem reset restores Python dependency view", page.locator('[data-lang="python"]').get_attribute("aria-pressed") == "true" and page.locator('[data-layer="dependencies"]').get_attribute("aria-pressed") == "true")
    check_lab_layout(page, "ecosystem desktop")
    page.set_viewport_size({"width": 390, "height": 844}); page.wait_for_timeout(150)
    check_lab_layout(page, "ecosystem mobile", True)
    shot(page, "ecosystem-390.png", full_page=True)
    context.close()


def test_practice(browser, port: int) -> None:
    context, page = open_mode(browser, port, "practice")
    expect("practice begins with prompt review and no execution", "不要修改全局 Python" in page.locator("#practice-code").inner_text() and "未执行任何命令" in page.locator("#practice-terminal").inner_text())
    page.locator('[data-practice-step="1"]').click()
    expect("practice init uses exact bare command", "uv init --bare --python 3.12 ." in page.locator("#practice-code").inner_text() and "pyproject.toml" in page.locator("#practice-tree").inner_text())
    page.locator('[data-practice-step="2"]').click()
    expect("practice pin creates python-version", "uv python pin 3.12" in page.locator("#practice-code").inner_text() and ".python-version" in page.locator("#practice-tree").inner_text())
    page.locator('[data-practice-step="3"]').click()
    expect("practice add synchronizes pyproject lock and venv", all(x in page.locator("#practice-tree").inner_text() for x in ("pyproject.toml", "uv.lock", ".venv")) and "uv add numpy==2.2.6 pandas==2.2.3 matplotlib==3.10.3" in page.locator("#practice-code").inner_text())
    page.locator('[data-practice-step="4"]').click()
    expect("practice script has measured fonts data rules Agg and anchored paths", all(x in page.locator("#practice-code").inner_text() for x in ("matplotlib.use(\"Agg\")", "Path(__file__).resolve().parent", "groupby", "fig.savefig", "font.sans-serif", "Microsoft YaHei", "SimHei", "Noto Sans CJK SC", "Arial Unicode MS", "DejaVu Sans", "axes.unicode_minus")))
    expect("practice script step cumulatively adds README and gitignore", all(x in page.locator("#practice-tree").inner_text() for x in ("pyproject.toml", ".python-version", "uv.lock", ".venv", "visualize.py", "README.md", ".gitignore", "data/answers.csv")))
    page.locator('[data-practice-step="5"]').click()
    expect("practice run uses locked command and labeled simulated values", "uv run --locked python visualize.py" in page.locator("#practice-code").inner_text() and "平均总点赞 = 30.3" in page.locator("#practice-terminal").inner_text() and "教学模拟" in page.locator("#practice-terminal").inner_text())
    expect("practice run keeps README gitignore and all prior files", all(x in page.locator("#practice-tree").inner_text() for x in ("README.md", ".gitignore", "visualize.py", "uv.lock", ".python-version", "data/answers.csv")))
    shot(page, "practice-run-1366.png")
    page.locator('[data-practice-step="6"]').click()
    evidence = page.locator("#practice-terminal").inner_text()
    expect("practice evidence has interpreter prefix and numpy file", all(x in evidence for x in (".venv/Scripts/python.exe", "True", "numpy/__init__.py")) and "模拟输出" in evidence)
    expect("practice evidence uses no-sync only after successful run", "uv run --no-sync --locked python -c" in page.locator("#practice-code").inner_text() and "上一步已成功运行" in page.locator("#practice-code").inner_text() and "不笼统称为只读" in page.locator("#practice-code").inner_text())
    page.locator('[data-practice-step="7"]').click()
    expect("practice sync rebuilds environment and keeps lock", "uv sync --locked" in page.locator("#practice-code").inner_text() and "已重建" in page.locator("#practice-tree").inner_text() and "requirements.txt" in page.locator("#practice-code").inner_text())
    final_tree = page.locator("#practice-tree").inner_text()
    final_required = ("pyproject.toml", "uv.lock", ".python-version", "README.md", ".gitignore", "visualize.py", "data/answers.csv", ".venv", "output/top_authors.png")
    expect("practice final tree contains complete cumulative delivery", all(x in final_tree for x in final_required) and "可重建：不提交" in final_tree and "数据来源与运行说明" in final_tree, final_tree)
    page.locator("#practice-reset").click()
    expect("practice reset returns to prompt review", page.locator('[data-practice-step="0"]').get_attribute("aria-current") == "step" and "未执行任何命令" in page.locator("#practice-terminal").inner_text())
    page.locator("#practice-play").click()
    page.wait_for_timeout(11200)
    expect("practice playback reaches final sync and stops", page.locator("#practice-step-no").inner_text() == "STEP 08 / 08" and page.locator("#practice-play").get_attribute("aria-pressed") == "false")
    page.locator("#practice-play").click(); page.wait_for_timeout(100)
    expect("practice replay starts a timer before visibility test", page.locator("#practice-play").get_attribute("aria-pressed") == "true")
    hidden_step = page.locator("#practice-step-no").inner_text()
    page.evaluate("""() => {
      Object.defineProperty(document, 'hidden', {configurable:true, get:() => true});
      document.dispatchEvent(new Event('visibilitychange'));
    }""")
    page.wait_for_timeout(1700)
    expect("hidden page stops playback timer without advancing", page.locator("#practice-play").get_attribute("aria-pressed") == "false" and page.locator("#practice-step-no").inner_text() == hidden_step and "计时器已停止" in page.locator("#practice-status").inner_text())
    page.evaluate("""() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); }""")
    check_lab_layout(page, "practice desktop")
    page.locator('[data-practice-step="5"]').click(); page.set_viewport_size({"width": 390, "height": 844}); page.wait_for_timeout(150)
    check_lab_layout(page, "practice mobile", True)
    shot(page, "practice-390.png", full_page=True)
    context.close()


def test_diagnostics(browser, port: int) -> None:
    context, page = open_mode(browser, port, "diagnostics")
    expected = {
        "missing": "ModuleNotFoundError",
        "wrong": "Get-Command python",
        "fresh": "fresh shell",
        "pip": "No module named pip",
    }
    for key, token in expected.items():
        page.locator(f'[data-diagnostic="{key}"]').click()
        combined = page.locator(".diag-inspector").inner_text()
        expect(f"diagnostic {key} synchronizes symptom command and remedy", token in combined and len(page.locator("#diag-fix").inner_text()) > 20)
    expect("diagnostics is evidence-first backup with no blanket read-only claim", "备用 / 课后" in page.locator("#diagnostics-heading").inner_text() and "先证据，后修复" in page.locator("#diagnostics-heading").inner_text() and "不笼统承诺只读" in page.locator("#mode-diagnostics .mode-intro").inner_text())
    expect("pip observation uses no-sync with preconditions and side-effect note", "uv run --no-sync --locked python -m pip --version" in page.locator("#diag-command").inner_text() and "前提" in page.locator("#diag-command").inner_text() and "普通 uv run 仍可能同步/写缓存" in page.locator("#diag-command").inner_text())
    shot(page, "diagnostics-pip-1366.png")
    page.locator("#diag-reset").click()
    expect("diagnostic reset restores module-missing case", page.locator('[data-diagnostic="missing"]').get_attribute("aria-pressed") == "true")
    check_lab_layout(page, "diagnostics desktop")
    page.set_viewport_size({"width": 390, "height": 844}); page.wait_for_timeout(150)
    check_lab_layout(page, "diagnostics mobile", True)
    shot(page, "diagnostics-390.png", full_page=True)
    context.close()


def test_file_and_reduced(browser, port: int) -> None:
    context = browser.new_context(viewport={"width": 1366, "height": 768}, reduced_motion="reduce")
    page = context.new_page(); attach_health(page, "file-and-reduced", port)
    for mode in MODES:
        page.goto(LAB.as_uri() + f"?mode={mode}", wait_until="load")
        expect(f"file URL opens mode {mode}", page.locator(f"#mode-{mode}").is_visible())
    page.goto(f"http://127.0.0.1:{port}/docs/python/demos/w07-venv-lab.html?mode=practice", wait_until="networkidle")
    page.locator('[data-practice-step="4"]').click(); page.wait_for_timeout(250)
    expect("reduced-motion practice has no active CSS/Web animations", page.evaluate("document.getAnimations().length") == 0)
    expect("reduced-motion disables autoplay with explicit button and status", page.locator("#practice-play").is_disabled() and "减少动态" in page.locator("#practice-play").inner_text() and "自动播放已禁用" in page.locator("#practice-status").inner_text() and "不会跳到末尾" in page.locator("#practice-status").inner_text())
    page.locator("#practice-play").evaluate("el => el.click()"); page.wait_for_timeout(1700)
    expect("reduced-motion never jumps or auto-advances to final", page.locator("#practice-step-no").inner_text() == "STEP 05 / 08" and page.locator("#practice-play").get_attribute("aria-pressed") == "false" and page.evaluate("document.getAnimations().length") == 0)
    page.locator("#practice-next").click()
    expect("reduced-motion keeps immediate single-step", page.locator("#practice-step-no").inner_text() == "STEP 06 / 08" and "即时单步" in page.locator("#practice-next").inner_text() and page.evaluate("document.getAnimations().length") == 0)
    shot(page, "practice-reduced.png")
    page.locator("#practice-reset").click()
    expect("reduced-motion reset remains functional", page.locator("#practice-step-no").inner_text() == "STEP 01 / 08")
    context.close()


def test_deck(browser, port: int) -> None:
    context = browser.new_context(viewport={"width": 1366, "height": 768})
    page = context.new_page(); attach_health(page, "deck", port)
    page.goto(f"http://127.0.0.1:{port}/docs/python/v2/slides/w07-venv.html#/1", wait_until="networkidle")
    expect("slides.js initializes 18 pages", page.locator(".sl-count").inner_text() == "1 / 18")
    expect("deck desktop primary controls meet 44px targets", not deck_target_sizes(page), json.dumps(deck_target_sizes(page), ensure_ascii=False))
    shot(page, "deck-cover-1366.png")
    page.evaluate("location.hash='#/2'"); page.wait_for_timeout(150)
    expect("deck schedule highlights four B rows and keeps six A rows", page.locator(".slide.active tr.seg-b").count() == 4 and page.locator(".slide.active tr.seg-a").count() == 6)
    expect("schedule explicitly states combined 100 minutes", "不是 B 段单独 100 分钟" in page.locator(".slide.active").inner_text())
    shot(page, "deck-schedule-1366.png")
    page.evaluate("location.hash='#/12'"); page.wait_for_timeout(200)
    expect("practice download links are present on B practical page", page.locator('.slide.active .w07-downloads a').count() == 2 and page.locator('.slide.active a[href="../../demos/w07-case.zip"]').count() == 1)
    download_geometry = page.locator(".slide.active").evaluate("""el => {
      const slide=el.getBoundingClientRect();
      const links=Array.from(el.querySelectorAll('.w07-downloads a')).map(a=>{const r=a.getBoundingClientRect();return {href:a.getAttribute('href'),top:r.top,bottom:r.bottom};});
      const card=el.querySelector('.w07-downloads').getBoundingClientRect();
      return {slideTop:slide.top,slideBottom:slide.bottom,cardBottom:card.bottom,links};
    }""")
    expect("practice downloads stay inside 1366 slide viewport", download_geometry["cardBottom"] <= download_geometry["slideBottom"] + 1 and all(link["bottom"] <= download_geometry["slideBottom"] + 1 for link in download_geometry["links"]), json.dumps(download_geometry, ensure_ascii=False))
    shot(page, "deck-practice-downloads-1366.png")
    page.evaluate("location.hash='#/3'"); page.wait_for_timeout(350)
    frame = page.frame_locator(".slide.active iframe")
    frame.locator('[data-case-node="viz-env"]').click()
    expect("case iframe works inside deck", "可视化自己的环境" in frame.locator("#case-inspector-title").inner_text())
    expect("iframe click does not advance parent deck", page.url.endswith("#/3"), page.url)
    page.evaluate("location.hash='#/8'"); page.wait_for_timeout(350)
    frame = page.frame_locator(".slide.active iframe")
    frame.locator('[data-runtime="fault"]').click()
    frame.locator('[data-runtime="fault"]').press("ArrowRight")
    expect("iframe ArrowRight is isolated from parent deck", page.url.endswith("#/8"), page.url)
    frame.locator('[data-runtime="global"]').press("Space")
    expect("iframe Space activates lab only", frame.locator('[data-runtime="global"]').get_attribute("aria-pressed") == "true" and page.url.endswith("#/8"))
    shot(page, "deck-principles-1366.png")
    page.locator(".slide.active h2").click(); page.keyboard.press("ArrowRight"); page.wait_for_timeout(200)
    expect("deck keyboard navigation still works outside iframe", page.url.endswith("#/9"), page.url)
    page.evaluate("location.hash='#/10'"); page.set_viewport_size({"width": 1920, "height": 1080}); page.wait_for_timeout(350)
    expect("ecosystem iframe visible at 1920px", page.frame_locator(".slide.active iframe").locator("#mode-ecosystem").is_visible())
    shot(page, "deck-ecosystem-1920.png")
    page.evaluate("location.hash='#/17'"); page.wait_for_timeout(200)
    expect("deck renders four quiz cards", page.locator(".slide.active .pyv2-q").count() == 4)
    for i, answer in enumerate([2, 1, 2, 1]):
        page.locator(".slide.active .pyv2-q").nth(i).locator(".opt").nth(answer).click()
    expect("quiz scoring reaches 4/4", "正确 4" in page.locator(".slide.active .quiz-score").inner_text() and "100 分" in page.locator(".slide.active .quiz-score").inner_text())
    page.set_viewport_size({"width": 1366, "height": 768}); shot(page, "deck-quiz-1366.png")
    page.evaluate("location.hash='#/18'"); page.wait_for_timeout(150)
    expect("final page primary next is W08", page.locator('.slide.active a.w07-action.primary[href="w08.html"]').count() == 1)
    shot(page, "deck-final-1366.png")
    page.evaluate("location.hash='#/13'"); page.set_viewport_size({"width": 390, "height": 844}); page.wait_for_timeout(350)
    expect("practice iframe usable at 390px deck width", page.frame_locator(".slide.active iframe").locator("[data-practice-step]").count() == 8)
    expect("deck 390px has no page-level horizontal overflow", page.evaluate("document.documentElement.scrollWidth <= innerWidth"), overflow_detail(page))
    expect("deck 390px primary controls meet 44px targets", not deck_target_sizes(page), json.dumps(deck_target_sizes(page), ensure_ascii=False))
    shot(page, "deck-practice-390.png")
    page.keyboard.press("End"); page.wait_for_timeout(100)
    expect("deck End reaches final page", page.url.endswith("#/18"), page.url)
    page.keyboard.press("Home"); page.wait_for_timeout(100)
    expect("deck Home returns to cover", page.url.endswith("#/1"), page.url)
    for width, height in ((1366, 768), (1920, 1080), (390, 844)):
        page.set_viewport_size({"width": width, "height": height})
        for number in range(1, 19):
            page.evaluate(f"location.hash='#/{number}'"); page.wait_for_timeout(60)
            dims = page.locator(".slide.active").evaluate("el => ({scroll:el.scrollWidth,client:el.clientWidth})")
            expect(f"deck page {number} has no active-slide horizontal overflow at {width}px", dims["scroll"] <= dims["client"] + 1, json.dumps(dims))
        geometry = page.evaluate("""() => { const h=document.querySelector('.sl-top').getBoundingClientRect(), r=document.querySelector('.pyv2-slides').getBoundingClientRect(); return {headerBottom:h.bottom,rootTop:r.top,rootBottom:r.bottom,innerHeight}; }""")
        expect(f"deck flex shell stays within viewport at {width}px", geometry["headerBottom"] <= geometry["rootTop"] + 1 and geometry["rootBottom"] <= height + 1, json.dumps(geometry))
    context.close()


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
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            run_block("case browser exception", lambda: test_case(browser, port))
            run_block("conflict browser exception", lambda: test_conflict(browser, port))
            run_block("principles browser exception", lambda: test_principles(browser, port))
            run_block("ecosystem browser exception", lambda: test_ecosystem(browser, port))
            run_block("practice browser exception", lambda: test_practice(browser, port))
            run_block("diagnostics browser exception", lambda: test_diagnostics(browser, port))
            run_block("file/reduced browser exception", lambda: test_file_and_reduced(browser, port))
            run_block("deck browser exception", lambda: test_deck(browser, port))
            browser.close()
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
            "Source-tree temporary HTTP server only; no MkDocs/shared build and no site/ writes.",
            "Chromium headless; desktop 1366×768 and 1920×1080; mobile 390×844; reduced-motion context.",
            "All lab terminals are teaching simulations; measured excerpts are separately labeled and are not page execution claims."
        ]
    }
    (OUT / "summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"SUMMARY: {passed}/{len(RESULTS)} passed; failed={failed}; screenshots={len(SCREENSHOTS)}", flush=True)
    raise SystemExit(1 if failed else 0)


if __name__ == "__main__":
    main()
