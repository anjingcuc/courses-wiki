# V027 Pandas 数据处理速通

## 视频信息

| 项目 | 内容 |
|---|---|
| 编号 | V027 |
| 标题 | Pandas 数据处理速通 |
| 目标时长 | 8 min |
| 对应课次 | L15 数据处理与可视化 |
| 前置微课 | V024 requests 库与 API 调用实战 |
| 一句话定位 | DataFrame 就是代码里的 Excel 表——筛选、分组、统计，不用鼠标 |

---

## 逐字稿

### [0:00-0:35] 开场 hook（痛点共鸣）

**【画面】** 屏幕展示一份 CSV 文件——weather_data.csv，35 行天气数据，城市、日期、温度、湿度、风速。然后展示一个问题："哪个城市平均温度最高？" 画面切到 Excel 手动操作——排序、筛选、写公式，点好几下。再切到 Python——三行代码搞定。字幕条："100 条你能用肉眼看，10000 条呢？"

**【旁白】** 你用 API 和爬虫搞到了一份天气数据 CSV——城市、日期、温度、湿度、风速，35 行。你想看看哪个城市平均温度最高。怎么搞？打开 Excel，选数据、做透视表、排序——鼠标点来点去好几分钟。如果是一万条数据呢？今天教你一个 Python 库叫 Pandas——三行代码就能完成 Excel 要点半天才能干的事。八分钟速通，让你像写代码一样处理数据，我们开始。

### [0:35-2:15] DataFrame：代码里的 Excel 表

**【画面】** VS Code 中展示 `pip install pandas`，然后演示读取 CSV 并打印 DataFrame。旁边放一个 Excel 表格做对比，两者长得几乎一样。

**【旁白】** 先装一下：`pip install pandas`。

Pandas 是 Python 数据分析领域最核心的库，几乎所有做数据分析的 Python 项目都会用到它。它的核心概念只有一个——DataFrame。什么是 DataFrame？说白了就是代码里的 Excel 表格。它有行有列，有列名，能筛选、排序、做统计——和你在 Excel 里做的操作一模一样。区别在于，你用代码来操作，而不是用鼠标点。

先读数据：

```python
import pandas as pd

df = pd.read_csv("weather_data.csv")
```

`pd.read_csv()` 读取 CSV 文件，返回一个 DataFrame 对象。注意这里 `import pandas as pd`——我们给 pandas 起了个简写的别名 pd，这是全世界约定俗成的写法，所有教程和项目都这么用。变量名叫 `df`，也是约定俗成的——就像 for 循环里用 i 一样，看到 df 你就知道它是个 DataFrame。

读进来了，看看数据长什么样：

```python
print(df.head(10))
```

`head(10)` 显示前 10 行——和你在 Excel 里打开文件看到的第一眼一模一样。城市、日期、温度、湿度、风速，整整齐齐地排列着。

还有几个快速了解数据的手段，特别有用：

```python
print(df.shape)     # (35, 5) —— 35 行 5 列
print(df.dtypes)    # 每列的数据类型
print(df.describe())  # 数值列的统计摘要
```

`shape` 告诉你数据规模——35 行 5 列，一行就搞清楚。`dtypes` 告诉你每列是什么类型——温度是整数还是浮点数。最厉害的是 `describe()`——它自动帮你算出每列的数量、平均值、最大值、最小值、标准差，一行代码看到全部统计信息。以后拿到任何陌生数据，第一件事就是 `describe()` 一下，全局观就有了。

顺便提一个概念——DataFrame 里单独拿出一列，叫 Series。你可以把 DataFrame 想成"多个 Series 拼在一起"，就像 Excel 表是"多列拼在一起"。这个概念知道就行，日常使用我们直接操作整个 DataFrame。

### [2:15-4:00] 数据筛选：条件过滤

**【画面】** 逐步演示条件筛选代码，每次筛选后打印结果，让观众看到数据行数变化。

**【旁白】** 读完数据，来做第一个操作——条件筛选。数据分析最常见的需求就是"只看满足条件的那部分数据"。比如我想看所有温度超过 20 度的记录：

```python
hot_days = df[df["temperature"] > 20]
print(f"温度超过20度的记录：{len(hot_days)} 条")
print(hot_days[["city", "date", "temperature"]])
```

这个写法初看有点奇怪——`df["temperature"] > 20` 是什么意思？它是拿整个 temperature 列的每个值去和 20 比较，生成一列布尔值——True 或 False。然后 `df[...]` 用这列布尔值做过滤——True 对应的行保留下来，False 对应的行丢掉。你可以把它想成 Excel 里的自动筛选功能——设一个条件，只看满足条件的行。

