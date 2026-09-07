# V046 AI Agent 原理与 ReAct 框架

## 视频信息

| 项目 | 内容 |
|---|---|
| 编号 | V046 |
| 标题 | AI Agent 原理与 ReAct 框架 |
| 目标时长 | 8 min |
| 对应课次 | L25 AI Agent 基础 |
| 前置微课 | V045 多模态 AI API 调用 |
| 一句话定位 | 从"你问它答"到"AI 自己决定用什么工具"——手写 ReAct 循环，不依赖任何 Agent 框架 |

---

## 逐字稿

### [0:00-0:35] 开场 hook：普通对话 vs Agent——算一笔大数

**【画面】** 终端分屏对比。左半"普通对话"：问"1234 × 5678 等于多少"，AI 回答"大约 700 万"——旁边红色标注"❌ 正确答案 7006652"。右半"Agent 模式"：同样的问题，终端打印"第1轮：调用工具 calculate({'expression': '1234 * 5678'})"，然后"返回结果: 7006652"，AI 最终回答"1234 乘 5678 等于 7006652"。绿色对勾。字幕条："普通对话 → 猜 · Agent → 调工具算"。

**【旁白】** 问 AI"1234 乘 5678 等于多少"。普通对话模式——AI 回答"大约 700 万"，但正确答案是 7006652，它算错了。大模型是语言模型不是计算器，大数字乘法不可靠。

换 Agent 模式——同样的问题。Agent 自己决定调用计算器工具，程序用 Python 精确计算，返回 7006652。AI 拿到精确结果，回答完全正确。

区别在哪？普通对话是"你问它答"——AI 靠自己的能力回答，算错了也没辙。Agent 是"AI 自己决定用什么工具"——发现需要算数，主动调计算器，弥补自己的短板。这就是今天的主角——Agent 和它的核心框架 ReAct。

### [0:35-2:00] Agent 概念：感知→决策→行动循环

**【画面】** PPT 展示循环图。四个节点用箭头连成环：感知（看到任务）→ 推理（我该做什么）→ 行动（执行操作）→ 观察（看结果）→ 回到推理。中间标注"ReAct = Reasoning + Acting"。下方类比图标："做菜：看冰箱 → 决定做什么 → 拿食材做 → 尝味道 → 调整"。

**【旁白】** 什么是 Agent？一句话——Agent 能自主完成多步任务，自己决定"什么时候调什么工具"。

人类解决问题的方式也是这样。做菜——先看冰箱有什么，这是感知；再决定做什么菜，这是推理；然后拿食材开始做，这是行动；做完尝一口，这是观察；如果味道不对就调整做法，又回到推理。感知、推理、行动、观察——一个循环。

Agent 用的是同样的模式，有个专门的名字叫 ReAct——Reasoning 加 Acting。推理"我需要做什么"，行动"调用工具执行"，观察"看工具返回了什么"，然后决定下一步。

和普通对话的区别在哪？普通对话是一问一答——你发一条它回一条。Agent 是自己转好几圈——可能调两三个工具，走三四轮，直到任务完成。不是更聪明地回答，而是自己拆解步骤、自己选工具、自己执行。

### [2:00-3:30] 工具定义与 Function Calling 回顾

**【画面】** VS Code 中展示两个工具函数——`get_current_time` 和 `calculate`。然后展示对应的 TOOLS JSON schema 列表和 TOOL_MAP 映射表。高亮三个对应关系：函数名、description、参数定义。标注："V041 的 Function Calling 就是 Agent 的单步版本"。

**【旁白】** Agent 的核心能力来自工具。先定义两个最简单的工具。

第一个，`get_current_time`——获取当前系统时间。大模型不知道"真正的当前时间"——它训练数据里有个时间，但不是实时的。这个工具让 Agent 能查到真实的系统时间。

第二个，`calculate`——数学计算。接收一个表达式字符串，用 Python 精确计算，返回结果。

每个工具需要两样东西。一是 Python 函数本身——执行具体逻辑。二是 JSON schema 描述——告诉 LLM 这个工具叫什么、能干什么、需要什么参数。这就是 V041 学的 Function Calling。

再准备一个 `TOOL_MAP`——用字典把函数名映射到实际函数，执行时用名字找到函数。

