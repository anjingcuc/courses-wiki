#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""#17 阅读版浏览器测试：以 MkDocs 发布页和用户操作为公共接缝。"""
import functools
import http.server
import pathlib
import threading
import unittest

from playwright.sync_api import sync_playwright

HERE = pathlib.Path(__file__).parent
REPO = HERE.parent.parent.parent
SITE = REPO / "site"
SITE_PAGE = SITE / "python" / "demos" / "crawler-web-bp.html"
SCENE_IDS = [
    "sc-overview", "sc-flow", "sc-complete", "sc-dynamic",
    "sc-selectors", "sc-practice", "sc-summary",
]


class SiteHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        if path.startswith("/courses-wiki/"):
            path = path[len("/courses-wiki"):]
        return super().translate_path(path)

    def log_message(self, *args):
        pass


class ReaderBrowserTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        if not SITE_PAGE.is_file():
            raise RuntimeError("缺少 site/python/demos/crawler-web-bp.html；先运行 uv run mkdocs build")
        handler = functools.partial(SiteHandler, directory=str(SITE))
        cls.server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.url = "http://127.0.0.1:%d/courses-wiki/python/demos/crawler-web-bp.html" % cls.server.server_port
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(channel="chrome", headless=True)

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join(timeout=2)

    def open_reader(self, hash_value="", viewport=None, reduced=False, capture_api=False):
        context = self.browser.new_context(
            viewport=viewport or {"width": 1440, "height": 1000},
            reduced_motion="reduce" if reduced else "no-preference",
        )
        page = context.new_page()
        self.addCleanup(context.close)
        if capture_api:
            page.add_init_script("""(() => {
              let bpValue;
              const audits = [];
              Object.defineProperty(window, 'BP', {
                configurable: true,
                get() { return bpValue; },
                set(bp) {
                  bpValue = bp;
                  const register = bp.scene;
                  bp.scene = function(id, factory) {
                    return register.call(this, id, function(root, gsap, api) {
                      audits.push({id, api});
                      return factory(root, gsap, api);
                    });
                  };
                }
              });
              window.__readerApiAudit = audits;
            })()""")
        errors = []
        requests = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.on("request", lambda r: requests.append(r.url))
        page.goto(self.url + hash_value, wait_until="load")
        page.wait_for_timeout(1200)
        self._errors = errors
        self._requests = requests
        return page

    def test_continuous_document_flow_and_browser_keys(self):
        page = self.open_reader()
        self.assertTrue(page.evaluate("() => !!(window.BP && BP.reader === true)"))
        self.assertEqual(page.eval_on_selector_all("main#reader > section.scene", "els => els.map(e => e.id)"), SCENE_IDS)
        layout = page.eval_on_selector_all("main#reader > section.scene", """els => els.map(e => {
          const s = getComputedStyle(e);
          return {display:s.display, position:s.position, overflowY:s.overflowY,
                  internalScroll:e.scrollHeight > e.clientHeight + 2};
        })""")
        for item in layout:
            self.assertNotEqual(item["display"], "none")
            self.assertNotEqual(item["position"], "absolute")
            self.assertNotIn(item["overflowY"], ("auto", "scroll"))
            self.assertFalse(item["internalScroll"], item)
        self.assertGreater(page.evaluate("() => document.scrollingElement.scrollHeight"), 5000)

        page.evaluate("() => { window.scrollTo(0, 0); document.body.tabIndex = -1; document.body.focus(); }")
        before = page.evaluate("() => ({hash:location.hash, theme:document.documentElement.dataset.theme})")
        for key in ("t", "o", "f", "r", "ArrowRight"):
            allowed = page.evaluate("""key => {
              const e = new KeyboardEvent('keydown', {key, bubbles:true, cancelable:true});
              document.dispatchEvent(e);
              return !e.defaultPrevented;
            }""", key)
            self.assertTrue(allowed, key)
        ctrl_find = page.evaluate("""() => {
          const e = new KeyboardEvent('keydown', {key:'f', ctrlKey:true, bubbles:true, cancelable:true});
          document.dispatchEvent(e);
          return !e.defaultPrevented;
        }""")
        self.assertTrue(ctrl_find)
        page.keyboard.press("PageDown")
        page.wait_for_timeout(350)
        self.assertGreater(page.evaluate("() => scrollY"), 100)
        self.assertEqual(page.evaluate("() => ({hash:location.hash, theme:document.documentElement.dataset.theme})"), before)
        self.assertEqual(self._errors, [])

    def test_scene_factory_reader_api_and_window_scroll_helpers(self):
        page = self.open_reader(capture_api=True)
        contract = page.evaluate("""() => window.__readerApiAudit.map(({id, api}) => ({
          id, reader:api.reader,
          scrollTo:typeof api.scrollTo,
          scrollToElement:typeof api.scrollToElement,
          scrollToTop:typeof api.scrollToTop,
          scrollBy:typeof api.scrollBy,
          getScrollTop:typeof api.getScrollTop
        }))""")
        self.assertEqual([item["id"] for item in contract], SCENE_IDS)
        for item in contract:
            self.assertIs(item["reader"], True, item)
            for helper in ("scrollTo", "scrollToElement", "scrollToTop", "scrollBy", "getScrollTop"):
                self.assertEqual(item[helper], "function", item)

        positions = page.evaluate("""() => {
          const api = window.__readerApiAudit[3].api;
          const target = document.getElementById('blkB');
          api.scrollTo(0, {behavior:'instant'});
          const zero = scrollY;
          api.scrollToElement(target, 0, 'instant');
          const atElement = {y:scrollY, top:Math.round(target.getBoundingClientRect().top)};
          api.scrollToTop('instant');
          const atScene = {y:scrollY, top:Math.round(document.getElementById('sc-dynamic').getBoundingClientRect().top)};
          return {zero, atElement, atScene};
        }""")
        self.assertEqual(positions["zero"], 0)
        self.assertGreater(positions["atElement"]["y"], 1000)
        self.assertEqual(positions["atElement"]["top"], 0)
        self.assertEqual(positions["atScene"]["top"], 0)
        self.assertEqual(self._errors, [])

    def test_semantic_anchors_and_simulated_dom_links(self):
        page = self.open_reader("#sc-dynamic")
        self.assertEqual(page.evaluate("() => location.hash"), "#sc-dynamic")
        page.wait_for_function("() => Math.abs(document.getElementById('sc-dynamic').getBoundingClientRect().top) <= 2")
        self.assertLessEqual(abs(page.locator("#sc-dynamic").evaluate("e => e.getBoundingClientRect().top")), 2)

        page.locator('.reader-toc a[href="#sc-selectors"]').click()
        page.wait_for_function("() => Math.abs(document.getElementById('sc-selectors').getBoundingClientRect().top) <= 2")
        self.assertEqual(page.evaluate("() => location.hash"), "#sc-selectors")
        self.assertLessEqual(abs(page.locator("#sc-selectors").evaluate("e => e.getBoundingClientRect().top")), 2)

        page.locator('#sc-summary .su-stop[data-go="2"]').click()
        page.wait_for_function("() => Math.abs(document.getElementById('sc-flow').getBoundingClientRect().top) <= 2")
        self.assertEqual(page.evaluate("() => location.hash"), "#sc-flow")
        self.assertLessEqual(abs(page.locator("#sc-flow").evaluate("e => e.getBoundingClientRect().top")), 2)

        before = page.url
        page.locator("#sc-selectors .pg a.cover").first.click()
        page.wait_for_timeout(250)
        self.assertEqual(page.url, before)
        self.assertEqual(self._errors, [])

    def test_core_interactions_and_state_survive_scrolling(self):
        page = self.open_reader()

        before = page.inner_text("#ovRoA")
        page.locator('#sc-overview [data-stage="2"]').click()
        page.wait_for_timeout(200)
        self.assertNotEqual(page.inner_text("#ovRoA"), before)

        page.locator('#sc-flow [data-step="1"] .fl-box').click()
        page.wait_for_timeout(200)
        self.assertTrue(page.locator("#flDrawer").evaluate("e => e.classList.contains('is-open')"))

        page.locator('#sc-complete [data-node="tpl"]').click()
        page.locator('#sc-complete [data-user="小王"]').click()
        page.wait_for_timeout(200)
        self.assertIn("username=小王", page.inner_text("#inspResp"))

        page.locator("#sc-dynamic .route.is-b").click()
        page.wait_for_timeout(900)
        dynamic_position = page.locator("#blkB").evaluate("e => ({top:e.getBoundingClientRect().top, bottom:e.getBoundingClientRect().bottom, viewport:innerHeight})")
        self.assertLess(dynamic_position["top"], dynamic_position["viewport"])
        self.assertGreater(dynamic_position["bottom"], 0)

        page.locator("#selInput").fill(".title")
        page.locator("#selInput").dispatch_event("input")
        page.wait_for_timeout(250)
        self.assertEqual(int(page.inner_text("#selN")), 3)
        page.locator('#selMode [data-mode="xpath"]').click()
        expression = "//h3[@class='title']"
        page.locator("#selInput").fill(expression)
        page.locator("#selInput").dispatch_event("input")
        page.wait_for_timeout(250)
        self.assertEqual(int(page.inner_text("#selN")), 3)
        rows = page.locator("#selTree .tr[data-nid]")
        rows.nth(5).click()
        page.wait_for_timeout(200)
        node_body = page.inner_text("#selNodeBody")
        self.assertIn("CSS", node_body)
        self.assertIn("XPath", node_body)

        page.locator('#sc-practice .pr-opt[data-k="2"]').click()
        page.wait_for_timeout(200)
        self.assertEqual(page.locator("#sc-practice .pr-res .pr-ok").count(), 1)
        page.locator('#sc-summary .qz-card[data-ans="B"] .qz-opt[data-k="B"]').first.click()
        page.wait_for_timeout(200)
        self.assertIn("1", page.inner_text("#sc-summary .qz-score"))
        saved_expression = page.locator("#selInput").input_value()
        saved_hits = page.inner_text("#selN")

        page.evaluate("() => window.scrollTo({top:0, behavior:'instant'})")
        page.wait_for_timeout(250)
        page.locator("#sc-selectors").evaluate("e => window.scrollTo({top:e.getBoundingClientRect().top + scrollY, behavior:'instant'})")
        page.wait_for_timeout(250)
        self.assertEqual(page.locator("#selInput").input_value(), saved_expression)
        self.assertEqual(page.inner_text("#selN"), saved_hits)
        self.assertEqual(page.locator("#sc-practice .pr-res .pr-ok").count(), 1)
        self.assertIn("1", page.inner_text("#sc-summary .qz-score"))
        self.assertEqual(self._errors, [])

    def test_responsive_document_and_touch_targets(self):
        for width, height in ((1440, 1000), (820, 1000), (390, 844)):
            page = self.open_reader(viewport={"width": width, "height": height})
            dimensions = page.evaluate("() => ({viewport:innerWidth, page:document.documentElement.scrollWidth})")
            self.assertLessEqual(dimensions["page"], dimensions["viewport"] + 1, (width, dimensions))
            visible = page.eval_on_selector_all("main#reader > section.scene", "els => els.every(e => getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().height > 100)")
            self.assertTrue(visible, width)
            if width == 390:
                targets = page.eval_on_selector_all(".reader-toc a, #selMode .mb, #selInput, .pr-opt, .qz-opt", """els => els.map(e => ({
                  label:e.textContent || e.value, width:e.getBoundingClientRect().width,
                  height:e.getBoundingClientRect().height
                }))""")
                self.assertGreaterEqual(len(targets), 15)
                for target in targets:
                    self.assertGreaterEqual(target["height"], 44, target)
                    self.assertGreaterEqual(target["width"], 32, target)
                wide = page.locator("#flStage").evaluate("e => ({client:e.clientWidth, scroll:e.scrollWidth, overflow:getComputedStyle(e).overflowX})")
                self.assertGreater(wide["scroll"], wide["client"])
                self.assertEqual(wide["overflow"], "auto")
            self.assertEqual(self._errors, [], width)

    def test_reduced_motion_and_offline_runtime(self):
        page = self.open_reader(reduced=True)
        css_animation = page.evaluate("""() => ({
          blip:getComputedStyle(document.querySelector('.sc-dynamic .blip')).animationName,
          hint:getComputedStyle(document.querySelector('.sc-complete .gtip'), '::before').animationName,
          active:document.getAnimations().length
        })""")
        self.assertEqual(css_animation["blip"], "none")
        self.assertEqual(css_animation["hint"], "none")
        self.assertEqual(css_animation["active"], 0)
        self.assertTrue(page.eval_on_selector_all("main#reader > section.scene", "els => els.every(e => getComputedStyle(e).display !== 'none')"))
        page.locator('#sc-summary .qz-card[data-ans="B"] .qz-opt[data-k="B"]').first.click()
        self.assertIn("1", page.inner_text("#sc-summary .qz-score"))
        external = [url for url in self._requests if not url.startswith("http://127.0.0.1:") and not url.startswith("data:")]
        self.assertEqual(external, [])
        self.assertEqual(self._errors, [])


if __name__ == "__main__":
    unittest.main(verbosity=2)
