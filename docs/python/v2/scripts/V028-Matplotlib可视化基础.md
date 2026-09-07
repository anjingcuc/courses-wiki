# V028 Matplotlib 可视化基础

## 视频信息

| 项目 | 内容 |
|---|---|
| 编号 | V028 |
| 标题 | Matplotlib 可视化基础 |
| 目标时长 | 7 min |
| 对应课次 | L15 数据处理与可视化 |
| 前置微课 | V027 Pandas 数据处理速通 |
| 一句话定位 | 让数据说话——柱状图看对比，折线图看趋势，一张图胜过一张表的数字 |

---

## 逐字稿

### [0:00-0:35] 开场 hook（成果前置）

**【画面】** 屏幕左边是一张满是数字的统计表——5 个城市的平均温度、湿度、风速。右边是一张漂亮的柱状图——同样的数据，但一眼就能看出广州最热、哈尔滨最冷。字幕条："同样一份数据，你看数字还是看图？"

**【旁白】** 上集你用 Pandas 算出了每个城市的平均温度——一组数字。说实话，盯着这组数字看半天才能比出谁高谁低。但如果把它画成一张柱状图呢？谁高谁矮，零点几秒就看清了。这就是可视化的力量——让数据从"一堆需要脑补的数字"变成"一眼就能看懂的结论"。今天学 Matplotlib，七分钟教你画出两种最常用的图表。我们直接上手。

### [0:35-2:15] 柱状图：对比利器

**【画面】** VS Code 中展示 `pip install matplotlib`，然后逐步写柱状图代码。代码运行后弹出一个图表窗口，展示各城市平均温度的柱状图。

**【旁白】** 先装一下：`pip install matplotlib`。

Matplotlib 是 Python 最经典的画图库，没有之一。它诞生于 2003 年，到现在依然是 Python 可视化的基石。其他更现代的库比如 seaborn、plotly，底层都是基于 Matplotlib 的。所以我们从 Matplotlib 学起。

直接上手画第一张图——各城市平均温度柱状图。数据就用上集 Pandas 算出来的结果：

```python
import matplotlib.pyplot as plt

cities = ["广州", "上海", "成都", "北京", "哈尔滨"]
temps = [28.1, 20.3, 18.2, 15.4, 5.3]

plt.bar(cities, temps)
plt.title("各城市平均温度对比")
plt.xlabel("城市")
plt.ylabel("平均温度 (°C)")
plt.show()
```

注意导入方式——`import matplotlib.pyplot as plt`，我们导入的是 pyplot 子模块，别名统一用 plt。这也是全世界约定俗成的写法。

核心就一行——`plt.bar(cities, temps)`。bar 就是柱状图的意思，第一个参数是 x 轴的标签，也就是五个城市的名字；第二个参数是每个柱子的高度，也就是对应的温度值。一行代码，五个柱子就立起来了。

但光有柱子不够——你还得加标题和坐标轴标签，不然别人看到这张图不知道你在展示什么。`plt.title()` 给图表加一个标题，`plt.xlabel()` 给 x 轴加标签，`plt.ylabel()` 给 y 轴加标签。这三样是每张图表的标配——以后不管画什么图，这三行都要有。

最后 `plt.show()` 把图表弹出来。你看到了什么——广州的柱子最高，将近 30 度；哈尔滨的柱子最矮，才 5 度左右。对比一目了然。这就是柱状图最大的优势——**比大小**。不同类别之间的数值差异，柱子的高度一比就出来了。

如果想好看一点，可以给柱子指定颜色：

```python
plt.bar(cities, temps, color="coral")
```

`color="coral"` 让柱子变成珊瑚色。Matplotlib 支持几十种颜色名称——red、blue、green 这些基本的都行，coral、steelblue、gold 这种文艺的也可以。颜色不是必须的，但如果你要把图表放在报告里给别人看，稍微注意一下美观度。

### [2:15-3:45] 折线图：看趋势

**【画面】** 在已有代码基础上，新写一段折线图代码——北京一周的温度变化。图表弹出后，折线的高低起伏清晰可见。

