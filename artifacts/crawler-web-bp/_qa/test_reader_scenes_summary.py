#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""#20 场景 06–07：从构建后发布页验证阅读行为与课堂回归。"""
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


class ReaderScenesSummaryTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        if not SITE_PAGE.is_file():
            raise RuntimeError("缺少构建后阅读页；先运行场景构建与 uv run mkdocs build")
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

    def open_reader(self, viewport=None, reduced=False):
        context = self.browser.new_context(
            viewport=viewport or {"width": 1440, "height": 1000},
            reduced_motion="reduce" if reduced else "no-preference",
        )
        page = context.new_page()
        self.addCleanup(context.close)
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
        page.goto(self.url, wait_until="load")
        page.wait_for_timeout(1200)
        self._errors = errors
        return page

    def test_practice_tree_and_quiz_state_survive_leaving_and_returning(self):
        page = self.open_reader()

        for case in ("A", "B"):
            page.locator('#sc-practice .pr-tab[data-case="%s"]' % case).click()
            page.locator('#sc-practice .pr-opt[data-k="2"]').click()
            self.assertEqual(page.locator("#sc-practice .pr-res .pr-ok").count(), 1)
        page.locator('#sc-practice .pr-tab[data-case="C"]').click()
        for key in ("t", "x", "j", "d"):
            page.locator('#sc-practice .pr-node[data-k="%s"]' % key).click()
        self.assertEqual(page.locator("#sc-practice .pr-tab.is-done").count(), 3)
        self.assertIn("requests.get", page.inner_text("#sc-practice .pr-res"))

        page.locator('#sc-summary .tr-b[data-b="2"]').click()
        self.assertEqual(page.locator('#sc-summary .tr-b[data-b="2"]').get_attribute("aria-expanded"), "true")
        answers = ((0, "B"), (1, "A"), (2, "B"))
        for index, key in answers:
            page.locator("#sc-summary .qz-card").nth(index).locator('.qz-opt[data-k="%s"]' % key).click()
        self.assertEqual(page.inner_text("#sc-summary .qz-score"), "2 / 3")
        self.assertTrue(page.locator("#sc-summary .qz-card").nth(1).evaluate("element => element.classList.contains('is-no')"))

        page.evaluate("() => window.scrollTo({top:0, behavior:'instant'})")
        page.wait_for_timeout(250)
        page.locator("#sc-practice").evaluate("element => window.scrollTo({top:element.getBoundingClientRect().top + scrollY, behavior:'instant'})")
        page.wait_for_timeout(250)
        self.assertEqual(page.locator("#sc-practice .pr-tab.is-done").count(), 3)
        self.assertEqual(page.locator('#sc-practice .pr-tab[data-case="C"]').get_attribute("aria-selected"), "true")
        self.assertIn("requests.get", page.inner_text("#sc-practice .pr-res"))

        page.locator("#sc-summary").evaluate("element => window.scrollTo({top:element.getBoundingClientRect().top + scrollY, behavior:'instant'})")
        page.wait_for_timeout(650)
        self.assertEqual(page.locator('#sc-summary .tr-b[data-b="2"]').get_attribute("aria-expanded"), "true")
        self.assertEqual(page.inner_text("#sc-summary .qz-score"), "2 / 3")
        self.assertTrue(page.locator("#sc-summary .qz-card").nth(1).evaluate("element => element.classList.contains('is-no')"))
        self.assertTrue(page.locator("#sc-summary .qz-card").nth(0).locator(".qz-exp").is_visible())
        self.assertEqual(self._errors, [])

    def test_summary_reveal_uses_browser_viewport(self):
        page = self.open_reader(viewport={"width": 1440, "height": 900})
        tree = page.locator('#sc-summary .su-block[data-block="tree"]')
        quiz = page.locator('#sc-summary .su-block[data-block="quiz"]')
        self.assertEqual(tree.evaluate("element => getComputedStyle(element).opacity"), "0")
        self.assertEqual(quiz.evaluate("element => getComputedStyle(element).opacity"), "0")

        tree.scroll_into_view_if_needed()
        page.wait_for_function("() => getComputedStyle(document.querySelector('#sc-summary [data-block=tree]')).opacity === '1'")
        self.assertEqual(tree.evaluate("element => getComputedStyle(element).opacity"), "1")
        quiz.scroll_into_view_if_needed()
        page.wait_for_function("() => getComputedStyle(document.querySelector('#sc-summary [data-block=quiz]')).opacity === '1'")
        page.locator("#sc-summary .qz-card").first.locator('.qz-opt[data-k="B"]').click()
        self.assertEqual(page.inner_text("#sc-summary .qz-score"), "1 / 3")

        page.evaluate("() => window.scrollTo({top:0, behavior:'instant'})")
        page.wait_for_timeout(200)
        quiz.scroll_into_view_if_needed()
        page.wait_for_timeout(300)
        self.assertEqual(page.inner_text("#sc-summary .qz-score"), "1 / 3")
        self.assertEqual(quiz.evaluate("element => getComputedStyle(element).opacity"), "1")
        self.assertEqual(self._errors, [])

    def test_responsive_flow_and_touch_targets_at_ticket_viewports(self):
        for width, height in ((390, 844), (768, 1024), (1920, 1080)):
            page = self.open_reader(viewport={"width": width, "height": height})
            dimensions = page.evaluate("() => ({viewport:innerWidth, page:document.documentElement.scrollWidth})")
            self.assertLessEqual(dimensions["page"], dimensions["viewport"] + 1, (width, dimensions))

            stages = page.eval_on_selector_all("#sc-practice .pr-stage", """elements => elements.map(element => {
              const rect = element.getBoundingClientRect();
              return {left:rect.left, right:rect.right, top:rect.top, bottom:rect.bottom};
            })""")
            self.assertEqual(len(stages), 3)
            if width < 1000:
                self.assertLess(stages[0]["bottom"], stages[1]["top"], (width, stages))
                self.assertLess(stages[1]["bottom"], stages[2]["top"], (width, stages))
            else:
                self.assertLess(stages[0]["right"], stages[1]["left"], (width, stages))
                self.assertLess(stages[1]["right"], stages[2]["left"], (width, stages))

            tree_layout = page.evaluate("""() => {
              const branches = document.querySelector('#sc-summary .tr-branches').getBoundingClientRect();
              const detail = document.querySelector('#sc-summary .tr-detail').getBoundingClientRect();
              return {branches, detail};
            }""")
            if width <= 1000:
                self.assertLess(tree_layout["branches"]["bottom"], tree_layout["detail"]["top"], (width, tree_layout))
            else:
                self.assertLess(tree_layout["branches"]["right"], tree_layout["detail"]["left"], (width, tree_layout))

            if width == 390:
                targets = page.eval_on_selector_all(
                    "#sc-practice .pr-tab, #sc-practice .pr-opt, #sc-summary .su-stop, "
                    "#sc-summary .tr-b, #sc-summary .qz-opt, #sc-summary .qz-reset",
                    """elements => elements.map(element => ({
                      label:element.textContent, width:element.getBoundingClientRect().width,
                      height:element.getBoundingClientRect().height
                    }))""",
                )
                self.assertGreaterEqual(len(targets), 24)
                for target in targets:
                    self.assertGreaterEqual(target["height"], 44, target)
                    self.assertGreaterEqual(target["width"], 32, target)
                page.locator('#sc-practice .pr-tab[data-case="C"]').click()
                node_heights = page.eval_on_selector_all("#sc-practice .pr-node", "elements => elements.map(element => element.getBoundingClientRect().height)")
                self.assertEqual(len(node_heights), 5)
                for target_height in node_heights:
                    self.assertGreaterEqual(target_height, 44)
            self.assertEqual(self._errors, [], width)

    def test_reduced_motion_keeps_practice_and_summary_immediately_usable(self):
        page = self.open_reader(viewport={"width": 390, "height": 844}, reduced=True)
        opacity = page.eval_on_selector_all(
            "#sc-practice .pr-head, #sc-practice .pr-flow, #sc-summary .su-block",
            "elements => elements.map(element => getComputedStyle(element).opacity)",
        )
        self.assertTrue(all(value == "1" for value in opacity), opacity)
        self.assertEqual(page.evaluate("() => document.getAnimations().length"), 0)

        page.locator('#sc-practice .pr-opt[data-k="2"]').click()
        self.assertEqual(page.locator("#sc-practice .pr-res .pr-ok").count(), 1)
        page.locator('#sc-summary .tr-b[data-b="3"]').click()
        self.assertEqual(page.locator('#sc-summary .tr-b[data-b="3"]').get_attribute("aria-expanded"), "true")
        page.locator("#sc-summary .qz-card").first.locator('.qz-opt[data-k="B"]').click()
        self.assertEqual(page.inner_text("#sc-summary .qz-score"), "1 / 3")
        self.assertEqual(page.evaluate("() => document.getAnimations().length"), 0)
        self.assertEqual(self._errors, [])

    def test_classroom_summary_path_keeps_presenter_navigation(self):
        context = self.browser.new_context(viewport={"width": 1920, "height": 1080})
        page = context.new_page()
        self.addCleanup(context.close)
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
        classroom = REPO / "artifacts" / "crawler-web-bp" / "index.html"
        page.goto(classroom.as_uri() + "#/7", wait_until="load")
        page.wait_for_timeout(1200)
        self.assertTrue(page.locator("#sc-summary").is_visible())

        page.locator('#sc-summary .su-stop[data-go="2"]').click()
        page.wait_for_function("() => location.hash === '#/2' && document.getElementById('sc-flow').getBoundingClientRect().height > 0")
        self.assertEqual(page.evaluate("() => location.hash"), "#/2")
        self.assertTrue(page.locator("#sc-flow").is_visible())
        self.assertFalse(page.locator("#sc-summary").is_visible())
        self.assertEqual(errors, [])

    def test_summary_path_uses_shareable_semantic_anchors(self):
        page = self.open_reader()
        stops = page.locator("#sc-summary .su-stop")
        self.assertEqual(stops.count(), 7)
        for index, scene_id in enumerate(SCENE_IDS):
            stop = stops.nth(index)
            self.assertEqual(stop.evaluate("element => element.tagName"), "A")
            self.assertEqual(stop.get_attribute("href"), "#" + scene_id)

        stops.nth(1).click()
        page.wait_for_function("() => Math.abs(document.getElementById('sc-flow').getBoundingClientRect().top) <= 2")
        self.assertEqual(page.evaluate("() => location.hash"), "#sc-flow")
        self.assertEqual(self._errors, [])


if __name__ == "__main__":
    unittest.main(verbosity=2)
