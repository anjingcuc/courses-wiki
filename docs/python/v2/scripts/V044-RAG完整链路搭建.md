# V044 RAG 完整链路搭建

## 视频信息

| 项目 | 内容 |
|---|---|
| 编号 | V044 |
| 标题 | RAG 完整链路搭建 |
| 目标时长 | 9 min |
| 对应课次 | L23 RAG 实战：知识库问答系统 |
| 前置微课 | V043 文本切分与 Embedding |
| 一句话定位 | 从文档读取到 AI 回答一条链路跑通——切分、向量化、检索、拼接、生成，不依赖任何框架，全部手写 |

---

## 逐字稿

### [0:00-0:40] 开场 hook：课程 FAQ 问答机器人完整运行

**【画面】** 终端中运行 `python rag_bot.py`，连续测试三个问题。第一个"这门课怎么考核？"——程序打印"检索到 top-3 片段"（显示相似度分数和片段内容），然后 AI 回答"平时作业50%加期末大项目50%，无上机考试"。第二个"作业怎么提交？"——检索到 GitLab 提交相关片段，AI 准确回答分支命名格式。第三个"授课老师是谁？"——AI 回答"提供的文档中未找到相关信息"。画面定格，字幕条："有文档的问题 → 准确 · 没文档的问题 → 不编"。

**【旁白】** 看这个系统。问"这门课怎么考核"——它从课程文档里检索到相关内容，AI 基于文档准确回答。问"作业怎么提交"——同样精准命中。问"授课老师是谁"——文档里没这个信息，AI 说"文档中未找到"，而不是编一个。这就是一个完整的 RAG 知识库问答系统。前两集学了 Embedding 和切分的原理，今天把整条链路从头到尾跑通。

### [0:40-2:00] RAG 全链路总览：两阶段六步走

**【画面】** PPT 展示 RAG 全流程图，分两个阶段。上半"离线建库（一次性）"：①文档读取 → ②文本切分 → ③Embedding 向量化 → ④存储向量矩阵。下半"在线检索（每次提问）"：⑤用户问题向量化 → ⑥余弦相似度检索 top-k → ⑦拼接 prompt → ⑧调 LLM 生成回答。用颜色区分两个阶段。标注："建库只做一次，检索每次提问都做"。

**【旁白】** 先看全链路全景。RAG 分两个阶段。

第一个阶段叫"离线建库"——只需做一次。从文件里读取文档，切成片段，每个片段调 Embedding API 变成向量，存成 numpy 矩阵。这个矩阵就是你的知识库。建好后可以反复用，不用每次提问都重新向量化。

第二个阶段叫"在线检索"——每次用户提问都做。用户的问题先做 Embedding 变成向量，然后和知识库里每个向量算余弦相似度，取最相关的 top-k 条片段。把这些片段拼进 prompt，连同用户问题一起发给 LLM，AI 基于文档生成回答。

整个过程不依赖 LangChain 或任何框架——openai SDK 加 numpy 就够了。每一步都看得见、改得动。

### [2:00-3:30] 离线建库：文档读取 → 切分 → 向量化

**【画面】** VS Code 中展示 `rag_bot.py` 的前半部分。先展示 `FAQ_TEXT` 文档内容（课程常见问题）。然后展示 `split_text` 函数调用，打印切分结果。再展示 `build_vector_store` 函数——遍历每个片段调 Embedding API，返回 numpy 矩阵。终端运行，展示切分后的片段数和矩阵形状。

**【旁白】** 先搭离线建库部分。

第一步，准备文档。这里用一段课程 FAQ 文本——包含考核方式、课程结构、作业提交、技术栈等信息，大约 800 字。实际项目中从文件读取就行。

第二步，切分。用上集的 `split_text` 函数，chunk_size 设 300，overlap 设 50。800 字大约切成 3 到 4 个片段。打印看一下——每个片段包含一个相对完整的信息块。

第三步，向量化。遍历每个片段调 Embedding API，把返回的向量收集起来，用 `np.array` 转成矩阵。矩阵形状是"片段数 × 维度"。

这里有个细节——实际项目中，建库只需做一次，建好后把矩阵 `np.save` 存成 `.npy` 文件，下次直接 `np.load` 加载。课堂为了演示清晰，每次运行都重新建。但你要知道，重复向量化既慢又花钱，生产环境一定要缓存。

### [3:30-5:15] 在线检索：问题向量化 → 相似度排序 → top-k

**【画面】** VS Code 中展示 `retrieve` 函数。高亮三个步骤：①`get_embedding(query)` 把问题变向量；②遍历向量矩阵算余弦相似度；③按分数降序排列取前 k 条。终端运行，查询"这门课怎么考核？"，展示每条片段的相似度分数和排名。

**【旁白】** 建好了知识库，来看在线检索。