**【旁白】** 柱状图适合比较不同类别的数值大小。但如果你要看一个东西随时间的变化趋势——比如北京这周的温度走势，每天怎么波动——那柱状图就不合适了，得用折线图。

数据准备好了——北京从 3 月 1 号到 7 号的每天温度：

```python
dates = ["03-01", "03-02", "03-03", "03-04", "03-05", "03-06", "03-07"]
beijing_temps = [14, 16, 13, 15, 12, 17, 15]

plt.plot(dates, beijing_temps, marker="o", color="steelblue")
plt.title("北京一周温度趋势")
plt.xlabel("日期")
plt.ylabel("温度 (°C)")
plt.show()
```

你发现没有——和柱状图的代码几乎一模一样，唯一的区别是把 `plt.bar()` 换成了 `plt.plot()`。plot 就是折线图，同样第一个参数是 x 轴数据——这里是日期，第二个参数是 y 轴数据——这里是温度。

两个额外参数让图表更好看：`marker="o"` 给每个数据点加一个小圆点标记，让你能看清每一天的温度具体在哪个位置。`color="steelblue"` 让线条变成钢蓝色，比默认的蓝色更沉稳一点。

你看这条折线——温度在 12 到 17 度之间来回波动，3 号有个低谷，6 号有个高峰。趋势一目了然，你一眼就能看出这周温度的整体走向。这就是折线图最大的优势——**看变化**。数据随时间的起伏走势，一条线就勾勒出来了。

记住一个选择原则：比较不同类别用柱状图，看时间变化用折线图。选对图表类型，数据自己就会说话。选错了——比如用折线图展示不同城市的温度对比——线条连起来反而会误导人，因为城市之间没有"先后顺序"。

### [3:45-5:15] 可运行闭环：从数据到图表

**【画面】** 完整代码出现在屏幕上——读取 CSV、Pandas 处理、Matplotlib 画两张图（柱状图加折线图），并排展示。运行后图片保存到本地。

**【旁白】** 来做完整闭环——从 CSV 文件到两张图表，走完"原始数据到可视化结论"的全链路。数据用上节课生成的天气 CSV：

```python
import pandas as pd
import matplotlib.pyplot as plt

# 设置中文字体（防止中文显示为方块）
plt.rcParams["font.sans-serif"] = ["SimHei", "WenQuanYi Micro Hei", "Arial Unicode MS"]
plt.rcParams["axes.unicode_minus"] = False

# 读取并处理数据
df = pd.read_csv("weather_data.csv")
city_stats = df.groupby("city")["temperature"].mean().round(1)
city_stats = city_stats.sort_values(ascending=False)
```

开头那两行 `plt.rcParams` 是设置中文字体——非常重要。Matplotlib 默认不支持中文，不加这两行的话，图表里的中文标题和坐标轴会全部显示成方块乱码。这两行的意思是：优先使用 SimHei 字体，如果没有就试文泉驿，再没有就用苹果的字体。如果你画图发现中文全是方块，就是字体问题，丢给 AI 一句话就能帮你解决。

然后画第一张图——柱状图：

```python
plt.figure(figsize=(10, 5))
plt.bar(city_stats.index, city_stats.values, color="coral")
plt.title("各城市平均温度对比")
plt.xlabel("城市")
plt.ylabel("平均温度 (°C)")
plt.tight_layout()
plt.savefig("city_temperature.png", dpi=150)
plt.show()
print("柱状图已保存：city_temperature.png")
```

几个新参数解释一下。`plt.figure(figsize=(10, 5))` 设置图表大小——宽 10 英寸高 5 英寸，比例比较舒服。`plt.tight_layout()` 自动调整边距，防止坐标轴标签被截掉。`plt.savefig()` 把图表保存成图片文件——`dpi=150` 控制清晰度，150 对屏幕展示和报告嵌入都够用。`plt.show()` 则是在屏幕上弹窗显示。

然后画第二张图——北京一周温度折线图：

