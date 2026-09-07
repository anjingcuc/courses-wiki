# V016 *args/**kwargs 与 lambda

## 视频信息

| 项目 | 内容 |
|---|---|
| 编号 | V016 |
| 标题 | *args/**kwargs 与 lambda |
| 目标时长 | 7 min |
| 对应课次 | L9 函数设计 |
| 前置微课 | V015 函数定义与参数设计 |
| 一句话定位 | 读懂 AI 代码里到处出现的 `*args`、`**kwargs` 和 lambda，不求会写但求秒懂 |

---

## 逐字稿

### [0:00-0:30] 开场 hook（成果前置）

**【画面】** 屏幕上展示 openai SDK 官方文档的 `create()` 方法签名——满屏的 `**kwargs`、`*args`、`lambda`。然后画面拉近，红框圈出这些符号。字幕条："AI 生成的代码里全是这玩意，你看得懂吗？"

**【旁白】** 你让 AI 帮你写一个 API 调用函数，它给你返回的代码里长这样——`def call_api(system_prompt, user_input, **kwargs):`。这个 `**kwargs` 是什么？还有排序时用的 `lambda`，又是什么？

今天的目标不是让你会写这些东西——而是**看得懂**。因为 openai SDK 的源码里全是它们，AI 生成的代码里也全是它们。看不懂，你连 AI 给你写的代码都读不了。

### [0:30-2:00] *args：收集位置参数

**【画面】** VS Code 中敲入 `*args` 演示代码。

**【旁白】** 先看 `*args`。一个星号，跟一个变量名 args（名字随便取，但约定俗成写 args）。

它的作用是——**把传进来的多个位置参数打包成一个元组**：

```python
def show_args(*args):
    print("收到:", args)
    print("类型:", type(args))

show_args("hello", 42, True)
```

运行——`收到: ('hello', 42, True)`，`类型: <class 'tuple'>`。

你看，你传了三个参数进去，函数里面它们被打包成了一个元组。为什么是元组？因为元组不可变，安全。

什么时候会遇到？比如你写一个函数，不确定调用方会传几个参数——

```python
def calculate_total(*prices):
    return sum(prices)

print(calculate_total(45, 120, 80, 300))  # 545
print(calculate_total(45, 120))            # 165
```

传几个都行，`*prices` 全收下。这在实际开发中，更多是你**读别人的代码时看到**，自己写用到的场景不多。

### [2:00-3:30] **kwargs：收集关键字参数

**【画面】** 继续敲入 `**kwargs` 演示代码。

**【旁白】** 两个星号 `**kwargs`——把传进来的关键字参数打包成一个**字典**：

```python
def show_kwargs(**kwargs):
    print("收到:", kwargs)
    print("类型:", type(kwargs))

show_kwargs(model="deepseek-chat", temperature=0.7)
```

运行——`收到: {'model': 'deepseek-chat', 'temperature': 0.7}`，`类型: <class 'dict'>`。

关键区别记住——`*args` 打包成元组（位置参数），`**kwargs` 打包成字典（关键字参数）。

现在看它在 AI 开发中最经典的用法——API 封装函数：

```python
def call_llm(system_prompt, user_input, **kwargs):
    """调用大模型 API，kwargs 里的参数控制模型行为"""
    model = kwargs.get("model", "deepseek-chat")
    temperature = kwargs.get("temperature", 0.7)
    max_tokens = kwargs.get("max_tokens", 1000)

    print(f"模型: {model}, 温度: {temperature}, 最大token: {max_tokens}")
    # 实际调用省略，这里展示参数处理逻辑
    return f"[{model}] 处理完毕"

# 基本调用——不传额外参数，全用默认值
print(call_llm("你是助手", "你好"))

# 灵活调用——想改什么就传什么
print(call_llm("你是助手", "你好", model="deepseek-reasoner", temperature=0.3))
```

看到了吗？`**kwargs` 让你的函数变得特别灵活——调用时想传 model 就传，想传 temperature 就传，不传就用默认值。openai SDK 的 `create()` 方法就是这么设计的。

`.get("model", "deepseek-chat")` 这个写法要记住——有 model 这个 key 就用它，没有就用 "deepseek-chat" 做默认。

### [3:30-5:00] lambda：一行函数

**【画面】** PPT 对比——左边是正常的 def 函数（4 行），右边是等价的 lambda（1 行），用等号连接。

**【旁白】** 接下来看 lambda。它就是一个"匿名函数"——不需要 def，一行搞定。

对比看就清楚了：

```python
# 正常函数
def square(x):
    return x * x

# 等价的 lambda
square_lambda = lambda x: x * x

print(square(5))         # 25
print(square_lambda(5))  # 25
```

完全一样的效果。lambda 的语法是——`lambda 参数: 返回值`，没有 return 关键字，冒号后面的表达式就是返回值。

那你可能会问——既然 def 能做一样的事，为什么还要 lambda？

因为 lambda 最常用的场景是**配合排序**——当你需要告诉 sort "按什么规则排"时，lambda 最方便：

```python
messages = [
    {"role": "user", "content": "你好"},
    {"role": "system", "content": "你是助手"},
    {"role": "user", "content": "天气怎样"},
]

# 按 role 字母顺序排序
messages.sort(key=lambda m: m["role"])
print(messages)
# system 排前面（s < u）
```

`key=lambda m: m["role"]` 意思是——排序时，拿每个元素的 `"role"` 字段的值做比较。如果不用 lambda，你得单独定义一个函数，多好几行代码。

再来一个 API 场景——按 token 消耗从高到低排序日志：

```python
call_logs = [
    {"model": "deepseek-chat", "total_tokens": 45},
    {"model": "deepseek-reasoner", "total_tokens": 320},
    {"model": "deepseek-chat", "total_tokens": 120},
]

call_logs.sort(key=lambda log: log["total_tokens"], reverse=True)
for log in call_logs:
    print(f"{log['model']}: {log['total_tokens']}")
```

运行——320、120、45，从高到低排好了。`reverse=True` 就是降序。

### [5:00-6:15] 综合实战：读懂 AI 生成的封装函数

**【画面】** 屏幕上展示一段"看起来很高级"的 AI 生成代码，逐行标注讲解。

**【旁白】** 最后做一个综合训练——读懂这段 AI 生成的 API 封装函数：

```python
def smart_chat(system_prompt, *user_inputs, **options):
    """智能对话函数

    支持多条用户输入，支持灵活配置模型参数。
    """
    model = options.get("model", "deepseek-chat")
    all_messages = [{"role": "system", "content": system_prompt}]

    for user_input in user_inputs:
        all_messages.append({"role": "user", "content": user_input})

    # 模拟返回
    return f"[{model}] 处理了 {len(user_inputs)} 条输入"

# 调用示例
result = smart_chat(
    "你是翻译助手",
    "翻译：Hello",
    "翻译：World",
    model="deepseek-reasoner",
    temperature=0.5
)
print(result)
```

逐行拆——`*user_inputs` 把多个位置参数（"翻译：Hello"和"翻译：World"）打包成元组。`**options` 把关键字参数（model 和 temperature）打包成字典。函数体里用 `options.get()` 取值。

现在你能看懂了——这就是 `*args` 和 `**kwargs` 的威力：一个函数签名，能适配各种调用方式。

### [6:15-6:50] 小结

**【画面】** 字幕条总结三行口诀。

**【旁白】** 三句话记住：`*args` 收位置参数打包成元组，`**kwargs` 收关键字参数打包成字典，lambda 是一行匿名函数配 sort 用。你不需要会写，但看到它们要能秒懂。

### [6:50-7:10] 提问彩蛋 + 引出下集

**【画面】** 字幕条逐行列出三个 prompt：
1. “我在学 Python 的 *args 和 **kwargs，请出 3 道‘看代码写运行结果’的题，由易到难，先别给答案，等我答完再逐题讲评。”
2. “请用生活类比讲清楚 *args 和 **kwargs 的区别，并各举一个适合用它的真实场景。”
3. “你扮演 Python 面试官，围绕 lambda 和 sort 的 key 参数追问我 3 个问题，我答错的地方请指出并讲透。”

**【旁白】** 今天的彩蛋——屏幕上这三个 prompt，暂停抄下来，直接发给 Kimi 或 DeepSeek。记住一个原则：别只问 AI 要答案，让它给你出题、追着你问，才是真把 AI 当私教用。下集我们进入文件 IO——程序一关数据全丢了怎么办？存成文件，下次读回来。

---

## 演示操作清单

### 完整演示代码

```python
# === V016 演示完整代码 ===

# --- Part 1: *args ---
def show_args(*args):
    print("收到:", args)
    print("类型:", type(args))

show_args("hello", 42, True)

def calculate_total(*prices):
    return sum(prices)

print(calculate_total(45, 120, 80, 300))
print(calculate_total(45, 120))

# --- Part 2: **kwargs ---
def show_kwargs(**kwargs):
    print("收到:", kwargs)
    print("类型:", type(kwargs))

show_kwargs(model="deepseek-chat", temperature=0.7)

def call_llm(system_prompt, user_input, **kwargs):
    model = kwargs.get("model", "deepseek-chat")
    temperature = kwargs.get("temperature", 0.7)
    max_tokens = kwargs.get("max_tokens", 1000)
    print(f"模型: {model}, 温度: {temperature}, 最大token: {max_tokens}")
    return f"[{model}] 处理完毕"

print(call_llm("你是助手", "你好"))
print(call_llm("你是助手", "你好", model="deepseek-reasoner", temperature=0.3))

# --- Part 3: lambda ---
def square(x):
    return x * x

square_lambda = lambda x: x * x
print(square(5))
print(square_lambda(5))

# lambda + sort
messages = [
    {"role": "user", "content": "你好"},
    {"role": "system", "content": "你是助手"},
    {"role": "user", "content": "天气怎样"},
]
messages.sort(key=lambda m: m["role"])
print("按 role 排序:", messages)

# lambda + API 日志排序
call_logs = [
    {"model": "deepseek-chat", "total_tokens": 45},
    {"model": "deepseek-reasoner", "total_tokens": 320},
    {"model": "deepseek-chat", "total_tokens": 120},
]
call_logs.sort(key=lambda log: log["total_tokens"], reverse=True)
for log in call_logs:
    print(f"{log['model']}: {log['total_tokens']}")

# --- Part 4: 综合实战 ---
def smart_chat(system_prompt, *user_inputs, **options):
    model = options.get("model", "deepseek-chat")
    all_messages = [{"role": "system", "content": system_prompt}]
    for user_input in user_inputs:
        all_messages.append({"role": "user", "content": user_input})
    return f"[{model}] 处理了 {len(user_inputs)} 条输入"

result = smart_chat(
    "你是翻译助手",
    "翻译：Hello",
    "翻译：World",
    model="deepseek-reasoner",
    temperature=0.5
)
print(result)
```

### 运行命令

```bash
cd ~/workspace/python-course
python v016_demo.py
```

---

## 录制注意

1. **定位明确——"能看懂"不是"会写"**：开场和结尾都要强调这集的目标是读懂 AI 生成代码，不是让你当场学会写 `*args`/`**kwargs`。观众如果觉得自己学不会，告诉他们"暂时不会写没关系，以后读 AI 代码时遇到能看懂就行"。
2. **易口误**：`*args` 读"星 args"，`**kwargs` 读"双星 kwargs"。不要读成"乘 args"或"kwargs"。录之前先念顺几遍。
3. **字幕条重点**：三句口诀一定要出字幕条——"`*args` → 元组 · `**kwargs` → 字典 · lambda → 一行函数 + sort"。这是本集唯一需要记住的东西。
4. **时长控制点**：Part 4（综合实战）如果超时可砍。核心是 Part 1-3，Part 4 是"读代码"的练习。但如果砍了 Part 4，结尾引出下集前要补充一句"这些在后面读 openai SDK 源码时会大量遇到"。
5. **提问彩蛋后期**：提问彩蛋段的 prompt 字幕条需在后期加上，确保观众能暂停照抄。
