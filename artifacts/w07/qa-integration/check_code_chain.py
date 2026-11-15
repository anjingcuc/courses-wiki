from __future__ import annotations

import ast
import builtins
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
OUT = Path(__file__).resolve().parent
DECK = ROOT / "site/python/v2/slides/w07.html"
VIZ_LAB = ROOT / "site/python/demos/w07-visualization-lab.html"
VENV_LAB = ROOT / "site/python/demos/w07-venv-lab.html"


def slide_code(deck: str, number: int) -> str:
    starts = list(re.finditer(r'<section class="slide(?:\s|\")', deck))
    start = starts[number - 1].start()
    end = starts[number].start() if number < len(starts) else len(deck)
    chunk = deck[start:end]
    match = re.search(r"<pre[^>]*><code>(.*?)</code></pre>", chunk, re.S)
    if not match:
        raise AssertionError(f"slide {number} has no code block")
    return html.unescape(re.sub(r"<[^>]+>", "", match.group(1)))


def target_names(node: ast.AST) -> set[str]:
    return {n.id for n in ast.walk(node) if isinstance(n, ast.Name) and isinstance(n.ctx, ast.Store)}


def load_names(node: ast.AST) -> list[ast.Name]:
    return [n for n in ast.walk(node) if isinstance(n, ast.Name) and isinstance(n.ctx, ast.Load)]


def sequential_undefined(tree: ast.Module) -> tuple[list[str], list[str]]:
    defined = set(dir(builtins))
    assigned_order: list[str] = []
    undefined: list[str] = []

    def check_loads(node: ast.AST) -> None:
        for name in load_names(node):
            if name.id not in defined:
                undefined.append(f"line {name.lineno}: {name.id}")

    def define_targets(node: ast.AST) -> None:
        for name in sorted(target_names(node)):
            if name not in defined:
                assigned_order.append(name)
            defined.add(name)

    for stmt in tree.body:
        if isinstance(stmt, ast.Import):
            for alias in stmt.names:
                name = alias.asname or alias.name.split(".")[0]
                if name not in defined:
                    assigned_order.append(name)
                defined.add(name)
        elif isinstance(stmt, ast.ImportFrom):
            for alias in stmt.names:
                name = alias.asname or alias.name
                if name not in defined:
                    assigned_order.append(name)
                defined.add(name)
        elif isinstance(stmt, ast.Assign):
            check_loads(stmt.value)
            define_targets(stmt.targets[0])
            for target in stmt.targets[1:]:
                define_targets(target)
        elif isinstance(stmt, ast.AnnAssign):
            if stmt.value:
                check_loads(stmt.value)
            define_targets(stmt.target)
        elif isinstance(stmt, ast.AugAssign):
            check_loads(stmt.target)
            check_loads(stmt.value)
            define_targets(stmt.target)
        else:
            check_loads(stmt)
            define_targets(stmt)
    return undefined, assigned_order


def main() -> None:
    deck = DECK.read_text(encoding="utf-8")
    viz_lab = VIZ_LAB.read_text(encoding="utf-8")
    venv_lab = VENV_LAB.read_text(encoding="utf-8")
    parts = [slide_code(deck, n) for n in (3, 4, 5, 9)]
    combined = "\n\n".join(parts)
    (OUT / "w07a-code-extracted.py").write_text(combined, encoding="utf-8")
    tree = ast.parse(combined)
    undefined, assigned = sequential_undefined(tree)
    a_code = "\n".join(parts) + "\n" + viz_lab
    read_csv_calls = [
        ast.unparse(n) for n in ast.walk(tree)
        if isinstance(n, ast.Call) and "read_csv" in ast.unparse(n.func)
    ]
    results = [
        {"name": "A slides 3/4/5/9 parse as one sequential Python program", "passed": True, "detail": "4 code blocks extracted"},
        {"name": "A code has no load-before-definition variables", "passed": not undefined, "detail": json.dumps(undefined, ensure_ascii=False)},
        {"name": "A definition chain includes df clean_df city_mean fig ax", "passed": all(x in assigned for x in ("df", "clean_df", "city_mean", "fig", "ax")), "detail": ", ".join(assigned)},
        {"name": "A code has no read_csv call", "passed": not read_csv_calls, "detail": json.dumps(read_csv_calls, ensure_ascii=False)},
        {"name": "A deck and visualization lab do not read phantom weather.csv", "passed": not re.search(r"read_csv\s*\([^)]*weather\.csv", deck + viz_lab), "detail": "weather.csv occurs only in explanatory prose"},
        {"name": "labs do not fetch CSV over the network", "passed": "fetch(" not in viz_lab and "fetch(" not in venv_lab and "XMLHttpRequest" not in viz_lab and "XMLHttpRequest" not in venv_lab, "detail": "B answers.csv remains an explicit W06 input contract, not a lab HTTP dependency"},
    ]
    summary = {
        "passed": sum(r["passed"] for r in results),
        "failed": sum(not r["passed"] for r in results),
        "results": results,
        "assigned_order": assigned,
        "undefined": undefined,
        "execution_note": "AST sequential validation only; system Python lacks Pandas/Matplotlib and no packages were installed. Browser lab states were tested separately.",
    }
    (OUT / "code-chain.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    for row in results:
        print(("PASS" if row["passed"] else "FAIL") + " | " + row["name"] + " | " + row["detail"])
    print(f"SUMMARY: {summary['passed']}/{len(results)} passed; failed={summary['failed']}")
    raise SystemExit(1 if summary["failed"] else 0)


if __name__ == "__main__":
    main()