`retrieve` 函数接收用户问题、向量矩阵和片段列表。第一步把问题也做 Embedding——和建库时用的是同一个 Embedding 模型，这点很重要，模型不一致相似度就没意义。

第二步，遍历向量矩阵的每一行，算问题和该片段的余弦相似度。把"索引、片段文本、相似度分数"组成元组，收集到列表里。

第三步，按相似度降序排列，取前 top_k 条。top_k 设 3，就是取最相关的 3 个片段。

运行看效果。查询"这门课怎么考核"——相似度最高的是包含"平时作业50%和期末大项目50%"的片段，分数 0.89。第二是包含"作业提交"相关信息的片段，分数 0.71。检索结果合理——用户问考核，排第一的正是考核方式。

top_k 怎么选？事实型问题——比如"考核方式是什么"——top_k 设 2、3 就够了，信息聚焦。分析型问题——比如"这门课的整体设计思路"——可能需要 top_k 设 5 甚至更大，信息更全。没有标准答案，靠实验。

### [5:15-7:00] 拼接 prompt + 调 LLM 生成回答

**【画面】** VS Code 中展示 `rag_answer` 函数。重点高亮 prompt 拼接部分——system prompt 写了"基于以下资料回答，如果资料中没有答案请说未找到，不要编造"；user prompt 把检索到的片段拼成 context 再跟用户问题组合。然后展示 API 调用，temperature 设 0。终端运行，展示完整回答。

**【旁白】** 检索到了相关片段，接下来拼接 prompt 让 AI 回答。这是 RAG 最关键的一步——prompt 写得好不好，直接决定回答质量。

`rag_answer` 函数分三步。第一步调 `retrieve` 拿到 top-k 片段。第二步拼接。system prompt 写了两个重要约束：一是"基于以下资料回答"——让 AI 知道它应该参考给的内容；二是"如果资料中没有答案，请说'资料中未提及'，不要编造"——这一条特别重要，它让 AI 在面对文档里没有的问题时说"不知道"，而不是幻觉。

把检索到的片段用换行拼成一段 context，放进 user prompt——"课程资料"下面是 context，"用户问题"下面是用户的提问。

第三步调 API。这里 temperature 设 0——RAG 场景要的是准确和忠于文档，不是创意发散。温度越高 AI 越可能"自由发挥"，偏离文档。

运行看效果。"这门课的考核方式是什么"——AI 回答"平时作业50%加期末大项目50%，无上机考试"。完全基于文档，准确无误。

再看一个关键的测试——问"授课老师是谁"。文档里没有这个信息。AI 的回答是"提供的文档中未找到相关信息"。没有编造。这就是 prompt 里"不要编造"那句话的威力。

### [7:00-8:15] 对比实验：有 RAG vs 无 RAG

**【画面】** 终端分屏对比。左半"❌ 无 RAG（直接问模型）"：问"这门 Python 课程的考核方式是什么？"，AI 回答"通常 Python 课程会有期末考试和平时作业，具体比例因学校而异"。右半"✅ 有 RAG"：同样的问题，AI 回答"平时作业50%加期末大项目50%，无上机考试"。字幕条："同一个模型 · 同一个问题 · 有没有 RAG 天壤之别"。

**【旁白】** 来做一个对比实验，直观感受 RAG 的价值。同一个问题"这门 Python 课程的考核方式是什么"，分别用两种方式回答。

方式 A——无 RAG，直接问模型。AI 的回答是"通常 Python 课程会有期末考试和平时作业，具体比例因学校而异"。这是模型在用通用知识猜——听起来合理，但完全不是你们这门课的信息。

方式 B——有 RAG，检索后回答。AI 的回答是"平时作业50%加期末大项目50%，无上机考试"。准确引用了课程文档。

同一个模型，同一个问题，结果天壤之别。区别在哪？有 RAG 时，AI 看到的是你的文档，不是它训练数据里的记忆。这就是 RAG 解决幻觉问题的核心价值——让 AI 基于你的数据回答，而不是瞎猜。

### [8:15-8:45] 小结

**【画面】** RAG 全链路图完整展示，每一步打上绿色对勾。字幕条："两阶段：离线建库 + 在线检索 · 不依赖框架 · prompt 约束防止幻觉 · temperature=0 保准确"。

**【旁白】** 核心记住几件事：RAG 分两阶段——离线建库只做一次，在线检索每次提问都做；整条链路只用 openai SDK 加 numpy，不依赖任何框架；prompt 里一定要写"基于资料回答，没有就说不知道"——这是防止幻觉的关键约束；temperature 设 0 保证回答忠于文档。

### [8:45-9:05] 提问彩蛋：三个 prompt 把 AI 变成陪练