V041 的 Function Calling 是 Agent 的单步版本——AI 调一次工具，程序执行，AI 回复。Agent 是多步版本——AI 可以连续调用多个工具，走好几轮。核心循环把单步扩展成了多步。

### [3:30-5:15] ReAct 循环：while + Function Calling

**【画面】** VS Code 中展示 `run_agent` 函数。用流程标注三个分支：①发请求带 tools 参数；②检查 `tool_calls`——如果不为空，执行工具，把结果加回 messages，继续循环；③如果为空，任务完成，返回回答。高亮 `for step in range(1, max_steps + 1)` 循环和 `messages.append` 操作。

**【旁白】** 来写 Agent 的核心——ReAct 循环。不用任何框架，一个 while 循环加 Function Calling。

`run_agent` 函数接收用户消息。先准备 system prompt 告诉 AI 它是一个有工具的助手，然后初始化 messages 列表——system 消息加 user 消息。

核心是一个 `for` 循环，最多走 max_steps 轮——这个上限很重要，防止无限循环。每轮做三件事：

第一步，发请求给 LLM，带上 tools 参数和完整的 messages 历史。LLM 根据当前状态决定下一步做什么。

第二步，检查返回的 `tool_calls`。如果不为空——说明 LLM 决定调工具——遍历每个工具调用，提取函数名和参数，从 TOOL_MAP 找到对应函数执行。这一步是"行动"。

第三步，把工具执行结果以 `role="tool"` 的消息追加到 messages 列表。这一步是"观察"——让 LLM 下一轮能看到工具返回了什么。然后回到循环顶部，继续下一轮。

如果 `tool_calls` 为空——说明 LLM 认为任务完成了，不需要再调工具——直接返回它的文本回答。循环结束。

关键理解：messages 列表在循环中不断增长——每轮的思考、工具调用、工具结果都追加进去。LLM 每次都能看到完整的对话历史，才能基于前文做下一步决策。这就像聊天记录不断变长，AI 每次翻看完整记录再决定说什么。

### [5:15-6:30] 可运行闭环：Agent 处理多步任务

**【画面】** 终端运行 `run_agent_verbose`。任务："现在是几点？如果加上 100 分钟，是几点？" 展示完整思考轨迹：第1轮调 get_current_time 得到"14:30:25"；第2轮调 calculate 得到计算结果；第3轮 AI 总结回答"现在 14:30，加 100 分钟后是 16:10"。每一轮标注 💭思考、🔧行动、👀观察。

**【旁白】** 运行看效果。给 Agent 一个多步任务："现在是几点？加上 100 分钟后是几点？"

第 1 轮。Agent 思考——"我需要先知道当前时间"。行动——调用 `get_current_time`。观察——返回"14点30分25秒"。

第 2 轮。Agent 思考——"当前是 14:30，需要加 100 分钟"。行动——调用 `calculate`，参数是时间换算表达式。观察——返回计算结果。

第 3 轮。Agent 思考——"任务完成了，整理答案"。没有调用工具。回答——"现在 14:30，加上 100 分钟后是 16:10"。

注意这个过程——Agent 不是一次回答的，它走了三轮。第一轮查时间，第二轮算数学，第三轮总结。每一步它都先推理再行动再观察，这就是 ReAct 的完整循环。

普通对话能回答这个问题吗？能——但大模型不知道"真正的当前时间"，它会说一个训练数据里的时间。Agent 调 `get_current_time` 拿到的是真实的系统时间。这就是工具的价值——补模型知识的盲区。

### [6:30-7:30] max_steps 保护：Agent 不是万能的

**【画面】** PPT 展示 Agent 的两个风险。左"无限循环"——图标一个循环箭头不停转，Agent 反复调用同一工具。右"错误传播"——图标多米诺骨牌倒下，前一步的错误被带到后续推理。底部标注防护措施："max_steps 设上限 · 工具内部 try/except · system prompt 加'无法完成就告知用户'"。

**【旁白】** Agent 有两个必须知道的风险。

第一，无限循环。Agent 不会自己判断"这个任务我做不到"。如果给它一个无法完成的任务——比如"把时间改成明天"——它可能反复调用 `get_current_time` 检查"时间变了没有"，每次发现没变就再调一次。所以 `max_steps` 是必须的——设一个上限，比如 5 轮，超过就强制停止。

