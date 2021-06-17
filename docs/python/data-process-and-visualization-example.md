---
title: 数据处理与可视化实例
---

**下方课件区域方向键控制翻页，`f` 键全屏。**

<iframe src="./slideshow.html" frameborder=0 width=800 height=450></iframe>

## pandas 及 matplotlib 实例

```python
import pandas as pd
import matplotlib.pyplot as plt


def data_process(file):
    # 从 csv 文件读取抓取到的结果，指定第一行为各个列的名称
    df = pd.read_csv(file)

    df_author_voteup = df.loc[:, ['author_name', 'voteup_count']]

    # 以 author_name 列进行分组
    grouped = df_author_voteup.groupby('author_name').sum()

    # 对分组进行求和并查看 voteup_count 列的求和结果
    voteup = grouped['voteup_count']

    # 对求和结果进行降序排列并取出前十
    all_authors = voteup.sort_values(ascending=False)

    top_10_authors = all_authors[0:10]

    return top_10_authors


def visualize(df):
    # 加载中文字体
    plt.rcParams['font.sans-serif'] = ['SimHei']

    # 初始化图表绘图区域
    plt.figure(figsize=[10.0, 4.0])

    # 直接使用 pandas 提供的绘图接口绘图
    df.plot.barh()

    # 从上到下顺序输出 y 轴
    plt.gca().invert_yaxis()

    # 显示绘制好的图标
    plt.show()


if __name__=='__main__':
    df = data_process('answers.csv')
    visualize(df)
```

## jieba 及 wordcloud 实例

```python
import pandas as pd
import jieba
import jieba.analyse
from wordcloud import WordCloud, STOPWORDS
import matplotlib.pyplot as plt


# 从回答 csv 文件中提取出回答的文本并转化成列表
def get_answers(file):
    df = pd.read_csv(file)

    answers = df['content']

    return list(answers)


# 结巴分词的 TD-IDF 接口直接提取关键词和其权重
def get_keywords(content, topK):
    keywords = jieba.analyse.extract_tags(content, topK=topK, withWeight=True)
    df = pd.DataFrame(keywords, columns=['keyword', 'weight'])
    return df


# 生成词云，注意这里的参数是一个字典 {'关键词': 12.123123} 后面的浮点数是权重
def generate_cloud(frequencies):
    wordcloud = WordCloud(
        'simfang.ttf',
        width=1920,
        height=1080,
        background_color='white',
        stopwords=STOPWORDS).generate_from_frequencies(frequencies)

    fig = plt.figure(figsize=(16, 8))
    plt.imshow(wordcloud)
    plt.axis('off') # 不显示坐标轴
    plt.tight_layout(pad=0) # 不留空白
    plt.show()


if __name__ == '__main__':
    answers = get_answers('answers.csv')

    jieba.analyse.set_stop_words(r'stopwords.txt')

    df = pd.DataFrame(columns=['keyword', 'weight'])
    for answer in answers:
        answer_keyword = get_keywords(answer, 10)
        df = df.append(answer_keyword)

    grouped = df.groupby('keyword').sum()

    keywords = grouped.sort_values('weight', ascending=False)

    top_100 = keywords[0:100]
    generate_cloud(top_100.weight.to_dict())
```
