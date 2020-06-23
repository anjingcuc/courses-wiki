---
title: 数据处理与可视化
---

**下方课件区域方向键控制翻页，`f` 键全屏。**

<iframe src="slideshow.html" frameborder=0 width=800 height=450></iframe>

## 代码示例

### csv 用法示例

[点击此处下载示例 csv 文件。](biostats.csv)

```python
import csv

# 读取并返回 csv 所有行的内容，并不处理首行的列名
with open('biostats.csv', newline='') as csvfile:
    reader = csv.reader(csvfile)
    for row in reader:
        print(row)

# 读取并返回 csv 所有行的内容，将首行的列名作为字典的key
# 注意: 此处 Python 3.8 返回 row 类型为 dict
with open('biostats.csv', newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        print(row)
```

### openpyxl 示例

[点击此处下载示例 xlsx 文件。](biostats.xlsx)

```python
from openpyxl import load_workbook

# 载入文件
wb = load_workbook(filename='biostats.xlsx')

# 获取表格当前激活的表单
ws = wb.active

# 打印所有行，每行一个元组
for row in ws.values:
    print(row)
```

### pandas

#### 读取文件

pandas 专门有一套完整的 IO tools 来处理各种数据的读取。

```python
import pandas as pd

df = pd.read_csv('biostats.csv')
print(df)

df1 = pd.read_excel('biostats.xlsx')
print(df1)
```

#### Series

Series 类似于一维数组，但是包含一组与之关联的数据标签，当我们仅指定一组数据，没有给出数据标签时，Series 自动将其索引所谓数据标签。

```python
import pandas as pd

s = pd.Series([1, 2, 3, 4, 5])

# 0    1
# 1    2
# 2    3
# 3    4
# 4    5
# dtype: int64
```

可以通过 index 参数传递索引，也可以直接使用字典来初始化 Series ，这时字典的 key 将作为数据标签，而 value 作为数据。

```python
s1 = pd.Series([1, 2, 3, 4, 5], index=['a', 'b', 'c', 'd', 'e'])

s2 = pd.Series({'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5})
```

#### DataFrame

DataFrame 是一个表格型数据，非常符合用户日常使用 Excel 处理数据的逻辑，DataFrame 可以看成一组由多个共用一组数据标签/索引的 Series 组成，并且除了 Series 自带的行索引，还为每一个 Series 提供了列索引。

```python
mport numpy as np
import pandas as pd

dates = pd.date_range('20130101', periods=6)

df = pd.DataFrame(np.random.randn(6, 4), index=dates, columns=list('ABCD'))

df2 = pd.DataFrame({
    'A': 1.,
    'B': pd.Timestamp('20130102'),
    'C': pd.Series(1, index=list(range(4)), dtype='float32'),
    'D': np.array([3] * 4, dtype='int32'),
    'E': pd.Categorical(["test", "train", "test", "train"]),
    'F': 'foo'
})
```

查看与选择数据：

```python
df.head() # 获取开头几行的数据，默认 5 行

df.tail(3) # 读取尾部 3 行数据

df.T # 行列互换，相当于矩阵的转置

df.loc[dates[0]] # 选中某一行

df.loc[:, ['A', 'B']] # 获取部分数据，第一部分用 : 表示所有行，第二部分用列表 ['A', 'B'] 表示仅这两列

df.loc['20130102':'20130104', ['A', 'B']] # 选择部分行，部分列的数据

df.iloc[[1, 2, 4], [0, 2]] # 还可以使用 iloc 来实现按照顺序的选取，比如这里选择 1 2 4 行 0 2 列的数据

df.iloc[1:3, :] # 同样可以采用类似切片的方法实现选择

df[df['A'] > 0] # 选中所有 A 列数据 > 0 的内容

df[df > 0] # 选中所有数据 > 0 的内容

df2 = df.copy()

df2['E'] = ['one', 'one', 'two', 'three', 'four', 'three']

df2[df2['E'].isin(['two', 'four'])] # 选中 E 列的数据是 'two' 或者 'four' 的内容
```

赋值：

```python
s1 = pd.Series([1, 2, 3, 4, 5, 6], index=pd.date_range('20130102', periods=6))

# 注意 DataFrame 会自动对齐数据，且没有数据的位置会设置为 np.nan 显示为 NaN ( Not a Number)
# 超出的部分则被舍弃
df['F'] = s1

df.at[dates[0], 'A'] = 0 # A 列 第一行 设置为 0 ，at[] 这个用法只能定位一行一列，不能切片

df.iat[0, 1] = 0 # 0 行 1列 设置为 0

df.loc[:, 'D'] = np.array([5] * len(df))

df2 = df.copy()

df2[df2 > 0] = -df2 # 左侧通过条件定位所有 df2 中数据 > 0 的位置，然后将原始数据对应的负数进行赋值
```

处理异常：

```python
# reindex 对原始数据 DataFrame 的行索引列索引进行重新定义，然后返回一个新的 DataFrame 对象
# 下面这句相当于创建了一个只包含原始 DataFrame 前 4 行， 且增加了一列 E 的新 DataFrame
df1 = df.reindex(index=dates[0:4], columns=list(df.columns) + ['E'])

df1.loc[dates[0]:dates[1], 'E'] = 1 # 把 E 列数据的前两行赋值为 1，这是剩下两行没有数据，所以为 NaN

df1.dropna() # 返回去除所有包含 NaN 的行之后的内容

df1.fillna(value=5) # 将所有 NaN 填充为数字 5 （会自动转化数据类型，比如转化为 float64
```

### matplotlib

matplotlib 提供了面向对象的接口，即将图表中各个部分都抽象为一个一个对象，然后提供相应的属性和方法来操作。

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()  # 创建一个包含一个坐标系的图表
ax.plot([1, 2, 3, 4], [1, 4, 2, 3])  # 分别为 x y 轴赋值来画出一系列的点，默认用折线图来展示

plt.show() # 需要调用 plt.show() 才会显示出界面
```

## 项目 3 - 数据处理与可视化

在项目 2 爬虫获取的数据基础上使用 pandas 及其他第三方库进行数据处理及可视化，方案可从下面选择或者自定：

1. 对采集的数据进行可视化排序，如点赞数 / 评论数 / 评分 等以柱状图折线图或自定形式展示。
2. 对采集的数据进行关键词提取（jieba TF-IDF）并结合 wordcloud 实现词云效果。

作业链接: [https://classroom.github.com/a/b86H2DFN](https://classroom.github.com/a/b86H2DFN)

截止时间为: 2020-07-05 20:00 。
