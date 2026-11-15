#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""#19 场景 04–05：以构建后阅读页和课堂页的公开行为为测试接缝。"""
import unittest

from playwright.sync_api import sync_playwright

from qa_common import SITE, start_reader_server, stop_reader_server

SITE_PAGE = SITE / "python" / "demos" / "crawler-web-bp.html"


class ReaderScenes0405Test(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        if not SITE_PAGE.is_file():
            raise RuntimeError("缺少构建后阅读页；先运行 build.py 与 uv run mkdocs build")
        cls.server, cls.thread, cls.url = start_reader_server()
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(channel="chrome", headless=True)

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()
        stop_reader_server(cls.server, cls.thread)

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

    def test_selector_map_returns_to_workbench_with_window_scrolling(self):
        page = self.open_reader()
        page.locator("#sc-selectors .sel-map").scroll_into_view_if_needed()
        page.locator('#selMap .map-xp[data-x="//a"]').click()
        page.wait_for_timeout(900)

        position = page.evaluate("""() => ({
          scrollY,
          sceneTop: document.getElementById('sc-selectors').getBoundingClientRect().top,
          input: document.getElementById('selInput').value,
          hits: document.getElementById('selN').textContent
        })""")
        self.assertEqual(position["input"], "//a")
        self.assertEqual(position["hits"], "6")  # logo + 2 个导航链接 + 3 个封面
        self.assertLessEqual(abs(position["sceneTop"]), 2, position)
        self.assertEqual(self._errors, [])

    def test_primary_touch_targets_are_at_least_44px_on_phone(self):
        page = self.open_reader(viewport={"width": 390, "height": 844}, reduced=True)
        selector = ", ".join([
            "#sc-dynamic button", "#sc-dynamic [role='button']",
            "#sc-selectors button", "#sc-selectors input",
            "#sc-selectors .tr[data-nid]", "#sc-selectors .hit[data-nid]",
        ])
        targets = page.eval_on_selector_all(selector, """els => els.map(e => ({
          label: (e.textContent || e.value || '').trim().slice(0, 60),
          width: e.getBoundingClientRect().width,
          height: e.getBoundingClientRect().height
        }))""")
        self.assertGreater(len(targets), 45)
        too_small = [target for target in targets if target["height"] < 44 or target["width"] < 32]
        self.assertEqual(too_small, [])
        self.assertEqual(self._errors, [])

    def test_workbenches_split_columns_without_page_overflow(self):
        for width, height in ((390, 844), (768, 1024), (1920, 1080)):
            with self.subTest(width=width):
                page = self.open_reader(viewport={"width": width, "height": height}, reduced=True)
                layout = page.evaluate("""() => {
                  const rects = selector => [...document.querySelectorAll(selector)].map(e => {
                    const r = e.getBoundingClientRect();
                    return {left:r.left, top:r.top, right:r.right, bottom:r.bottom};
                  });
                  return {
                    viewport: innerWidth,
                    pageWidth: document.documentElement.scrollWidth,
                    selectors: rects('#sc-selectors .sel-col1, #sc-selectors .sel-tree, #sc-selectors .sel-console'),
                    dynamic: rects('#sc-dynamic .a-flow, #sc-dynamic .a-dom, #sc-dynamic .a-code')
                  };
                }""")
                self.assertLessEqual(layout["pageWidth"], layout["viewport"] + 1, layout)
                for key in ("selectors", "dynamic"):
                    columns = layout[key]
                    self.assertEqual(len(columns), 3)
                    if width < 1180:
                        self.assertTrue(all(item["top"] >= columns[0]["bottom"] - 1 for item in columns[1:]), (key, columns))
                        self.assertLess(columns[1]["top"], columns[2]["top"], (key, columns))
                    else:
                        self.assertLess(columns[0]["right"], columns[1]["left"], (key, columns))
                        self.assertLess(columns[1]["right"], columns[2]["left"], (key, columns))
                self.assertEqual(self._errors, [], width)

    def test_dynamic_diagram_uses_window_positioning_for_both_routes(self):
        page = self.open_reader(reduced=True)
        scene = page.locator("#sc-dynamic")
        scene.scroll_into_view_if_needed()

        page.locator("#sc-dynamic .route.is-b").click()
        page.wait_for_timeout(100)
        b_position = page.evaluate("""() => ({
          detailTop: document.getElementById('blkB').getBoundingClientRect().top,
          rootScroll: document.getElementById('sc-dynamic').scrollTop,
          windowScroll: scrollY
        })""")
        self.assertLessEqual(abs(b_position["detailTop"] - 54), 2, b_position)
        self.assertEqual(b_position["rootScroll"], 0)
        self.assertGreater(b_position["windowScroll"], 1000)

        page.locator("#sc-dynamic .route.is-a [data-step='4']").click()
        page.wait_for_timeout(100)
        a_position = page.evaluate("""() => ({
          detailTop: document.getElementById('blkA').getBoundingClientRect().top,
          step: document.getElementById('aStepNo').textContent,
          rootScroll: document.getElementById('sc-dynamic').scrollTop
        })""")
        self.assertLessEqual(abs(a_position["detailTop"] - 54), 2, a_position)
        self.assertEqual(a_position["step"], "STEP 04 / 07")
        self.assertEqual(a_position["rootScroll"], 0)
        self.assertEqual(self._errors, [])

    def test_every_simulated_selector_link_stays_on_reader(self):
        page = self.open_reader(reduced=True)
        original_url = page.url
        links = page.locator("#sc-selectors .pg a[href]")
        self.assertEqual(links.count(), 6)
        for index in range(links.count()):
            link = links.nth(index)
            href = link.get_attribute("href")
            link.click()
            page.wait_for_timeout(80)
            self.assertEqual(page.url, original_url, href)
        self.assertEqual(self._errors, [])

    def test_css_xpath_and_tree_nodes_keep_three_way_highlight_in_sync(self):
        page = self.open_reader(reduced=True)

        def assert_three_title_hits():
            expected = page.eval_on_selector_all(
                "#sc-selectors .pg h3.title", "els => els.map(e => e.dataset.nodeId)"
            )
            self.assertEqual(len(expected), 3)
            self.assertEqual(page.inner_text("#selN"), "3")
            self.assertEqual(page.locator("#selHits .hb").count(), 3)
            self.assertEqual(
                page.eval_on_selector_all("#selTree .tr.is-hit", "els => els.map(e => e.dataset.nid)"),
                expected,
            )
            source_lines = page.locator("#selSrc .src-line.is-hit").all_inner_texts()
            self.assertEqual(len(source_lines), 3)
            self.assertTrue(all("h3" in line for line in source_lines), source_lines)
            self.assertEqual(page.locator("#selHitsList .hit[data-nid]").count(), 3)

        page.locator("#selInput").fill(".title")
        page.locator("#selInput").dispatch_event("input")
        page.wait_for_timeout(180)
        assert_three_title_hits()

        page.locator('#selMode [data-mode="xpath"]').click()
        page.locator("#selInput").fill("//h3[@class='title']")
        page.locator("#selInput").dispatch_event("input")
        page.wait_for_timeout(180)
        assert_three_title_hits()

        card_id = page.locator('#sc-selectors .pg .card[data-id="BV2B"]').get_attribute("data-node-id")
        page.locator('#selTree .tr[data-nid="%s"]' % card_id).click()
        css_expression = page.inner_text("#selNodeBody .nc-row.css .nc-e")
        xpath_expression = page.inner_text("#selNodeBody .nc-row.xp .nc-e")
        self.assertEqual(css_expression, 'div[data-id="BV2B"]')
        self.assertEqual(xpath_expression, '//div[@data-id="BV2B"]')

        for row_selector, expression in (
            ("#selNodeBody .nc-row.xp", xpath_expression),
            ("#selNodeBody .nc-row.css", css_expression),
        ):
            page.locator(row_selector).click()
            self.assertEqual(page.locator("#selInput").input_value(), expression)
            self.assertEqual(page.inner_text("#selN"), "1")
            self.assertEqual(
                page.eval_on_selector_all("#selTree .tr.is-hit", "els => els.map(e => e.dataset.nid)"),
                [card_id],
            )
            self.assertEqual(page.locator("#selHits .hb").count(), 1)

        page.evaluate("() => window.scrollTo({top:0, behavior:'instant'})")
        page.locator("#sc-selectors").evaluate("e => window.scrollTo({top:e.getBoundingClientRect().top + scrollY, behavior:'instant'})")
        self.assertEqual(page.locator("#selInput").input_value(), css_expression)
        self.assertEqual(page.inner_text("#selN"), "1")
        self.assertEqual(self._errors, [])


if __name__ == "__main__":
    unittest.main(verbosity=2)
