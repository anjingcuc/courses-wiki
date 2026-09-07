# V043 文本切分与 Embedding

## 视频信息

| 项目 | 内容 |
|---|---|
| 编号 | V043 |
| 标题 | 文本切分与 Embedding |
| 目标时长 | 7 min |
| 对应课次 | L22 RAG 基础：让 AI 读你的文档 |
| 前置微课 | V042 RAG 原理：向量与语义检索 |
| 一句话定位 | 真实文档几千字，API 有长度限制——文本切分（chunking）把长文档切成可检索的小片段，配合 Embedding 完成知识库构建 |

---

## 逐字稿

### [0:00-0:30] 开场 hook：长文档塞不进 Embedding API

**【画面】** 终端中运行一段代码，试图把一篇 5000 字的课程大纲整篇传给 Embedding API。程序报错："input too long"。画面切到另一段代码——先调用 `split_text` 把大纲切成 18 个片段，再逐个调用 API，全部成功。字幕条："整篇塞不进去 · 切成片段就行"。

**【旁白】** 上集我们用 6 条短文本做了语义检索。但真实文档可能几千字——比如这份课程大纲有 5000 多字。直接整篇传给 Embedding API，报错"太长了"。怎么办？切成小片段。这就是今天的主角——文本切分。

### [0:30-1:45] 为什么要切分：三个理由

**【画面】** PPT 展示三个理由，用图标配文字。①"API 长度限制"——图标一把锁。②"检索粒度"——一篇大文档的向量太"模糊"，匹配不准。③"成本控制"——切分后按需检索，不用每次都处理整篇文档。下方类比图标："切香肠——不能太薄也不能太厚"。

**【旁白】** 为什么要切分？三个理由。

第一，API 有长度限制。Embedding API 对单次输入的文本长度有上限，超了就报错。

第二，检索粒度。如果你把一整篇 5000 字的大纲做成一个向量，这个向量太"笼统"了。用户问"期末项目占多少分"——整篇大纲都"匹配"，但你拿到的是全文，没法定位到具体那段。切成小片段后，每个片段聚焦一个话题，检索才精准。

第三，成本。切分后只检索最相关的几个片段拼进 prompt，不用每次都把整篇文档塞给 LLM——省 token 省钱。

打个比方：切分像切香肠。不能切太薄——碎片化丢上下文；也不能切太厚——检索不精确。每个片段大概一两百字，刚好包含一个完整的意思。

### [1:45-3:30] 固定长度切分：最简单实用的策略

**【画面】** VS Code 中展示 `split_text` 函数。用动画展示切分过程：一段长文本从位置 0 开始，每次取 `chunk_size` 个字符，然后回退 `overlap` 个字符再切下一刀。高亮 `chunk_size` 和 `overlap` 两个参数。下方展示切分后的片段列表，每个片段标注字符数。

**【旁白】** 最简单的切分策略叫"固定长度切分"。原理很直白——从头开始，每次取固定长度的字符作为一个片段。

但有个关键参数叫 `overlap`——重叠。每一刀故意跟前一刀重叠几十个字符。为什么？防止正好切断了关键信息。比如一句话"期末项目占总成绩的 50%"，如果正好从中间切断——前一个片段有"期末项目占总"，后一个片段有"成绩的 50%"——检索到哪个片段都不完整。有了 overlap，这句话会在相邻两个片段里都完整出现。

来看代码：

```python
def split_text(text, chunk_size=200, overlap=50):
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        start += chunk_size - overlap  # 前进 chunk_size，但回退 overlap
    return chunks
```

核心就是 `start += chunk_size - overlap` 这一行——每次前进 chunk_size 个字符，但往回退 overlap 个，保证相邻片段有重叠。

参数怎么选？`chunk_size` 一般 150 到 300 字符，取决于你的文档结构。`overlap` 一般是 chunk_size 的 15% 到 25%。这不是硬规则，需要根据实际效果调整——下集会专门讲调优。

### [3:30-5:00] 可运行闭环：切分 + Embedding 构建

**【画面】** VS Code 中展示完整的 `build_index.py`。先展示一段 500 字的长文本（课程简介），调用 `split_text` 切分，打印每个片段。然后逐个片段调 Embedding API，存成 numpy 矩阵。终端运行，展示切分结果（片段数、每个片段字符数）和向量矩阵形状 `(n_chunks, 1024)`。

**【旁白】** 来把切分和 Embedding 串起来。准备一段课程简介——大约 500 字，涵盖模块结构、考核方式、技术栈等信息。

第一步，切分。调用刚才的 `split_text` 函数，chunk_size 设 200，overlap 设 50。500 字切成大约 3 到 4 个片段。打印每个片段——你能看到它们之间有重叠的部分。

