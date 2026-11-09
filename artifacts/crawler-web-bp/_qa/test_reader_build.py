#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""#17 双出口构建测试：公共接缝是 build.py 命令与其发布产物。"""
import pathlib
import re
import subprocess
import sys
import unittest

HERE = pathlib.Path(__file__).parent
PROJ = HERE.parent
REPO = PROJ.parent.parent
BUILD = PROJ / "build" / "build.py"
CLASSROOM = PROJ / "index.html"
READER = REPO / "docs" / "python" / "demos" / "crawler-web-bp.html"
SCENE_IDS = [
    "sc-overview", "sc-flow", "sc-complete", "sc-dynamic",
    "sc-selectors", "sc-practice", "sc-summary",
]


class ReaderBuildTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.result = subprocess.run(
            [sys.executable, str(BUILD)], cwd=str(BUILD.parent),
            text=True, capture_output=True,
        )

    def test_build_succeeds_and_writes_both_outputs(self):
        self.assertEqual(self.result.returncode, 0, self.result.stderr)
        self.assertTrue(CLASSROOM.is_file(), "课堂版未生成")
        self.assertTrue(READER.is_file(), "阅读版未生成到 docs/python/demos/")
        self.assertIn(str(CLASSROOM), self.result.stdout)
        self.assertIn(str(READER), self.result.stdout)

    def test_reader_reuses_all_scene_sources_with_semantic_anchors(self):
        self.assertTrue(READER.is_file(), "先运行双输出构建")
        html = READER.read_text("utf-8")
        ids = re.findall(r'<section\b[^>]*\bclass="[^"]*\bscene\b[^"]*"[^>]*\bid="([^"]+)"', html)
        self.assertEqual(ids, SCENE_IDS)
        for sid in SCENE_IDS:
            self.assertIn('href="#%s"' % sid, html, sid)
        self.assertIn('data-nav="回到总图"', html)

    def test_reader_has_no_presenter_controls_or_global_scene_shortcuts(self):
        self.assertTrue(READER.is_file(), "先运行双输出构建")
        html = READER.read_text("utf-8")
        for control in ("btnAuto", "btnFull", "btnTheme", "btnReplay", "railList"):
            self.assertNotIn('id="%s"' % control, html)
        self.assertIsNone(re.search(r"document\.addEventListener\(\s*['\"]keydown", html))
        self.assertIsNone(re.search(r"document\.addEventListener\(\s*['\"]touchstart", html))
        self.assertNotIn("requestFullscreen", html)
        self.assertNotIn("bp-theme", html)

    def test_classroom_keeps_presenter_shell(self):
        self.assertTrue(CLASSROOM.is_file(), "课堂版未生成")
        html = CLASSROOM.read_text("utf-8")
        for control in ("btnAuto", "btnFull", "btnTheme", "btnReplay", "railList"):
            self.assertIn('id="%s"' % control, html)
        self.assertIn("BP.scenes", html)
        self.assertNotIn("BP.reader = true", html)


if __name__ == "__main__":
    unittest.main(verbosity=2)
