from __future__ import annotations

import json
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[3]
OUT = Path(__file__).resolve().parent
MODES = ("case", "conflict", "principles", "ecosystem", "practice", "diagnostics")


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, fmt, *args):
        return


def geometry(page):
    return page.evaluate("""() => {
      const visible = el => {
        const s = getComputedStyle(el), r = el.getBoundingClientRect();
        return !el.closest('[hidden]') && s.display !== 'none' && s.visibility !== 'hidden' && r.width > 0 && r.height > 0;
      };
      const buttons = Array.from(document.querySelectorAll('button')).filter(visible).map((el, index) => {
        const r = el.getBoundingClientRect();
        return {index, name:el.textContent.trim().slice(0,40), left:r.left, right:r.right, top:r.top, bottom:r.bottom,
          font:parseFloat(getComputedStyle(el).fontSize)};
      });
      const overlaps = [];
      for (let i=0;i<buttons.length;i++) for (let j=i+1;j<buttons.length;j++) {
        const a=buttons[i], b=buttons[j];
        if (Math.min(a.right,b.right)-Math.max(a.left,b.left)>1 && Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1)
          overlaps.push([a.name,b.name]);
      }
      const clipped = Array.from(document.querySelectorAll('.case-node,.practice-step,.path-value,.eco-inspector p,.status,.diag-card'))
        .filter(visible).filter(el => {
          const s=getComputedStyle(el);
          const clipX=(el.scrollWidth>el.clientWidth+1) && !['auto','scroll'].includes(s.overflowX);
          const clipY=(el.scrollHeight>el.clientHeight+1) && ['hidden','clip'].includes(s.overflowY);
          return clipX || clipY;
        }).map(el=>({name:el.textContent.trim().slice(0,45),sw:el.scrollWidth,cw:el.clientWidth,sh:el.scrollHeight,ch:el.clientHeight}));
      const core = Array.from(document.querySelectorAll('.code-box,.terminal,.case-node,.path-value,.eco-tool,.practice-step')).filter(visible)
        .map(el=>parseFloat(getComputedStyle(el).fontSize));
      return {overlaps, clipped, minCoreFont:core.length?Math.min(...core):null, buttonCount:buttons.length,
        minButtonFont:buttons.length?Math.min(...buttons.map(b=>b.font)):null};
    }""")


def main():
    server = ThreadingHTTPServer(("127.0.0.1", 0), partial(QuietHandler, directory=str(ROOT)))
    port = server.server_address[1]
    thread = threading.Thread(target=server.serve_forever, daemon=True); thread.start()
    report = {"passed": True, "checks": []}
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            for width, height in ((1366, 768), (1920, 1080), (390, 844)):
                context = browser.new_context(viewport={"width": width, "height": height})
                page = context.new_page()
                for mode in MODES:
                    page.goto(f"http://127.0.0.1:{port}/docs/python/demos/w07-venv-lab.html?mode={mode}", wait_until="networkidle")
                    if mode == "conflict":
                        page.locator('[data-conflict-view="probe"]').click()
                    if mode == "practice":
                        page.locator('[data-practice-step="5"]').click()
                    data = geometry(page)
                    passed = not data["overlaps"] and not data["clipped"] and (data["minCoreFont"] or 0) >= 9.5
                    row = {"target": f"lab/{mode}", "viewport": [width, height], "passed": passed, **data}
                    report["checks"].append(row)
                    report["passed"] = report["passed"] and passed
                context.close()
            for width, height in ((1366, 768), (1920, 1080), (390, 844)):
                context = browser.new_context(viewport={"width": width, "height": height})
                page = context.new_page()
                page.goto(f"http://127.0.0.1:{port}/docs/python/v2/slides/w07-venv.html#/1", wait_until="networkidle")
                for number in range(1, 19):
                    page.evaluate(f"location.hash='#/{number}'"); page.wait_for_timeout(80)
                    metrics = page.locator(".slide.active").evaluate("""el => {
                      const h2=el.querySelector('h2,h1');
                      const pre=Array.from(el.querySelectorAll('pre')).map(p=>({sw:p.scrollWidth,cw:p.clientWidth,sh:p.scrollHeight,ch:p.clientHeight}));
                      const rect=el.getBoundingClientRect();
                      const offenders=Array.from(el.querySelectorAll('*')).filter(node=>{
                        if (node.closest('pre')) return false; // 长代码只允许 pre 内局部滚动，主套件另查整页横溢。
                        const s=getComputedStyle(node),r=node.getBoundingClientRect();
                        return s.display!=='none' && r.width>0 && (r.right>rect.right+1 || r.left<rect.left-1);
                      }).slice(0,12).map(node=>({tag:node.tagName,cls:node.className,text:node.textContent.trim().slice(0,70),right:node.getBoundingClientRect().right}));
                      return {title:h2?h2.textContent.trim():'', titleFont:h2?parseFloat(getComputedStyle(h2).fontSize):null,
                        pre, offenders, slideTop:rect.top, slideBottom:rect.bottom, innerHeight};
                    }""")
                    passed = metrics["titleFont"] >= 26 and not metrics["offenders"]
                    row = {"target": f"deck/slide-{number}", **metrics, "viewport": [width, height], "passed": passed}
                    report["checks"].append(row)
                    report["passed"] = report["passed"] and passed
                context.close()
            browser.close()
    finally:
        server.shutdown(); server.server_close(); thread.join(timeout=3)
    (OUT / "projection-geometry.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    failed = [row for row in report["checks"] if not row["passed"]]
    print(json.dumps({"passed": report["passed"], "checks": len(report["checks"]), "failed": failed}, ensure_ascii=False, indent=2))
    raise SystemExit(0 if report["passed"] else 1)


if __name__ == "__main__":
    main()
