# V047 构建有工具的 AI Agent

## 视频信息

| 项目 | 内容 |
|---|---|
| 编号 | V047 |
| 标题 | 构建有工具的 AI Agent |
| 目标时长 | 9 min |
| 对应课次 | L26 AI Agent 实战 |
| 前置微课 | V046 AI Agent 原理与 ReAct 框架 |
| 一句话定位 | 给 Agent 加搜索、计算、自定义工具，处理"先查后算"的多步复杂任务——并堵住无限循环和错误传播两个坑 |

---

## 逐字稿

### [0:00-0:40] 开场 hook：Agent 自主拆解三步任务

**【画面】** 终端运行 `python agent_pro.py`。用户输入"帮我查一下中国的国土面积，然后算一下它大约能装下多少个 100 公顷的足球场"。Agent 打印"第1轮：调用 search_info({'query': '中国国土面积 平方公里'})" → 返回"约960万平方公里"；"第2轮：调用 calculate({'expression': '9600000 / 100'})" → 返回"96000"；"第3轮：任务完成" → 回答"中国面积约960万平方公里，大约能容纳96000个100公顷的足球场"。画面定格，字幕条："用户只说了目标 · Agent 自己拆成3步 · 先搜再算"。

**【旁白】** 看这个。给 Agent 一个复杂任务——"查中国国土面积，算能装多少个足球场"。用户没有说"先搜什么、再算什么"。但 Agent 自己拆成了三步：第一步搜索面积，第二步算除法，第三步总结回答。这就是实战级 Agent——上集只有时间查询和计算器两个简单工具，今天给它加搜索工具、加自定义工具、加错误防护，让它能处理真正的复杂任务。

### [0:40-2:00] 工具描述是 Agent 的"岗位说明书"

**【画面】** PPT 对比两版工具描述。左"模糊版"：calculate 描述"计算数学表达式"，search_info 描述"搜索信息"——标注"❌ Agent 会选错"。右"精准版"：calculate 描述"仅用于已知数字的纯数学运算，如果不知道数字先用 search_info 查"，search_info 描述"搜索事实信息如人口面积GDP，不确定时用此工具而非猜测"——标注"✅ Agent 选得准"。下方类比："工具描述 = 岗位说明书"。

**【旁白】** 实战 Agent 和上集的简单 Agent 最大的区别不在代码结构——循环还是那个循环。区别在工具质量和工具描述。

来看一个经典问题。Agent 有两个工具——`calculate` 和 `search_info`。用户问"北京有多少人口"。如果工具描述写得太模糊——calculate 写"计算数学表达式"，search_info 写"搜索信息"——Agent 可能错误地选了 calculate，因为它觉得"多少"也涉及计算。

问题出在哪？工具描述太模糊。LLM 是根据 description 判断"什么时候该用哪个工具"的。描述不清楚，它就犹豫甚至选错。

精准版怎么写？calculate 改成"仅用于已知数字的纯数学运算。如果不知道具体数字，先用 search_info 查"。search_info 改成"搜索互联网获取事实信息，如人口、面积、GDP。当你不确定某个事实时使用，而非猜测"。

核心认知——**工具描述就是给 Agent 的岗位说明书**。什么时候用、什么时候不用、参数怎么填，全写在 description 里。描述越精准，Agent 决策越准确。这是 Agent 工程最重要的技能，没有之一。

### [2:00-3:30] 实战工具集：搜索 + 计算 + 自定义

**【画面】** VS Code 中展示四个工具函数：`search_info`（DuckDuckGo API）、`calculate`（安全计算器）、`get_current_time`、`count_words`（文本统计）。每个函数旁边标注对应的 JSON schema description。重点放大 `search_info` 的 requests 调用和异常处理。

**【旁白】** 来搭实战工具集。四个工具。

第一个，`search_info`——搜索工具。用 DuckDuckGo 的免费 API，不需要 API Key。传一个搜索关键词，返回摘要文本。关键是异常处理——网络请求可能超时、可能返回空结果，所以用 try/except 包起来，失败时返回"搜索失败，请稍后重试"，而不是让程序崩溃。

