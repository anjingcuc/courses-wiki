from functools import partial
from http.server import ThreadingHTTPServer
from pathlib import Path
import threading

from playwright.sync_api import sync_playwright
from test_built_viz import QuietHandler

ROOT = Path(__file__).resolve().parents[3]
server = ThreadingHTTPServer(("127.0.0.1", 0), partial(QuietHandler, directory=str(ROOT / "site")))
port = server.server_address[1]
thread = threading.Thread(target=server.serve_forever, daemon=True)
thread.start()
base = f"http://127.0.0.1:{port}/courses-wiki/"
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe")
        page = browser.new_page(viewport={"width": 1366, "height": 768})
        page.on("console", lambda msg: print("CONSOLE", msg.type, msg.text, msg.location, flush=True))
        page.on("response", lambda response: print("HTTP", response.status, response.url, flush=True) if response.status >= 400 else None)
        page.on("requestfailed", lambda request: print("REQUESTFAILED", request.url, request.failure, flush=True))
        for name, url in (
            ("lab", base + "python/demos/w07-visualization-lab.html?mode=pipeline"),
            ("m4", base + "python/v2/m4/"),
            ("home", base + "python/"),
        ):
            print("NAVIGATE", name, url, flush=True)
            response = page.goto(url, wait_until="networkidle")
            print("PAGE", name, "status", response.status if response else None, "url", page.url, "title", page.title(), flush=True)
            print("COUNTS", name, "m4b", page.locator('a[href="../slides/w07-venv.html"]').count(), "m4a", page.locator('a[href="../slides/w07.html"]').count(), "homea", page.locator('a.wk-go[href="v2/slides/w07.html"]').count(), flush=True)
            if name == "m4":
                print("W07 TEXTS", page.locator('a:has-text("W07")').all_inner_texts(), flush=True)
                page.screenshot(path=str(ROOT / "artifacts/w07/qa-integration/diagnostic-m4.png"), full_page=False)
        browser.close()
finally:
    server.shutdown(); server.server_close(); thread.join(timeout=3)
