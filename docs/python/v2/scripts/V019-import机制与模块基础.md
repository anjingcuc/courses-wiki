# V019 import 机制与模块基础

## 视频信息

| 项目 | 内容 |
|---|---|
| 编号 | V019 |
| 标题 | import 机制与模块基础 |
| 目标时长 | 7 min |
| 对应课次 | L10 文件 IO、异常处理与模块 |
| 前置微课 | V017 文件读写与 with 语句、V018 try/except 异常处理实战 |
| 一句话定位 | 模块就是 .py 文件、包就是文件夹，import 让你跨文件复用代码 |

---

## 逐字稿

### [0:00-0:30] 开场 hook（痛点共鸣）

**【画面】** 屏幕上展示一个 300 行的单文件 Python 脚本，滚动了很久没到底。然后画面一转，同样的项目被拆成 3 个文件，每个文件 80 行。字幕条："一个文件 300 行 vs 三个文件各 80 行"。

**【旁白】** 当你的代码从几十行涨到几百行，全堆在一个文件里——找一个函数要翻半天，改一处怕影响别的地方。解法很简单：拆成多个文件。Python 里跨文件使用代码靠一个关键词——`import`。今天五分钟搞懂模块和 import，让你的代码从"一团乱麻"变成"井井有条"。

### [0:30-2:00] import 基础：模块 = .py 文件

**【画面】** VS Code 中展示两个文件——`chat_utils.py` 和 `main.py`，并排显示。在 main.py 中敲入 import 语句。

**【旁白】** Python 里有一个最简单的规则——**一个 .py 文件就是一个模块**。

你看，我们之前写了一个 `chat_utils.py`，里面有几个函数：

```python
# chat_utils.py
import json


def load_history(filename="chat_history.json"):
    """加载对话历史"""
    try:
        with open(filename, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return []


def save_history(history, filename="chat_history.json"):
    """保存对话历史"""
    with open(filename, "w") as f:
        json.dump(history, f, ensure_ascii=False, indent=2)


def build_messages(system_prompt, user_input):
    """构建消息列表"""
    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_input}
    ]
```

现在我在**同一目录下**新建一个 `main.py`，用 import 就能用这些函数：

```python
# main.py
from chat_utils import load_history, save_history, build_messages

history = load_history()
print(f"加载了 {len(history)} 条历史消息")

save_history(history)
print("已保存")
```

`from chat_utils import load_history` 意思是——从 chat_utils 这个模块里，引入 load_history 这个函数。引入后就像自己写的一样，直接调用。

注意——import 的时候**不写 .py 后缀**。是 `import chat_utils`，不是 `import chat_utils.py`。

### [2:00-3:00] 两种 import 写法

**【画面】** 对比展示两种 import 写法。

**【旁白】** import 有两种写法，你都会遇到。

第一种——导入整个模块，用的时候带模块名前缀：

```python
import chat_utils

history = chat_utils.load_history()
chat_utils.save_history(history)
```

每次调用要写 `chat_utils.` 前缀。好处是一眼看出函数来自哪个模块。缺点是名字长。

第二种——从模块里导入特定函数，用的时候直接写函数名：

```python
from chat_utils import load_history, save_history

history = load_history()
save_history(history)
```

不用写前缀，更简洁。日常开发中这种方式最常用。

两种没有对错——看场景。模块名短就用第一种，函数名多需要精简就用第二种。

### [3:00-4:00] 标准库 import

**【画面】** 展示几个常用的标准库 import 示例。

**【旁白】** 你其实早就在用 import 了——`import json` 就是导入 Python 自带的 json 模块。Python 有大量自带的标准库，常用的有：

```python
import json       # JSON 读写
import os         # 操作系统功能（文件路径、环境变量）
import random     # 随机数
import time       # 时间相关（sleep、计时）
import datetime   # 日期时间处理
```

这些是 Python 自带的，不需要安装，import 就能用。比如生成一个随机数：

```python
import random
print(random.randint(1, 100))  # 1-100 之间的随机整数
```

或者暂停程序 2 秒：

```python
import time
print("开始等待...")
time.sleep(2)
print("2秒过去了")
```

之前学过的 `import json` 就是标准库的一员——你现在知道它的原理了：json 是 Python 自带的一个模块文件，import 进来就能用 `json.dump()` 和 `json.load()`。

### [4:00-5:15] 包：文件夹组织模块

**【画面】** PPT 动画展示目录结构——一个文件夹里包含多个 .py 文件，文件夹名就是包名。

**【旁白】** 当你的模块越来越多——chat_utils、api_client、file_handler、data_processor——全堆在一个目录下也不行。这时候需要"包"。

**包就是文件夹**——Python 里一个文件夹只要包含一个 `__init__.py` 文件（可以是空文件），它就是一个包。

目录结构长这样：

```
my_project/
├── main.py
├── utils/
│   ├── __init__.py
│   ├── chat_utils.py
│   └── file_utils.py
└── api/
    ├── __init__.py
    └── client.py
```

从包里导入：

```python
# 从 utils 包的 chat_utils 模块导入
from utils.chat_utils import load_history, save_history

# 从 api 包的 client 模块导入
from api.client import call_api
```

点号表示层级——`utils.chat_utils` 就是 utils 文件夹下的 chat_utils.py 文件。

初学阶段你暂时不需要建包——一个目录下放几个 .py 文件用 import 就够了。等你做期末项目、代码超过 500 行时，再用包来组织。