第二个，`calculate`——增强计算器。和上集比，多了两个改进。一是安全检查——只允许数字和运算符，过滤掉非法字符。二是错误信息明确——遇到除零返回"除数不能为零"，遇到格式错误返回可操作的提示。这些清晰的错误信息对 Agent 非常重要——它据此判断"此路不通，换个策略"。

第三个，`get_current_time`——和上集一样。

第四个，`count_words`——自定义工具。统计文本的字符数、单词数、行数。这个工具展示了"自定义工具"的模式——任何你觉得有用的 Python 函数都可以包装成 Agent 工具。期末项目中你可以根据应用场景设计专属工具。

### [3:30-5:00] 加固 Agent 循环：错误兜底 + 重复检测

**【画面】** VS Code 中展示 `run_agent` 函数的加固版本。用高亮标注三处加固：①API 调用外层 try/except；②工具执行 try/except 兜底；③重复调用检测——连续 3 次同一工具同一参数则强制停止。标注："三层防护：API 层 → 工具层 → 循环层"。

**【旁白】** 上集的 Agent 循环很简洁，但实战中不够健壮。今天加三层防护。

第一层，API 调用保护。`client.chat.completions.create` 外面包一层 try/except——网络断了、API 限流了，不能让程序直接崩。捕获异常后返回一个友好的错误信息。

第二层，工具执行保护。每个工具的调用都包在 try/except 里。工具函数内部可能有 bug、参数可能不匹配——这些错误不应该把整个 Agent 搞崩溃。捕获异常后把错误信息转成字符串告诉 LLM，让它自己决定怎么办。

第三层，重复检测。记录每次工具调用的"签名"——函数名加参数。如果连续 3 次调用完全相同的工具和参数，说明 Agent 陷入循环了——强制停止。这是一个很实用的防护，很多无限循环就是"Agent 反复调同一个工具期望得到不同结果"。

这三层防护让 Agent 在出错时优雅降级，而不是崩溃或死循环。

### [5:00-6:30] 可运行闭环：三步任务完整演示

**【画面】** 终端运行 `run_agent`。任务："帮我查一下中国的国土面积，然后算一下它大约能装下多少个100公顷的足球场"。展示完整轨迹：第1轮 search_info 返回面积数据；第2轮 calculate 返回除法结果；第3轮 AI 总结回答。然后运行第二个任务"统计这段文本的字数"，展示 Agent 选择 count_words 工具。

**【旁白】** 运行实战 Agent。

任务一："帮我查中国国土面积，然后算能装多少个 100 公顷的足球场"。

第 1 轮。Agent 思考——"我需要先查面积"。行动——调用 `search_info`，关键词"中国国土面积 平方公里"。观察——返回"约 960 万平方公里"。

第 2 轮。Agent 思考——"960 万平方公里等于 960 万公顷，需要除以 100"。行动——调用 `calculate`，表达式"9600000 / 100"。观察——返回"96000"。

第 3 轮。Agent 思考——"任务完成"。回答——"中国面积约 960 万平方公里，大约能容纳 96000 个 100 公顷的足球场"。

注意 Agent 的决策过程——它先搜索再计算，顺序合理。这不是你写的 if-else 逻辑，是 Agent 根据 system prompt 和工具描述自己推理出来的。

任务二："帮我统计这段文本的字数"。Agent 直接选择 `count_words` 工具——因为它从描述中判断"统计字数"就是 count_words 的活儿。一个函数调用就完成了。

不同任务，Agent 选不同工具。这就是"决策"能力——你给它工具，它自己选。

### [6:30-7:30] 故障演示：Agent 的三种典型失败

**【画面】** 终端连续展示三个故障案例。案例1"计算 10/0"：Agent 调 calculate → 返回"除数不能为零" → Agent 告知用户。案例2"帮我把时间改成明天"：Agent 调 get_current_time → 发现只能读不能改 → 告知用户无法完成。案例3"帮我发邮件给老师"：Agent 发现没有邮件工具 → 告知用户当前无法操作。标注："这些不是 bug——是 Agent 优雅处理'做不到'的场景"。

**【旁白】** 来看 Agent 的失败案例。这些不是 bug，是教学素材。

案例一——"帮我算 10 除以 0"。Agent 调 calculate，工具返回"除数不能为零"。Agent 看到错误信息后告诉用户"0 不能做除数"。优雅处理了数学错误。

