# V040 JSON Mode 与结构化输出

## 视频信息

| 项目 | 内容 |
|---|---|
| 编号 | V040 |
| 标题 | JSON Mode 与结构化输出 |
| 目标时长 | 8 min |
| 对应课次 | L21 结构化输出与 Function Calling |
| 前置微课 | V038 Prompt 结构化设计、V039 Few-shot 与思维链技巧 |
| 一句话定位 | 让 AI 输出合法 JSON 而不是带废话的文本——response_format 参数与 json.loads 解析 |

---

## 逐字稿

### [0:00-0:35] 开场 hook：json.loads 翻车现场

**【画面】** VS Code 中展示一段代码：让 AI 分析用户反馈并返回 JSON。终端运行，AI 返回的文本前后各带了一句"好的，以下是分析结果："和"希望对你有帮助！"。下一行 `json.loads(content)`，终端弹出红色报错：`json.decoder.JSONDecodeError`。画面定格在报错上，字幕条弹出："AI 明明返回了 JSON，为什么还报错？"

**【旁白】** 看这个场景。你让 AI 分析一段用户反馈，要求返回 JSON 格式。AI 确实返回了 JSON——但它前后各加了一句"好的，以下是分析结果"和"希望对你有帮助"。你觉得无所谓？程序可不这么想。`json.loads()` 一解析，直接报错——你这段字符串不是合法 JSON，它前后有废话。

上两集我们学了 Prompt 结构化设计和 Few-shot 技巧，让 AI 说得更好。但当你的程序需要解析 AI 的回复时，"说得好"不够，得"说得让程序能读"。今天解决这个问题——JSON Mode。

### [0:35-1:45] 为什么 AI 输出的 JSON 不可靠

**【画面】** PPT 展示三类典型问题，每类配一个代码示例和对应的报错截图。第一类：自然语言夹带；第二类：引号不匹配；第三类：字段名不稳定。用红色高亮问题位置。

**【旁白】** 在学 JSON Mode 之前，先搞清楚——为什么让 AI 输出 JSON 这么不靠谱？

三个最常见的坑。第一个坑——**自然语言夹带**。AI 太"礼貌"了，它习惯在 JSON 前后加上"好的，这是你要的结果"、"希望能帮到你"这类话。对人来说没问题，但 `json.loads()` 只认纯 JSON，多一个字都不行。

第二个坑——**引号不匹配**。JSON 规范要求双引号，但 AI 有时候给你混进单引号，或者字符串内部的引号忘了转义。你的程序一解析就是 `JSONDecodeError`。

第三个坑——**字段名不稳定**。你在 prompt 里要求返回 `sentiment`，AI 可能给你返回 `情感倾向` 或者 `emotion`——格式看着像 JSON，但字段名对不上，你的代码 `data["sentiment"]` 就 KeyError 了。

这些问题的根源是：你只告诉了 AI"返回 JSON"，但没告诉它"只返回 JSON"。AI 的默认行为是生成自然语言，JSON 只是它顺便夹在里面的一段文本。

### [1:45-3:15] JSON Mode 原理与核心参数

**【画面】** 代码编辑器中展示 `response_format` 参数，用动画放大这个参数。然后展示一个对比图：左侧不加参数 → 输出带废话的文本；右侧加上参数 → 输出纯 JSON。字幕条："response_format={'type': 'json_object'}"。

**【旁白】** JSON Mode 就是为解决这个问题设计的。原理很简单——在调用 API 时加一个参数 `response_format`，值设为 `{"type": "json_object"}`。这个参数告诉模型：你这次只管输出合法 JSON，别加任何自然语言。

来看代码：

```python
response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{"role": "user", "content": prompt}],
    response_format={"type": "json_object"}
)
```

和之前的调用相比，就多了一行 `response_format`。模型收到这个参数后，会在输出层面做约束——不是靠 prompt 提醒，而是直接在生成逻辑上限制。返回的内容保证是合法 JSON，可以直接 `json.loads()`，不会报错。

但有一个**关键限制**必须记住——你的 prompt 中必须出现"json"或"JSON"这个字样。如果你只说"返回结构化数据"，API 会直接报错，报错信息会告诉你：用了 JSON Mode 就要在 prompt 里明确提到 JSON。这不是 Bug，是 API 在帮你——强制你把输出格式说清楚。

### [3:15-4:15] 代码演示：不加 vs 加 JSON Mode

**【画面】** VS Code 分屏对比两个版本。左边 `demo_without_json_mode.py`，不加 `response_format`，展示 AI 返回的带废话文本和 json.loads 报错。右边 `demo_json_mode.py`，加上 `response_format`，展示干净的 JSON 和成功解析。终端分别运行两个脚本。

**【旁白】** 来看实际效果。左边是不加 JSON Mode 的版本——prompt 里要求返回 JSON，但没有加 `response_format` 参数。运行一下。看，AI 返回了"好的，以下是分析结果"然后是 JSON，最后还有"希望对你有帮助"。`json.loads()` 直接报错。

