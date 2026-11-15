"""Validate the deck's self-contained Pandas data chain with an existing runtime."""
from __future__ import annotations

import ast
import json
import sys
from pathlib import Path

import pandas as pd

OUT = Path(__file__).resolve().parent

records = [
    {"city": "北京", "date": "2026-06-01", "temperature": 28},
    {"city": "北京", "date": "2026-06-02", "temperature": 30},
    {"city": "北京", "date": "2026-06-03", "temperature": None},
    {"city": "上海", "date": "2026-06-01", "temperature": 26},
    {"city": "上海", "date": "2026-06-02", "temperature": 27},
    {"city": "上海", "date": "2026-06-03", "temperature": 29},
    {"city": "广州", "date": "2026-06-01", "temperature": 31},
    {"city": "广州", "date": "2026-06-02", "temperature": 32},
    {"city": "广州", "date": "2026-06-03", "temperature": 33},
]

df = pd.DataFrame(records)
assert df.shape == (9, 3)
assert df["temperature"].isna().sum() == 1

df["temperature"] = pd.to_numeric(df["temperature"], errors="coerce")
clean_df = df.dropna(subset=["temperature"]).copy()
assert clean_df.shape == (8, 3)

hot_df = clean_df[clean_df["temperature"] >= 30]
assert len(hot_df) == 4
assert hot_df["temperature"].tolist() == [30.0, 31.0, 32.0, 33.0]

city_mean = (
    clean_df.groupby("city")["temperature"]
    .mean()
    .round(1)
    .sort_values(ascending=False)
)
city_mean_df = city_mean.rename("avg_temperature").reset_index()
assert city_mean.to_dict() == {"广州": 32.0, "北京": 29.0, "上海": 27.3}
assert city_mean_df.to_dict(orient="records") == [
    {"city": "广州", "avg_temperature": 32.0},
    {"city": "北京", "avg_temperature": 29.0},
    {"city": "上海", "avg_temperature": 27.3},
]

# Matplotlib is intentionally not mocked. Validate the displayed script's syntax and
# save-before-show ordering; graphical execution requires a runtime with Matplotlib.
plot_code = '''
import matplotlib.pyplot as plt
plt.rcParams["font.sans-serif"] = ["Microsoft YaHei", "SimHei", "Noto Sans CJK SC"]
plt.rcParams["axes.unicode_minus"] = False
fig, ax = plt.subplots(figsize=(7, 4))
ax.bar(city_mean.index, city_mean.values, color="#0284c7")
ax.set_title("各城市平均温度（3 日）")
ax.set_xlabel("城市")
ax.set_ylabel("平均温度（℃）")
ax.set_ylim(0, 35)
ax.bar_label(ax.containers[0], fmt="%.1f")
fig.tight_layout()
fig.savefig("city_mean.png", dpi=150, bbox_inches="tight")
plt.show()
'''
ast.parse(plot_code)
assert plot_code.index('fig.savefig("city_mean.png"') < plot_code.index("plt.show()")

result = {
    "passed": True,
    "python": sys.version.split()[0],
    "pandas": pd.__version__,
    "raw_shape": list(df.shape),
    "clean_shape": list(clean_df.shape),
    "hot_rows": len(hot_df),
    "city_mean": city_mean.to_dict(),
    "matplotlib_execution": "not run: Matplotlib is absent from the available runtime; syntax and save/show order checked, no mock used",
}
(OUT / "reference-results.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
print(json.dumps(result, ensure_ascii=False, indent=2))