第二步，向量化。遍历每个片段，调 Embedding API 把它变成向量，存成 numpy 矩阵。矩阵的形状是"片段数 × 维度"——比如 4 个片段、每个 1024 维，就是 `(4, 1024)` 的矩阵。这就是你的"知识库"。

第三步，验证。写一个查询——"这门课用什么技术栈"，调 Embedding 变向量，和矩阵里每一行算余弦相似度。最相关的片段应该包含"技术栈"相关的内容。

运行看效果。4 个片段向量化完成，矩阵形状 `(4, 1024)`。查询"技术栈"——相似度最高的是包含"Python、openai SDK、FastAPI、numpy"的那个片段，分数 0.85。切分没切断语义，检索准确命中。

### [5:00-6:15] 参数调优直觉：chunk_size 和 overlap 怎么选

**【画面】** PPT 展示三组对比。左"chunk_size=50（太小）"：信息碎片化，一句话被切成两半，检索到一半信息。中"chunk_size=200（合适）"：每个片段包含完整信息。右"chunk_size=2000（太大）"：一个片段混了多个话题，检索精度下降。下方标注："事实型问题 → 小 chunk；分析型问题 → 大 chunk；没有标准答案，靠实验"。

**【旁白】** chunk_size 和 overlap 怎么选？

chunk_size 太小——比如 50 个字符——一句话被切成两半，信息碎片化，检索到不完整的片段。

chunk_size 太大——比如 2000 字符——一个片段里混了好几个话题，用户问一个具体问题，匹配到的片段里大部分内容都无关，检索精度下降。

合适的范围通常是 150 到 300 字符。但这不是绝对的——事实型问题（"期末项目占多少分"）适合小 chunk，分析型问题（"这门课的整体设计思路"）适合大 chunk。没有标准答案，需要拿你的真实文档做实验，看哪个参数下检索效果最好。

overlap 一般设 chunk_size 的 15% 到 25%。比如 chunk_size 200，overlap 设 30 到 50。太小起不到防切断的作用，太大就浪费——同样的内容被重复向量化，浪费 API 调用。

### [6:15-6:50] 小结

**【画面】** 字幕条："长文档需要切分 · 固定长度切分 + overlap 防切断 · chunk_size 150-300 · 切分后逐个 Embedding 存成矩阵"。最后出现 RAG 全链路图："文档 → 切分 → Embedding → 存储 → 检索 → 拼接 → 生成"，前四步高亮标注"上集+本集已覆盖"。

**【旁白】** 核心记住几件事：长文档需要切分成小片段才能做 Embedding；固定长度切分加 overlap 是最简单实用的策略；chunk_size 一般 150 到 300 字符，overlap 设 chunk_size 的 15% 到 25%；切分后逐个片段做 Embedding，存成 numpy 矩阵就是你的知识库。

### [6:50-7:15] 提问彩蛋

**【画面】** 黑底字幕条逐条弹出三个 prompt（右上角标注"暂停照抄"）：
1. 「我在学文本切分（chunking）。请扮演面试官追问我：为什么切分要设 overlap？chunk_size 太大和太小各自会出什么问题？」
2. 「给我出 3 道切分参数调优题：每题给出文档类型和问题类型（比如"5000 字产品手册 + 事实型问答"），让我给出 chunk_size 和 overlap 的建议值并说明理由，我答完你点评。」
3. 「不要用"切香肠"——另找一个生活类比重新解释文本切分，并说明 overlap 在这个类比里对应什么。」

**【旁白】** 最后照例留个彩蛋——三个 prompt 抄走问 AI。chunk_size 没有标准答案，正好让 AI 出题逼你动手调一调。别把 AI 当搜索引擎，搜个结论就走；把它当教练，出变式题、抠薄弱点，这才叫跟着 AI 学。

### [7:15-7:25] 引出下集

**【画面】** RAG 全链路图中最后三步"检索 → 拼接 → 生成"亮起。下集预告卡片："V044 RAG 完整链路搭建——从文档读取到 AI 回答，一条链路跑通"。

**【旁白】** 到目前为止，你已经会做切分和 Embedding 了。但还差最后三步——检索到的片段怎么拼进 prompt、怎么让 AI 基于文档生成回答、怎么对比有 RAG 和没 RAG 的效果差异。下集把整条链路跑通，搭一个真正的知识库问答系统。我们下集见。

---

## 演示操作清单

### 文件结构

```
v041_demo/
├── .env
└── build_index.py    （切分 + Embedding + 检索验证）
```

### 完整代码：build_index.py

