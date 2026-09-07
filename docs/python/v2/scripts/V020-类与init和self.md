# V020 类与 __init__ 和 self

## 视频信息

| 项目 | 内容 |
|---|---|
| 编号 | V020 |
| 标题 | 类与 __init__ 和 self |
| 目标时长 | 8 min |
| 对应课次 | L11 类与面向对象 |
| 前置微课 | V017 文件读写与 with 语句、V018 try/except 异常处理实战、V019 import 机制与模块基础 |
| 一句话定位 | class 把相关的数据和函数打包成一个整体，__init__ 初始化属性，self 指向实例自己 |

---

## 逐字稿

### [0:00-0:35] 开场 hook（痛点共鸣）

**【画面】** 屏幕上展示之前课里的"散装代码"——`api_key`、`model`、`history`、`system_prompt` 四五个变量散落在全局作用域，调用函数时参数列表长长一串。画面定格，变量名全部高亮，字幕条："5 个变量，散落各处"。

**【旁白】** 之前几节课，我们写了不少调用大模型 API 的代码。但你有没有发现一个问题——每次调用都围着 api_key、model、history、system_prompt 这几个变量转，散落在代码各处，函数之间传来传去。如果现在要同时维护两个聊天会话呢？得搞两套变量——history1、history2、system_prompt1、system_prompt2……想想就头大。

有没有办法把这些相关的数据和操作打包到一起，不用再一个个传？有——这就是今天的主角，类。

### [0:35-2:15] class 定义与 __init__

**【画面】** VS Code 中新建文件，敲入 class 定义代码。重点高亮 `class` 关键字、类名 `AIChatManager`、`__init__` 方法名和 `self.xxx` 赋值。逐行讲解时对应行高亮变色。

**【旁白】** 来看最简单的类长什么样。

用 `class` 关键字定义一个类，后面跟类名和冒号。Python 的命名习惯是——类名用大驼峰格式，每个单词首字母大写。比如我们这个类叫 `AIChatManager`，三个单词首字母都大写。一看名字就知道它是一个"AI 对话管理器"。

类里面第一个要认识的方法叫 `__init__`。注意——两边各有两个下划线，不是一边一个。读作"dunder init"，意思是双下划线 init。它是"初始化"方法，每次创建新实例的时候 Python 会自动执行它，负责把对象的初始数据设好。

来看代码：

```python
from openai import OpenAI


class AIChatManager:
    def __init__(self, api_key, system_prompt):
        self.client = OpenAI(api_key=api_key, base_url="https://api.deepseek.com")
        self.model = "deepseek-chat"
        self.history = [
            {"role": "system", "content": system_prompt}
        ]
```

`__init__` 接收两个参数——api_key 和 system_prompt。然后在方法体里面，用 `self.client = ...`、`self.model = ...`、`self.history = ...` 把值逐一存起来。这些 `self.xxx` 就是实例的属性，也就是对象内部的数据。你看——client、model、history，之前散落在各处的三个变量，现在全都被 `self` 管起来了。

创建实例非常简单，像调用函数一样：

```python
manager = AIChatManager(api_key="sk-xxx", system_prompt="你是翻译助手")
```

这一行做了两件事：第一步，创建一个 AIChatManager 实例；第二步，自动调用 `__init__` 把你传的参数塞进去初始化属性。创建完之后，manager 这个对象里面就有 client、model、history 这些数据了。你可以用 `manager.model` 直接看到模型名称，用 `manager.history` 直接看到对话历史。

你肯定注意到了——`__init__` 的第一个参数是 `self`，但创建实例的时候我们没传它。这是怎么回事？下一节解释。

### [2:15-3:45] self 是什么

**【画面】** PPT 动画：`manager.send("你好")` → Python 自动把 `manager` 作为 self 传入 → 方法内部 `self` 就等于 `manager`。然后用两行对比代码展示等价关系。旁边补充一个微信群消息截图作为类比。

**【旁白】** 很多同学卡在 self 上。我一句话讲明白——**self 就是实例自己**。

