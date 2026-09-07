# V041 Function Calling 入门

## 视频信息

| 项目 | 内容 |
|---|---|
| 编号 | V041 |
| 标题 | Function Calling 入门 |
| 目标时长 | 8 min |
| 对应课次 | L21 结构化输出与 Function Calling |
| 前置微课 | V040 JSON Mode 与结构化输出 |
| 一句话定位 | AI 不亲自干活，它决定该干什么和用什么参数——从"AI 聊天"到"AI 驱动程序"的关键跨越 |

---

## 逐字稿

### [0:00-0:35] 开场 hook：成果前置——意图识别器完整运行

**【画面】** 终端中运行 `python intent_recognizer.py`，连续输入四条指令。第一条"北京天气怎么样？"——程序打印"→ 调用工具: get_weather({'city': '北京'})"，然后 AI 回复"北京当前晴，气温28°C"。第二条"帮我算 125*8+37"——程序打印"→ 调用工具: calculate({'expression': '125 * 8 + 37'})"，AI 回复"结果是 1037"。第三条"你好，你能做什么？"——程序直接 AI 回复，没调用工具。画面定格，字幕条："AI 自动选工具 · 自动填参数 · 程序执行 · AI 回复"。

**【旁白】** 看这个效果。用户说"北京天气怎么样"——程序自动调用天气查询函数，拿到结果后让 AI 生成自然语言回复。说"帮我算一道数学题"——程序自动调用计算器。说"你好"——AI 直接聊天，不调用任何工具。这个程序就是今天的主角——AI 意图识别器。它用到的核心技术叫 Function Calling，就是今天这集的主题。

### [0:35-1:45] 从 JSON Mode 到 Function Calling

**【画面】** PPT 展示两阶段对比。左半："V040 JSON Mode"——用户 → AI → 固定格式的 JSON。右半："V041 Function Calling"——用户 → AI → 选择哪个工具+参数 → 程序执行 → AI 生成回复。中间用一个箭头连接，标注"从'输出数据'到'驱动动作'"。

**【旁白】** 上集学的 JSON Mode 解决了一个问题——让 AI 输出合法 JSON，程序能解析。但想象一个场景：你有一个聊天机器人，用户可能问天气、可能让你算数学、可能让你翻译。你不知道用户接下来会说什么。

如果只用 JSON Mode，你得在 prompt 里写："如果是查天气就返回 weather 字段，如果是计算就返回 expression 字段……"——随着功能增多，这个 prompt 会越来越复杂，而且 AI 经常搞混。

Function Calling 换了个思路。你不用在 prompt 里写一堆 if-else 逻辑，而是把"我有哪些工具"用结构化的方式告诉 AI。AI 根据用户的输入，自动判断该用哪个工具、参数填什么。你的代码拿到 AI 的决策后，执行对应函数，再把结果告诉 AI。

**核心心智模型**记住这句话——**AI 不亲自干活，它只决定"该干什么"和"用什么参数"，执行是你的代码的事**。AI 是调度中心，不是执行者。

### [1:45-3:30] tools 参数：用 JSON Schema 描述工具

**【画面】** VS Code 中展示 `tools` 列表，逐层展开结构。用不同颜色标注 name、description、parameters 三个层级。重点放大 description 字段，标注"这是给 AI 看的"。

**【旁白】** Function Calling 的入口是 `tools` 参数。你把工具的描述信息放进一个列表，传给 API。来看结构：

```python
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "查询指定城市的天气预报",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "城市名称，如'北京'、'上海'"
                    }
                },
                "required": ["city"]
            }
        }
    }
]
```

逐层拆开。最外层 `type` 固定是 `"function"`。里面 `function` 字段有三个关键信息。

第一，`name`——函数名，程序后面靠它做路由，AI 返回 `"get_weather"` 你就知道该调天气函数。

第二，`description`——**这个最重要**。它描述工具能干什么。AI 就是根据这个描述判断"什么时候该用这个工具"的。描述写得越清楚，AI 选择越准确。这里写了"查询指定城市的天气预报"，AI 看到"北京天气怎么样"就知道该用它。

