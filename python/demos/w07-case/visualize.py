from pathlib import Path

import matplotlib

matplotlib.use("Agg")  # 无桌面/远程终端也保存图片，不弹窗
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data" / "answers.csv"
OUTPUT = ROOT / "output" / "top_authors.png"


def load_and_summarize(path: Path) -> tuple[pd.DataFrame, int, int]:
    """读取爬虫 CSV，清洗并汇总每位实名作者的总点赞数。"""
    df = pd.read_csv(path)
    raw_count = len(df)

    # 匿名合集不是唯一作者；点赞缺失的行不能参与求和。
    clean = df.loc[df["author_name"].ne("知乎用户")].dropna(
        subset=["author_name", "voteup_count"]
    )
    clean = clean.assign(voteup_count=pd.to_numeric(clean["voteup_count"]))

    top = (
        clean.groupby("author_name", as_index=False)["voteup_count"]
        .sum()
        .nlargest(5, "voteup_count")
        .sort_values("voteup_count")  # barh 中最大值最后绘制，位于最上方
    )
    return top, raw_count, len(clean)


def draw_chart(top: pd.DataFrame, output: Path) -> None:
    """画横向柱状图并保存，长作者名比竖排柱更容易阅读。"""
    plt.rcParams["font.sans-serif"] = [
        "Microsoft YaHei",
        "SimHei",
        "Noto Sans CJK SC",
        "Arial Unicode MS",
        "DejaVu Sans",
    ]
    plt.rcParams["axes.unicode_minus"] = False

    fig, ax = plt.subplots(figsize=(8, 4.5), layout="constrained")
    ax.barh(top["author_name"], top["voteup_count"], color="#0f7f9c")
    ax.set_title("爬虫回答：实名作者总点赞 Top 5")
    ax.set_xlabel("总点赞数")
    ax.set_ylabel("作者")
    ax.grid(axis="x", alpha=0.2)

    output.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(output, dpi=150)
    plt.close(fig)


def main() -> None:
    top, raw_count, clean_count = load_and_summarize(DATA)
    print(f"原始 {raw_count} 行；用于统计 {clean_count} 行（已排除匿名合集与缺失值）")
    print(top.to_string(index=False))

    # NumPy 也来自本项目的锁定环境；版本检查不使用全局包。
    print(f"NumPy {np.__version__}: 平均总点赞 = {np.mean(top['voteup_count']):.1f}")

    draw_chart(top, OUTPUT)
    print(f"图表已保存：{OUTPUT}")


if __name__ == "__main__":
    main()