```python
beijing = df[df["city"] == "北京"].sort_values("date")

plt.figure(figsize=(10, 5))
plt.plot(beijing["date"], beijing["temperature"], marker="o", color="steelblue")
plt.title("北京一周温度趋势")
plt.xlabel("日期")
plt.ylabel("温度 (°C)")
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig("beijing_trend.png", dpi=150)
plt.show()
print("折线图已保存：beijing_trend.png")
```

`plt.xticks(rotation=45)` 把 x 轴的日期标签旋转 45 度——因为日期字符串比较长，横着排会重叠，斜着排就清爽了。这种小技巧你不用死记——画图时发现标签挤在一起，问 AI 怎么解决，它告诉你加这一行就行。

运行——两张图表生成并保存到本地。从一份 CSV 到可视化结论，完整链路走通。

### [5:15-6:30] 读懂 AI 生成的图表代码

**【画面】** 展示一段 AI 生成的较复杂的图表代码（含 subplots 双图），用注释标注每部分的作用。

**【旁白】** 最后讲一个实际场景。以后你画图，大概率不会从零开始写——你会描述需求让 AI 生成代码。比如你说"帮我画两个图，一个柱状图一个折线图，左右并排排列"——AI 会返回这样的代码：

```python
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

axes[0].bar(city_stats.index, city_stats.values, color="coral")
axes[0].set_title("各城市平均温度")

axes[1].plot(beijing["date"], beijing["temperature"], marker="o")
axes[1].set_title("北京一周温度趋势")
```

你可能没学过 `subplots`——没关系，看结构就能理解。`plt.subplots(1, 2)` 创建了一个一行两列的画布，左边一个位置右边一个位置。左图叫 `axes[0]`，右图叫 `axes[1]`——就是列表的第一个和第二个元素。画图的方法从 `plt.bar` 变成了 `axes[0].bar`，设置标题从 `plt.title` 变成了 `axes[0].set_title`——就是多了个前缀，本质完全一样。

你不需要记住这些 API 细节——Matplotlib 的方法有几百个，全背不现实也不必要。你需要做的是三件事：看懂代码的大致结构，运行后对照输出验证效果对不对，需要微调时改一个参数看看变化。这就是"AI 画图，你审查"的工作方式——和爬虫、Pandas 里的思路一模一样。

### [6:30-7:20] 小结 + 提问彩蛋 + 引出下集

**【画面】** 字幕条："bar 比大小 · plot 看趋势 · title/xlabel/ylabel 三件套 · savefig 保存图片"

**【旁白】** 两种最常用的图表记住了：柱状图比大小，折线图看趋势。核心套路是 `bar` 或 `plot` 画图，然后加 `title`、`xlabel`、`ylabel` 三件套，最后 `savefig` 保存。Matplotlib 方法多到记不完，但你能描述需求、能读懂 AI 生成的代码就够了。

**【画面】** 提问彩蛋——字幕条逐条列出三个可直接照抄去问 Kimi / DeepSeek 的 prompt：

1. "我在学 Matplotlib。请给我 5 个数据场景，让我判断该用柱状图还是折线图并说明理由，我答完你再公布参考答案并点评。"
2. "请逐行解释 plt.rcParams 设置中文字体的那两行各在做什么，为什么不做这步中文会变成方块？"
3. "请写一段含 plt.subplots 的双图代码并逐行注释，然后故意留 3 处参数（颜色、尺寸、标题）让我自己填，填错帮我指出。"

**【旁白】** 图以后大多让 AI 画，但"为什么这么画"你得会问。这三个 prompt 就干这个——让它考你选图、给你讲原理、留空让你填。光看它画，你永远学不会画。

M3 数据获取与处理模块到此收官——四节课，从 HTTP 基础到 API 调用到网页爬取再到数据处理和可视化，你已经具备了"从网上拿数据并分析出结论"的完整能力链。下个模块解决工程化——虚拟环境、代码质量、项目结构，让你的代码从"能跑"变成"能维护、能上线"。

---

## 演示操作清单