第三，`parameters`——用 JSON Schema 格式描述参数。`city` 是字符串类型，描述是"城市名称，如北京、上海"。`required` 标明哪些参数是必填的。

这里有个核心认知——**工具描述就是给 AI 的 prompt**。这和 V038 讲的 Prompt 结构化设计是一脉相承的。description 写得好不好，直接决定 AI 选得准不准。很多同学 Function Calling 不靠谱，问题不在代码，而在工具描述写得太模糊。

### [3:30-5:00] 完整流程拆解：六步走通 Function Calling

**【画面】** PPT 动画展示完整流程图，六步用编号标注，每一步配对应的代码片段。箭头连接每一步，形成闭环。重点标注第二步的 `tool_calls` 判断和第四步的函数执行。

**【旁白】** 现在拆解完整流程。看起来步骤多，但本质就是"AI 决策 → 代码执行 → 结果反馈"三件事。

**第一步**，发送用户消息，同时附上 `tools` 参数。AI 会根据用户说的话和工具描述做判断。

**第二步**，检查返回结果中的 `message.tool_calls`。如果 AI 认为需要调用工具，这个字段就不为空；如果只是普通聊天，它就是 None。这一步是分支——有工具调用走工具流程，没有就直接返回 AI 的文本回复。

**第三步**，如果需要调用工具，从 `tool_calls` 里提取函数名和参数。函数名在 `tool_call.function.name`，参数在 `tool_call.function.arguments`——它是一个 JSON 字符串，`json.loads()` 解析成字典。

**第四步**，执行对应的函数。你的代码拿到函数名和参数后，调用真正的 Python 函数。这一步完全是你自己的逻辑，AI 不管。

**第五步**，把函数执行结果返回给 AI。构造一条 `role="tool"` 的消息，带上 `tool_call_id` 和结果内容，追加到对话历史里，再发一次请求。

**第六步**，AI 拿到工具结果后，生成自然语言回复。用户最终看到的不是冰冷的 JSON，而是一句人话。

整个链路就是：用户说话 → AI 选工具 → 你执行 → AI 回复。AI 做了最难的部分——理解意图和选择工具，你只需要把工具实现好。

### [5:00-6:45] 可运行闭环：AI 意图识别器

**【画面】** VS Code 中展示完整的 `intent_recognizer.py`。先展示工具实现部分（get_weather 和 calculate），再展示 tools 列表，最后展示 `chat_with_tools` 函数。终端运行，展示四条测试用例的完整输出。

**【旁白】** 来写完整的意图识别器。两个工具——查天气和计算器。

先实现工具函数。`get_weather` 查天气，课堂用模拟数据，实际项目可以接入真实的天气 API。`calculate` 计算数学表达式，这里用 eval 做演示，实际项目要做安全过滤。

然后定义 tools 列表——就是刚才讲的 JSON Schema 格式，两个工具各一个。再加一个工具路由表，用字典把函数名映射到实际函数：

```python
TOOL_MAP = {
    "get_weather": get_weather,
    "calculate": calculate,
}
```

核心是 `chat_with_tools` 函数。第一步发请求，带上 `tools` 参数。第二步检查 `tool_calls`——如果 AI 要调用工具，遍历每个工具调用，提取函数名和参数，从 TOOL_MAP 里找到对应函数，执行它。第三步把结果以 `role="tool"` 的消息追加到对话历史，再发一次请求，让 AI 生成自然语言回复。

如果 `tool_calls` 为空，说明用户只是在聊天，不需要工具——直接返回 AI 的文本回复。这个分支一定要处理，否则用户说句"你好"程序就不知道该怎么办了。

运行看效果。输入"北京天气怎么样"——AI 选了 `get_weather`，参数 `city` 填"北京"，程序执行拿到天气数据，AI 回复"北京当前晴，气温28度"。输入"帮我算 125 乘以 8 加 37"——AI 选了 `calculate`，参数填的是 `"125 * 8 + 37"`，程序执行返回 1037，AI 回复"结果是 1037"。输入"你好你能做什么"——没有调用工具，AI 直接回复。完整闭环。

### [6:45-7:30] 设计思维：AI 作为调度中枢

