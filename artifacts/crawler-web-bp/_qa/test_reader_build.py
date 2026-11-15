#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""#17 双出口构建测试：公共接缝是 build.py 命令与其发布产物。"""
import pathlib
import os
import re
import shutil
import subprocess
import sys
import tempfile
import unittest

from qa_common import SCENE_IDS

HERE = pathlib.Path(__file__).parent
PROJ = HERE.parent
REPO = PROJ.parent.parent
BUILD = PROJ / "build" / "build.py"
CLASSROOM = PROJ / "index.html"
READER = REPO / "docs" / "python" / "demos" / "crawler-web-bp.html"


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

    def test_scene_nav_labels_within_six_chars(self):
        """CONTRACT §2：data-nav 是左侧导航短标签，必须 ≤6 字。"""
        html = READER.read_text("utf-8")
        labels = re.findall(r'data-nav="([^"]+)"', html)
        self.assertEqual(len(labels), 7, labels)
        for label in labels:
            self.assertLessEqual(len(label), 6, label)

    def test_docs_and_contract_point_at_scenes_v3(self):
        """文档不得漂移：build.py docstring 与 CONTRACT 自检命令都指向 scenes-v3。"""
        build_text = BUILD.read_text("utf-8")
        contract_text = (PROJ / "build" / "CONTRACT.md").read_text("utf-8")
        self.assertIn("scenes-v3", build_text)
        self.assertNotIn("scenes/02-flow", build_text)
        self.assertIn("scenes-v3", contract_text)
        self.assertNotIn("scenes/*", contract_text)
        self.assertNotIn("node --check build/scenes/", contract_text)
        self.assertIn("node --check build/scenes-v3/", contract_text)

    def test_contract_node_check_command_runs(self):
        """CONTRACT §7 自检命令真实可跑：node --check 每个 scenes-v3 JS。"""
        if shutil.which("node") is None:
            self.skipTest("node 不可用")
        for js in sorted((PROJ / "build" / "scenes-v3").glob("*.js")):
            result = subprocess.run(
                ["node", "--check", str(js)], capture_output=True, text=True,
            )
            self.assertEqual(result.returncode, 0, js.name)

    def test_readme_documents_reader_pipeline(self):
        """README 目录树与重建章节须覆盖阅读版出口、外壳与全部 QA 入口。"""
        text = (PROJ / "README.md").read_text("utf-8")
        for needle in (
            "reader-shell.html",
            "docs/python/demos/crawler-web-bp.html",
            "audit_reader.py",
            "test_reader.py",
            "audit_v3.py",
            "mkdocs build",
        ):
            self.assertIn(needle, text)

    def test_scene_registry_single_source(self):
        """场景清单单一来源：qa_common.scene_ids() 派生自 scenes-v3 文件发现。"""
        sys.path.insert(0, str(HERE))
        try:
            import qa_common
        except ImportError as error:
            self.fail("缺少 _qa/qa_common.py 共享脚手架：%s" % error)
        self.assertEqual(qa_common.scene_ids(), SCENE_IDS)

    def test_reader_href_escape_warns_on_uncovered_forms(self):
        """阅读版只转义 href=\" 精确形态；其它写法必须给出构建警告且不改写产物。"""
        probe_js = (
            'BP.scene("sc-probe", function (root, gsap, api) {\n'
            "  var html = '<span href=\"/covered\">ok</span>'\n"
            "    + \"<span href='/single'>sq</span>\"\n"
            '    + \'<span href = "/spaced">sp</span>\'\n'
            "    + '<span HREF=\"/upper\">up</span>';\n"
            "  return {};\n"
            "});\n"
        )
        env = dict(os.environ)
        with tempfile.TemporaryDirectory() as tmp:
            scenes = pathlib.Path(tmp) / "scenes"
            scenes.mkdir()
            (scenes / "01-probe.html").write_text(
                '<section class="scene sc-probe" id="sc-probe" data-nav="探针">'
                '<div class="pg"><p>probe</p></div></section>', "utf-8",
            )
            (scenes / "01-probe.js").write_text(probe_js, "utf-8")
            env["BP_SCENE_DIR"] = str(scenes)
            try:
                result = subprocess.run(
                    [sys.executable, str(BUILD)], cwd=str(BUILD.parent),
                    text=True, capture_output=True, env=env,
                )
                self.assertEqual(result.returncode, 0, result.stderr)
                warn_lines = [line for line in result.stdout.splitlines() if "href" in line]
                self.assertTrue(warn_lines, result.stdout)
                joined = "\n".join(warn_lines)
                self.assertIn("01-probe.js", joined)
                for form in ("href='", 'href = "', 'HREF="'):
                    self.assertIn(form, joined)
                self.assertNotIn('href="/covered"', joined)
                # 覆盖形态仍被转义；未覆盖形态原样保留。
                reader_html = READER.read_text("utf-8")
                self.assertIn('href\\x3d"/covered"', reader_html)
                self.assertIn("/single", reader_html)
            finally:
                # 恢复真实双出口产物，避免污染同文件内其它测试。
                subprocess.run(
                    [sys.executable, str(BUILD)], cwd=str(BUILD.parent),
                    capture_output=True,
                )


if __name__ == "__main__":
    unittest.main(verbosity=2)