**【画面】** 黑底字幕条逐条列出三个 prompt（编号 1/2/3，关键词高亮，可暂停照抄）：
1. "我刚学完手写 RAG 链路（切分、Embedding、余弦相似度检索、拼接 prompt）。请给我出 3 道变式思考题，比如 top_k 从 3 改成 1 会怎样、chunk_size 太小有什么问题——先别给答案，我答完你再点评。"
2. "请用对比表格讲清楚 RAG 的'离线建库'和'在线检索'有什么区别、为什么建库只做一次，再解释为什么 RAG 场景要把 temperature 设为 0。"
3. "请你扮演面试官，围绕'RAG 如何防止 AI 幻觉'连续追问我三个问题，一个比一个深入，我答完一个你再问下一个。"

**【旁白】** 最后送你三个能直接照抄的 prompt，去问 Kimi 或 DeepSeek。跑通代码只是第一步——让 AI 给你出变式题、扮面试官追问你，答不上来的地方，就是你没真懂的地方。别拿它要答案，拿它找自己的漏洞。

### [9:05-9:20] 引出下集

**【画面】** 下集预告卡片："V045 多模态 AI API 调用——RAG 只处理文本，如果让 AI 看图片、听声音呢？"

**【旁白】** RAG 让 AI 能读你的文档了。但世界不只是文字。如果让 AI 看图片、听声音、甚至生成语音呢？下集进入多模态 AI。我们下集见。

---

## 演示操作清单

### 文件结构

```
v042_demo/
├── .env
└── rag_bot.py    （完整 RAG 知识库问答系统）
```

### 完整代码：rag_bot.py

```python
# rag_bot.py —— 完整 RAG 知识库问答系统（不依赖 LangChain 等框架）
"""文档读取 → 切分 → 向量化 → 存储 → 检索 → 拼接 prompt → 生成回答"""
import os
import numpy as np
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.environ.get("DEEPSEEK_API_KEY", ""),
    base_url="https://api.deepseek.com"
)

# ---- 知识库文档 ----

FAQ_TEXT = """Python程序设计（vibe coding 版）课程常见问题

【考核方式】
本课程考核方式为：平时作业 50%（5次小作业各10% + 课堂参与10%）+ 期末大项目 50%。没有上机考试。平时作业包括数据处理脚本、API调用项目、模块化重构、Prompt工程和RAG迷你应用。期末大项目需要分组或个人完成一个完整AI应用，包含前端、后端和AI核心功能。

【课程结构】
本课程共48学时，分为7个模块：M0导论、M1环境与工具、M2语言核心、M3数据获取与处理、M4工程化、M5 AI应用开发、M6综合项目实战、M7总结展望。核心增量模块是M5，共12节课覆盖从API调用到AI应用全栈开发。

【作业提交】
作业通过 GitLab 仓库提交，每次作业使用独立分支。分支命名格式为序号加主题，如01-data-processing。提交前确保代码可运行，API Key 不硬编码在代码中，需提供 .env.example 模板。允许使用 AI 辅助完成作业，但需要在提交说明中注明 AI 贡献部分。

【AI工具选型】
课程推荐使用 DeepSeek API 作为大模型接口，兼容 OpenAI SDK。编程工具首选 Kimi Code CLI 和 Trae IDE。所有 API 调用使用 openai SDK 的兼容接口，base_url 设为 https://api.deepseek.com。

【技术栈】
课程技术栈包括：Python 3.10+、openai SDK、requests、FastAPI、numpy、Pandas、Matplotlib。RAG 部分不使用 LangChain 等重型框架，直接用 numpy 做向量检索。Agent 部分手写 ReAct 循环，不使用框架。

【期末项目】
期末项目从项目池中选择：AI知识库助手、智能学伴、AI创意工坊、智能数据分析师、AI客服机器人。每组2-3人或个人完成，需交付完整代码、README、AI协作日志。答辩时每组8-10分钟展示。
"""


# ---- 工具函数 ----

def split_text(text, chunk_size=300, overlap=50):
    """固定长度切分，带 overlap"""
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


# ---- 离线建库 ----

def build_vector_store(chunks):
    """把所有片段向量化，返回向量矩阵"""
    embeddings = [get_embedding(chunk) for chunk in chunks]
    return np.array(embeddings)


# ---- 在线检索 ----

def retrieve(query, vector_store, chunks, top_k=3):
    """检索与 query 最相关的 top_k 个片段"""
    query_vec = get_embedding(query)

    scores = []
    for i, chunk_vec in enumerate(vector_store):
        score = cosine_similarity(query_vec, chunk_vec)
        scores.append({"index": i, "chunk": chunks[i], "score": score})

    scores.sort(key=lambda x: x["score"], reverse=True)
    return scores[:top_k]


# ---- RAG 问答 ----

def rag_answer(question, vector_store, chunks, top_k=3):
    """完整 RAG 问答：检索 + 拼接 prompt + 生成回答"""
    # 1. 检索
    results = retrieve(question, vector_store, chunks, top_k)

    print(f"\n检索结果（top-{top_k}）：")
    for r in results:
        print(f"  [{r['score']:.4f}] {r['chunk'][:60]}...")

    # 2. 拼接 context
    context = "\n\n".join([r["chunk"] for r in results])

    # 3. 构造 prompt
    system_prompt = (
        "你是一个课程问答助手。请基于以下课程资料回答用户问题。"
        "如果资料中没有答案，请明确说'资料中未提及'，不要编造。"
    )
    user_prompt = f"课程资料：\n{context}\n\n用户问题：{question}"

    # 4. 调用 LLM（temperature=0，忠于文档）
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0
    )
    return response.choices[0].message.content


def answer_without_rag(question):
    """不用 RAG，直接问模型"""
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[{"role": "user", "content": question}]
    )
    return response.choices[0].message.content


# ---- 运行 ----

if __name__ == "__main__":
    # 离线建库
    chunks = split_text(FAQ_TEXT, chunk_size=300, overlap=50)
    print(f"文档切分为 {len(chunks)} 个片段")
    print("正在构建向量库...")
    vector_store = build_vector_store(chunks)
    print(f"向量矩阵形状: {vector_store.shape}")

    # 测试问答
    questions = [
        "这门课的考核方式是什么？",
        "作业怎么提交？",
        "授课老师是谁？",  # 文档中没有的问题
    ]

    for q in questions:
        print(f"\n{'='*60}")
        print(f"问: {q}")
        answer = rag_answer(q, vector_store, chunks, top_k=3)
        print(f"答: {answer}")

    # 对比实验：有 RAG vs 无 RAG
    print(f"\n{'='*60}")
    print("对比实验：有 RAG vs 无 RAG")
    print(f"{'='*60}")
    q = "这门 Python 课程的考核方式是什么？"
    print(f"\n❌ 无 RAG:")
    print(answer_without_rag(q))
    print(f"\n✅ 有 RAG:")
    print(rag_answer(q, vector_store, chunks, top_k=3))
```

