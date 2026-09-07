"""全站内部链接检查器：扫描 site/ 所有 HTML 的 href/src，报告指向不存在的目标。"""
import os
import re
import html
from urllib.parse import urljoin, urlparse, unquote

SITE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "site")

# 已知无害/环境性断链（LFS 本地未拉取、协议相对链接、reveal 自带示例、讲义示例链接）
IGNORE = re.compile(
    r"(\.zip|\.exe|\.rar|\.mp4|\.webm|\.whl|//player\.|socket\.io|/plugin/markdown|/author/|ct/demo\.md)$|//player\."
)


def url_exists(url_path):
    url_path = unquote(url_path.lstrip("/"))
    url_path = url_path.split("?")[0].split("#")[0]
    if not url_path:
        return True
    cand = os.path.join(SITE, url_path)
    if os.path.isfile(cand):
        return True
    if os.path.isfile(os.path.join(cand, "index.html")):
        return True
    return False


checked = {}
broken = []
count = 0

for root, dirs, files in os.walk(SITE):
    dirs[:] = [d for d in dirs if d not in (".git",)]
    for f in files:
        if not f.endswith(".html"):
            continue
        full = os.path.join(root, f)
        rel = os.path.relpath(full, SITE).replace(os.sep, "/")
        if rel == "index.html":
            page_url = "/"
        elif rel.endswith("/index.html"):
            page_url = "/" + rel[: -len("index.html")]
        else:
            page_url = "/" + rel
        text = open(full, encoding="utf-8", errors="ignore").read()
        for m in re.finditer(r'(?:href|src)="([^"]+)"', text):
            raw = html.unescape(m.group(1))
            if raw.startswith(("http://", "https://", "mailto:", "data:", "javascript:")):
                continue
            if IGNORE.search(raw):
                continue
            if raw.startswith("#") or raw == "":
                continue
            absu = urljoin(page_url, raw)
            key = urlparse(absu).path
            # 模拟 GitHub Pages 部署：站点挂在 /courses-wiki/ 前缀下
            key = key.replace("/courses-wiki/", "/", 1) if key.startswith("/courses-wiki/") else key
            if key not in checked:
                checked[key] = url_exists(key)
            count += 1
            if not checked[key]:
                broken.append((rel, raw))

seen = set()
uniq = [x for x in broken if not (x in seen or seen.add(x))]
print(f"checked {count} link refs, unique broken: {len(uniq)}")
for page, link in uniq:
    print(f"  {page}  ->  {link}")
