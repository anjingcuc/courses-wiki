# V035 yield 生成器与流式输出基础

## 视频信息

| 项目 | 内容 |
|---|---|
| 编号 | V035 |
| 标题 | yield 生成器与流式输出基础 |
| 目标时长 | 7 min |
| 对应课次 | L19 大模型 API 深入（前置预习） |
| 前置微课 | V034 装饰器原理 |
| 一句话定位 | 生成器 = 会暂停的函数——看懂 for chunk in stream 逐块拿数据的底层机制 |

---

## 逐字稿

### [0:00-0:30] 开场 hook（不用 API 也能做出打字机效果）

**【画面】** 终端运行 `demo_stream.py`：一行文字像 DeepSeek 网页版那样逐块蹦出来——"Python 是一门简单而强大的编程语言。"每个词间隔 0.2 秒出现。字幕条："没调任何 API · 纯 Python 模拟 · 逐块蹦出"。

**【旁白】** 看这个效果——文字一块一块往外蹦，跟 DeepSeek 网页版的打字机一模一样。但我今天没调任何 API，没有网络请求，纯 Python 就模拟出了流式输出。靠的是一个你还没学过的关键字——`yield`。下节课 L19 你要写 `stream=True` 的流式调用，后面 M6 做 SSE 推送，底层都是它。七分钟，把"会暂停的函数"讲明白。

### [0:30-2:00] return vs yield：结束 vs 暂停

**【画面】** PPT 动画对比。左边普通函数：调用 → 从头跑到尾 → return → 函数"散场"，标注"一次给全部"。右边生成器函数：调用 → 跑到 yield → 送出一个值 → 函数"冻结"在原地，标注"给一个，暂停，下次接着来"。字幕："return 是剧终 · yield 是暂停"。

**【旁白】** 先建立一个心智模型。你写的普通函数是什么行为？调用它，它从头跑到尾，遇到 return，把结果一次性给你，然后这个函数就结束了——局部变量清空，下次调用从头再来。return 是"剧终"。

而函数里只要出现一个 `yield`，这个函数就变成了"生成器函数"——行为完全变了。调用它，它跑到第一个 yield，把这个值送出去，然后——**冻结**。注意不是结束，是暂停：它停在这一行，局部变量是什么、执行到了哪一行，全都记着。等外面说"下一个"，它从冻结的地方接着跑，到下一个 yield，再送一个值，再冻结。

一句话：**return 是把全部结果一次性给你然后散场，yield 是给一个、暂停、等你来要下一个。** 这就是"会暂停的函数"。

### [2:00-3:20] 第一个生成器：next() 与 for 循环

**【画面】** VS Code 中写一个 `three_numbers()` 生成器，三个 yield 各配一行 print。先用 `next()` 手动取值，观察 print 语句是"惰性"执行的——不 next 就不打印。最后用 for 循环自动取。字幕："for 循环 = 帮你自动不停地 next"。

**【旁白】** 上代码，眼见为实：

```python
def three_numbers():
    print("→ 生成 1")
    yield 1
    print("→ 生成 2")
    yield 2
    print("→ 生成 3")
    yield 3
```

注意两个反直觉的点。第一，调用 `three_numbers()` 时，函数体**一行都没执行**——没有任何打印，它返回的是一个"生成器对象"，你可以理解成一条待命的流水线。第二，取值要用 `next()`：

```python
gen = three_numbers()
print(next(gen))   # 先打印"→ 生成 1"，再输出 1
print(next(gen))   # 接着打印"→ 生成 2"，输出 2
```

每次 next，函数从上次暂停处跑到下一个 yield 为止。值取光之后再 next，会报 `StopIteration`——告诉你"没了"。

但你日常几乎不会手写 next，因为 **for 循环就是帮你自动不停地调 next**：

```python
for num in three_numbers():
    print(num)
```

所以生成器和 for 是天生一对——for 每转一圈，生成器就从暂停处苏醒一次，吐一个值出来。

### [3:20-4:40] 为什么要"给一个算一个"：斐波那契对比

**【画面】** 左右对比两个函数：`fib_list(n)` 一次返回整个列表 vs `fib()` 用 yield 逐个给。重点高亮 `fib()` 里的 `while True`——标注"无限序列，列表做不到"。字幕："惰性 = 要一个才造一个 · 不占内存 · 可以无限"。

