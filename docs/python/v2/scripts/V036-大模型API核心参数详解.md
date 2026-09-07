# V036 大模型 API 核心参数详解

## 视频信息

| 项目 | 内容 |
|---|---|
| 编号 | V036 |
| 标题 | 大模型 API 核心参数详解 |
| 目标时长 | 8 min |
| 对应课次 | L19 大模型 API 深入 |
| 前置微课 | V035 yield 生成器与流式输出基础 |
| 一句话定位 | temperature/top_p/max_tokens/stop 四个旋钮控制 AI 行为——参数即编程 |

---

## 逐字稿

### [0:00-0:35] 开场 Hook：同一个问题问十次，答案一样吗？

**【画面】** 终端中执行一段脚本，向 AI 发送同一个问题"用一句话描述秋天"，连续跑两次。两次输出并列展示在屏幕上——文字明显不同。字幕条："同一个 prompt · 连跑两次 · 答案不同"。

**【旁白】** 我用同一个 prompt，问了 AI 两次同样的问题，答案不一样。你可能觉得理所当然——但这里有个关键问题：到底是 AI 在"随机发挥"，还是你的代码在控制它发挥到什么程度？答案是——两者都有。之前我们调 API 一直用默认参数，等于把方向盘交给了 AI。今天这集，我带你认识四个旋钮：temperature、top_p、max_tokens、stop。拧上它们，你就拿回了方向盘。

### [0:35-2:30] temperature：创意与确定性的旋钮

**【画面】** PPT 动画：一个音量旋钮，刻度从 0 到 2。旋钮拧到 0 时，画面变安静，只显示一行最朴素的文字；拧到 2 时，画面炸开，满屏飘散碎乱文字。然后切到 VS Code，展示 `demo_temperature.py` 代码并运行。

**【旁白】** 第一个旋钮，也是最重要的一个——`temperature`，翻译过来叫"温度"。

你可以把它想象成一个音量旋钮。旋到 0，是静音——AI 只说最有把握、最确定的话；旋到 2，是最大声——什么都敢说，天马行空。范围从 0 到 2，默认值通常是 1。

直接看代码。我用同一个 prompt"用一句话解释什么是递归"，分别在 temperature 等于 0、0.7、1.5 下跑三次：

```python
prompt = "用一句话解释什么是递归"

for temp in [0, 0.7, 1.5]:
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[{"role": "user", "content": prompt}],
        temperature=temp,
        max_tokens=100
    )
    print(f"temperature={temp}:")
    print(response.choices[0].message.content)
    print("-" * 60)
```

来看实际输出。temperature 等于 0——"递归是指函数在执行过程中直接或间接调用自身的编程技巧。"很准确、很规矩，像教科书。

temperature 等于 0.7——"递归就像俄罗斯套娃，一个函数打开后发现里面藏着一个同样的自己，直到最小的那个不再打开。"有比喻，有画面，自然的风格。

temperature 等于 1.5——"递归嘛就是函数自己叫自己！就像你站在两面镜子中间看到无数个自己……不过要记得设个出口不然就！"开始重复、跑偏，不稳定了。

这就是温度的魔力。一个关键技巧：**如果你把 temperature 设成 0，同一个 prompt 连续跑三次，输出几乎一模一样**。这也是为什么写代码生成场景要调到 0——你需要的是稳定和准确，不是惊喜。

### [2:30-3:30] 猜温度互动 + 参数选择策略

**【画面】** 三段输出截图分上下排列，每段前面标着字母 A、B、C，但没有标注温度值。字幕："A: '秋天是一年中的第三个季节，气温逐渐降低，树叶变色脱落。' B: '秋天用金色的画笔在大地上涂抹，每一片落叶都是它写给冬天的信。' C: '秋天秋天秋天落叶飘飘飘金色红色橙色然后冬天来了但秋天还在记忆里跳舞。'"

**【旁白】** 来做个互动——猜温度。这三段输出，分别对应 temperature 等于 0、0.7、1.5。你暂停视频想一想，哪个是哪个？

答案是：A 是 0——平铺直叙，像维基百科；B 是 0.7——有比喻，有美感，是 AI 最自然的风格；C 是 1.5——开始胡言乱语、自我重复。感觉到了吧？

记住一个选择策略：**写代码、做摘要、做分类——用低温度，0 到 0.3**，你要的是准确和稳定；**写文案、做创意、写故事——用高温度，0.7 到 1.0**，你要的是发散和新意。日常对话用 0.7，这也是大多数模型的默认值。

### [3:30-4:30] top_p：核采样，与 temperature 二选一

