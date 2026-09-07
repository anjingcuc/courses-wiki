# V017 文件读写与 with 语句

## 视频信息

| 项目 | 内容 |
|---|---|
| 编号 | V017 |
| 标题 | 文件读写与 with 语句 |
| 目标时长 | 7 min |
| 对应课次 | L10 文件 IO、异常处理与模块 |
| 前置微课 | V015 函数定义与参数设计、V016 *args/**kwargs 与 lambda |
| 一句话定位 | 用 with open 读写文本和 JSON 文件，让 API 对话数据"关机不丢" |

---

## 逐字稿

### [0:00-0:35] 开场 hook（痛点共鸣）

**【画面】** 屏幕上运行一个对话程序——AI 回复了好几轮。然后程序关闭/重启，之前的数据全没了。字幕条："程序一关，数据全没了"。

**【旁白】** 你写了个 AI 对话程序，聊了十几轮，体验很好。然后你关了程序想明天继续——打开发现对话历史全没了。为什么？因为数据只存在内存里，程序一关内存就清空了。

解决方法很简单——把数据写到文件里。今天教你 Python 文件读写，核心就一个关键词：`with open`。学完你的对话数据就能存成文件，下次读回来继续聊。

### [0:35-2:00] with open 基本语法

**【画面】** VS Code 中敲入文件写入代码，运行后在终端用 `cat` 展示文件内容。

**【旁白】** 先看写文件。Python 里写文件最标准的写法：

```python
with open("note.txt", "w") as f:
    f.write("Hello, Python!")
```

拆开看——`open("note.txt", "w")` 打开一个叫 note.txt 的文件，`"w"` 是写入模式。`as f` 把文件对象赋值给变量 f。`f.write()` 就是往里写内容。

为什么用 `with`？因为 `with` 会在代码块结束后**自动关闭文件**。你不用手动写 `f.close()`。如果你忘了 close，文件可能写不进去或者被锁住。`with` 就是"自动门——走进去自动开，走出来自动关"。

文件模式记住三个：

`"w"` ——写入。如果文件已存在会**覆盖**。

`"a"` ——追加。在文件末尾加内容，不会覆盖。

`"r"` ——只读。读文件用的。

来看读文件：

```python
with open("note.txt", "r") as f:
    content = f.read()

print(content)  # Hello, Python!
```

就这么简单——write 写，read 读，with 自动关。

### [2:00-3:30] JSON 文件读写

**【画面】** 敲入 JSON 读写代码。运行后用 `cat` 展示生成的 JSON 文件格式。

**【旁白】** 文本读写会了，但我们的对话数据是列表和字典——不是简单的字符串。怎么存？用 JSON。

JSON 是一种通用的数据格式，Python 里用 `json` 模块就能把列表/字典和文件互相转换。

**写入 JSON**：

```python
import json

messages = [
    {"role": "system", "content": "你是翻译助手"},
    {"role": "user", "content": "Hello World"},
    {"role": "assistant", "content": "你好，世界"}
]

with open("chat_history.json", "w") as f:
    json.dump(messages, f, ensure_ascii=False, indent=2)

print("对话已保存")
```

`json.dump()` 把 Python 对象（列表/字典）写到文件里。两个参数要注意——`ensure_ascii=False` 让中文直接存中文而不是转义编码，`indent=2` 让输出带缩进好看。

看生成的文件——`cat chat_history.json`：

```json
[
  {
    "role": "system",
    "content": "你是翻译助手"
  },
  ...
]
```

漂亮，格式化好的 JSON。

**读取 JSON**：

```python
with open("chat_history.json", "r") as f:
    loaded = json.load(f)

print(f"恢复了 {len(loaded)} 条消息")
for msg in loaded:
    print(f"  [{msg['role']}] {msg['content']}")
```

`json.load()` 把 JSON 文件读回来变成 Python 的列表/字典。运行——恢复了 3 条消息，内容完整。

### [3:30-5:00] 可运行闭环：对话持久化

**【画面】** 完整的对话存取代码出现在屏幕上。运行后展示写入→读取→追加→再读取的完整流程。

**【旁白】** 来做一段完整闭环——模拟 AI 对话的存储和恢复：

```python
import json

# --- 第一次运行：创建对话历史 ---
history = [
    {"role": "system", "content": "你是一个简洁的助手"},
    {"role": "user", "content": "什么是Python？"},
    {"role": "assistant", "content": "Python是一种编程语言"},
]

with open("chat_history.json", "w") as f:
    json.dump(history, f, ensure_ascii=False, indent=2)

print("第1次：保存了对话历史")
```

现在模拟第二次运行——读回来，加上新的一轮对话：

```python
# --- 第二次运行：读取并追加 ---
with open("chat_history.json", "r") as f:
    history = json.load(f)

print(f"第2次：恢复了 {len(history)} 条消息")

# 新增一轮对话
history.append({"role": "user", "content": "它适合初学者吗？"})
history.append({"role": "assistant", "content": "非常适合初学者"})

# 保存回去
with open("chat_history.json", "w") as f:
    json.dump(history, f, ensure_ascii=False, indent=2)

print(f"第2次：追加后共 {len(history)} 条消息")
```

运行——第一次保存 3 条，第二次恢复 3 条并追加到 5 条。关机再开机，对话历史还在。这就是持久化的威力。

### [5:00-6:00] 配置文件：代码与数据分离

**【画面】** 展示一个 config.json 文件，然后展示从配置文件读取值的 Python 代码。

**【旁白】** JSON 文件在 AI 开发里还有一个重要用途——**配置文件**。你之前把 API Key、模型名、系统提示词都硬编码在代码里，改一个配置就要改代码。更合理的做法是放到 JSON 文件里：

```json
{
    "api_key": "sk-xxx",
    "model": "deepseek-chat",
    "system_prompt": "你是一个翻译助手",
    "max_tokens": 1000
}
```

读取：

```python
import json

with open("config.json", "r") as f:
    config = json.load(f)

print(config["model"])           # deepseek-chat
print(config["system_prompt"])   # 你是一个翻译助手
```

改配置改 JSON 文件就行，不用动 Python 代码。这在真实项目里是标配——**配置与代码分离**。

### [6:00-6:45] 小结

**【画面】** 字幕条："with open → 自动关闭 · json.dump/load → 存取列表字典 · 配置文件 → 代码与数据分离"

**【旁白】** 记住：with open 自动关闭文件，json.dump 写、json.load 读，配置文件让代码和数据分离。

### [6:45-7:05] 提问彩蛋 + 引出下集

**【画面】** 字幕条逐行列出三个 prompt：
1. “我在学 Python 文件读写，请出 3 道关于 with open 和 json.dump/json.load 的变式练习题，先让我自己写，再对照你的答案讲评。”
2. “请讲清楚 open 的 "r"、"w"、"a" 三种模式的区别，各举一个新手会踩坑的例子。”
3. “为什么写文件推荐用 with 而不是手动 close？如果忘了 close 会发生什么后果？”

**【旁白】** 今天的彩蛋——屏幕上这三个 prompt，暂停抄下来去问 AI。问 AI 有个讲究：别要答案，要它出题、要它挑你的错，这样练一遍顶你自己看三遍。但有个问题——如果文件不存在你直接读，程序直接崩了。怎么办？下集讲异常处理，让程序在出错时优雅地处理而不是直接崩溃。

---

## 演示操作清单

### 完整演示代码

```python
# === V017 演示完整代码 ===
import json

# --- Part 1: 文本读写 ---
with open("note.txt", "w") as f:
    f.write("Hello, Python!")

with open("note.txt", "r") as f:
    content = f.read()
print("文本内容:", content)

# --- Part 2: JSON 写入 ---
messages = [
    {"role": "system", "content": "你是翻译助手"},
    {"role": "user", "content": "Hello World"},
    {"role": "assistant", "content": "你好，世界"}
]

with open("chat_history.json", "w") as f:
    json.dump(messages, f, ensure_ascii=False, indent=2)

print("对话已保存到 chat_history.json")

# --- Part 3: JSON 读取 ---
with open("chat_history.json", "r") as f:
    loaded = json.load(f)

print(f"恢复了 {len(loaded)} 条消息")
for msg in loaded:
    print(f"  [{msg['role']}] {msg['content']}")

# --- Part 4: 对话持久化闭环 ---
# 第一次运行：创建
history = [
    {"role": "system", "content": "你是一个简洁的助手"},
    {"role": "user", "content": "什么是Python？"},
    {"role": "assistant", "content": "Python是一种编程语言"},
]
with open("chat_history.json", "w") as f:
    json.dump(history, f, ensure_ascii=False, indent=2)
print(f"第1次：保存了 {len(history)} 条消息")

# 第二次运行：读取并追加
with open("chat_history.json", "r") as f:
    history = json.load(f)
print(f"第2次：恢复了 {len(history)} 条消息")

history.append({"role": "user", "content": "它适合初学者吗？"})
history.append({"role": "assistant", "content": "非常适合初学者"})

with open("chat_history.json", "w") as f:
    json.dump(history, f, ensure_ascii=False, indent=2)
print(f"第2次：追加后共 {len(history)} 条消息")

# --- Part 5: 配置文件 ---
config = {
    "api_key": "sk-xxx",
    "model": "deepseek-chat",
    "system_prompt": "你是一个翻译助手",
    "max_tokens": 1000
}

with open("config.json", "w") as f:
    json.dump(config, f, ensure_ascii=False, indent=2)

with open("config.json", "r") as f:
    loaded_config = json.load(f)

print(f"模型: {loaded_config['model']}")
print(f"提示词: {loaded_config['system_prompt']}")
```

### 运行命令

```bash
cd ~/workspace/python-course
python v017_demo.py

# 验证生成的文件
cat chat_history.json
cat config.json
```

---

## 录制注意

1. **`ensure_ascii=False` 容易忘**：这是中文场景的必备参数。如果忘了加，JSON 文件里中文会变成 `\u4f60\u597d` 这种编码。录制时可以故意先不加，展示"乱码"效果，再补上参数重新运行——这个翻车点很直观。
2. **`cat` 展示文件内容**：Part 2 写完 JSON 后，切到终端用 `cat chat_history.json` 展示文件内容，让观众看到格式化好的 JSON 结构。这是成果前置的体现——先让观众看到"存下来的文件长什么样"。
3. **字幕条重点**：三种文件模式出字幕条——"`'w'` 写入(覆盖) · `'a'` 追加 · `'r'` 只读"。以及"`with` = 自动关闭文件"。
4. **时长控制点**：Part 5（配置文件）如果超时可砍。核心是 Part 1-4，配置文件概念在旁白中提一句即可。但配置文件是 AI 开发的实际最佳实践，条件允许时保留。
5. **提问彩蛋后期**：提问彩蛋段的 prompt 字幕条需在后期加上，确保观众能暂停照抄。
