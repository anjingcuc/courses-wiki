#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""#22：从 MkDocs 构建后的真实站点验收拓展阅读版。

公开接缝是 ``site/`` 经 ``/courses-wiki/`` 子路径发布后的页面。审计只通过
浏览器 URL、用户可见内容、布局与交互观察行为，不读取 BP 或场景私有函数。

覆盖：
  ① W06 / M3 / 拓展长廊三入口实际点击进入并返回，记录 HTTP 状态；
  ② 连续滚动、语义锚点、无全局翻场快捷键；
  ③ 核心图内交互与滚动后状态保持（页面承诺"滚动不会重置练习状态"）；
  ④ 390 / 768 / 860 / 1000 / 1180 / 1920 无整页横向溢出（1100 / 1280 同规则覆盖）；
  ⑤ reduced-motion 下循环动画停止；
  ⑥ 每个会话无外部请求 / 意外导航 / console error / pageerror；
  ⓪ 探测器自检：横溢与 console 探测器先在合成违规上证明能报警（防恒真）。

MkDocs Material 的站点级既有外部行为（主题字体 + GitHub 仓库挂件，均为基线已
存在）只出现在入口/返回页，挂件走本地桩响应；阅读页会话仍然要求零外部请求。

用法（先运行场景构建与 ``uv run mkdocs build``）：
    python artifacts/crawler-web-bp/_qa/audit_reader.py

