from __future__ import annotations

import json
import re
import threading
from functools import partial
from http.server import ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

from playwright.sync_api import sync_playwright
from test_built_venv import QuietHandler

ROOT = Path(__file__).resolve().parents[3]
OUT = Path(__file__).resolve().parent
SITE = ROOT / "site"
A = SITE / "python/v2/slides/w07.html"
B = SITE / "python/v2/slides/w07-venv.html"
CASE = SITE / "python/demos/w07-case"
EXPECTED_TIMES = ["0–8", "8–18", "18–30", "30–40", "40–52", "52–58", "58–70", "70–86", "86–94", "94–100"]
RESULTS: list[dict] = []
SCREENSHOTS: list[str] = []


def expect(name: str, passed: bool, detail="") -> None:
    RESULTS.append({"name": name, "passed": bool(passed), "detail": detail})
    print(("PASS" if passed else "FAIL") + " | " + name + (" | " + str(detail) if detail else ""), flush=True)


def schedule(path: Path) -> list[tuple[str, str]]:
    text = path.read_text(encoding="utf-8")
    table = re.search(r'<table class="w07-schedule">(.*?)</table>', text, re.S)
    if not table:
        return []
    return re.findall(r'<tr class="(seg-[ab])"><td>([^<]+)</td>', table.group(1))


def main() -> None:
    required = [
        "answers.csv", "data/answers.csv", "visualize.py", "numpy_probe.py",
        "conflict-requirements.txt", "pyproject.toml", "uv.lock", "index.html",
    ]
    for name in required:
        path = CASE / name
        expect(f"built w07-case file exists: {name}", path.is_file(), f"bytes={path.stat().st_size}" if path.is_file() else "missing")

    schedule_a = schedule(A)
    schedule_b = schedule(B)
    expect("A/B schedules have identical segment classes and time ranges", schedule_a == schedule_b, json.dumps({"A": schedule_a, "B": schedule_b}, ensure_ascii=False))
    expect("A/B schedule times are the expected ten rows", [x[1] for x in schedule_a] == EXPECTED_TIMES and [x[1] for x in schedule_b] == EXPECTED_TIMES, json.dumps({"A": schedule_a, "B": schedule_b}, ensure_ascii=False))
    expect("schedule is contiguous 0–100 with six A and four B rows", [x[0] for x in schedule_a] == ["seg-a"] * 6 + ["seg-b"] * 4 and all(EXPECTED_TIMES[i].split("–")[1] == EXPECTED_TIMES[i + 1].split("–")[0] for i in range(9)) and EXPECTED_TIMES[0].startswith("0–") and EXPECTED_TIMES[-1].endswith("–100"))

    server = ThreadingHTTPServer(("127.0.0.1", 0), partial(QuietHandler, directory=str(SITE)))
    port = server.server_address[1]
    thread = threading.Thread(target=server.serve_forever, daemon=True); thread.start()
    health = {"console_errors": [], "page_errors": [], "http_errors": [], "unexpected_external_requests": []}
    downloads: list[dict] = []
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True, executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe")
            context = browser.new_context(viewport={"width": 1366, "height": 768}, accept_downloads=True)
            page = context.new_page()
            page.on("console", lambda msg: health["console_errors"].append(msg.text + " @ " + msg.location.get("url", "")) if msg.type == "error" else None)
            page.on("pageerror", lambda err: health["page_errors"].append(str(err)))
            page.on("response", lambda response: health["http_errors"].append(f"{response.status} {response.url}") if response.status >= 400 else None)
            def request_handler(request):
                parsed = urlparse(request.url)
                if parsed.scheme in ("http", "https") and not (parsed.hostname == "127.0.0.1" and parsed.port == port):
                    health["unexpected_external_requests"].append(request.url)
            page.on("request", request_handler)
            base = f"http://127.0.0.1:{port}/courses-wiki/"
            page.goto(base + "python/v2/slides/w07-venv.html#/12", wait_until="networkidle")
            links = page.locator(".slide.active .w07-downloads a[download]")
            expect("B slide 12 exposes the single complete-archive download link", links.count() == 1, f"found={links.count()}")
            found = {}
            for i in range(links.count()):
                link = links.nth(i)
                found[link.inner_text().strip()] = link.evaluate("a => a.href")
            expect("B download label is the complete UV archive", set(found) == {"下载完整 UV 案例包 (.zip) ↓"}, json.dumps(found, ensure_ascii=False))
            guide_link = page.locator('.slide.active .w07-downloads a[href="../../demos/w07-case/"]')
            expect("B case guide link has no download attribute", guide_link.count() == 1 and guide_link.get_attribute("download") is None, f"found={guide_link.count()}")
            guide_url = guide_link.evaluate("a => a.href") if guide_link.count() == 1 else base + "python/demos/w07-case/"
            shot = "venv-deck-downloads-1366.png"
            page.screenshot(path=str(OUT / shot)); SCREENSHOTS.append(shot)
            for name, url in found.items():
                response = context.request.get(url)
                body = response.body()
                row = {"name": name, "url": url, "status": response.status, "bytes": len(body), "content_type": response.headers.get("content-type", "")}
                downloads.append(row)
                expect(f"B download HTTP 200: {name}", response.status == 200 and len(body) > 1000, json.dumps(row, ensure_ascii=False))
                import io as _io, zipfile as _zipfile
                try:
                    archive = _zipfile.ZipFile(_io.BytesIO(body))
                    names = set(archive.namelist())
                    required = {"pyproject.toml", "uv.lock", ".python-version", ".gitignore", "README.md", "visualize.py", "numpy_probe.py", "conflict-requirements.txt", "data/answers.csv"}
                    expect("B archive contains the complete runnable UV project", required.issubset(names) and archive.testzip() is None, json.dumps(sorted(required - names), ensure_ascii=False))
                except Exception as exc:  # noqa: BLE001
                    expect("B archive is a valid zip", False, str(exc))
            guide_response = context.request.get(guide_url)
            guide_body = guide_response.body()
            expect("B case guide directory URL is HTTP 200", guide_url == base + "python/demos/w07-case/" and guide_response.status == 200 and b"W07" in guide_body, json.dumps({"url": guide_url, "status": guide_response.status, "bytes": len(guide_body)}, ensure_ascii=False))
            zip_response = context.request.get(base + "python/demos/w07-case.zip")
            expect("site serves w07-case.zip", zip_response.status == 200 and len(zip_response.body()) > 1000, json.dumps({"status": zip_response.status, "bytes": len(zip_response.body())}))
            expect("B download/deck page has no console/pageerror/HTTP/unexpected-network errors", not any(health.values()), json.dumps(health, ensure_ascii=False))
            context.close(); browser.close()
    finally:
        server.shutdown(); server.server_close(); thread.join(timeout=3)

    summary = {
        "passed": sum(r["passed"] for r in RESULTS),
        "failed": sum(not r["passed"] for r in RESULTS),
        "total": len(RESULTS),
        "results": RESULTS,
        "downloads": downloads,
        "health": health,
        "screenshots": SCREENSHOTS,
        "hidden_metadata_in_site": {name: (CASE / name).is_file() for name in (".python-version", ".gitignore")},
        "readme_note": "MkDocs renders README.md to w07-case/index.html; B links to the /w07-case/ guide directory and serves the complete project as w07-case.zip.",
    }
    (OUT / "final-assets.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"SUMMARY: {summary['passed']}/{summary['total']} passed; failed={summary['failed']}; screenshots={len(SCREENSHOTS)}", flush=True)
    raise SystemExit(1 if summary["failed"] else 0)


if __name__ == "__main__":
    main()
