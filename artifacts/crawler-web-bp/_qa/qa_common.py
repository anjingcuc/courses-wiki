#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""_qa 共享脚手架：子路径静态服务器 + 场景清单单一来源。

四个阅读版浏览器测试、audit_reader 与 audit_v3 都从这里取 SiteHandler、
服务器引导与 SCENE_IDS，避免同一子路径映射和七屏清单在多处复制漂移。
场景清单派生自 build/scenes-v3/*.html 的文件发现（按 stem 排序取 section id），
与 build.py 的组装顺序同一规则；新增/改名场景文件时清单自动跟随。
"""
import functools
import http.server
import pathlib
import re
import sys
import threading
from urllib.parse import urlsplit

HERE = pathlib.Path(__file__).resolve().parent
PROJ = HERE.parent
REPO = PROJ.parent.parent
SITE = REPO / "site"
PREFIX = "/courses-wiki/"
READER_PATH = PREFIX + "python/demos/crawler-web-bp.html"


def scene_ids(scene_dir=None):
    """按 stem 顺序从场景 HTML 片段提取 section id（build.py 同一发现规则）。"""
    directory = pathlib.Path(scene_dir) if scene_dir else (PROJ / "build" / "scenes-v3")
    ids = []
    for html_path in sorted(directory.glob("*.html")):
        match = re.search(r'<section[^>]*\bid="([^"]+)"', html_path.read_text("utf-8"))
        if match:
            ids.append(match.group(1))
    return ids


SCENE_IDS = scene_ids()


class QuietServer(http.server.ThreadingHTTPServer):
    """浏览器关页中断传输属正常现象，不向测试输出倾倒堆栈。"""

    daemon_threads = True

    def handle_error(self, request, client_address):
        exc = sys.exc_info()[1]
        if isinstance(exc, (ConnectionAbortedError, ConnectionResetError, BrokenPipeError)):
            return
        super().handle_error(request, client_address)


class SiteHandler(http.server.SimpleHTTPRequestHandler):
    """把 GitHub Pages 子路径 /courses-wiki/ 映射到 MkDocs 的 site 根目录。"""

    def do_GET(self):
        # 真实发布源带 favicon；本地静态源补一个 204，避免把环境伪影记成 console error。
        if urlsplit(self.path).path == "/favicon.ico":
            self.send_response(204)
            self.end_headers()
            return
        super().do_GET()

    def translate_path(self, path):
        published_path = urlsplit(path).path
        if not published_path.startswith(PREFIX):
            return str(SITE / "__outside_courses_wiki__")
        path = published_path[len(PREFIX) - 1:]
        return super().translate_path(path)

    def log_message(self, *args):
        pass


def start_reader_server():
    """在随机端口托管 site/，返回 (server, thread, reader_url)。"""
    server = QuietServer(("127.0.0.1", 0), functools.partial(SiteHandler, directory=str(SITE)))
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    url = "http://127.0.0.1:%d%s" % (server.server_port, READER_PATH)
    return server, thread, url


def stop_reader_server(server, thread):
    server.shutdown()
    server.server_close()
    thread.join(timeout=2)