假设我们已经定义好了 `send` 方法。调用时这样写：

```python
manager = AIChatManager(api_key="sk-xxx", system_prompt="你是翻译助手")
manager.send("你好")
```

当你写 `manager.send("你好")` 的时候，Python 在背后做了一个自动操作——它把 manager 这个对象，作为 self 参数传进了 send 方法。所以下面两行代码是完全等价的：

```python
manager.send("你好")
AIChatManager.send(manager, "你好")
```

第一种写法，Python 自动帮你填了 self。第二种是手动传进去，效果一模一样，只是没人这么写，因为太啰嗦了。

理解了这一点，`self.history` 的意思就清楚了——它指的是"当前这个实例的 history"。如果有两个实例，manager1 和 manager2，它们各有各的 history。manager1 调用 send 方法时，self 就是 manager1，操作的是 manager1 的历史。manager2 调用时，self 就是 manager2，操作的是 manager2 的历史。互不干扰。

打个比方——self 就像微信群里的昵称。你在群里发消息，系统自动在消息前面带上你的名字。你不需要每次发消息都自己报一遍名字——系统帮你加。方法里的 self 就是 Python 自动帮你加的"这个实例是谁"。

最后记住一条铁规则——**类里面所有的实例方法，第一个参数必须是 self**。你不写会报错。但调用的时候不用管它，Python 自动处理。这是唯一一个"定义时有、调用时没有"的参数，刚开始会有点反直觉，写几次就习惯了。

### [3:45-5:00] 属性与方法：给类加 send 和 show_history

**【画面】** 继续在 VS Code 中敲代码。从只有 `__init__` 的类开始，逐步加 `send` 方法和 `show_history` 方法。每加一个方法，说明它用到了哪些 self 属性——用箭头标注 `self.history`、`self.client`、`self.model` 的来源。

**【旁白】** 光有 `__init__` 还不够。一个对话管理器得能发消息、能看历史，这才算一个有用的工具。我们给类加方法。

在 `__init__` 下面继续定义函数，就是方法。和普通函数唯一的区别是——第一个参数必须是 self，因为方法需要通过 self 访问对象内部的属性。

先加一个 send 方法，用来发消息给大模型：

```python
def send(self, user_input):
    self.history.append({"role": "user", "content": user_input})
    try:
        response = self.client.chat.completions.create(
            model=self.model,
            messages=self.history
        )
        reply = response.choices[0].message.content
        self.history.append({"role": "assistant", "content": reply})
        return reply
    except Exception as e:
        self.history.pop()
        return f"调用失败: {e}"
```

注意看 send 方法内部。第一行 `self.history.append`——往当前实例的历史里追加一条用户消息。然后 `self.client.chat.completions.create`——用当前实例的 client 调 API，model 用的也是 `self.model`。拿到回复后，再把 AI 的回答也追加到 `self.history` 里。你看，整个过程中用到的 history、client、model 全都来自 self，**不需要一个参数一个参数地传进来**。

这里还复用了上节课学的异常处理——如果 API 调用失败，`self.history.pop()` 把刚加进去的用户消息弹出去，保持历史记录干净整洁。

再加一个 show_history 方法，用来查看对话历史：

```python
def show_history(self):
    for msg in self.history:
        print(f"[{msg['role']}] {msg['content']}")
```

逻辑很简单——遍历 `self.history` 里的每条消息，打印角色和内容。

到这一步你应该看到了一个清晰的模式——**属性是对象存的数据，方法是对象能做的事**。属性和方法都在类内部通过 self 关联在一起，不再散落各处。这就是面向对象的核心思想：把数据和行为打包到同一个盒子里。

### [5:00-6:45] 可运行闭环：完整 AIChatManager

**【画面】** 屏幕展示完整代码。运行 `python lesson11_demo.py`，终端依次输出两轮对话的 AI 回复，以及完整的对话历史。终端滚动展示输出结果。

**【旁白】** 来看今天的完整闭环——一个能跑的 AI 对话管理器：