多个条件也行，用 `&` 符号连接。比如我想找温度超过 25 度而且湿度低于 60 的记录——又热又干的天气：

```python
hot_dry = df[(df["temperature"] > 25) & (df["humidity"] < 60)]
print(hot_dry)
```

这里有个语法细节要注意——每个条件必须用括号包起来。`(df["temperature"] > 25)` 是一个条件，`(df["humidity"] < 60)` 是另一个条件，中间用 `&` 连接表示"并且"。如果你忘了加括号，Python 会报运算优先级的错误。`&` 是"并且"，`|` 是"或者"——和一般编程语言里的 and、or 类似，但 Pandas 里必须用符号形式。

筛选完，你还能只看自己关心的列——传一个列名列表进去：

```python
print(hot_days[["city", "date", "temperature"]])
```

只输出城市、日期和温度三列，就像 Excel 里把不需要的列隐藏掉。这样输出更清爽，一眼就能看到关键信息。

### [4:00-5:45] 分组统计：groupby

**【画面】** 展示 groupby 操作，打印分组前后的对比。用 Excel 透视表画面做类比。

**【旁白】** 第二个操作，也是 Pandas 最强大的功能——分组统计。什么是分组统计？举个例子：你有一个月的数据，包含 5 个城市 7 天的温度，你想知道每个城市的平均温度分别是多少。怎么做？你得先把数据按城市分成 5 组，然后对每组算平均值。在 Excel 里这叫"数据透视表"，在 Pandas 里叫 `groupby`。

```python
city_stats = df.groupby("city").agg({
    "temperature": "mean",
    "humidity": "mean",
    "wind_speed": "mean"
}).round(1)

print(city_stats)
```

逐行解释。`groupby("city")` 按城市列分组——北京的数据放一组，上海的放一组，广州的放一组，以此类推。`.agg()` 告诉它每组要算什么统计量——这里我对 temperature 求 mean 也就是平均值，humidity 也求平均值，wind_speed 也求平均值。最后 `.round(1)` 保留一位小数，不然你会看到 `15.285714285714286` 这样的数字，很难看。

输出长这样——每个城市一行，三列统计值。北京平均温度 15 度左右，广州 28 度左右，哈尔滨 5 度左右。一目了然，不需要你去数。

排个序——按平均温度从高到低，看看谁最热：

```python
sorted_by_temp = city_stats.sort_values("temperature", ascending=False)
print(sorted_by_temp)
```

`sort_values("temperature")` 按温度这一列排序，`ascending=False` 表示降序——从大到小。温度最高的城市排在最前面。广州最热，哈尔滨最冷——三行代码就得出了结论。你在 Excel 里做同样的事，至少要四五步鼠标操作：选数据、插入透视表、拖字段、改聚合方式、排序。Pandas 三行代码，几毫秒搞定，而且数据量再大也一样快。

### [5:45-7:00] 可运行闭环：从 CSV 到统计结论

**【画面】** 完整代码出现在屏幕上。从头到尾运行一遍：读取 → 探索 → 筛选 → 分组 → 排序 → 输出。

**【旁白】** 来做今天的完整闭环——从一份 CSV 文件出发，读取、探索、筛选、分组、排序，最后得到统计结论：

```python
import pandas as pd

# 读取数据
df = pd.read_csv("weather_data.csv")
print(f"数据规模：{df.shape[0]} 行 {df.shape[1]} 列")
print(df.head())

# 条件筛选：找出高温记录
hot_days = df[df["temperature"] > 25]
print(f"\n温度超过25度的记录：{len(hot_days)} 条")

# 分组统计：每个城市的平均情况
city_stats = df.groupby("city").agg({
    "temperature": "mean",
    "humidity": "mean",
    "wind_speed": "mean"
}).round(1)
print("\n各城市统计：")
print(city_stats)

# 排序：按温度从高到低
ranking = city_stats.sort_values("temperature", ascending=False)
print("\n温度排行榜：")
print(ranking)
```

运行——35 条原始数据，读取、筛选、分组、排序，最后给你一个清晰的温度排行榜。整个过程不到 15 行代码，没有一行 for 循环，没有一行 if 分支。Pandas 帮你把繁琐的数据操作封装成了简洁的方法调用。你不需要逐行遍历数据手动计算平均值，一行表达式就能完成"按城市分组求平均再排序"这种复杂操作。

这就是 DataFrame 的核心价值——你用声明式的代码描述"我要什么"，而不是用命令式的代码描述"怎么一步步做"。

### [7:00-8:05] 小结 + 提问彩蛋 + 引出下集

