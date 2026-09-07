# V014 for/while 循环与推导式

## 视频信息

| 项目 | 内容 |
|---|---|
| 编号 | V014 |
| 标题 | for/while 循环与推导式 |
| 目标时长 | 8 min |
| 对应课次 | L8 控制流：分支与循环 |
| 前置微课 | V013 if 分支与条件逻辑 |
| 一句话定位 | for 遍历、while 循环、break/continue，外加推导式进阶——批量处理的四件套 |

---

## 逐字稿

### [0:00-0:35] 开场 hook（成果前置）

**【画面】** 屏幕上先展示运行结果：一个终端中的多轮 AI 对话，用户输入"你好"→AI 回复，再输入"天气"→AI 回复，输入"quit"→程序退出并显示"本次对话共 6 条消息"。字幕条："这就是你今天要写的代码"。

**【旁白】** 看到没？一个能持续对话、你说 quit 才退出的程序。这就是今天循环要做的核心事情——AI 聊天应用的核心逻辑雏形。上集我们学了 if 分支做判断，但判断一次只能处理一条数据。如果你要对 500 条日志逐条判断？如果你要让程序反复执行直到用户说停？那就需要循环。

### [0:35-2:00] for 循环遍历

**【画面】** VS Code 中敲入 for 循环代码，终端面板展示输出。

**【旁白】** 先看 for 循环——Python 里最常用的循环方式。

遍历列表，上一课其实已经用过了：

```python
call_logs = [
    {"model": "deepseek-chat", "total_tokens": 45},
    {"model": "deepseek-reasoner", "total_tokens": 320},
]

for log in call_logs:
    print(f"{log['model']}: {log['total_tokens']} tokens")
```

读法就是人话——"对于 call_logs 里的**每一个** log，执行缩进里的代码"。Python 的 for 循环是遍历式的，不像 C 语言的 `for(i=0; i<n; i++)` 那么绕。

但如果我就是想固定循环几次呢？用 `range()`：

```python
for i in range(3):
    print(f"第 {i+1} 次调用")
```

输出 1、2、3。注意——`range(3)` 生成的是 0、1、2，**不是** 1、2、3。这是新手最容易踩的坑，叫 off-by-one。记住口诀：**range 从 0 开始，到参数的前一个停**。

`range` 还有两种写法：

```python
range(2, 6)    # 2, 3, 4, 5——从 2 到 5
range(0, 10, 2)  # 0, 2, 4, 6, 8——步长为 2
```

### [2:00-3:30] while 循环

**【画面】** 敲入 while 循环代码，演示多轮对话。

**【旁白】** for 循环适合"知道要循环几次"的场景。但如果你不知道用户什么时候退出呢？用 while。

最经典的多轮对话模式——`while True` + `break`：

```python
messages = [{"role": "system", "content": "你是一个简洁的助手。"}]

while True:
    user_input = input("你: ")
    if user_input == "quit":
        print("对话结束。")
        break

    messages.append({"role": "user", "content": user_input})
    fake_reply = f"收到：{user_input}"
    messages.append({"role": "assistant", "content": fake_reply})
    print(f"AI: {fake_reply}")

print(f"本次对话共 {len(messages)} 条消息。")
```

这里我先用假回复代替真实 API 调用，重点看循环结构。`while True` 让程序无限循环，`break` 是唯一的出口——当用户输入 "quit" 时跳出。这就是后面做 AI 聊天应用的核心骨架。

while 还有另一种写法——条件循环：

```python
count = 0
while count < 3:
    print(f"第 {count+1} 次")
    count += 1
```

这里必须记得在循环体里改 `count`，不然就死循环了。

### [3:30-5:00] break 与 continue

**【画面】** PPT 动画分屏：左边 break（门开了直接走人），右边 continue（这轮跳过继续下一轮）。

**【旁白】** 循环里两个控制关键字——break 和 continue，特别容易搞混。

**break**：直接退出整个循环。

```python
for log in call_logs:
    if not log["success"]:
        print(f"发现失败记录: {log}")
        break  # 找到第一条就停
```

找到第一条失败记录就退出，后面的不看了。

