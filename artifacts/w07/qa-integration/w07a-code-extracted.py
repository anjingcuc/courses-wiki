import pandas as pd

records = [
    {"city": "北京", "date": "2026-06-01", "temperature": 28},
    {"city": "北京", "date": "2026-06-02", "temperature": 30},
    {"city": "北京", "date": "2026-06-03", "temperature": None},
    {"city": "上海", "date": "2026-06-01", "temperature": 26},
    {"city": "上海", "date": "2026-06-02", "temperature": 27},
    {"city": "上海", "date": "2026-06-03", "temperature": 29},
    {"city": "广州", "date": "2026-06-01", "temperature": 31},
    {"city": "广州", "date": "2026-06-02", "temperature": 32},
    {"city": "广州", "date": "2026-06-03", "temperature": 33}
]
df = pd.DataFrame(records)
print(df.shape)  # (9, 3)

# df 已由上一页完整定义
print(df.head(3))                 # 先看前几行长什么样
df.info()                         # 列、非空数量、dtype
print(df["temperature"].describe()) # 数值分布
print(df.isna().sum())             # 每列缺失数

df["temperature"] = pd.to_numeric(
    df["temperature"], errors="coerce"
)
clean_df = df.dropna(subset=["temperature"]).copy()
print(clean_df.shape)              # (8, 3)

# clean_df 已由上一页定义
hot_df = clean_df[clean_df["temperature"] >= 30]

city_mean = (
    clean_df.groupby("city")["temperature"]
    .mean()
    .round(1)
    .sort_values(ascending=False)
)
city_mean_df = city_mean.rename("avg_temperature").reset_index()

print(hot_df)        # 4 行：仍是一批观测记录
print(city_mean_df)  # 3 行：每行是一个城市

import matplotlib.pyplot as plt

plt.rcParams["font.sans-serif"] = [
    "Microsoft YaHei", "SimHei", "Noto Sans CJK SC"
]
plt.rcParams["axes.unicode_minus"] = False

# city_mean 已由第 5 页定义：索引是城市，值是均温
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