案例二——"帮我把时间改成明天"。Agent 调 get_current_time 发现只能读取不能修改，它告知用户"当前工具无法修改系统时间"。Agent 不会说"好的我改了"——它在观察到工具结果后做出了正确判断。

案例三——"帮我发邮件给老师"。Agent 发现自己没有发邮件的工具——工具列表里没有这个函数。它告诉用户"当前无法发送邮件"。

这三个案例展示了 Agent 的"失败素养"——遇到做不到的事，不编造、不死循环，而是诚实告知。这种能力来自两个设计：一是工具的错误信息写得清楚——"除数不能为零"而不是返回 None 或崩溃；二是 system prompt 里写了"如果任务无法完成，诚实告知原因"。

### [7:30-8:30] Agent vs 确定性代码：什么时候该用 Agent

**【画面】** PPT 展示对比表。左列"适合 Agent"：任务路径不固定、需要根据输入决定做什么、需要调多种工具、用户用自然语言描述需求。右列"适合确定性代码"：任务路径固定、结果必须 100% 可靠、性能要求高（毫秒级）。底部类比："Agent 像实习生——能自主干活但不保证每步都对。确定性代码像流水线——快且可靠但不灵活"。

**【旁白】** 最后聊一个工程判断——什么时候该用 Agent，什么时候不该用。

Agent 适合的场景：任务路径不固定——用户可能问任何东西；需要根据输入灵活决策——调哪个工具、走什么顺序；用户用自然语言描述需求——不是点菜单选功能。

确定性代码适合的场景：任务流程固定——比如每天自动导出报表；结果必须 100% 可靠——比如金融计算；性能要求高——Agent 每轮都有 API 调用，响应慢。

Agent 像一个实习生——能自主完成多步任务，但你不能保证每步都对。确定性代码像流水线——快且可靠但不灵活。期末项目中，你的 AI 应用可能同时有两种模块——Agent 处理需要灵活性的部分，确定性代码处理需要可靠性的部分。关键是判断哪部分需要什么。

### [8:30-8:50] 小结

**【画面】** 字幕条："工具描述 = 岗位说明书 · 三层防护防崩溃防死循环 · 先搜后算是 Agent 典型模式 · 不是所有任务都适合 Agent"。

**【旁白】** 核心记住几件事：工具描述是 Agent 准确性的关键——写得越精准 Agent 选得越准；实战 Agent 需要三层防护——API 层、工具层、循环层的错误兜底；"先搜索再计算"是 Agent 最典型的多步推理模式；Agent 不是万能的——固定流程和高可靠性需求用确定性代码更合适。

### [8:50-9:15] 提问彩蛋：把 AI 当教练用

**【画面】** 字幕条逐条列出三个 prompt（编号 1/2/3，可暂停照抄）：
1. "请给我 3 段写得模糊的工具 description（比如'搜索信息''计算数学表达式'），我改写成精准版，你点评我的版本，并说明模糊描述会让 Agent 在哪些场景选错工具。"
2. "请用对比表讲清楚：什么任务适合用 Agent、什么任务该写确定性代码？各给 3 个实际例子，并总结判断标准。"
3. "请你扮演面试官追问我：实战 Agent 的三层防护（API 调用、工具执行、重复检测）分别防什么故障？少一层会怎样？"

**【旁白】** 这三条丢给 Kimi 或 DeepSeek，让它陪你把"岗位说明书"和三层防护练到脱口而出。AI 不是帮你交差的，是帮你练功的——它出题你动手，功夫才长在你身上。

### [9:15-9:25] 引出下集

**【画面】** 下集预告卡片："V049 FastAPI 路由与请求处理——Agent 能力和 AI 功能怎么让别人也能用？把它包装成 Web 服务"。

**【旁白】** Agent 已经能自主完成复杂任务了。但它只存在于命令行里——别人怎么用？下节课进入 Web 开发，用 FastAPI 把 AI 能力包装成别人能访问的服务。这是期末项目的关键一环。我们下集见。

---

## 演示操作清单

### 文件结构

```
v045_demo/
├── .env
└── agent_pro.py    （实战版 Agent）
```

### 完整代码：agent_pro.py