**【画面】** PPT 动画：一个相机镜头对比图。左标"调焦距=temperature"，右标"换镜头=top_p"。字幕："两个都能改变画面，但你日常只用调焦距"。

**【旁白】** 第二个旋钮叫 `top_p`，也叫核采样。它和 temperature 做的事情类似——都是控制 AI 选词的随机性——但底层逻辑不同。temperature 是给每个候选词重新分配概率，top_p 是只从概率累积前百分之 p 的候选词里选。

你不需要记这个底层逻辑。**关键就一句话：temperature 和 top_p，二选一，日常只调 temperature 就够了。** 它们像相机对焦——temperature 像调焦距，top_p 像换镜头，两个都能改变画面，但你日常只用调焦距。

API 官方文档也明确说了：两个一起调会导致结果不可预测。所以除非你有特殊需求，不然别碰 top_p。记住 temperature，忘掉 top_p——至少现阶段。

### [4:30-5:50] max_tokens：输出上限，防烧钱

**【画面】** VS Code 中展示 `demo_max_tokens.py` 代码，运行后展示被截断的输出。重点放大 `finish_reason` 字段的值——先展示正常调用时是 "stop"，再展示截断时是 "length"。字幕条："stop = 正常结束 · length = 被截断"。

**【旁白】** 第三个旋钮是 `max_tokens`——输出长度上限。这个参数的实际用途是**控制成本**。大模型按 token 计费，token 可以理解为字或词的计量单位。你不设上限，AI 可能给你输出一篇万字长文，烧的就是你的钱。

来看效果。我让 AI 详细介绍 Python 的十大特点，但只给它 50 个 token：

```python
response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{"role": "user", "content": "详细介绍Python的十大特点"}],
    max_tokens=50
)
print(response.choices[0].message.content)
print(f"\nfinish_reason: {response.choices[0].finish_reason}")
```

跑一下——看，AI 刚说到第三点，话还没说完就被砍断了。注意这行 `finish_reason`，它的值是 `length`，意思是"因为达到 token 上限被截断了"。

对比一下——如果正常回答完毕，`finish_reason` 的值是 `stop`，表示 AI 自然结束。**写代码时一定要检查这个字段**：如果拿到的是 `length`，说明 AI 的话被腰斩了，你拿到的不是完整答案。这在你做工具调用、做结构化输出时尤其重要——拿到半截 JSON 解析会直接报错。

### [5:50-7:00] stop：停止序列，控制输出边界

**【画面】** PPT 动画：一个人在说话，屏幕上出现一个红色停止按钮，AI 立刻闭嘴。然后 VS Code 展示一个简短的 stop 参数演示代码。

**【旁白】** 最后一个旋钮叫 `stop`，停止序列。它的作用是——当 AI 的输出中出现指定的字符串时，立刻停止生成。

看个例子。我让 AI 做翻译，但只想要翻译结果，不想要它的解释。可以设 `stop` 参数：

```python
response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{"role": "user", "content": "把'Hello World'翻译成中文，只输出翻译结果，然后输出END"}],
    stop=["END"],
    max_tokens=100
)
print(response.choices[0].message.content)
```

AI 生成到 END 两个字时就会自动停。你拿到的输出里不包含 END 本身——它是一个边界标记，不是内容的一部分。

stop 参数在什么场景最有用？做模板化输出。比如你让 AI 按固定格式生成内容，用特殊符号作为分隔符，stop 到分隔符就停——保证输出格式干净，不夹带额外解释。日常简单调用不太用，但做 AI 应用时是个控制输出的利器。

### [7:00-7:30] 心智模型总结

**【画面】** 字幕卡片，四行核心规则逐条弹出："temperature 控创意 · max_tokens 控成本 · stop 控格式 · top_p 通常别碰"。

**【旁白】** 四个旋钮讲完了，给你一个心智模型记住它们：**temperature 控创意，max_tokens 控成本，stop 控格式，top_p 通常别碰。** 参数不是可选项，而是你用代码控制 AI 行为的编程接口。这和函数参数控制函数行为是同一件事——参数即编程。

### [7:30-7:50] 小结

**【画面】** 四个参数的图标排成一行，每个配一句话注释。

**【旁白】** 回顾一下：temperature 管创意、top_p 通常别碰、max_tokens 管成本还要检查 finish_reason、stop 管格式边界。四个旋钮拧会了，你就从"听 AI 的"变成了"指挥 AI 的"。

### [7:50-8:10] 提问彩蛋：结论自己跑出来