**continue**：跳过这一轮，继续下一轮。

```python
total = 0
for log in call_logs:
    if not log["success"]:
        continue  # 失败的跳过，不加到统计里
    total += log["total_tokens"]
print(f"成功调用的总token: {total}")
```

continue 的意思是"这条我不要，直接看下一条"。用一句话区分——**break 是"我不干了"，continue 是"这条跳过"**。

### [5:00-6:15] 推导式进阶（含 else）

**【画面】** 继续在同一文件中演示推导式进阶用法。

**【旁白】** 上上集我们学了基本推导式。今天看两个进阶用法。

第一——推导式里加 if-else：

```python
labels = ["高消耗" if log["total_tokens"] > 200 else "正常" for log in call_logs]
print(labels)
```

读法——"表达式 if 条件 else 否则的表达式，for 遍历"。每条日志，token 超过 200 标'高消耗'，否则标'正常'，结果是一个标签列表。

第二——嵌套推导式（点到为止）：

```python
# 两组日志合并后提取所有模型名
group_a = [{"model": "deepseek-chat"}, {"model": "deepseek-reasoner"}]
group_b = [{"model": "deepseek-chat"}, {"model": "gpt-4o"}]
all_groups = [group_a, group_b]

models = [log["model"] for group in all_groups for log in group]
unique_models = set(models)
print(unique_models)
```

这个稍微烧脑，读法是两层 for 从左到右。初学阶段遇到嵌套推导式，直接问 AI 帮你读就行。

### [6:15-7:30] 死循环陷阱与可运行闭环

**【画面】** 先展示一段故意写错的死循环代码，运行 2 秒后按 Ctrl+C 终止。然后展示完整闭环代码。

**【旁白】** 最后说一个实战陷阱——死循环。看这段代码：

```python
count = 0
while count < 3:
    print(f"第 {count+1} 次")
    # 忘了写 count += 1 ！
```

运行——它会无限打印"第 1 次"。程序卡死了怎么办？按 `Ctrl+C` 强制终止。记住这个快捷键，你会经常用到。

好，来看今天的完整闭环——对 API 日志做循环统计 + 异常筛选：

```python
logs = [
    {"model": "deepseek-chat", "total_tokens": 45, "success": True},
    {"model": "deepseek-reasoner", "total_tokens": 320, "success": False},
    {"model": "deepseek-chat", "total_tokens": 80, "success": True},
    {"model": "deepseek-reasoner", "total_tokens": 500, "success": False},
]

# 循环统计：总 token + 异常记录
total_tokens = 0
anomalies = []
for log in logs:
    total_tokens += log["total_tokens"]
    if log["total_tokens"] > 200 and not log["success"]:
        anomalies.append(log)

print(f"总token: {total_tokens}")
print(f"异常记录: {len(anomalies)} 条")
for a in anomalies:
    print(f"  {a['model']} | {a['total_tokens']} tokens")
```

运行——总 token 945，异常记录 2 条。for 循环 + if 分支，真实开发中天天在用。

### [7:30-7:50] 小结 + 引出下集

**【画面】** 字幕条："for 遍历 / while 条件循环 / break 退出 / continue 跳过 / range(3)=0,1,2"

**【旁白】** 循环四件套：for 遍历、while 条件循环、break 退出、continue 跳过。记住 range 从 0 开始、while 循环体里必须有改变条件的语句。

**【画面】** 提问彩蛋。字幕条依次列出三个可以直接照抄去问 Kimi/DeepSeek 的 prompt：

- ① 出 4 道 `range()` 取值预测题考我，比如 `range(2, 10, 3)` 会生成哪些数，先别公布答案，我答完再逐题讲解。
- ② 用 API 日志处理的场景，各给我 2 个 break 和 continue 的代码例子，讲完之后出 1 道题让我判断该用哪个。
- ③ 我写了一段 while 循环结果死循环了。请不要直接给我改好的代码，而是一步步提问，引导我自己找出原因。（这条后面贴上你的代码）

**【旁白】** 重点看第三条 prompt——程序卡死的时候，把代码贴给它，但要求它只提问、不给答案，引导你自己把 bug 揪出来。AI 帮你改的 bug 你记不住，自己找到的 bug 一辈子忘不了。

