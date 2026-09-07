# V018 try/except 异常处理实战

## 视频信息

| 项目 | 内容 |
|---|---|
| 编号 | V018 |
| 标题 | try/except 异常处理实战 |
| 目标时长 | 8 min |
| 对应课次 | L10 文件 IO、异常处理与模块 |
| 前置微课 | V017 文件读写与 with 语句 |
| 一句话定位 | try/except 让程序在出错时优雅降级，不再一崩到底 |

---

## 逐字稿

### [0:00-0:35] 开场 hook（痛点共鸣 + 翻车现场）

**【画面】** 终端中运行一段代码——读取不存在的文件，Python 抛出一大段红色报错堆栈，程序直接退出。画面定格在红色的 `FileNotFoundError` 上。字幕条："你的程序，一崩到底？"

**【旁白】** 你写了个程序，第一次运行——"啪"，一堆红色报错，程序直接崩了。为什么？因为你要读的文件还不存在。

用户看到红色报错的第一反应是什么？"坏了，这软件有问题"，然后卸载。但如果我们能让程序在出错时给个友好提示而不是直接崩呢？这就需要异常处理。今天教你 try/except——让程序在出错时优雅地降级。

### [0:35-2:00] try/except 基本语法

**【画面】** VS Code 中对比展示"没有异常处理"和"有异常处理"的代码。

**【旁白】** 先看没有异常处理的情况：

```python
with open("chat_history.json", "r") as f:
    history = json.load(f)
```

如果 `chat_history.json` 不存在，程序直接崩，抛出 `FileNotFoundError`。

加上异常处理：

```python
import json

try:
    with open("chat_history.json", "r") as f:
        history = json.load(f)
except FileNotFoundError:
    print("第一次使用，创建空对话历史")
    history = []
```

结构很直白——`try` 里放可能出错的代码，`except` 后面跟异常类型，冒号下面写"出了这个错怎么办"。

现在文件不存在时，程序不会崩了——它打印一句提示，然后给 history 一个空列表，继续往下走。这就是"优雅降级"。

### [2:00-3:15] 多个 except + 精准捕获

**【画面】** 继续敲入多 except 代码。

**【旁白】** 现实中可能出错的场景不止一个。文件不存在是一种错，文件存在但内容损坏又是另一种。你可以写多个 except：

```python
try:
    with open("chat_history.json", "r") as f:
        history = json.load(f)
except FileNotFoundError:
    print("提示：未找到历史文件，从空白对话开始")
    history = []
except json.JSONDecodeError:
    print("警告：历史文件格式错误，已重置")
    history = []
```

`FileNotFoundError` 管文件不存在，`json.JSONDecodeError` 管 JSON 格式错误。各管各的，精准处理。

这里有一个原则——**先写具体的异常，最后才考虑通用的**。就像看病：先对症下药，万不得已才吃止痛片。

```python
# 不推荐——太宽泛，什么错都吞
except Exception as e:
    print(f"出错了: {e}")

# 推荐——针对具体异常处理
except FileNotFoundError:
    ...
except json.JSONDecodeError:
    ...
```

`except Exception` 会把所有异常都捕获，包括你没预料到的。问题是——真正的 bug 可能被悄悄吞掉了，你都不知道程序哪里出了问题。

### [3:15-4:30] 读懂报错信息

**【画面】** PPT 展示一段完整的 Python 报错堆栈，用红框标出最后一行。

**【旁白】** 很多人看到一大段报错就慌了。其实你只需要看**最后一行**——它告诉你出了什么错：

```
Traceback (most recent call last):
  File "demo.py", line 3, in <module>
    with open("chat.json", "r") as f:
FileNotFoundError: [Errno 2] No such file or directory: 'chat.json'
```

从下往上看——最后一行 `FileNotFoundError` 告诉你什么错。往上翻 `File "demo.py", line 3` 告诉你哪里出的错。中间那些是调用链，初学阶段不用管。

几个常见异常记住名字就够：

`FileNotFoundError` ——文件不存在。

`JSONDecodeError` ——JSON 格式错误。

`KeyError` ——字典里没这个 key。

`TypeError` ——类型不对，比如拿字符串和数字相加。

`ValueError` ——值不对，比如 `int("abc")`。

### [4:30-6:15] 可运行闭环：健壮的对话管理

**【画面】** 完整代码出现在屏幕上。演示三步：文件不存在时优雅降级 → 正常读写 → API 调用失败时给出友好提示。

**【旁白】** 来做今天的完整闭环——一个健壮的对话管理系统，能处理文件不存在、格式错误、API 调用失败三种情况：

```python
import json


def load_history(filename="chat_history.json"):
    """加载对话历史，出错时返回空列表"""
    try:
        with open(filename, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        print("提示：未找到历史文件，从空白对话开始")
        return []
    except json.JSONDecodeError:
        print("警告：历史文件格式错误，已重置")
        return []


def save_history(history, filename="chat_history.json"):
    """保存对话历史"""
    try:
        with open(filename, "w") as f:
            json.dump(history, f, ensure_ascii=False, indent=2)
    except OSError as e:
        print(f"警告：保存失败 - {e}")


def chat(user_input, history):
    """调用 API 对话"""
    messages = list(history)
    messages.append({"role": "user", "content": user_input})

    # 模拟 API 调用（真实场景替换为 client.chat.completions.create）
    try:
        # 模拟可能失败的调用
        if "error" in user_input:
            raise ConnectionError("模拟网络错误")
        reply = f"收到：{user_input}"
        history.append({"role": "user", "content": user_input})
        history.append({"role": "assistant", "content": reply})
        return reply
    except ConnectionError as e:
        return f"网络错误，请稍后重试：{e}"


# --- 主逻辑 ---
history = load_history()
print(f"当前历史：{len(history)} 条消息")

reply = chat("翻译：Good morning", history)
print("AI回复：", reply)

reply = chat("error test", history)  # 触发模拟错误
print("AI回复：", reply)

save_history(history)
print(f"已保存，当前历史：{len(history)} 条消息")
```