第二，错误传播。前一步工具返回了错误信息，Agent 基于错误结果继续推理，越走越偏。防护办法是工具内部做好异常处理——计算遇到除零就返回"除数不能为零"，而不是让程序崩溃或返回一堆乱码。

Agent 不是万能的。它像一个实习生——能自主完成多步任务，但你不能保证每步都对。所以防护措施比"多加工具"更重要。

### [7:30-7:50] 小结

**【画面】** 字幕条："Agent = ReAct 循环 + 工具集 · while + Function Calling · messages 列表是 Agent 的记忆 · max_steps 防止死循环"。

**【旁白】** 核心记住几件事：Agent 的核心是 ReAct 循环——推理、行动、观察，不断迭代直到任务完成；实现上就是一个 while 循环加 Function Calling，不需要任何框架；messages 列表是 Agent 的"记忆"，每轮的思考、工具调用、结果都追加进去；max_steps 是必须的安全阀，防止无限循环。

### [7:50-8:15] 提问彩蛋：让 AI 考考你

**【画面】** 字幕条逐条列出三个 prompt（编号 1/2/3，可暂停照抄）：
1. "请用做菜的类比讲清楚 ReAct 框架里'推理—行动—观察'每一轮分别在干什么，以及为什么 messages 列表要不断追加工具调用结果。"
2. "请你扮演技术面试官，围绕'Agent 为什么会陷入无限循环、max_steps 怎么防护'连续追问我，指出我每个回答的漏洞再问下一个。"
3. "我刚手写了 ReAct 循环（while 循环 + Function Calling）。请给我出 2 道思考题，比如'工具执行报错时 messages 里应该追加什么'，我答完你再点评。"

**【旁白】** 别只让 AI 替你调工具，也让它考你。这三条直接抄去问——尤其第二条，被面试官追问三轮还答得上来，ReAct 才算真懂。问 AI 的目的不是省掉思考，是逼你思考。

### [8:15-8:25] 引出下集

**【画面】** 下集预告卡片："V047 构建有工具的 AI Agent——给 Agent 加搜索工具、计算工具、自定义工具，处理真正的复杂任务"。

**【旁白】** 今天 Agent 只有时间查询和计算器两个简单工具。下节课给它加搜索工具、加文本统计工具、加错误防护——做一个真正能完成复杂任务的实战 Agent。我们下集见。

---

## 演示操作清单

### 文件结构

```
v044_demo/
├── .env
└── agent_demo.py    （Agent 核心 + ReAct 循环）
```

### 完整代码：agent_demo.py