**【画面】** PPT 对比图。左侧"传统程序"：用户选菜单 → 程序执行对应功能。右侧"Function Calling 模式"：用户说自然语言 → AI 理解意图 → AI 选工具 → 程序执行 → AI 回复。下方列出三个优势："用户不需要学界面 · 加功能只需加工具 · AI 做了最难的意图识别"。

**【旁白】** 最后聊一下设计思维。传统程序里，用户要在菜单里选"1-查天气，2-计算器"。Function Calling 模式下，用户说自然语言就行——AI 帮你做了意图识别这件最难的事。

这种模式的威力在于：**加新功能只需加新工具**——写好工具函数和工具描述，加入 tools 列表，AI 自动就能识别新意图，不用改任何界面逻辑。用户不需要学你的界面，说人话就行。

但代价也要清楚：AI 可能选错工具——所以工具描述要写好；多了一次 API 调用——响应会慢一些；每次调用消耗更多 token——成本会增加。工程上没有银弹，但这些代价在大多数场景下是值得的。

### [7:30-7:50] 小结

**【画面】** 字幕条逐条出现："AI 决策 + 代码执行 · tools 参数描述你的工具 · description 是给 AI 的 prompt · tool_calls 为 None 时是普通对话"。

**【旁白】** 核心记住几件事：Function Calling 是"AI 决策 + 代码执行"的协作模式；工具描述用 JSON Schema 格式写在 tools 参数里；description 是给 AI 看的，写得好 AI 选得准；用户不需要工具时要处理 `tool_calls` 为 None 的情况。

### [7:50-8:15] 提问彩蛋

**【画面】** 黑底字幕条逐条弹出三个 prompt（右上角标注"暂停照抄"）：
1. 「我在学 Function Calling。请扮演面试官追问我：为什么说"AI 不亲自干活，只做决策"？message.tool_calls 为 None 时代码必须怎么处理？」
2. 「给我出 3 道 Function Calling 设计题：每题给一个生活场景（比如订咖啡、查快递），让我写出 tools 里的 name、description 和 parameters，我写完你逐条点评。」
3. 「把 Function Calling 的六步流程用"调度中心和执行者"的类比讲一遍，并指出哪一步最容易出错、为什么。」

**【旁白】** 彩蛋时间——三个 prompt 拿去问 Kimi 或 DeepSeek。Function Calling 光看我演示没用，让 AI 出道设计题，你亲手写一遍 tools 参数才算数。一句话：AI 能替你回答，但替代不了你思考——用它考你，别用它替你做。

### [8:15-8:25] 引出下集

**【画面】** 下集预告卡片，展示一个问题："AI 能调用工具了，但如果工具需要外部知识怎么办？"——举例"本课程的考试政策"，模型训练时不知道。

**【旁白】** 今天 AI 能调用工具了。但如果工具需要外部知识呢？比如让 AI 回答"本课程的考试政策"——模型训练时根本不知道这些信息。怎么解决？后面会学 RAG——检索增强生成。让 AI 先查资料再回答。我们后面见。

---

## 演示操作清单

### 文件结构

```
v039_demo/
└── intent_recognizer.py    （完整的 AI 意图识别器）
```

### 完整代码：intent_recognizer.py