**【旁白】** 下集进入函数设计——我们这几课把代码全写在文件顶层，代码一多就乱。函数就是给你的逻辑起个名字，喊名字就能用。

---

## 演示操作清单

### 完整演示代码

```python
# === V014 演示完整代码 ===

call_logs = [
    {"model": "deepseek-chat", "total_tokens": 45, "success": True},
    {"model": "deepseek-reasoner", "total_tokens": 320, "success": False},
    {"model": "deepseek-chat", "total_tokens": 80, "success": True},
    {"model": "deepseek-reasoner", "total_tokens": 500, "success": False},
]

# --- Part 1: for 遍历 ---
for log in call_logs:
    print(f"{log['model']}: {log['total_tokens']} tokens")

# --- Part 2: range ---
for i in range(3):
    print(f"第 {i+1} 次调用")

print("range(2, 6):", list(range(2, 6)))
print("range(0, 10, 2):", list(range(0, 10, 2)))

# --- Part 3: while + break（多轮对话，用假数据演示结构）---
messages = [{"role": "system", "content": "你是一个简洁的助手。"}]

# 模拟用户输入序列
user_inputs = ["你好", "天气怎样", "quit"]
idx = 0

while True:
    user_input = user_inputs[idx]
    idx += 1
    print(f"你: {user_input}")
    if user_input == "quit":
        print("对话结束。")
        break
    messages.append({"role": "user", "content": user_input})
    fake_reply = f"收到：{user_input}"
    messages.append({"role": "assistant", "content": fake_reply})
    print(f"AI: {fake_reply}")

print(f"本次对话共 {len(messages)} 条消息。")

# --- Part 4: break ---
for log in call_logs:
    if not log["success"]:
        print(f"发现第一条失败记录: {log['model']} | {log['total_tokens']} tokens")
        break

# --- Part 5: continue ---
total = 0
for log in call_logs:
    if not log["success"]:
        continue
    total += log["total_tokens"]
print(f"成功调用的总token: {total}")

# --- Part 6: 推导式进阶 ---
labels = ["高消耗" if log["total_tokens"] > 200 else "正常" for log in call_logs]
print("标签:", labels)

# --- Part 7: 完整闭环 ---
logs = call_logs
total_tokens = 0
anomalies = []
for log in logs:
    total_tokens += log["total_tokens"]
    if log["total_tokens"] > 200 and not log["success"]:
        anomalies.append(log)

print(f"总token: {total_tokens}")
print(f"异常记录: {len(anomalies)} 条")
for a in anomalies:
    print(f"  {a['model']} | {a['total_tokens']} tokens")
```

### 运行命令

```bash
cd ~/workspace/python-course
python v014_demo.py
```

> **注**：录制时 Part 3 的 while 循环使用了模拟输入序列而非 `input()`，避免录制时需要手动输入。课堂演示时可改为真实 `input()`。死循环陷阱部分需单独运行，记得 `Ctrl+C` 终止。

---

## 录制注意

1. **死循环翻车是亮点**：故意写一段忘加 `count += 1` 的 while 循环，让它跑 3-5 秒后按 `Ctrl+C` 停掉。观众亲眼看到程序"卡死"比口头说十遍有效。但注意控制时间——不要让它跑太久把终端刷屏。
2. **`input()` 处理**：录微课时不方便用 `input()` 做交互演示。建议用预先准备好的 `user_inputs` 列表模拟输入序列，逻辑完全一致，录播时更顺畅。录制旁白时说明"实际运行时这里用的是 input"。
3. **字幕条重点**：break vs continue 的区分一定要出字幕条——"break = 不干了（退出循环）· continue = 这条跳过（继续下一轮）"。这是观众最需要截图记住的点。
4. **时长控制点**：Part 6 的嵌套推导式（group_a/group_b 那段）如果超时直接砍掉，只保留 if-else 推导式。嵌套推导式标为"选学"。
5. **提问彩蛋字幕**：提问彩蛋段的 prompt 字幕条需在后期加上，确保观众能暂停照抄。