**【旁白】** 你可能会问：直接 return 一个列表不行吗？为什么要这么麻烦？看斐波那契数列的两种写法：

```python
def fib_list(n):          # 列表版：一次算完
    result = []
    a, b = 0, 1
    for _ in range(n):
        result.append(a)
        a, b = b, a + b
    return result         # 全部装进内存，一次性返回

def fib():                # 生成器版：要一个给一个
    a, b = 0, 1
    while True:           # 无限！列表版不敢这么写
        yield a
        a, b = b, a + b
```

列表版有两个天花板：一是你得提前想好要几个；二是所有结果得一次性装进内存。生成器版里 `while True` 看着像死循环，但它永远不"死"——每 yield 一次就暂停了，**你不取，它不算**。这叫"惰性"：要一个才造一个。取前十个，循环转十圈它就醒十次：

```python
f = fib()
for _ in range(10):
    print(next(f), end=" ")   # 0 1 1 2 3 5 8 13 21 34
```

数据量大、或者根本不知道有多少个的时候——比如大模型一个一个字往外蹦，你事先不知道它要说多少——惰性取值就是唯一的解法。

### [4:40-6:10] 可运行闭环：模拟 LLM 流式输出

**【画面】** 展示 `demo_stream.py` 完整代码：`fake_llm_stream()` 生成器每次 yield 一个文本块，消费端 for 循环逐块打印。运行，文字逐块蹦出。右侧并排展示真实 API 的流式代码 `for chunk in stream:`，标注"同一个模式"。

**【旁白】** 回到开场的打字机效果，现在你能完全看懂它了：

```python
import time

def fake_llm_stream(prompt):
    """模拟大模型的流式响应：逐块给出文本"""
    chunks = ["Python", " 是", "一门", "简单", "而", "强大", "的", "编程语言", "。"]
    for chunk in chunks:
        time.sleep(0.2)     # 模拟网络延迟
        yield chunk         # 来一块，给一块

for chunk in fake_llm_stream("介绍Python"):
    print(chunk, end="", flush=True)
```

`fake_llm_stream` 是个生成器——每 0.2 秒"生成"一小块文字就 yield 出来。消费端一个 for 循环，来一块打印一块。这就是流式输出的完整骨架。

为什么要费这个劲模拟？因为下节课你写的真实代码，结构一模一样：

```python
stream = client.chat.completions.create(..., stream=True)
for chunk in stream:        # stream 也是"逐块给"的对象
    print(chunk.choices[0].delta.content, end="", flush=True)
```

API 返回的 `stream` 对象，底层就是生成器这套机制——大模型每生成一小块，它就给你一块。你今天的 for 循环怎么写，下节课还这么写，只是数据来源从列表换成了真正的大模型。这段代码以后你会在 AI 生成的代码里反复见到。到了 M6 做 SSE 推送，你还会在 FastAPI 里亲手写 `yield` 把数据一块块推给前端——到时候别觉得陌生。

### [6:10-6:30] 小结

**【画面】** 字幕条："yield = 暂停不是结束 · next() 取下一个 · for 自动帮你 next · 惰性：要一个才造一个 · 流式输出的底层"。

**【旁白】** 四句话收束：函数里有 yield 就是生成器，会暂停不会结束；next() 手动取下一个，for 循环帮你自动取；惰性取值——要一个才造一个，不占内存还能表示无限序列；AI 的流式输出，底层就是这套机制。

### [6:30-6:50] 提问彩蛋：亲眼看到才算懂

**【画面】** 弹出"提问彩蛋"卡片，字幕条逐条列出三个 prompt，停留足够时长供暂停照抄：
1. "请帮我设计一个实验代码，让我亲眼看到：调用生成器函数时函数体一行都不执行，只有 next() 时才执行到下一个 yield。并解释为什么会出现这个现象。"
2. "给我出一道生成器练习题：写一个生成器，逐个 yield 列表里的偶数。先别给答案，我写完贴给你批改并指出问题。"
3. "你扮演面试官问我：既然列表推导式一行就能生成数据，为什么还要用 yield 生成器？什么场景下列表做不到、只有生成器可以？"

**【旁白】** 最后留个提问彩蛋——三条 prompt 直接照抄：让 AI 帮你设计实验代码，亲眼看到"不 next 就不执行"；让它出道生成器练习题，你写完它批改；让它扮演面试官，追问你为什么列表推导式替代不了 yield。想不通的地方让它设计实验去验证——亲眼看到，才算真懂。