```python
from openai import OpenAI


class AIChatManager:
    """AI对话管理器——封装API配置和对话历史"""

    def __init__(self, api_key, system_prompt, model="deepseek-chat", base_url="https://api.deepseek.com"):
        self.client = OpenAI(api_key=api_key, base_url=base_url)
        self.model = model
        self.history = [
            {"role": "system", "content": system_prompt}
        ]

    def send(self, user_input):
        self.history.append({"role": "user", "content": user_input})
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=self.history
            )
            reply = response.choices[0].message.content
            self.history.append({"role": "assistant", "content": reply})
            return reply
        except Exception as e:
            self.history.pop()
            return f"调用失败: {e}"

    def show_history(self):
        for msg in self.history:
            print(f"[{msg['role']}] {msg['content']}")


# --- 主逻辑 ---
manager = AIChatManager(
    api_key="sk-xxx",
    system_prompt="你是一个翻译助手，把用户输入翻译成英文"
)

reply = manager.send("你好，世界")
print("AI:", reply)

reply = manager.send("今天天气真好")
print("AI:", reply)

print("\n--- 完整对话历史 ---")
manager.show_history()
```

运行一下。第一行 `manager.send("你好，世界")`——把这条用户消息存进历史，调 API，DeepSeek 返回了 `Hello, World`，这条回复也自动存进了历史。第二行 `manager.send("今天天气真好")`——同样的流程，但注意，这次 API 调用会自动带上前面的对话上下文，因为所有消息都在 `self.history` 里。这就是多轮对话的基础——对象自己记住了之前的对话。

最后 `show_history` 打印完整对话记录。你会看到 system 提示、两条用户消息、两条 AI 回复，一共五条，整整齐齐排列出来。从 system 到最后一条 AI 回复，一目了然。

从"五个变量散落各处、函数之间传来传去"，到"一个对象装下所有状态和行为"——这就是类带来的改变。数据和行为绑在一起，代码立刻清爽了。

### [6:45-7:45] 类与实例：图纸与产品

**【画面】** PPT 动画：左边一张"图纸"标注着 AIChatManager 的结构（属性+方法列表），右边两个"产品"——manager1 和 manager2，各自有不同的 system_prompt 和 history。然后切换到终端，展示 `type(client)` 返回 `<class 'openai.OpenAI'>`。

**【旁白】** 最后要区分一个关键概念——**类和实例是两回事**。

类是图纸——它定义了"有哪些属性、有哪些方法"，但本身不存具体数据。实例是按图纸造出来的具体产品——每个实例有自己的属性值。一个类可以创建无数个实例。

```python
manager1 = AIChatManager(api_key="sk-xxx", system_prompt="翻译助手")
manager2 = AIChatManager(api_key="sk-xxx", system_prompt="编程助手")
```

manager1 和 manager2 都是 AIChatManager 类的实例，都拥有 client、model、history 这三个属性和 send、show_history 这两个方法。但它们的 system_prompt 不同，对话历史也各自独立。就像用同一张图纸盖了两栋房子，外面结构一模一样，里面的装修各放各的。

其实你早就在用类了，只是不知道。还记得 L4 课写的这行代码吗？

```python
client = OpenAI(api_key="sk-xxx", base_url="https://api.deepseek.com")
```

`OpenAI` 就是一个类，`client` 就是它创建的一个实例。你一直在用的 `client.chat.completions.create()` 就是在调用实例的方法。你从第四节课就在用面向对象了，只是今天才揭开这层窗帘。

### [7:45-8:00] 小结

**【画面】** 字幕条："class 定义类 · __init__ 初始化属性 · self = 实例自己 · 属性是数据，方法是行为"

**【旁白】** 三句话记住今天的内容——class 定义类，`__init__` 初始化属性，self 指向实例自己。属性是对象存的数据，方法是对象能做的事，它们通过 self 关联在同一个盒子里。

### [8:00-8:20] 提问彩蛋 + 引出下集