```python
# agent_pro.py —— 实战版 Agent：多工具 + 错误防护 + 重复检测
import os
import json
import requests
from datetime import datetime
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.environ.get("DEEPSEEK_API_KEY", ""),
    base_url="https://api.deepseek.com"
)

# ---- 工具函数 ----

def search_info(query):
    """搜索互联网获取信息（DuckDuckGo 免费 API）"""
    try:
        resp = requests.get(
            "https://api.duckduckgo.com/",
            params={"q": query, "format": "json", "no_html": 1, "skip_disambig": 1},
            timeout=10
        )
        data = resp.json()
        abstract = data.get("AbstractText", "")
        if abstract:
            return f"搜索结果: {abstract}"
        topics = data.get("RelatedTopics", [])
        if topics:
            return f"搜索结果: {topics[0].get('Text', '无相关信息')}"
        return f"未找到关于'{query}'的信息"
    except Exception as e:
        return f"搜索失败: {e}"


def calculate(expression):
    """安全数学计算"""
    try:
        allowed = set("0123456789+-*/.() ")
        if not all(c in allowed for c in expression):
            return "错误: 表达式包含非法字符，只支持数字和 +-*/()"
        result = eval(expression)
        return f"计算结果: {result}"
    except ZeroDivisionError:
        return "错误: 除数不能为零"
    except Exception as e:
        return f"错误: 无法计算 '{expression}'"


def get_current_time():
    """获取当前日期和时间"""
    return datetime.now().strftime("当前时间: %Y年%m月%d日 %H:%M:%S")


def count_words(text):
    """统计文本的字符数、单词数、行数"""
    return f"字符数: {len(text)}, 单词数: {len(text.split())}, 行数: {len(text.split(chr(10)))}"


# ---- 工具描述 ----

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "search_info",
            "description": "搜索互联网获取事实信息，如国家面积、人口、GDP、历史事件等。当你不确定某个事实性数据时使用此工具，不要凭记忆猜测。",
            "parameters": {
                "type": "object",
                "properties": {"query": {"type": "string", "description": "搜索关键词"}},
                "required": ["query"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "calculate",
            "description": "执行纯数学运算。仅当你已经知道具体数字时使用。如果你不知道某个数字，请先用 search_info 查询。",
            "parameters": {
                "type": "object",
                "properties": {"expression": {"type": "string", "description": "数学表达式，如 '(15+27)*3'"}},
                "required": ["expression"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_current_time",
            "description": "获取当前的真实日期和时间。",
            "parameters": {"type": "object", "properties": {}, "required": []}
        }
    },
    {
        "type": "function",
        "function": {
            "name": "count_words",
            "description": "统计一段文本的字符数、单词数和行数。",
            "parameters": {
                "type": "object",
                "properties": {"text": {"type": "string", "description": "要统计的文本"}},
                "required": ["text"]
            }
        }
    }
]

TOOL_MAP = {
    "search_info": search_info,
    "calculate": calculate,
    "get_current_time": get_current_time,
    "count_words": count_words,
}


# ---- 加固版 Agent 循环 ----

def run_agent(user_message, max_steps=8, verbose=True):
    """实战版 Agent——带三层防护"""
    system_prompt = (
        "你是一个有工具的 AI 助手，可以帮助用户完成多步任务。\n"
        "工作原则：\n"
        "1. 先分析任务需要哪些步骤\n"
        "2. 按顺序调用工具完成每一步\n"
        "3. 如果工具返回错误，调整策略或告知用户\n"
        "4. 如果任务无法完成，诚实告知原因\n"
    )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_message}
    ]

    tools_used = []

    if verbose:
        print(f"{'='*60}")
        print(f"👤 用户: {user_message}")
        print(f"{'='*60}")

    for step in range(1, max_steps + 1):
        if verbose:
            print(f"\n--- 🔄 第 {step} 轮 ---")

        # 第一层防护：API 调用保护
        try:
            response = client.chat.completions.create(
                model="deepseek-chat",
                messages=messages,
                tools=TOOLS,
                tool_choice="auto"
            )
        except Exception as e:
            if verbose:
                print(f"  ❌ API 调用失败: {e}")
            return f"Agent 运行出错: {e}"

        msg = response.choices[0].message

        if msg.content and verbose:
            print(f"💭 思考: {msg.content}")

        if msg.tool_calls:
            messages.append(msg)

            for tc in msg.tool_calls:
                name = tc.function.name
                args = json.loads(tc.function.arguments)

                if verbose:
                    print(f"🔧 行动: {name}({args})")

                # 第三层防护：重复检测
                tool_sig = f"{name}({json.dumps(args, sort_keys=True)})"
                tools_used.append(tool_sig)
                recent = tools_used[-3:]
                if len(recent) >= 3 and recent[-1] == recent[-2] == recent[-3]:
                    if verbose:
                        print(f"  ⚠️ 检测到重复调用，强制停止。")
                    return "Agent 重复尝试同一操作未能取得进展，任务可能无法通过现有工具完成。"

                # 第二层防护：工具执行保护
                func = TOOL_MAP.get(name)
                if func is None:
                    result = f"错误: 工具 '{name}' 不存在"
                else:
                    try:
                        result = func(**args)
                    except Exception as e:
                        result = f"错误: 工具执行失败 - {e}"

                if verbose:
                    print(f"👀 观察: {result}")

                messages.append({
                    "role": "tool",
                    "tool_call_id": tc.id,
                    "content": str(result)
                })
        else:
            if verbose:
                print(f"\n✅ 任务完成!（共 {step} 轮）")
                print(f"💬 回答: {msg.content}")
            return msg.content

    if verbose:
        print(f"\n⚠️ 达到最大轮数 {max_steps}，强制停止。")
    return f"Agent 超过了最大循环次数（{max_steps}）。"


# ---- 运行 ----

if __name__ == "__main__":
    # 测试1: 搜索 + 计算的多步任务
    run_agent("帮我查一下中国的国土面积是多少平方公里，"
              "然后算一下它大约等于多少个100公顷的足球场。")

    # 测试2: 文本分析
    print("\n\n")
    run_agent("帮我统计这段文本的字数："
              "'Python is a great programming language for beginners.'")

    # 测试3: 错误处理
    print("\n\n")
    run_agent("帮我计算 10 除以 0 的结果")
```