**【画面】** 弹出"提问彩蛋"卡片，字幕条逐条列出三个 prompt，停留足够时长供暂停照抄：
1. "请帮我设计一个可运行的实验：用同一个 prompt 分别在 temperature=0、0.7、1.5 下各调用三次 DeepSeek API，观察输出差异，并告诉我应该对比哪些维度。"
2. "用我听得懂的话解释 temperature 和 top_p 的底层区别，为什么官方建议二选一？两个一起调会发生什么？"
3. "你扮演面试官问我：max_tokens 截断时 finish_reason 是什么值？拿到半截 JSON 会发生什么？代码里怎么检测和处理这种情况？"

**【旁白】** 结尾送个提问彩蛋——三条 prompt 拿去照抄：让 AI 帮你设计三温度对比实验，自己跑出结论；让它讲透 temperature 和 top_p 为什么不能一起调；让它扮演面试官，考你 finish_reason 截断后怎么处理。参数这东西，听十遍不如亲手拧一遍——让 AI 搭实验，结论自己跑。

### [8:10-8:25] 引出下集

**【画面】** 切换到下集预告卡片："V037 流式输出实现"。

**【旁白】** 但有个体验问题还没解决——你现在调用 API，AI 要等好几秒才一次性把全部回复返回给你。参数控的是怎么生成，但用户体验还有个问题——等 8 秒才看到结果。下集学流式输出，让 AI 回复逐字出现，从"等 8 秒看全部"变成"0.5 秒看第一个字"。下集见。

---

## 演示操作清单

### 演示1：temperature 参数效果对比（demo_temperature.py）

```python
# demo_temperature.py
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.environ.get("DEEPSEEK_API_KEY", ""),
    base_url="https://api.deepseek.com"
)

prompt = "用一句话解释什么是递归"

print("=" * 60)
for temp in [0, 0.7, 1.5]:
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[{"role": "user", "content": prompt}],
        temperature=temp,
        max_tokens=100
    )
    print(f"temperature={temp}:")
    print(response.choices[0].message.content)
    print("-" * 60)
```

### 演示2：max_tokens 截断效果（demo_max_tokens.py）

```python
# demo_max_tokens.py
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.environ.get("DEEPSEEK_API_KEY", ""),
    base_url="https://api.deepseek.com"
)

prompt = "详细介绍 Python 的十大特点"

# 只给 50 token——AI 会被强制截断
response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{"role": "user", "content": prompt}],
    max_tokens=50
)

print("max_tokens=50 的输出（会被截断）：")
print(response.choices[0].message.content)
print(f"\nfinish_reason: {response.choices[0].finish_reason}")
# finish_reason="length" 表示因 max_tokens 截断
# finish_reason="stop" 表示正常结束
```

### 演示3：stop 停止序列（可选演示）

```python
# demo_stop.py
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.environ.get("DEEPSEEK_API_KEY", ""),
    base_url="https://api.deepseek.com"
)

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{"role": "user", "content": "把'Hello World'翻译成中文，只输出翻译结果，然后输出END"}],
    stop=["END"],
    max_tokens=100
)

print("stop=['END'] 的输出：")
print(response.choices[0].message.content)
print(f"\nfinish_reason: {response.choices[0].finish_reason}")
```

### 运行命令

```bash
cd ~/workspace/python-course

# 温度对比演示
python demo_temperature.py

# max_tokens 截断演示
python demo_max_tokens.py

# stop 停止序列演示（可选）
python demo_stop.py
```

---

## 录制注意

1. **开场两次调用要有明显差异**：开场连续跑两次同一 prompt，确保两次输出有肉眼可见的差异（如不同的比喻、不同的句式）。如果碰巧两次一样，多跑几次直到出现差异再录。建议用创意类 prompt（如"描述秋天"）而非事实类 prompt，差异更明显。
2. **temperature 对比提前跑好**：三温度对比的输出建议提前跑好截图备用，防止录制时网络波动或 API 返回异常。但视频里尽量展示真实运行过程——可以先敲 `python demo_temperature.py` 再切到提前截好的输出图。
3. **finish_reason 要放大展示**：max_tokens 截断演示中，`finish_reason: length` 这行必须放大或高亮，这是本集的核心知识点之一。可以先展示一次正常调用（finish_reason 是 stop），再展示截断（finish_reason 是 length），形成对比。
4. **时长控制**：核心讲解放在 temperature（最重点）和 max_tokens（实用性强），top_p 和 stop 各控制在 1 分钟左右。如果时长紧张，stop 演示可以只讲概念不跑代码，代码放演示清单里供学生课后参考。
5. **提问彩蛋字幕后期添加**：提问彩蛋段的 prompt 字幕条需在后期加上，确保观众能暂停照抄。
