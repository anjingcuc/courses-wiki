#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""#18 场景 01–03：以构建后阅读页的公开浏览器行为为接缝。"""
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


class SiteHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        if path.startswith("/courses-wiki/"):
            path = path[len("/courses-wiki"):]
        return super().translate_path(path)

    def log_message(self, *args):
        pass


class ReaderScenesCoreTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        if not SITE_PAGE.is_file():
            raise RuntimeError("缺少阅读版构建产物；先运行双输出构建与 uv run mkdocs build")
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

    def open_reader(self, width=1920, height=1080, touch=False, reduced=False):
        context = self.browser.new_context(
            viewport={"width": width, "height": height},
            has_touch=touch,
            is_mobile=touch,
            reduced_motion="reduce" if reduced else "no-preference",
        )
        page = context.new_page()
        self.addCleanup(context.close)
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.goto(self.url, wait_until="load")
        page.wait_for_timeout(1200)
        self._errors = errors
        return page

    def test_flow_touch_targets_and_local_horizontal_scroll(self):
        page = self.open_reader(width=390, height=844, touch=True)
        dimensions = page.evaluate("""() => ({
          viewport: innerWidth,
          page: document.documentElement.scrollWidth,
          client: document.getElementById('flStage').clientWidth,
          scroll: document.getElementById('flStage').scrollWidth,
          overflow: getComputedStyle(document.getElementById('flStage')).overflowX
        })""")
        self.assertLessEqual(dimensions["page"], dimensions["viewport"] + 1, dimensions)
        self.assertGreater(dimensions["scroll"], dimensions["client"], dimensions)
        self.assertEqual(dimensions["overflow"], "auto")

        targets = page.eval_on_selector_all(
            "#sc-flow .fl-step .fl-box, #sc-flow .fl-schip-hit .fl-schip",
            """els => els.map(e => ({
              label: e.parentElement.textContent,
              width: e.getBoundingClientRect().width,
              height: e.getBoundingClientRect().height
            }))""",
        )
        self.assertGreaterEqual(len(targets), 10)
        for target in targets:
            self.assertGreaterEqual(target["width"], 44, target)
            self.assertGreaterEqual(target["height"], 44, target)
        self.assertEqual(self._errors, [])

    def test_complete_evolution_stacks_on_phone(self):
        page = self.open_reader(width=390, height=844, touch=True)
        nodes = page.eval_on_selector_all("#sc-complete .evo-node", """els => els.map(e => {
          const r = e.getBoundingClientRect();
          return {left:r.left, right:r.right, width:r.width, top:r.top, bottom:r.bottom};
        })""")
        self.assertEqual(len(nodes), 3)
        for node in nodes[1:]:
            self.assertAlmostEqual(node["left"], nodes[0]["left"], delta=1, msg=nodes)
            self.assertAlmostEqual(node["width"], nodes[0]["width"], delta=1, msg=nodes)
            self.assertGreaterEqual(node["top"], nodes[0]["bottom"], nodes)
        self.assertEqual(self._errors, [])

    def test_touch_interactions_and_state_survive_window_scroll(self):
        page = self.open_reader(width=390, height=844, touch=True)

        overview_before = page.inner_text("#ovRoA")
        page.locator('#sc-overview [data-stage="2"]').tap()
        self.assertNotEqual(page.inner_text("#ovRoA"), overview_before)
        matrix_cell = page.locator('#ovMx .ov-mx-c[data-row="2"][data-col="1"]')
        matrix_before = matrix_cell.evaluate("e => getComputedStyle(e).backgroundColor")
        matrix_cell.tap()
        page.wait_for_timeout(150)
        matrix_after = matrix_cell.evaluate("e => getComputedStyle(e).backgroundColor")
        self.assertNotEqual(matrix_after, matrix_before)

        page.locator('#sc-flow [data-step="1"] .fl-box').tap()
        self.assertIn("输入 URL", page.inner_text("#flDrawer"))
        flow_resource = page.locator('#sc-flow .fl-schip-hit[data-wf="font.woff2"]')
        flow_resource.tap()
        page.wait_for_timeout(700)
        waterfall_row = page.locator('#sc-flow .fl-wf-row[data-wf="font.woff2"]')
        waterfall_color = waterfall_row.evaluate("e => getComputedStyle(e).backgroundColor")
        self.assertNotEqual(waterfall_color, "rgba(0, 0, 0, 0)")

        page.locator('#sc-complete [data-node="tpl"]').tap()
        page.locator('#sc-complete [data-user="小王"]').tap()
        self.assertIn("username=小王", page.inner_text("#inspResp"))

        page.evaluate("() => window.scrollTo({top:0,behavior:'instant'})")
        page.wait_for_timeout(150)
        page.locator("#sc-complete").evaluate("e => window.scrollTo({top:e.offsetTop,behavior:'instant'})")
        page.wait_for_timeout(150)
        self.assertNotEqual(page.inner_text("#ovRoA"), overview_before)
        self.assertIn("输入 URL", page.inner_text("#flDrawer"))
        self.assertEqual(waterfall_row.evaluate("e => getComputedStyle(e).backgroundColor"), waterfall_color)
        self.assertIn("username=小王", page.inner_text("#inspResp"))
        self.assertEqual(self._errors, [])

    def test_core_layout_at_390_768_and_1920(self):
        for width, height in ((390, 844), (768, 1024), (1920, 1080)):
            with self.subTest(width=width):
                page = self.open_reader(width=width, height=height, touch=width < 1920)
                dimensions = page.evaluate("""() => ({
                  viewport:innerWidth,
                  page:document.documentElement.scrollWidth,
                  body:document.body.scrollWidth
                })""")
                self.assertLessEqual(dimensions["page"], dimensions["viewport"] + 1, dimensions)
                self.assertLessEqual(dimensions["body"], dimensions["viewport"] + 1, dimensions)
                sections = page.eval_on_selector_all(
                    "#sc-overview, #sc-flow, #sc-complete",
                    "els => els.map(e => ({id:e.id,display:getComputedStyle(e).display,position:getComputedStyle(e).position,height:e.getBoundingClientRect().height}))",
                )
                for section in sections:
                    self.assertEqual(section["display"], "flex", section)
                    self.assertEqual(section["position"], "relative", section)
                    self.assertGreater(section["height"], 500, section)

                overview_columns = page.locator("#sc-overview .ov-stages").evaluate(
                    "e => getComputedStyle(e).gridTemplateColumns.split(' ').length"
                )
                self.assertEqual(overview_columns, 4 if width == 1920 else 1)

                for selector in ("#flStage", "#graph"):
                    wide = page.locator(selector).evaluate("""e => ({
                      client:e.clientWidth, scroll:e.scrollWidth,
                      overflow:getComputedStyle(e).overflowX
                    })""")
                    if width < 1920:
                        self.assertGreater(wide["scroll"], wide["client"], (width, selector, wide))
                        self.assertEqual(wide["overflow"], "auto", (width, selector, wide))
                        scrolled = page.locator(selector).evaluate("""e => {
                          e.scrollLeft = 160;
                          return {local:e.scrollLeft, window:window.scrollX,
                                  page:document.documentElement.scrollLeft};
                        }""")
                        self.assertGreater(scrolled["local"], 0, (width, selector, scrolled))
                        self.assertEqual(scrolled["window"], 0, scrolled)
                        self.assertEqual(scrolled["page"], 0, scrolled)
                    else:
                        self.assertLessEqual(wide["scroll"], wide["client"] + 1, (selector, wide))
                self.assertEqual(self._errors, [], width)

    def test_reduced_motion_keeps_core_interactions_without_animation(self):
        page = self.open_reader(width=390, height=844, touch=True, reduced=True)
        motion = page.evaluate("""() => ({
          overviewTransition:getComputedStyle(document.querySelector('#sc-overview .ov-stage')).transitionDuration,
          sendAnimation:getComputedStyle(document.querySelector('#sc-flow .fl-send .dot')).animationName,
          completeAnimation:getComputedStyle(document.querySelector('#sc-complete .gtip'),'::before').animationName,
          active:document.getAnimations().length
        })""")
        self.assertTrue(all(value == "0s" for value in motion["overviewTransition"].split(",")), motion)
        self.assertEqual(motion["sendAnimation"], "none", motion)
        self.assertEqual(motion["completeAnimation"], "none", motion)
        self.assertEqual(motion["active"], 0, motion)

        page.locator('#sc-overview [data-stage="3"]').tap()
        self.assertIn("不在 HTML", page.inner_text("#ovRoA"))
        page.locator('#sc-flow [data-step="6"] .fl-chip').tap()
        self.assertIn("HTTP 响应", page.inner_text("#flDrawer"))
        page.locator('[data-send]').tap()
        page.locator('#sc-complete [data-node="tpl"]').tap()
        page.locator('#sc-complete [data-user="匿名"]').tap()
        self.assertIn("username=匿名", page.inner_text("#inspResp"))
        self.assertEqual(page.evaluate("() => document.getAnimations().length"), 0)
        self.assertEqual(self._errors, [])


if __name__ == "__main__":
    unittest.main(verbosity=2)