右边加上 JSON Mode——同一份 prompt，只多了 `response_format` 这一行。运行。这次 AI 返回的是纯净的 JSON，没有任何多余文本。`json.loads()` 成功，我们拿到了 `sentiment`、`score`、`keywords`、`suggestion` 四个字段。

对比很直观——不加 JSON Mode，你永远不知道 AI 会在 JSON 前后加什么"花样"；加了之后，输出格式被锁死，程序可以放心解析。

### [4:15-6:00] 可运行闭环：用户反馈分析器

**【画面】** VS Code 中完整展示 `demo_json_mode.py`，逐段高亮：prompt 构造、API 调用、JSON 解析、字段提取。终端运行后展示完整输出，格式化打印每个字段。

**【旁白】** 现在来写一个完整的可运行闭环——用户反馈分析器。输入一段用户反馈，AI 返回结构化的 JSON，包含情感倾向、情感分数、关键词和改进建议。

先构造 prompt，明确告诉 AI：以 JSON 格式返回，包含四个字段——sentiment 是情感倾向、score 是 1 到 10 的整数、keywords 是关键词列表、suggestion 是一句话改进建议。然后传入一段真实的用户反馈。

```python
prompt = """分析以下用户反馈，以 JSON 格式返回分析结果。

要求包含以下字段：
- sentiment: 情感倾向，"正面"、"负面"或"中性"
- score: 情感分数，1-10 的整数
- keywords: 关键词列表，最多3个
- suggestion: 改进建议，一句话

用户反馈：这个产品包装很差，打开的时候盒子都变形了。但东西本身还不错，用起来挺方便的。"""
```

然后调用 API，加上 `response_format={"type": "json_object"}`。拿到返回后直接 `json.loads()`，不报错，干净利落。

```python
response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{"role": "user", "content": prompt}],
    response_format={"type": "json_object"}
)

data = json.loads(response.choices[0].message.content)
print(f"情感: {data['sentiment']}")
print(f"分数: {data['score']}/10")
print(f"关键词: {data['keywords']}")
print(f"建议: {data['suggestion']}")
```

运行看结果——情感"中性"、分数 6、关键词"包装差、盒子变形、东西方便"、建议"改善包装质量"。这就是一个完整的闭环：自然语言进，结构化数据出。

### [6:00-7:15] JSON Mode 的边界：只保格式不保内容

**【画面】** PPT 展示一张对比图。左半："✅ JSON Mode 保证什么？"——格式合法、可被 json.loads 解析、字段是有效的 JSON 结构。右半："❌ JSON Mode 不保证什么？"——字段名是否匹配你的预期、字段值的语义是否正确、是否包含你要求的所有字段。用红绿对比色。

**【旁白】** 到这里你可能觉得 JSON Mode 万事大吉了。但你需要注意它的边界——**JSON Mode 只保证格式合法，不保证内容正确**。

什么意思？JSON Mode 保证返回的是合法 JSON——引号匹配、没有废话、`json.loads()` 不会报错。但它不保证：字段名是你要求的那几个；字段值语义正确；所有必需字段都包含。

比如你要求返回 `sentiment`，AI 可能给你返回 `emotion`——格式是合法 JSON，但你代码里 `data["sentiment"]` 就 KeyError 了。或者你要求 score 是 1 到 10 的整数，AI 给你返回了"还不错"——格式对，但类型不对。

怎么办？两个手段。第一，prompt 写清楚——把每个字段的名字、类型、取值范围都列出来，就像我们刚才做的那样。这呼应了 V038 讲的 Prompt 结构化设计——**好的 prompt 是结构化输出的前提**。第二，代码里做防御性检查——拿到字典后验证字段是否存在，类型是否正确。这些你们在异常处理那课已经学过了。

### [7:15-7:45] 小结

**【画面】** 字幕条逐条出现："JSON Mode = response_format={'type': 'json_object'} · prompt 必须含 json 字样 · 只保格式不保内容 · 语义质量取决于 prompt"。

**【旁白】** 三句话记住今天的核心：JSON Mode 靠 `response_format` 参数强制输出合法 JSON；prompt 里必须出现 json 字样否则报错；它只保证格式不保证内容，语义质量还是看你的 prompt 写得好不好。

### [7:45-8:05] 提问彩蛋

**【画面】** 黑底字幕条逐条弹出三个 prompt（右上角标注"暂停照抄"）：
1. 「我在学 JSON Mode（response_format={"type": "json_object"}）。请扮演面试官追问我：为什么开了 JSON Mode，prompt 里还必须出现 json 字样？JSON Mode 保证什么、不保证什么？」
2. 「给我出 3 个"程序解析 AI 回复失败"的故障案例，让我判断问题出在 JSON 格式不合法还是字段名、类型不匹配，我答完你公布答案。」
3. 「讲清楚 json.loads 抛 JSONDecodeError 和字典取值抛 KeyError 的本质区别，以及各自的防御性写法。」