```python
# intent_recognizer.py —— 完整的 AI 意图识别器
"""用户说自然语言 → AI 识别意图 → 程序执行 → AI 生成回复"""
import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.environ.get("DEEPSEEK_API_KEY", ""),
    base_url="https://api.deepseek.com"
)

# ---- 工具的实际实现 ----

def get_weather(city: str) -> dict:
    """查询天气（课堂用模拟数据，实际项目可接入天气API）"""
    weather_db = {
        "北京": {"temp": 28, "condition": "晴", "humidity": 45},
        "上海": {"temp": 32, "condition": "多云", "humidity": 70},
    }
    return weather_db.get(city, {"temp": 25, "condition": "未知", "humidity": 50})


def calculate(expression: str) -> str:
    """安全计算数学表达式"""
    try:
        # 注意：实际项目中不要用 eval，这里仅做演示
        result = eval(expression, {"__builtins__": {}}, {})
        return str(result)
    except Exception as e:
        return f"计算失败: {e}"


# ---- 工具描述（给 AI 看的）----

tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "查询指定城市的天气",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "城市名称"
                    }
                },
                "required": ["city"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "calculate",
            "description": "计算数学表达式并返回结果",
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {
                        "type": "string",
                        "description": "数学表达式，如 '2+3*4'"
                    }
                },
                "required": ["expression"]
            }
        }
    }
]

# ---- 工具路由表 ----

TOOL_MAP = {
    "get_weather": get_weather,
    "calculate": calculate,
}


def chat_with_tools(user_input: str) -> str:
    """带工具调用的聊天函数"""
    messages = [{"role": "user", "content": user_input}]

    # 第一步：发送消息，让 AI 决定是否调用工具
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=messages,
        tools=tools
    )
    message = response.choices[0].message

    # 第二步：如果 AI 要调用工具
    if message.tool_calls:
        messages.append(message)  # 把 AI 的决策加入对话历史

        for tool_call in message.tool_calls:
            func_name = tool_call.function.name
            arguments = json.loads(tool_call.function.arguments)

            print(f"  → 调用工具: {func_name}({arguments})")

            # 执行对应的函数
            func = TOOL_MAP.get(func_name)
            if func:
                result = func(**arguments)
            else:
                result = f"未知工具: {func_name}"

            print(f"  → 执行结果: {result}")

            # 把结果返回给 AI
            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": json.dumps(result, ensure_ascii=False)
            })

        # 第三步：让 AI 根据工具结果生成自然语言回复
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=messages
        )
        return response.choices[0].message.content
    else:
        # AI 没调用工具，直接回复
        return message.content


# ---- 使用 ----
if __name__ == "__main__":
    test_cases = [
        "北京天气怎么样？",
        "帮我算一下 125 * 8 + 37",
        "上海今天热不热？",
        "你好，你能做什么？",
    ]

    for user_input in test_cases:
        print(f"\n用户: {user_input}")
        reply = chat_with_tools(user_input)
        print(f"AI: {reply}")
```

### 运行命令

```bash
cd ~/workspace/python-course/v039_demo

# 运行意图识别器
python intent_recognizer.py
```

### 预期输出

```
用户: 北京天气怎么样？
  → 调用工具: get_weather({'city': '北京'})
  → 执行结果: {'temp': 28, 'condition': '晴', 'humidity': 45}
AI: 北京当前天气晴朗，气温28°C，湿度45%，天气不错！

用户: 帮我算一下 125 * 8 + 37
  → 调用工具: calculate({'expression': '125 * 8 + 37'})
  → 执行结果: 1037
AI: 125 * 8 + 37 = 1037

用户: 上海今天热不热？
  → 调用工具: get_weather({'city': '上海'})
  → 执行结果: {'temp': 32, 'condition': '多云', 'humidity': 70}
AI: 上海现在32°C，多云，湿度较高（70%），确实挺热的，注意防暑。

用户: 你好，你能做什么？
AI: 你好！我可以帮你查天气和做数学计算。比如问我"北京天气怎么样"或"帮我算 2+2"。
```

---

## 录制注意

1. **开场成果前置必须真实运行**：开场 30 秒展示 `intent_recognizer.py` 的完整运行效果——四条测试用例，包含"调用工具"和"不调用工具"两种情况。必须实际运行展示真实输出，不要用截图或后期合成。让用户第一眼看到"这集做完我能得到什么"。
2. **tools 参数讲解要逐层展开**：讲解 JSON Schema 时不要一次性全部展示，用折叠或高亮逐层展开——先 `type` → `function` → `name` → `description` → `parameters`。重点停在 description 上，强调"这是给 AI 看的 prompt"，呼应 V038。
3. **六步流程用动画或标注辅助**：六步流程信息量大，纯口播观众会迷失。建议用 PPT 流程图或代码标注配合，讲到哪步高亮哪步。核心是让观众记住"AI 决策 → 代码执行 → 结果反馈"这个三段式骨架，六步只是它的细化。
4. **语速控制**：整体旁白约 1900 字，按 230 字/分钟控制在 8 分钟以内。六步流程和工具描述讲解适当放慢，开场和结尾正常语速。
5. 提问彩蛋段的 prompt 字幕条需在后期加上，确保观众能暂停照抄。