**【画面】** 字幕条逐行列出三个 prompt：
1. “我在学 Python 的类和 self，请出 3 道‘看代码说运行结果’的题，重点考 self 指向谁，先等我答完再逐题讲解。”
2. “请用生活类比讲清楚类、实例、属性、方法这四个概念，再各给一个最小代码例子。”
3. “你扮演面试官，围绕 __init__ 和 self 追问我 3 个问题，我答不上来的地方请用最小例子讲透。”

**【旁白】** 今天的彩蛋——屏幕上这三个 prompt，暂停抄下来问 Kimi 或 DeepSeek。检验真懂假懂的最好办法，就是让 AI 反过来考你——别怕答错，答错的地方正是要补的洞。上节课学的函数、文件、异常、模块，再加上今天的类——你的 Python 武器库基本齐了。下集讲面向对象思维——什么时候该用类、怎么用类解决真实问题，我们会用一个同时开两个 AI 助手的实战场景来收尾整个 M2 模块。

---

## 演示操作清单

### 完整演示代码

```python
# === V020 演示完整代码 ===
from openai import OpenAI


class AIChatManager:
    """AI对话管理器——封装API配置和对话历史"""

    def __init__(self, api_key, system_prompt, model="deepseek-chat", base_url="https://api.deepseek.com"):
        self.client = OpenAI(api_key=api_key, base_url=base_url)
        self.model = model
        self.history = [
            {"role": "system", "content": system_prompt}
        ]

    def send(self, user_input):
        """发送消息并获取AI回复"""
        self.history.append({"role": "user", "content": user_input})
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=self.history
            )
            reply = response.choices[0].message.content
            self.history.append({"role": "assistant", "content": reply})
            return reply
        except Exception as e:
            # 调用失败时移除刚加的用户消息，保持历史一致性
            self.history.pop()
            return f"调用失败: {e}"

    def show_history(self):
        """打印对话历史"""
        for msg in self.history:
            print(f"[{msg['role']}] {msg['content']}")


# --- 主逻辑 ---
manager = AIChatManager(
    api_key="sk-xxx",
    system_prompt="你是一个翻译助手，把用户输入翻译成英文"
)

reply = manager.send("你好，世界")
print("AI:", reply)

reply = manager.send("今天天气真好")
print("AI:", reply)

print("\n--- 完整对话历史 ---")
manager.show_history()


# --- 验证 self 机制（演示用）---
# 下面两行等价，Python 自动把 manager 作为 self 传入
# manager.send("测试")
# AIChatManager.send(manager, "测试")

# --- 查看 OpenAI client 的类型（演示用）---
# from openai import OpenAI
# client = OpenAI(api_key="sk-xxx", base_url="https://api.deepseek.com")
# print(type(client))  # <class 'openai.OpenAI'>
```

### 运行命令

```bash
cd ~/workspace/python-course
python lesson11_demo.py
```

---

## 录制注意

1. **self 不要展开讲太深**：self 是新手最大的认知障碍，但也是最容易过度解释的概念。本片用"两行等价代码"+"微信群昵称"类比一击即破，不要引入 `__new__`、描述符协议等进阶内容。核心信息就是：self 是实例自己，Python 自动传，方法第一个参数必须是 self。
2. **__init__ 写法要强调双下划线**：新手常写成 `_init_`（单下划线），运行不会报错但初始化不执行。可以在录制时故意演示一次单下划线的效果——对象创建了但 history 是空的——然后修正。如果时长紧张可省略。
3. **字幕条重点**：核心规则出字幕条——"class 定义类 · __init__ 初始化属性 · self = 实例自己"。属性与方法的对比出一条——"属性 = 数据，方法 = 行为"。OpenAI client 类比可口头带过不出字幕。
4. **时长控制点**：类与实例（6:45-7:45）如果时间紧可压缩为 30 秒——只展示"manager1 和 manager2 各自独立"的代码和 OpenAI client 一句话类比，不展开图纸比喻。核心是 Part 2-5 的 class 语法和完整闭环。下集面向对象思维的预告改为口头一句即可。
5. **提问彩蛋后期**：提问彩蛋段的 prompt 字幕条需在后期加上，确保观众能暂停照抄。