**【旁白】** 彩蛋环节——三个 prompt 抄走。JSON Mode 的坑不在代码，在理解：让 AI 给你出故障案例，把两类报错讲透。学东西别停在"哦我懂了"——让 AI 追着你问，答不上来的地方，就是你没懂的地方。

### [8:05-8:20] 引出下集

**【画面】** 下集预告卡片："V041 Function Calling 入门——让 AI 决定调用哪个函数"。展示一个简单示意：用户说"查天气" → AI 返回 `{tool: "get_weather", city: "北京"}`。

**【旁白】** JSON Mode 解决了"让 AI 输出结构化数据"的问题。但如果你有多个功能——查天气、算数学、发邮件——你想让 AI 自动判断该调哪个函数、用什么参数呢？这就是下集的内容——Function Calling。从"AI 输出数据"到"AI 驱动程序"，下集见。

---

## 演示操作清单

### 文件结构

```
v038_demo/
├── demo_without_json_mode.py   （对比演示用，不加 response_format）
└── demo_json_mode.py           （完整闭环）
```

### 文件 1：demo_without_json_mode.py（对比演示）

```python
# demo_without_json_mode.py — 不加 JSON Mode，演示 json.loads 报错
import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.environ.get("DEEPSEEK_API_KEY", ""),
    base_url="https://api.deepseek.com"
)

prompt = """分析以下用户反馈，返回 JSON 格式：{"sentiment": "正面/负面", "keywords": ["关键词"]}
用户反馈：这个产品包装很差，但东西还不错。"""

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{"role": "user", "content": prompt}]
    # 注意：没有 response_format 参数
)

content = response.choices[0].message.content
print("AI 原始输出：")
print(content)
print()

# 尝试解析 —— 很可能报错
try:
    data = json.loads(content)
    print("解析成功：", data)
except json.JSONDecodeError as e:
    print(f"❌ json.loads 报错：{e}")
    print("原因：AI 输出前后带了自然语言，不是纯 JSON")
```

### 文件 2：demo_json_mode.py（完整闭环）

```python
# demo_json_mode.py — 用户反馈分析器（JSON Mode 完整闭环）
import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.environ.get("DEEPSEEK_API_KEY", ""),
    base_url="https://api.deepseek.com"
)

prompt = """分析以下用户反馈，以 JSON 格式返回分析结果。

要求包含以下字段：
- sentiment: 情感倾向，"正面"、"负面"或"中性"
- score: 情感分数，1-10 的整数
- keywords: 关键词列表，最多3个
- suggestion: 改进建议，一句话

用户反馈：这个产品包装很差，打开的时候盒子都变形了。但东西本身还不错，用起来挺方便的。"""

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{"role": "user", "content": prompt}],
    response_format={"type": "json_object"}  # 关键参数：强制输出合法 JSON
)

content = response.choices[0].message.content
print("原始输出：")
print(content)
print()

# 直接 json.loads，不会报错
data = json.loads(content)
print("解析结果：")
print(f"情感: {data['sentiment']}")
print(f"分数: {data['score']}/10")
print(f"关键词: {data['keywords']}")
print(f"建议: {data['suggestion']}")
```

### 运行命令

```bash
cd ~/workspace/python-course/v038_demo

# 先运行不带 JSON Mode 的版本，观察报错
python demo_without_json_mode.py

# 再运行带 JSON Mode 的版本，对比效果
python demo_json_mode.py
```

### 预期输出（demo_json_mode.py）

```
原始输出：
{"sentiment":"中性","score":6,"keywords":["包装差","盒子变形","东西方便"],"suggestion":"改善产品包装质量，避免运输过程中变形。"}

解析结果：
情感: 中性
分数: 6/10
关键词: ['包装差', '盒子变形', '东西方便']
建议: 改善产品包装质量，避免运输过程中变形。
```

---

## 录制注意

1. **开场报错画面要真实**：先运行不带 JSON Mode 的代码，让观众亲眼看到 `json.decoder.JSONDecodeError` 报错。AI 返回的废话前后文本每次不同，属于正常现象——重点是让观众看到"AI 返回了 JSON 但程序解析不了"这个反差。
2. **对比演示是核心节奏**：两个脚本逐个运行，左"翻车"右"成功"，视觉对比要强。可以先运行不加参数的版本展示报错，再运行加了 `response_format` 的版本展示成功，形成"问题→方案"的叙事。
3. **prompt 含 json 字样的坑要演示**：可以快速演示一次——把 prompt 里的"JSON 格式"改成"结构化数据"，运行，展示 API 报错。让观众记住：用了 JSON Mode，prompt 里必须出现 json 或 JSON。时长紧张可口播提醒代替演示。
4. **语速控制**：整体旁白约 1850 字，按 230 字/分钟控制在 8 分钟以内。讲解 `response_format` 参数和对比演示时适当放慢，过渡段正常语速。
5. 提问彩蛋段的 prompt 字幕条需在后期加上，确保观众能暂停照抄。