### 运行命令

```bash
cd ~/workspace/python-course/v045_demo
pip install openai requests python-dotenv
python agent_pro.py
```

### 预期输出

```
============================================================
👤 用户: 帮我查一下中国的国土面积是多少平方公里，然后算一下它大约等于多少个100公顷的足球场。
============================================================

--- 🔄 第 1 轮 ---
💭 思考: 我需要先查询中国的国土面积，然后再做计算。
🔧 行动: search_info({'query': '中国国土面积 平方公里'})
👀 观察: 搜索结果: 中国国土面积约960万平方公里...

--- 🔄 第 2 轮 ---
💭 思考: 中国面积约960万平方公里 = 9,600,000公顷。需要计算 9600000 / 100。
🔧 行动: calculate({'expression': '9600000 / 100'})
👀 观察: 计算结果: 96000.0

--- 🔄 第 3 轮 ---
✅ 任务完成!（共 3 轮）
💬 回答: 中国国土面积约960万平方公里，大约能容纳96000个100公顷的足球场。
```

> **注意**：DuckDuckGo API 对中文查询支持有限，有时返回空结果。课堂前用测试问题跑通确认效果。如搜索质量不佳，可备选 Wikipedia API 或用 LLM 内置知识替代搜索演示。

---

## 录制注意

1. **开场三步任务必须真实运行**：开场的"查面积 → 算除法 → 总结回答"是全片的核心成果展示，必须实际运行并展示完整的思考轨迹。每一轮的 💭🔧👀 标注要清晰可读。
2. **工具描述对比是核心知识点**：模糊版 vs 精准版的对比要放在同一画面，让观众看到描述差异如何影响 Agent 的工具选择。这是本集最重要的工程经验。
3. **故障演示要有但不宜过长**：三个故障案例各 15-20 秒即可，重点是让观众理解"Agent 遇到做不到的事会优雅降级"。不要深入分析每个案例的代码细节。
4. **语速控制**：整体旁白约 2100 字，按 235 字/分钟控制在 9 分钟以内。工具描述和加固循环讲解适当放慢，故障演示和 Agent vs 确定性代码部分可以稍快。
5. 提问彩蛋段的 prompt 字幕条需在后期加上，确保观众能暂停照抄。