截图与机器可读摘要默认写入 ``artifacts/crawler-web-bp/_qa/reader/``。
"""
import argparse
import functools
import json
import os
import pathlib
import sys
import threading
import traceback
from urllib.parse import urlsplit

import qa_common
from qa_common import QuietServer, SiteHandler

HERE = pathlib.Path(__file__).resolve().parent
REPO = HERE.parent.parent.parent
SITE = qa_common.SITE
SOURCE_READER = REPO / "docs" / "python" / "demos" / "crawler-web-bp.html"
SITE_READER = SITE / "python" / "demos" / "crawler-web-bp.html"
PREFIX = qa_common.PREFIX
READER_PATH = qa_common.READER_PATH
READER_LINK = "Web 演进 × 爬虫技术"
TOC_NAV = 'nav[aria-label="阅读章节"] a[href="#%s"]'
SCENES = qa_common.SCENE_IDS
# 入口/返回页（MkDocs Material 页面）的站点级既有外部行为，基线 74a9671 已存在，
# 非本票据引入：主题字体（mkdocs.yml ``font:``）与 GitHub 仓库挂件（``repo_url`` 驱动
# vendored 主题包 docs/assets/javascripts/application.c648116f.js 请求 api.github.com）。
# 挂件在本审计中以本地桩响应代替，避免向真实 API 发请求（匿名限流 60 次/时会导致
# 结果不确定）；线上挂件行为属基线既有，不在本票据验收范围。阅读页会话不放行任何外部源。
THEME_HOSTS = ("fonts.googleapis.com", "fonts.gstatic.com", "api.github.com")
GITHUB_API_STUB = '{"name": "courses-wiki", "tag_name": "local-audit-stub"}'
RESULTS = []
SCREENSHOTS = []

OVERFLOW_EXPR = """() => {
  const d = document.documentElement, b = document.body;
  return {doc: d.scrollWidth - d.clientWidth, body: b.scrollWidth - b.clientWidth};
}"""

RUNNING_ANIM_EXPR = """() => {
  const out = [];
  for (const el of document.querySelectorAll('*')) {
    const cs = getComputedStyle(el);
    if (cs.animationName !== 'none') {
      out.push({tag: el.tagName, name: cs.animationName, iter: cs.animationIterationCount});
    }
  }
  return out;
}"""


def check(name, ok, detail=""):
    """打印并保存每一项真实观察结果。"""
    ok = bool(ok)
    RESULTS.append({"name": name, "ok": ok, "detail": str(detail)})
    print(("  PASS  " if ok else "  FAIL  ") + name + (("  — " + str(detail)) if detail else ""))
    return ok


def require(condition, message):
    if not condition:
        raise AssertionError(message)


class PageHealth:
    """收集一个会话的浏览器健康信号。

    ``allow_outside`` 供入口/返回页放行 MkDocs Material 站点级字体源；
    阅读页会话保持空表（零外部请求）。
    """

    def __init__(self, page, origin, allow_outside=()):
        self.page = page
        self.origin = origin
        self.allow_outside = tuple(allow_outside)
        self.console_errors = []
        self.page_errors = []
        self.bad_responses = []
        self.unexpected_requests = []
        page.on("console", self.on_console)
        page.on("pageerror", lambda error: self.page_errors.append(str(error)))
        page.on("response", self.on_response)
        page.on("request", self.on_request)

    def on_console(self, message):
        if message.type == "error":
            self.console_errors.append(message.text)

    def on_response(self, response):
        if response.status >= 400:
            self.bad_responses.append("%d %s" % (response.status, response.url))

    def on_request(self, request):
        url = urlsplit(request.url)
        if url.scheme in ("data", "blob", "about"):
            return
        expected = (
            url.scheme == "http"
            and url.netloc == self.origin
            and url.path.startswith(PREFIX)
        )
        if not expected and url.netloc not in self.allow_outside:
            self.unexpected_requests.append(request.url)

    def verify(self, label):
        check(label + "：无 console error", not self.console_errors, self.console_errors[:4])
        check(label + "：无未捕获页面异常", not self.page_errors, self.page_errors[:4])
        check(label + "：无 HTTP 4xx/5xx", not self.bad_responses, self.bad_responses[:4])
        check(label + "：无子路径外或外部网络请求", not self.unexpected_requests, self.unexpected_requests[:4])


class ReaderAudit:
    def __init__(self, browser, port, output):
        self.browser = browser
        self.origin = "127.0.0.1:%d" % port
        self.base = "http://%s%s" % (self.origin, PREFIX)
        self.reader_url = "http://%s%s" % (self.origin, READER_PATH)
        self.output = output
        self.output.mkdir(parents=True, exist_ok=True)

    def open_page(self, viewport=None, reduced=False, touch=False, allow_outside=()):
        context = self.browser.new_context(
            viewport=viewport or {"width": 1920, "height": 1080},
            reduced_motion="reduce" if reduced else "no-preference",
            has_touch=touch,
            is_mobile=touch,
            device_scale_factor=1,
        )
        page = context.new_page()
        page.set_default_timeout(8000)
        if allow_outside:
            context.route(
                "**/api.github.com/**",
                lambda route: route.fulfill(
                    status=200, content_type="application/json", body=GITHUB_API_STUB
                ),
            )
        health = PageHealth(page, self.origin, allow_outside=allow_outside)
        return context, page, health

    def screenshot(self, page, name, full_page=False):
        path = self.output / (name + ".png")
        page.screenshot(path=str(path), full_page=full_page)
        SCREENSHOTS.append(str(path.relative_to(REPO)))
        print("  SHOT   %s" % path.relative_to(REPO))
        return path

    def scenario(self, name, function):
        print("\n== %s ==" % name)
        try:
            function()
        except Exception as error:
            check(name + "：场景完成", False, "%s: %s" % (type(error).__name__, error))
            traceback.print_exc(limit=2)

    def toc(self, page, sid, settle=1200):
        """经公开目录锚点导航到语义章节，等待平滑滚动落定。"""
        page.locator(TOC_NAV % sid).click()
        page.wait_for_timeout(settle)

    def selftest(self):
        """⓪ 负向自检：证明探测器在合成违规上真的会报警（防恒真断言）。"""

        def run():
            context, page, health = self.open_page(viewport={"width": 768, "height": 1024})
            try:
                page.goto(self.reader_url, wait_until="load")
                clean = page.evaluate(OVERFLOW_EXPR)
                check("自检：初始无横溢", clean["doc"] <= 1 and clean["body"] <= 1, clean)
                page.evaluate(
                    "() => { const d = document.createElement('div');"
                    " d.id = '__qa_wide'; d.style.cssText = 'width:3000px;height:8px';"
                    " document.body.appendChild(d); }"
                )
                dirty = page.evaluate(OVERFLOW_EXPR)
                check("自检：横溢探测器对合成违规报警", dirty["doc"] > 1, dirty)
                page.evaluate("() => document.getElementById('__qa_wide').remove()")
                restored = page.evaluate(OVERFLOW_EXPR)
                check("自检：移除违规后读数归零", restored["doc"] <= 1, restored)
                page.evaluate("() => console.error('__qa_synthetic_error__')")
                page.wait_for_timeout(300)
                caught = any("__qa_synthetic_error__" in text for text in health.console_errors)
                check("自检：console 探测器捕获合成错误", caught, health.console_errors[:2])
            finally:
                context.close()

        self.scenario("探测器自检", run)

    def entry_and_return(self, key, source_path, return_link, from_slide=False):
        def run():
            context, page, health = self.open_page(allow_outside=THEME_HOSTS)
            try:
                source_url = self.base + source_path
                entry_resp = page.goto(source_url, wait_until="load")
                check(key + "：入口页 HTTP 200", entry_resp.status == 200,
                      "%s %s" % (entry_resp.status, source_url))
                # 非精确匹配：拓展长廊入口是整卡链接，可访问名含更多卡片文案。
                link = page.get_by_role("link", name=READER_LINK)
                if from_slide:
                    # W06 课后阅读在最后一页，frag 条目由课件公开键盘操作逐条展开。
                    for _ in range(4):
                        if link.is_visible():
                            break
                        page.keyboard.press("ArrowRight")
                require(link.is_visible(), "%s 的阅读入口不可见" % key)
                with page.expect_response(
                    lambda r: r.request.is_navigation_request()
                    and urlsplit(r.url).path == READER_PATH
                ) as reader_info:
                    link.click()
                reader_resp = reader_info.value
                check(key + "：阅读页 HTTP %d" % reader_resp.status,
                      reader_resp.status == 200, reader_resp.url)
                page.wait_for_load_state("load")
                require(urlsplit(page.url).path == READER_PATH, page.url)
                check(key + "：点击进入同一阅读页并保留子路径", True, page.url)
                require(page.get_by_role("heading", name=READER_LINK, exact=False).count() > 0, "阅读页标题缺失")

                page.get_by_role("link", name=return_link, exact=True).first.click()
                page.wait_for_url(
                    lambda url: urlsplit(url).path == PREFIX + source_path.split("#", 1)[0],
                    wait_until="load",
                )
                returned_path = urlsplit(page.url).path
                check(key + "：返回原学习上下文", returned_path == PREFIX + source_path.split("#", 1)[0], page.url)
                health.verify(key)
            finally:
                context.close()

        self.scenario(key + "进入 / 返回", run)

    def reader_navigation(self):
        """② 连续长页、语义锚点、无全局翻场快捷键。"""

        def run():
            context, page, health = self.open_page()
            try:
                resp = page.goto(self.reader_url, wait_until="load")
                check("阅读页 HTTP 200", resp.status == 200, resp.status)
                size = page.evaluate("() => ({h: document.documentElement.scrollHeight, vh: innerHeight})")
                check("连续长页（≥3 屏高）", size["h"] >= 3 * size["vh"], size)
                self.screenshot(page, "reader-hero-1920")

                landing, problems = True, []
                for sid in SCENES:
                    self.toc(page, sid)
                    state = page.evaluate(
                        "(sid) => { const el = document.getElementById(sid);"
                        " return {hash: location.hash, top: Math.round(el.getBoundingClientRect().top)}; }",
                        sid,
                    )
                    good = state["hash"] == "#" + sid and -2 <= state["top"] <= 160
                    landing = landing and good
                    if not good:
                        problems.append({sid: state})
                check("7 个语义锚点点击后 URL 与章节落位一致", landing, problems)
                self.screenshot(page, "reader-anchor-summary")

                page.evaluate("() => window.scrollTo({top: document.documentElement.scrollHeight})")
                page.wait_for_timeout(1200)
                check("滚到底部可见页脚返回入口",
                      page.get_by_role("link", name="返回 W06 课堂", exact=True).is_visible())
                sections = page.evaluate(
                    "() => Array.from(document.querySelectorAll('main#reader section[id]'))"
                    ".map(s => ({id: s.id, h: Math.round(s.getBoundingClientRect().height),"
                    " flow: !!s.offsetParent}))"
                )
                check("滚动后 7+ 章节均在文档流中可读",
                      len(sections) >= 7 and all(s["h"] > 100 and s["flow"] for s in sections), sections)
                self.screenshot(page, "reader-footer")

                self.toc(page, "sc-dynamic")
                before = page.evaluate(
                    "() => ({y: Math.round(scrollY), hash: location.hash,"
                    " theme: document.documentElement.dataset.theme || ''})"
                )
                for key_name in ("ArrowRight", "ArrowLeft", "t", "o"):
                    page.keyboard.press(key_name)
                    page.wait_for_timeout(150)
                after = page.evaluate(
                    "() => ({y: Math.round(scrollY), hash: location.hash,"
                    " theme: document.documentElement.dataset.theme || ''})"
                )
                check("无全局翻场快捷键（←/→/T/O 不换场景）", before == after, (before, after))
                health.verify("阅读页导航")
            finally:
                context.close()

        self.scenario("导航 / 滚动 / 快捷键", run)

    def figure_interaction(self):
        """③ 核心图内交互 + 连续滚动离开再回来后状态保持。"""

        def run():
            context, page, health = self.open_page()
            try:
                page.goto(self.reader_url, wait_until="load")
                # 总图：阶段节点驱动读数。
                self.toc(page, "sc-overview")
                before = page.inner_text("#ovRoA")
                page.click('#sc-overview [data-stage="2"]')
                page.wait_for_timeout(400)
                after_ov = page.inner_text("#ovRoA")
                check("总图阶段节点驱动读数", after_ov != before, "%s → %s" % (before, after_ov))

                # 往返图：点击可见节点展开报文抽屉。
                self.toc(page, "sc-flow")
                boxes = page.locator("#sc-flow .fl-box")
                clicked = False
                for i in range(min(boxes.count(), 8)):
                    if boxes.nth(i).is_visible():
                        boxes.nth(i).click()
                        clicked = True
                        break
                require(clicked, "往返图无可见图节点")
                page.wait_for_timeout(400)
                drawer_open = page.eval_on_selector(
                    "#flDrawer", "e => e.classList.contains('is-open')"
                )
                check("往返图节点展开报文抽屉", drawer_open)
                self.screenshot(page, "reader-interaction-drawer")

                # 连续滚动离开（滚轮），再经目录锚点回来：交互状态应保持。
                for _ in range(3):
                    page.mouse.wheel(0, 4000)
                    page.wait_for_timeout(400)
                self.toc(page, "sc-overview")
                kept_ov = page.inner_text("#ovRoA")
                check("滚动往返后总图读数保持", kept_ov == after_ov, "%s → %s" % (after_ov, kept_ov))
                self.screenshot(page, "reader-state-kept-overview")
                self.toc(page, "sc-flow")
                kept_drawer = page.eval_on_selector(
                    "#flDrawer", "e => e.classList.contains('is-open')"
                )
                check("滚动往返后报文抽屉保持打开", kept_drawer)
                check("图内交互不触发意外导航", urlsplit(page.url).path == READER_PATH, page.url)
                health.verify("阅读页图内交互")
            finally:
                context.close()

        self.scenario("图内交互与滚动后状态保持", run)

    def viewport_overflow(self):
        """④ 390 / 768 / 860 / 1000 / 1180 / 1920 无整页横向溢出。"""

        def run():
            for width, height, label in (
                (390, 844, "390"), (768, 1024, "768"), (860, 900, "860"),
                (1000, 900, "1000"), (1180, 900, "1180"), (1920, 1080, "1920"),
            ):
                context, page, health = self.open_page(viewport={"width": width, "height": height})
                try:
                    page.goto(self.reader_url, wait_until="load")
                    page.wait_for_timeout(800)
                    overflow = page.evaluate(OVERFLOW_EXPR)
                    check("%spx 无整页横向溢出" % label,
                          overflow["doc"] <= 1 and overflow["body"] <= 1, overflow)
                    self.screenshot(page, "reader-viewport-%s" % label)
                    health.verify("阅读页 %spx" % label)
                finally:
                    context.close()

        self.scenario("390/768/860/1000/1180/1920 视口横溢", run)

    def reduced_motion(self):
        """⑤ reduced-motion 下循环动画停止。"""

        def run():
            context, page, _ = self.open_page()
            try:
                page.goto(self.reader_url, wait_until="load")
                # 先整页滚动一圈，让折叠场景初始化自己的循环动画。
                for _ in range(4):
                    page.mouse.wheel(0, 4000)
                    page.wait_for_timeout(350)
                page.evaluate("() => window.scrollTo({top: 0, behavior: 'instant'})")
                page.wait_for_timeout(600)
                running = page.evaluate(RUNNING_ANIM_EXPR)
                loops = [r for r in running if r["iter"] == "infinite"]
                check("正常动效下存在循环动画（≥3 处）", len(loops) >= 3,
                      ["%s/%s" % (r["tag"], r["name"]) for r in loops])
                behavior = page.evaluate(
                    "() => getComputedStyle(document.documentElement).scrollBehavior"
                )
                check("正常动效下目录锚点平滑滚动", behavior == "smooth", behavior)
            finally:
                context.close()

            context, page, health = self.open_page(viewport={"width": 768, "height": 1024}, reduced=True)
            try:
                page.goto(self.reader_url, wait_until="load")
                for _ in range(4):
                    page.mouse.wheel(0, 4000)
                    page.wait_for_timeout(350)
                page.evaluate("() => window.scrollTo({top: 0, behavior: 'instant'})")
                page.wait_for_timeout(600)
                running = page.evaluate(RUNNING_ANIM_EXPR)
                check("reduced-motion 下循环动画全部停止", len(running) == 0, running[:5])
                behavior = page.evaluate(
                    "() => getComputedStyle(document.documentElement).scrollBehavior"
                )
                check("reduced-motion 下滚动行为为 auto", behavior == "auto", behavior)
                self.screenshot(page, "reader-reduced-768")
                health.verify("阅读页 reduced-motion")
            finally:
                context.close()

        self.scenario("reduced-motion 动画停用", run)

    def run(self):
        self.selftest()
        self.entry_and_return(
            "W06", "python/v2/slides/w06.html#/10", "← 返回 W06", from_slide=True,
        )
        self.entry_and_return(
            "M3", "python/v2/m3/", "M3 数据获取与处理",
        )
        self.entry_and_return(
            "拓展长廊", "python/v2/extensions/", "拓展自学长廊",
        )
        self.reader_navigation()
        self.figure_interaction()
        self.viewport_overflow()
        self.reduced_motion()


def verify_build():
    check("MkDocs 阅读页已生成", SITE_READER.is_file(), SITE_READER)
    if not SITE_READER.is_file():
        return False
    fresh = SITE_READER.read_bytes() == SOURCE_READER.read_bytes()
    check("MkDocs 阅读页与当前 docs 源一致（非陈旧 site）", fresh)
    for label, relative in (
        ("W06", "python/v2/slides/w06.html"),
        ("M3", "python/v2/m3/index.html"),
        ("拓展长廊", "python/v2/extensions/index.html"),
    ):
        check(label + "入口存在于构建后站点", (SITE / relative).is_file(), relative)
    return fresh


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=pathlib.Path, default=HERE / "reader")
    parser.add_argument("--browser-channel", default=os.environ.get("BP_QA_BROWSER", "chrome"))
    args = parser.parse_args()

    if not verify_build():
        print("\n请先运行 python artifacts/crawler-web-bp/build/build.py 与 uv run mkdocs build")
        return 2

    handler = functools.partial(SiteHandler, directory=str(SITE))
    server = QuietServer(("127.0.0.1", 0), handler)
    server.daemon_threads = True
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    exit_code = 1
    try:
        from playwright.sync_api import sync_playwright

        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(channel=args.browser_channel, headless=True)
            try:
                ReaderAudit(browser, server.server_port, args.output.resolve()).run()
            finally:
                browser.close()
        failed = [result for result in RESULTS if not result["ok"]]
        summary = {
            "passed": len(RESULTS) - len(failed),
            "total": len(RESULTS),
            "failed": failed,
            "results": RESULTS,
            "screenshots": SCREENSHOTS,
        }
        args.output.mkdir(parents=True, exist_ok=True)
        summary_path = args.output / "summary.json"
        summary_path.write_text(json.dumps(summary, ensure_ascii=False, indent=2), "utf-8")
        print("\n%d/%d passed" % (len(RESULTS) - len(failed), len(RESULTS)))
        print("Summary: %s" % summary_path)
        exit_code = 1 if failed else 0
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=2)
    return exit_code


if __name__ == "__main__":
    sys.exit(main())
