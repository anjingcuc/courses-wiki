from __future__ import annotations

import json
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[3]
OUT = Path(__file__).resolve().parent
FILES = [
    ROOT / "docs/python/v2/slides/w07-venv.html",
    ROOT / "docs/python/demos/w07-venv-lab.html",
]


class AuditParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.buttons_missing_type: list[int] = []
        self.iframes: list[dict] = []
        self.blank_links_missing_rel: list[int] = []
        self.links: list[str] = []
        self.external_assets: list[str] = []

    def handle_starttag(self, tag: str, attrs_list: list[tuple[str, str | None]]) -> None:
        attrs = dict(attrs_list)
        line = self.getpos()[0]
        if attrs.get("id"):
            self.ids.append(str(attrs["id"]))
        if tag == "button" and attrs.get("type") != "button":
            self.buttons_missing_type.append(line)
        if tag == "iframe":
            self.iframes.append({"line": line, "title": attrs.get("title"), "loading": attrs.get("loading"), "src": attrs.get("src")})
        if tag == "a":
            href = attrs.get("href") or ""
            self.links.append(href)
            if attrs.get("target") == "_blank" and "noopener" not in (attrs.get("rel") or ""):
                self.blank_links_missing_rel.append(line)
        if tag in ("script", "img", "iframe", "link"):
            url = attrs.get("src") or attrs.get("href") or ""
            if urlsplit(url).scheme in ("http", "https"):
                self.external_assets.append(url)


def local_target_exists(source: Path, href: str) -> bool | None:
    if not href or href.startswith("#") or href.startswith("?"):
        return None
    parsed = urlsplit(href)
    if parsed.scheme or href.startswith("//"):
        return None
    path = unquote(parsed.path)
    if not path:
        return None
    target = (source.parent / path).resolve()
    if target.is_dir() or path.endswith("/"):
        candidate = Path(str(target) + ".md") if path.endswith("/") else target / "index.md"
        return candidate.exists()
    return target.exists()


def main() -> None:
    report = {"files": [], "passed": True}
    for file in FILES:
        parser = AuditParser()
        parser.feed(file.read_text(encoding="utf-8"))
        duplicate_ids = sorted(key for key, count in Counter(parser.ids).items() if count > 1)
        bad_iframes = [frame for frame in parser.iframes if not frame["title"] or frame["loading"] != "lazy"]
        links = [{"href": href, "exists": local_target_exists(file, href)} for href in parser.links]
        broken = [link["href"] for link in links if link["exists"] is False]
        # The slides URL ../../#weeks maps to docs/python.md under MkDocs directory URLs.
        broken = [href for href in broken if href != "../../#weeks"]
        row = {
            "file": str(file.relative_to(ROOT)),
            "duplicate_ids": duplicate_ids,
            "buttons_missing_type": parser.buttons_missing_type,
            "bad_iframes": bad_iframes,
            "blank_links_missing_rel": parser.blank_links_missing_rel,
            "broken_local_targets": broken,
            "external_assets": parser.external_assets,
            "local_links_checked": sum(1 for link in links if link["exists"] is not None),
        }
        row["passed"] = not any(row[key] for key in ("duplicate_ids", "buttons_missing_type", "bad_iframes", "blank_links_missing_rel", "broken_local_targets", "external_assets"))
        report["files"].append(row)
        report["passed"] = report["passed"] and row["passed"]
    (OUT / "static-integrity.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    raise SystemExit(0 if report["passed"] else 1)


if __name__ == "__main__":
    main()