```python
# agent_demo.py —— 手写 ReAct 循环的 AI Agent
"""Agent = while 循环 + Function Calling，不依赖任何框架"""
import os
import json
from datetime import datetime
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.environ.get("DEEPSEEK_API_KEY", ""),
    base_url="https://api.deepseek.com"
)

# ---- 工具函数 ----

def get_current_time():
    """获取当前日期和时间"""
    now = datetime.now()
    return now.strftime("当前时间: %Y年%m月%d日 %H:%M:%S")


def calculate(expression):
    """数学计算（支持加减乘除、括号、幂运算）"""
    try:
        allowed = set("0123456789+-*/.() ")
        if not all(c in allowed for c in expression):
            return "错误: 表达式包含非法字符"
        result = eval(expression)
        return f"计算结果: {result}"
    except ZeroDivisionError:
        return "错误: 除数不能为零"
    except Exception as e:
        return f"错误: 无法计算 '{expression}'"


# ---- 工具描述（JSON schema）----

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "get_current_time",
            "description": "获取当前的日期和时间。当用户问'现在几点''今天日期'时使用。",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "calculate",
            "description": "执行数学计算。当需要精确计算加减乘除时使用。大模型自身计算可能不准确，复杂计算应使用此工具。",
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {
                        "type": "string",
                        "description": "数学表达式，如 '2 + 3 * 4' 或 '(100 + 200) / 3'"
                    }
                },
                "required": ["expression"]
            }
        }
    }
]

TOOL_MAP = {
    "get_current_time": get_current_time,
    "calculate": calculate,
}


# ---- Agent 核心 ----

def run_agent(user_message, max_steps=5):
    """运行 Agent——手写 ReAct 循环"""
    system_prompt = (
        "你是一个有工具的 AI 助手。"
        "你可以使用工具来帮助回答问题。"
        "如果问题不需要工具，直接回答。"
        "每次工具调用后，根据返回结果决定下一步。"
    )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_message}
    ]

    print(f"👤 用户: {user_message}")
    print("-" * 50)

    for step in range(1, max_steps + 1):
        print(f"\n🔄 第 {step} 轮:")

        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=messages,
            tools=TOOLS,
            tool_choice="auto"
        )

        msg = response.choices[0].message

        if msg.tool_calls:
            messages.append(msg)

            for tc in msg.tool_calls:
                name = tc.function.name
                args = json.loads(tc.function.arguments)

                print(f"  🔧 调用工具: {name}({args})")

                func = TOOL_MAP.get(name)
                result = func(**args) if func else f"未知工具: {name}"

                print(f"  📋 返回结果: {result}")

                messages.append({
                    "role": "tool",
                    "tool_call_id": tc.id,
                    "content": str(result)
                })
        else:
            print(f"  💬 最终回答: {msg.content}")
            return msg.content

    print(f"  ⚠️ 达到最大循环次数 {max_steps}，强制停止。")
    return "Agent 超过了最大循环次数。"


# ---- 运行 ----

if __name__ == "__main__":
    # 测试1: 需要工具的单步任务
    print("=" * 60)
    run_agent("现在几点了？")

    # 测试2: 多步任务
    print("\n\n" + "=" * 60)
    run_agent("计算 (15 + 27) * 3 的结果，然后告诉我现在的时间。")

    # 测试3: 不需要工具的任务
    print("\n\n" + "=" * 60)
    run_agent("Python 的列表和元组有什么区别？")
```

### 运行命令

```bash
cd ~/workspace/python-course/v044_demo
pip install openai python-dotenv
python agent_demo.py
```

### 预期输出

```
============================================================
👤 用户: 现在几点了？
--------------------------------------------------

🔄 第 1 轮:
  🔧 调用工具: get_current_time({})
  📋 返回结果: 当前时间: 2025年08月08日 14:30:25

🔄 第 2 轮:
  💬 最终回答: 现在是 2025年8月8日 14点30分25秒。

============================================================
👤 用户: 计算 (15 + 27) * 3 的结果，然后告诉我现在的时间。
--------------------------------------------------

🔄 第 1 轮:
  🔧 调用工具: calculate({'expression': '(15 + 27) * 3'})
  📋 返回结果: 计算结果: 126

🔄 第 2 轮:
  🔧 调用工具: get_current_time({})
  📋 返回结果: 当前时间: 2025年08月08日 14:30:26

🔄 第 3 轮:
  💬 最终回答: (15+27)*3 的结果是 126。现在是 2025年8月8日 14:30:26。

============================================================
👤 用户: Python 的列表和元组有什么区别？
--------------------------------------------------

🔄 第 1 轮:
  💬 最终回答: 列表是可变序列，元组是不可变序列...
```

---

## 录制注意

1. **开场对比必须真实运行**：普通对话 vs Agent 的对比——同一道数学题，两种模式——必须实际运行展示。如果大数字 AI 恰好算对了，换成更大的数字如 `123456 * 789012`，确保差异明显。
2. **ReAct 循环是全片核心**：讲解 `run_agent` 函数时要逐段拆解——先讲循环结构，再讲 `tool_calls` 检查，最后讲 messages 追加。建议在代码旁边画一个简化流程图辅助理解。重点让观众理解"messages 列表在循环中不断增长"这个概念。
3. **多步任务的思考轨迹是教学亮点**：测试2"计算结果再查时间"展示了 Agent 连续调用两个不同工具的过程。每一轮的 💭思考、🔧行动、👀观察标注要清晰，让观众看清 Agent 是怎么"一步一步"解决问题的。
4. **语速控制**：整体旁白约 1900 字，按 235 字/分钟控制在 8 分钟以内。ReAct 循环讲解是核心，适当放慢；开场和风险提示部分正常语速。
5. 提问彩蛋段的 prompt 字幕条需在后期加上，确保观众能暂停照抄。
