#!/usr/bin/env python3
"""Build the teaching-innovation slideshow into the MkDocs site.

Source of truth: teaching-innovation-deck/
Generated output: docs/innovation-report/

The deck is static HTML/JS. This script only copies the runtime files and
validates that the published copy stays self-contained and offline-capable.
"""

from __future__ import annotations

import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "teaching-innovation-deck"
DEST = ROOT / "docs" / "innovation-report"

REQUIRED = (
    "index.html",
    "composition/index.html",
    "composition/assets/deck.css",
    "composition/assets/deck.js",
    "composition/assets/gsap.min.js",
    "vendor/hyperframes-player.global.js",
    "vendor/hyperframes-slideshow.global.js",
)


def reset_directory(path: Path) -> None:
    path_resolved = path.resolve()
    expected_parent = (ROOT / "docs").resolve()
    if path_resolved.parent != expected_parent:
        raise SystemExit(f"Refusing to clear unexpected path: {path_resolved}")
    if path_resolved.exists():
        shutil.rmtree(path_resolved)
    path_resolved.mkdir(parents=True)


def copy_runtime() -> None:
    if not SOURCE.is_dir():
        raise SystemExit(f"Deck source not found: {SOURCE}")
    reset_directory(DEST)
    shutil.copy2(SOURCE / "index.html", DEST / "index.html")
    shutil.copy2(SOURCE / "favicon.ico", DEST / "favicon.ico")
    for name in ("composition", "vendor"):
        shutil.copytree(SOURCE / name, DEST / name)


def validate() -> None:
    missing = [item for item in REQUIRED if not (DEST / item).is_file()]
    if missing:
        raise SystemExit("Deck build is incomplete: " + ", ".join(missing))

    html = (DEST / "index.html").read_text(encoding="utf-8")
    composition = (DEST / "composition" / "index.html").read_text(encoding="utf-8")
    if 'src="composition/index.html' not in html:
        raise SystemExit("Published wrapper no longer points at the composition")
    if 'data-composition-id="root"' not in composition:
        raise SystemExit("Composition root is missing")
    scene_count = len(re.findall(r'class="scene-frame[^"]*"', composition))
    if scene_count != 17:
        raise SystemExit(f"Expected 17 scenes, found {scene_count}")

    remote_assets = re.findall(
        r'(?:src|href)=["\'](https?://[^"\']+\.(?:js|css))(?:[?"\'])', html + composition
    )
    if remote_assets:
        raise SystemExit("Deck must not load remote scripts/styles: " + repr(remote_assets))

    files = [path for path in DEST.rglob("*") if path.is_file()]
    total = sum(path.stat().st_size for path in files)
    print(
        f"Teaching-innovation deck built: {len(files)} files, "
        f"{total / 1024:.0f} KiB, {scene_count} scenes → {DEST.relative_to(ROOT)}"
    )


if __name__ == "__main__":
    copy_runtime()
    validate()