运行——第一次调用成功，第二次因为输入含 "error" 触发了模拟的网络错误，但程序没崩，给出了友好提示。对话历史正常保存。从"能跑但脆弱"到"能跑且健壮"，这就是异常处理的价值。

### [6:15-7:50] 小结

**【画面】** 字幕条："try 放可能出错的 · except 精准捕获 · 先具体后通用 · 看报错只看最后一行"

**【旁白】** 记住四件事：try 里放可能出错的代码，except 精准捕获具体异常，先写具体的再写通用的，看报错信息从最后一行开始看。异常处理不是消灭错误——而是让程序在出错时优雅地告诉用户"出什么事了"，而不是直接崩溃。

### [7:50-8:10] 提问彩蛋 + 引出下集

**【画面】** 字幕条逐行列出三个 prompt：
1. “我在学 Python 的 try/except，请给我 5 段会抛出不同异常的代码，让我判断会报什么错，先别给答案。”
2. “请对比讲解 except Exception 和捕获具体异常的区别，并举一个‘bug 被悄悄吞掉’的真实例子。”
3. “你扮演面试官，围绕 Python 异常处理追问我 3 个问题，比如什么时候该用 try、什么时候反而多余。”

**【旁白】** 今天的彩蛋——屏幕上这三个 prompt，暂停抄下来直接问。让 AI 当你的排错教练：先听它讲清楚“为什么会报这个错”，再看怎么改，下次遇到你才不用求人。下集讲 import 和模块——你的代码越来越多了，全堆在一个文件里越来越乱。怎么拆成多个文件互相调用？import 机制帮你搞定。

---

## 演示操作清单

### 完整演示代码

```python
# === V018 演示完整代码 ===
import json


# --- Part 1: 无异常处理（翻车演示）---
# 取消下面注释可演示翻车效果
# with open("nonexistent.json", "r") as f:
#     data = json.load(f)


# --- Part 2: 基本异常处理 ---
def load_history(filename="chat_history.json"):
    """加载对话历史，出错时返回空列表"""
    try:
        with open(filename, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        print("提示：未找到历史文件，从空白对话开始")
        return []
    except json.JSONDecodeError:
        print("警告：历史文件格式错误，已重置")
        return []


def save_history(history, filename="chat_history.json"):
    """保存对话历史"""
    try:
        with open(filename, "w") as f:
            json.dump(history, f, ensure_ascii=False, indent=2)
    except OSError as e:
        print(f"警告：保存失败 - {e}")


def chat(user_input, history):
    """调用 API 对话（模拟）"""
    messages = list(history)
    messages.append({"role": "user", "content": user_input})

    try:
        # 模拟可能失败的 API 调用
        if "error" in user_input:
            raise ConnectionError("模拟网络错误")
        reply = f"收到：{user_input}"
        history.append({"role": "user", "content": user_input})
        history.append({"role": "assistant", "content": reply})
        return reply
    except ConnectionError as e:
        return f"网络错误，请稍后重试：{e}"


# --- Part 3: 完整闭环演示 ---
history = load_history()
print(f"当前历史：{len(history)} 条消息")

reply = chat("翻译：Good morning", history)
print("AI回复：", reply)

reply = chat("error test", history)  # 触发模拟错误
print("AI回复：", reply)

save_history(history)
print(f"已保存，当前历史：{len(history)} 条消息")


# --- Part 4: 常见异常速览（演示用）---
# FileNotFoundError: open("不存在.txt", "r")
# KeyError: {"a": 1}["b"]
# TypeError: "hello" + 42
# ValueError: int("abc")
```

### 运行命令

```bash
cd ~/workspace/python-course
python v018_demo.py

# 如果要演示翻车效果，取消 Part 1 的注释后运行
# python -c "import json; json.load(open('nonexistent.json'))"
```

---

## 录制注意

1. **开场翻车要真实**：第一帧的红色报错堆栈要真实运行出来——不要用图片，直接在终端跑 `python -c "open('xxx.json')"` 让真实的 `FileNotFoundError` 出现。观众看到红色报错的第一反应就是"我也遇到过"，立刻有共鸣。
2. **模拟 API 错误的方式**：Part 3 的闭环里用 `if "error" in user_input: raise ConnectionError(...)` 来模拟网络错误。录制时一定要解释清楚"这是模拟的，真实场景是 API 调用时网络断了会自动抛异常"——不要让观众以为真实代码需要手动 raise。
3. **字幕条重点**：异常处理原则出字幕条——"先具体 except，后通用 except · except Exception 是最后手段"。报错阅读出一条——"看报错从最后一行开始读"。
4. **时长控制点**：Part 4（常见异常速览）如果时间紧可压缩为口头带过，不出代码。核心是 Part 1-3 的 try/except 结构和完整闭环。报错信息阅读（3:15-4:30）如果讲慢了，Part 4 可完全砍掉。
5. **提问彩蛋后期**：提问彩蛋段的 prompt 字幕条需在后期加上，确保观众能暂停照抄。