```python
# build_index.py —— 文本切分 + Embedding 向量化 + 检索验证
import os
import numpy as np
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.environ.get("DEEPSEEK_API_KEY", ""),
    base_url="https://api.deepseek.com"
)

# ---- 长文档 ----

LONG_TEXT = """本课程是《Python程序设计》的 vibe coding 升级版，共48学时。
课程分为7个模块：导论、环境工具、语言核心、数据获取、工程化、AI应用开发、综合项目。
其中 AI 应用开发模块（M5）是课程的核心增量，共12节课。
学生将学习大模型 API 调用、Prompt 工程、RAG、Agent、Web 应用开发等技术。
课程考核方式为：平时作业50%（5次小作业各10%加课堂参与10%）加期末大项目50%，无上机考试。
技术栈包括 Python 3.10、openai SDK、requests、FastAPI、numpy、Pandas、Matplotlib。
RAG 部分不使用 LangChain，直接用 numpy 做向量检索。"""


# ---- 文本切分 ----

def split_text(text, chunk_size=200, overlap=50):
    """固定长度切分，带 overlap 重叠"""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        if end >= len(text):
            break
        start += chunk_size - overlap
    return chunks


# ---- Embedding ----

def get_embedding(text: str) -> np.ndarray:
    """获取文本的 embedding 向量"""
    response = client.embeddings.create(
        model="deepseek-embed",
        input=text
    )
    return np.array(response.data[0].embedding)


def cosine_similarity(vec_a, vec_b) -> float:
    """余弦相似度"""
    return np.dot(vec_a, vec_b) / (np.linalg.norm(vec_a) * np.linalg.norm(vec_b))


# ---- 构建索引 + 检索验证 ----

if __name__ == "__main__":
    # 1. 切分
    chunks = split_text(LONG_TEXT, chunk_size=200, overlap=50)
    print(f"原文长度: {len(LONG_TEXT)} 字符")
    print(f"切分为 {len(chunks)} 个片段:\n")
    for i, chunk in enumerate(chunks):
        print(f"--- 片段 {i}（{len(chunk)} 字符）---")
        print(chunk)
        print()

    # 2. 向量化
    print("正在向量化...")
    embeddings = [get_embedding(chunk) for chunk in chunks]
    matrix = np.array(embeddings)
    print(f"向量矩阵形状: {matrix.shape}")

    # 3. 检索验证
    query = "这门课用什么技术栈？"
    query_vec = get_embedding(query)

    scores = []
    for i, chunk_vec in enumerate(matrix):
        score = cosine_similarity(query_vec, chunk_vec)
        scores.append((i, chunks[i], score))

    scores.sort(key=lambda x: x[2], reverse=True)

    print(f"\n查询: {query}")
    for idx, chunk, score in scores:
        print(f"  [{score:.4f}] 片段{idx}: {chunk[:50]}...")

    print(f"\n最相关: {scores[0][1][:80]}...")
```

> **注意**：Embedding 模型名称以实际 API 文档为准。如 DeepSeek 暂不支持 Embedding，可改用智谱 GLM `embedding-3` 或其他兼容服务。

### 运行命令

```bash
cd ~/workspace/python-course/v041_demo
pip install numpy openai python-dotenv
python build_index.py
```

### 预期输出

```
原文长度: 380 字符
切分为 3 个片段:

--- 片段 0（200 字符）---
本课程是《Python程序设计》的 vibe coding 升级版，共48学时。
课程分为7个模块：导论、环境工具、语言核心、数据获取、工程化、AI应用开发、综合项目。
其中 AI 应用开发模块（M5）是课程的核心增量...

--- 片段 1（200 字符）---
学生将学习大模型 API 调用、Prompt 工程、RAG、Agent、Web 应用开发等技术。
课程考核方式为：平时作业50%...
技术栈包括 Python 3.10、openai SDK...

--- 片段 2（180 字符）---
Matplotlib。
RAG 部分不使用 LangChain，直接用 numpy 做向量检索。

正在向量化...
向量矩阵形状: (3, 1024)

查询: 这门课用什么技术栈？
  [0.8521] 片段1: 学生将学习大模型 API 调用...技术栈包括 Python 3.10...
  [0.5102] 片段0: 本课程是《Python程序设计》的 vibe coding 升级版...
  [0.3344] 片段2: Matplotlib。RAG 部分不使用 LangChain...

最相关: 学生将学习大模型 API 调用、Prompt 工程、RAG、Agent、Web 应用开发等技术...
```

---

## 录制注意

1. **切分过程要可视化**：讲解 `split_text` 函数时，不要只展示代码。用动画或标注展示"取 chunk_size 个字符 → 回退 overlap → 再取"的滑动窗口过程。让观众直观理解 overlap 为什么能防止语义切断。
2. **chunk_size 对比用真实数据**：讲解参数调优时，如果有条件可以展示同一份文档分别用 chunk_size=50、200、2000 切分后的效果对比，让观众亲眼看到"太碎"和"太粗"的问题。
3. **语速控制**：整体旁白约 1650 字，按 235 字/分钟控制在 7 分钟以内。切分函数讲解是重点，适当放慢；参数调优部分可以稍快。
4. 提问彩蛋段的 prompt 字幕条需在后期加上，确保观众能暂停照抄。