### 准备：生成演示数据

```python
# 文件：generate_weather_data.py（与 V027 共用）
import csv
import random

random.seed(42)

cities = ["北京", "上海", "广州", "成都", "哈尔滨"]
dates = ["2026-03-01", "2026-03-02", "2026-03-03", "2026-03-04",
         "2026-03-05", "2026-03-06", "2026-03-07"]

base_temp = {"北京": 15, "上海": 20, "广州": 28, "成都": 18, "哈尔滨": 5}
base_humid = {"北京": 40, "上海": 65, "广州": 80, "成都": 70, "哈尔滨": 35}

with open("weather_data.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["city", "date", "temperature", "humidity", "wind_speed"])
    for city in cities:
        for date in dates:
            temp = base_temp[city] + random.randint(-3, 3)
            humid = base_humid[city] + random.randint(-10, 10)
            wind = random.randint(1, 15)
            writer.writerow([city, date, temp, humid, wind])

print("数据已生成：weather_data.csv")
```

### 完整演示代码

```python
# === V028 演示：Matplotlib 可视化完整流程 ===
import pandas as pd
import matplotlib.pyplot as plt

# 设置中文字体（防止中文乱码）
plt.rcParams["font.sans-serif"] = ["SimHei", "WenQuanYi Micro Hei", "Arial Unicode MS"]
plt.rcParams["axes.unicode_minus"] = False

# --- 读取并处理数据 ---
df = pd.read_csv("weather_data.csv")

# 各城市平均温度（降序）
city_stats = df.groupby("city")["temperature"].mean().round(1)
city_stats = city_stats.sort_values(ascending=False)

# --- 图1：柱状图 ---
plt.figure(figsize=(10, 5))
plt.bar(city_stats.index, city_stats.values, color="coral")
plt.title("各城市平均温度对比")
plt.xlabel("城市")
plt.ylabel("平均温度 (°C)")
plt.tight_layout()
plt.savefig("city_temperature.png", dpi=150)
plt.show()
print("柱状图已保存：city_temperature.png")

# --- 图2：折线图 ---
beijing = df[df["city"] == "北京"].sort_values("date")

plt.figure(figsize=(10, 5))
plt.plot(beijing["date"], beijing["temperature"], marker="o", color="steelblue")
plt.title("北京一周温度趋势")
plt.xlabel("日期")
plt.ylabel("温度 (°C)")
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig("beijing_trend.png", dpi=150)
plt.show()
print("折线图已保存：beijing_trend.png")
```

### 运行命令

```bash
cd ~/workspace/python-course

# 安装依赖
pip install pandas matplotlib

# 生成数据（如已有 weather_data.csv 可跳过）
python generate_weather_data.py

# 运行可视化
python v028_demo.py

# 查看生成的图表
ls -la city_temperature.png beijing_trend.png
```

---

## 录制注意

1. **中文乱码一定要处理**：Matplotlib 默认不支持中文，坐标轴和标题会显示成方块。录制时 `plt.rcParams` 两行一定要展示。如果录制环境没有中文字体，改为英文标注——但要在旁白中告诉学生"真实环境丢给 AI 一句话就能解决中文字体问题"。
2. **每张图先弹窗再保存**：演示时先 `plt.show()` 弹窗让观众看到效果，同时 `plt.savefig()` 保存——两个动作都展示，让学生知道两种输出方式。
3. **图表类型选择原则要强调**：柱状图比大小、折线图看趋势——这是最核心的判断。出一条字幕条固化。其他图表类型（饼图、散点图、箱线图）课后让 AI 扩展，不在课上展开。
4. **时长控制点**：Part 5（读懂 AI 生成的图表代码）如果时间紧张可以压缩为 30 秒——只展示 subplots 双图代码并口头说明"axes[0] 和 axes[1] 就是左右两张图"。核心是 Part 1-4 的两种基本图表。
5. **提问彩蛋字幕条**：提问彩蛋段的 prompt 字幕条需在后期加上，确保观众能暂停照抄。