**【画面】** 字幕条："DataFrame = 代码里的 Excel · read_csv 读数据 · df[条件] 筛选 · groupby 分组 · sort_values 排序"

**【旁白】** Pandas 的核心就这几样：`read_csv` 读数据，中括号加条件做筛选，`groupby` 做分组统计，`sort_values` 做排序。Pandas 有上百个方法——你不需要全记住，也不现实。实际工作中，描述清楚你要什么效果，让 AI 帮你写 Pandas 代码，你审查逻辑对不对就行。AI 生成的代码里可能出现你没见过的方法，不要慌——看输出结果倒推它的逻辑，不懂的问 AI 解释一下。

**【画面】** 提问彩蛋——字幕条逐条列出三个可直接照抄去问 Kimi / DeepSeek 的 prompt：

1. "我在学 Pandas。请生成一份 30 行左右的销售数据 CSV（含地区、日期、销量、单价），出 4 道题：条件筛选、多条件筛选、groupby 分组统计、排序，我做完发你批改。"
2. "请拆解 df[df['temperature'] > 20] 的执行过程：里层先算什么？为什么多条件必须用 & 且每个条件要加括号？给一个不加括号的报错示例。"
3. "请扮演数据分析面试官，围绕 groupby 和 describe() 的使用场景连续追问我，我答得含糊的地方要求我举例子。"

**【旁白】** 三个 prompt 照抄去用就行。原则就一个——让它出数据、出考题，代码你自己写。Pandas 方法上百个，靠背没用；被它追问几轮、自己动手改几次，套路就长在手里了。

数据处理完了，但一堆数字看着还是枯燥。下集学 Matplotlib——把数据画成图表，让数字变成一眼就看懂的结论。

---

## 演示操作清单

### 准备：生成演示数据

```python
# 文件：generate_weather_data.py
# 模拟从天气 API 获取 5 个城市 7 天的数据，保存为 CSV
import csv
import random

random.seed(42)  # 固定随机种子，保证每次生成相同数据

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
# === V027 演示：Pandas 数据处理完整流程 ===
import pandas as pd

# --- 第1步：读取数据 ---
df = pd.read_csv("weather_data.csv")
print("=== 数据概览 ===")
print(f"规模：{df.shape[0]} 行 {df.shape[1]} 列")
print(df.head(10))
print("\n=== 统计摘要 ===")
print(df.describe())

# --- 第2步：条件筛选 ---
print("\n=== 高温记录（温度 > 25）===")
hot_days = df[df["temperature"] > 25]
print(f"共 {len(hot_days)} 条")
print(hot_days[["city", "date", "temperature"]])

# 多条件筛选
print("\n=== 高温低湿记录 ===")
hot_dry = df[(df["temperature"] > 25) & (df["humidity"] < 60)]
print(hot_dry[["city", "date", "temperature", "humidity"]])

# --- 第3步：分组统计 ---
print("\n=== 各城市统计 ===")
city_stats = df.groupby("city").agg({
    "temperature": "mean",
    "humidity": "mean",
    "wind_speed": "mean"
}).round(1)
print(city_stats)

# --- 第4步：排序 ---
print("\n=== 温度排行榜（降序）===")
ranking = city_stats.sort_values("temperature", ascending=False)
print(ranking)

# --- 第5步：保存结果 ---
ranking.to_csv("city_summary.csv")
print("\n结果已保存：city_summary.csv")
```

### 运行命令

```bash
cd ~/workspace/python-course

# 安装 Pandas
pip install pandas

# 生成演示数据
python generate_weather_data.py

# 运行演示
python v027_demo.py

# 查看输出文件
cat city_summary.csv
```

---

## 录制注意

1. **Excel 类比贯穿全程**：讲 DataFrame 时一定要和 Excel 表格做类比——这是学生理解 Pandas 最快的路径。每讲一个操作都说一句"在 Excel 里这叫什么"，建立对应关系。groupby 对应数据透视表是最重要的类比。
2. **每步都打印中间结果**：不要只讲代码——筛选完 print 一下，分组完 print 一下。让学生看到数据从"一坨"变成"有结论"的过程。每一步的数据变化是理解 Pandas 的关键。
3. **describe() 要展示**：很多人忽略了 `df.describe()` 的价值——它一行代码就能给你数据的全局视图。录制时展示一次 describe 的输出，强调"拿到陌生数据，第一步先 describe"。
4. **不展开讲 Series**：Series 和 DataFrame 的区别点到为止——初学阶段直接操作 DataFrame 就够了。展开讲反而增加认知负担。
5. **提问彩蛋字幕条**：提问彩蛋段的 prompt 字幕条需在后期加上，确保观众能暂停照抄。