### [6:50-7:05] 引出下集

**【画面】** 切下集预告卡片："V036 大模型 API 核心参数详解"。

**【旁白】** 生成器解决了"怎么拿"，下集回到大模型 API 本身——temperature、max_tokens 这些旋钮控制 AI"怎么生成"。下集见。

---

## 演示操作清单

### 演示1：第一个生成器——next() 与 for 循环（demo_generator.py）

```python
# demo_generator.py —— 生成器入门：会暂停的函数

def three_numbers():
    print("  → 生成 1")
    yield 1
    print("  → 生成 2")
    yield 2
    print("  → 生成 3")
    yield 3


print("--- 调用生成器函数（注意：此时函数体一行都没执行）---")
gen = three_numbers()

print("--- 手动 next() 取值 ---")
print(next(gen))   # 先打印"→ 生成 1"，再输出 1
print(next(gen))   # 从暂停处接着跑，打印"→ 生成 2"，输出 2

print("--- for 循环自动逐个取（重新创建一个生成器）---")
for num in three_numbers():
    print(num)
```

### 演示2：斐波那契——列表版 vs 生成器版（demo_fib.py）

```python
# demo_fib.py —— 列表版 vs 生成器版斐波那契

def fib_list(n):
    """列表版：一次算完 n 个，全部装进内存返回"""
    result = []
    a, b = 0, 1
    for _ in range(n):
        result.append(a)
        a, b = b, a + b
    return result


def fib():
    """生成器版：要一个给一个，while True 也不会真"死循环" """
    a, b = 0, 1
    while True:
        yield a          # 给出一个就暂停，下次从这里接着来
        a, b = b, a + b


print("列表版（一次返回 10 个）:")
print(fib_list(10))

print("生成器版（用 next 取 10 个）:")
f = fib()
for _ in range(10):
    print(next(f), end=" ")
print()

print("生成器版（用 for 取，超过 50 就停）:")
for num in fib():
    if num > 50:
        break
    print(num, end=" ")
print()
```

预期输出：

```
列表版（一次返回 10 个）:
[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
生成器版（用 next 取 10 个）:
0 1 1 2 3 5 8 13 21 34 
生成器版（用 for 取，超过 50 就停）:
0 1 1 2 3 5 8 13 21 34 
```

### 演示3：模拟 LLM 流式输出（demo_stream.py）

```python
# demo_stream.py —— 用生成器模拟 LLM 流式输出
import time


def fake_llm_stream(prompt):
    """模拟大模型的流式响应：逐块 yield 文本（来一块，给一块）"""
    print(f"[收到问题] {prompt}")
    chunks = ["Python", " 是", "一门", "简单", "而", "强大", "的", "编程语言", "。"]
    for chunk in chunks:
        time.sleep(0.2)      # 模拟网络延迟
        yield chunk          # 暂停在这里，把这一块交出去


# 消费端：for 循环逐块拿，拿到一块打印一块
full_text = ""
for chunk in fake_llm_stream("用一句话介绍Python"):
    print(chunk, end="", flush=True)
    full_text += chunk

print()
print(f"[拼接完成] 完整回复共 {len(full_text)} 个字符")
```

### 运行命令

```bash
cd ~/workspace/python-course

# 生成器入门
python demo_generator.py

# 列表版 vs 生成器版
python demo_fib.py

# 模拟流式输出
python demo_stream.py
```

---

## 录制注意

1. **开场打字机效果必须真实运行**：`time.sleep(0.2)` 的节奏保证肉眼可见逐块蹦出。开场不说原理，先让观众好奇"这是怎么做到的"。
2. **"调用时一行都没执行"要演出来**：演示 `three_numbers()` 时，先只调用不 next，展示没有任何打印；再 next 一次，print 才出现。这个反直觉点是理解生成器的关键，不要一句带过。
3. **与真实流式代码并排对比是画龙点睛**：把 `for chunk in fake_llm_stream(...)` 和 V037 的 `for chunk in stream:` 放在同一画面，强调"同一个 for 模式，只是数据来源换了"。这是本集的存在意义。
4. **时长控制**：旁白约 1600 字，按 235 字/分钟控制在 7 分钟。`StopIteration` 一句带过即可，不要展开讲迭代器协议——超纲。
5. **提问彩蛋字幕后期添加**：提问彩蛋段的 prompt 字幕条需在后期加上，确保观众能暂停照抄。