> **注意**：Embedding 模型名称以实际 API 文档为准。如 DeepSeek 暂不支持 Embedding，可改用智谱 GLM `embedding-3` 或其他兼容服务。核心代码结构完全一致。

### 运行命令

```bash
cd ~/workspace/python-course/v042_demo
pip install numpy openai python-dotenv
python rag_bot.py
```

### 预期输出

```
文档切分为 4 个片段
正在构建向量库...
向量矩阵形状: (4, 1024)

============================================================
问: 这门课的考核方式是什么？

检索结果（top-3）：
  [0.8921] 本课程考核方式为：平时作业 50%（5次小作业各10% + 课堂参与10%）...
  [0.7234] 作业通过 GitLab 仓库提交，每次作业使用独立分支...
  [0.4521] 本课程共48学时，分为7个模块...
答: 本课程的考核方式为：平时作业占50%（5次小作业各10%加课堂参与10%），期末大项目占50%，没有上机考试。

============================================================
问: 授课老师是谁？

检索结果（top-3）：
  [0.3102] 期末项目从项目池中选择...
  [0.2845] 课程技术栈包括...
  [0.2501] 本课程共48学时...
答: 提供的文档中未提及授课老师的信息。

============================================================
对比实验：有 RAG vs 无 RAG

❌ 无 RAG:
通常 Python 课程会有期末考试和平时作业，具体比例因学校和课程设置而异...

✅ 有 RAG:
本课程的考核方式为：平时作业占50%，期末大项目占50%，没有上机考试。
```

---

## 录制注意

1. **开场成果前置分两段展示**：前 20 秒展示"有文档的问题 → 准确回答"，后 10 秒展示"没文档的问题 → AI 说不知道不编造"。两种情况都展示才能体现 RAG 的完整价值——既准确又不会幻觉。
2. **prompt 拼接部分要逐行讲解**：拼接 prompt 是 RAG 最核心的一步。system prompt 中的"不要编造"约束必须重点讲解——这是防止幻觉的关键。用高亮或标注让观众看清这句话在哪里。
3. **对比实验是全片高潮**：有 RAG vs 无 RAG 的对比实验是让观众"顿悟"的关键时刻。两个回答放在同一画面，差异一目了然。建议用分屏或先后紧接的方式呈现，中间不加多余讲解，让对比冲击力最大化。
4. **语速控制**：整体旁白约 2100 字，按 235 字/分钟控制在 9 分钟以内。全链路总览和拼接 prompt 部分适当放慢，对比实验部分正常语速保持节奏感。
5. 提问彩蛋段的 prompt 字幕条需在后期加上，确保观众能暂停照抄。