### [5:15-6:30] 可运行闭环：多文件项目

**【画面】** VS Code 中展示完整的多文件项目结构。先运行 `chat_utils.py`（独立测试），再运行 `main.py`（调用模块）。

**【旁白】** 最后看一个完整的可运行闭环——两个文件组成的最小项目：

**文件 1：chat_utils.py**（工具模块）

```python
import json


def load_history(filename="chat_history.json"):
    """加载对话历史"""
    try:
        with open(filename, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return []


def save_history(history, filename="chat_history.json"):
    """保存对话历史"""
    with open(filename, "w") as f:
        json.dump(history, f, ensure_ascii=False, indent=2)


def build_messages(system_prompt, user_input):
    """构建消息列表"""
    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_input}
    ]
```

**文件 2：main.py**（主程序）

```python
from chat_utils import load_history, save_history, build_messages

# 构建新对话
messages = build_messages("你是翻译助手", "翻译：Hello World")

# 初始化历史
history = load_history()
history.extend(messages)

# 保存
save_history(history)
print(f"已保存 {len(history)} 条消息")

# 读回来验证
restored = load_history()
print(f"验证：恢复了 {len(restored)} 条消息")
for msg in restored:
    print(f"  [{msg['role']}] {msg['content']}")
```

运行 `python main.py`——构建消息、存到文件、读回来验证，全程通过。两个文件各司其职——chat_utils 管工具函数，main 管业务逻辑。以后要改工具函数，只动 chat_utils；要改业务逻辑，只动 main。这就是模块化的价值。

### [6:30-7:00] 小结

**【画面】** 字幕条："模块 = .py 文件 · 包 = 文件夹 · import 不写 .py · from 模块 import 函数"

**【旁白】** 三句话记住：模块就是一个 .py 文件，包就是一个文件夹，import 让你跨文件复用代码。

### [7:00-7:20] 提问彩蛋 + 引出下集

**【画面】** 字幕条逐行列出三个 prompt：
1. “我在学 Python 的 import 机制，请出 3 道判断题考我，比如 import 时写不写 .py 后缀、import 模块和 from 模块 import 函数的区别，并解释我答错的题。”
2. “请用生活中的类比讲清楚模块、包、库这三个概念的区别。”
3. “我写 import 时报 ModuleNotFoundError，请列出最常见的 3 个原因和对应的排查步骤。”

**【旁白】** 今天的彩蛋——屏幕上这三个 prompt，暂停抄下来去问 AI。记住：AI 是教练不是代写——概念让它考你、错题让它讲透，比让它替你写代码有用得多。下集我们进入面向对象——用类把相关的数据和函数打包到一起。你会发现，类就是把"相关的状态和行为"组织成一个整体的最佳工具。

---

## 演示操作清单

### 文件结构

```
v019_demo/
├── chat_utils.py
└── main.py
```

### 文件 1：chat_utils.py

```python
import json


def load_history(filename="chat_history.json"):
    """加载对话历史"""
    try:
        with open(filename, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return []


def save_history(history, filename="chat_history.json"):
    """保存对话历史"""
    with open(filename, "w") as f:
        json.dump(history, f, ensure_ascii=False, indent=2)


def build_messages(system_prompt, user_input):
    """构建消息列表"""
    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_input}
    ]
```

### 文件 2：main.py

```python
from chat_utils import load_history, save_history, build_messages

# 构建新对话
messages = build_messages("你是翻译助手", "翻译：Hello World")

# 初始化历史
history = load_history()
history.extend(messages)

# 保存
save_history(history)
print(f"已保存 {len(history)} 条消息")

# 读回来验证
restored = load_history()
print(f"验证：恢复了 {len(restored)} 条消息")
for msg in restored:
    print(f"  [{msg['role']}] {msg['content']}")
```

### 标准库速览（演示用）

```python
import random
print(random.randint(1, 100))

import time
print("开始等待...")
time.sleep(1)
print("1秒过去了")
```

### 运行命令

```bash
cd ~/workspace/python-course/v019_demo

# 先确认两个文件在同一目录
ls

# 运行主程序
python main.py

# 查看生成的文件
cat chat_history.json
```

---

## 录制注意

1. **两个文件必须在同一目录**：这是 import 能工作的前提。录制前先在终端 `ls` 展示两个文件在同一目录下，让观众看到文件结构再运行。如果文件不在同一目录，import 会报 `ModuleNotFoundError`。
2. **import 不写 .py**：这是新手高频错误。可以在演示时故意写 `from chat_utils.py import load_history`，展示 `ModuleNotFoundError` 报错，然后修正为不带 .py 的写法。如果时长紧张可省略。
3. **字幕条重点**：核心规则出字幕条——"模块 = .py 文件 · 包 = 文件夹 · import 不写后缀 · from 模块 import 函数"。包的概念可以出一条——"包 = 文件夹 + `__init__.py`"。
4. **时长控制点**：包（Part 4，4:00-5:15）如果时间紧可以压缩为 30 秒——只展示目录结构图和一行 `from utils.chat_utils import ...`，不展开讲 `__init__.py`。核心是 Part 1-3 的模块和 import 基础。下集面向对象的预告改为口头一句话即可。
5. **提问彩蛋后期**：提问彩蛋段的 prompt 字幕条需在后期加上，确保观众能暂停照抄。
