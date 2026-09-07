# V048 Python 异步编程基础

## 视频信息

| 项目 | 内容 |
|---|---|
| 编号 | V048 |
| 标题 | Python 异步编程基础 |
| 目标时长 | 8 min |
| 对应课次 | L27 Web 应用基础：FastAPI 后端（前置预习） |
| 前置微课 | V047 构建有工具的 AI Agent |
| 一句话定位 | 看懂 async def / await——等待时不干站着，把时间让给别人 |

---

## 逐字稿

### [0:00-0:30] 开场 hook（3 秒 vs 2 秒）

**【画面】** 分屏对比。左边跑同步版：泡茶 2 秒 + 烤面包 1 秒，画面角落的计时器一路走到 3.0 秒。右边跑异步版：同样两件事，计时器停在 2.0 秒。字幕条："同样的任务 · 同步 3 秒 · 异步 2 秒 · 只多了两个关键词"。

**【旁白】** 看这个对比。两件任务——泡茶要 2 秒，烤面包要 1 秒。左边的程序老老实实先泡茶、再烤面包，总共 3 秒。右边的程序同样两件事，只花了 2 秒——因为它在等茶泡好的时候，顺手把面包烤上了。代码几乎一样，只是多了 `async` 和 `await` 两个词。下节课 L27 写 FastAPI，你会看到满屏的 `async def`——今天八分钟，让你看懂它到底是什么、为什么不阻塞。

### [0:30-2:00] 为什么需要异步：等待时不干站着

**【画面】** PPT 动画。左边"同步"：一个人站在灶台前盯着水壶，水开了才去烤面包，时间轴占满 3 格。右边"异步"：人把水壶坐上灶，等待期间转身去烤面包，时间轴只占 2 格。字幕："等待的时间里，手可以别闲着"。

**【旁白】** 先说清楚问题在哪。你的程序里有一类操作特别浪费时间——"等"。等网络响应、等文件读写、等大模型生成。同步代码里，等就是干等：调用 `time.sleep(2)`，整个程序卡住两秒，什么都不干。就像烧开水时站在灶台前盯着水壶发呆。

异步的思路是：水坐上灶之后，人别闲着，转身去烤面包；水开了再回来倒茶。等待的时间被利用起来了。

这个思路为什么对 AI 应用特别重要？想想 FastAPI 的场景——你的后端收到一个请求，调大模型要 5 秒。同步写法下，这 5 秒里服务器只服务这一个用户，其他人全在排队。异步写法下，等待大模型回复的 5 秒里，服务器可以转头处理几十上百个其他请求。**同一个大模型，同一台机器，吞吐量天差地别。** 这就是 FastAPI 端点爱写 `async def` 的原因，这段代码以后你会在 AI 生成的后端代码里反复见到。

### [2:00-4:00] 三个新词：async def、await、asyncio.run

**【画面】** 代码逐行出现，三个新词各配一个标签：`async def` = "这个函数里有要等的事"，`await` = "在这里等，等的时候让出控制权"，`asyncio.run()` = "异步世界的大门"。规则卡片弹出："await 只能写在 async def 里"。

**【旁白】** 异步代码只有三个新东西，一个个看。

第一个，`async def`。在 def 前面加 async，这个函数就变成了"异步函数"，官方名字叫协程。它是在声明：**这个函数内部有需要等待的操作**。注意，光调用异步函数它不会立刻干活，它需要一个发动机来驱动。

第二个，`await`。写在某个耗时操作前面，意思是"我要在这里等它完成——**但等的时候，我把控制权让出去，别人可以先干活**"。这是异步的灵魂。对比一下：`time.sleep(2)` 是死死地等，谁都别想动；`await asyncio.sleep(2)` 是有礼貌地等——我等着，你们先用。

第三个，`asyncio.run()`。异步函数不能直接在普通代码里跑，需要一个发动机启动它，`asyncio.run(主函数())` 就是点火。你的程序从这扇大门进入异步世界。

还有一条铁律：**`await` 只能写在 `async def` 里面**。普通函数没有"让出控制权"的能力，硬写会直接报语法错误。

### [4:00-6:00] 可运行闭环：同步 vs 异步耗时对比

**【画面】** VS Code 中展示 `demo_async.py` 完整代码，同步版和异步版上下排列。终端运行，先看同步版 3 秒走完，再看异步版——"开始泡茶"和"开始烤面包"几乎同时出现，2 秒走完。时间差用字幕放大。

**【旁白】** 完整跑一遍，眼见为实。先看同步版：

```python
import time

def make_tea():
    time.sleep(2)       # 泡茶 2 秒
    return "🍵"

def toast_bread():
    time.sleep(1)       # 烤面包 1 秒
    return "🍞"

start = time.time()
make_tea()
toast_bread()
print(f"同步版耗时: {time.time() - start:.1f} 秒")   # 约 3 秒
```

`time.sleep` 一调用，程序卡死，两秒过去才开始烤面包。总共 3 秒。

再看异步版：

```python
import asyncio

async def make_tea():
    await asyncio.sleep(2)   # 等 2 秒，等待时让出控制权
    return "🍵"

async def toast_bread():
    await asyncio.sleep(1)
    return "🍞"

async def main():
    start = time.time()
    await asyncio.gather(make_tea(), toast_bread())
    print(f"异步版耗时: {time.time() - start:.1f} 秒")   # 约 2 秒

asyncio.run(main())
```

改动就三处：def 前加 async；`time.sleep` 换成 `await asyncio.sleep`；用 `asyncio.gather` 把两件事同时安排下去。gather 的意思是"这几个任务一起开始，我等它们全部完成"。看输出顺序——"开始泡茶"和"开始烤面包"几乎同时打印，1 秒时"面包烤好了"，2 秒时"茶泡好了"。泡茶等待的 2 秒里，烤面包的 1 秒插进去了——总耗时取决于最慢的那个，2 秒。

注意一个坑：异步版里如果误用 `time.sleep(2)`，它可不会让出控制权，整个程序照样卡死，总耗时变回 3 秒。**异步代码里的"等"，必须用能 await 的等。**

### [6:00-7:10] 看懂 FastAPI 的异步端点

**【画面】** 展示一段 FastAPI 代码，高亮 `async def chat(...)` 和 `await call_llm(...)` 两行。标注："端点里调大模型要等待 → 所以用 async def + await"。字幕："今天只要求看懂，L27 手把手写"。

**【旁白】** 现在回头看 FastAPI，你下节课会写到这样的代码：

```python
@app.post("/chat")
async def chat(message: str):
    reply = await call_llm(message)   # 调大模型要等几秒
    return {"reply": reply}
```

为什么这个端点用 `async def`？因为里面要调大模型，一等就是好几秒——用了 await，等待的这几秒服务器能去服务别人。判断标准就一句话：**函数里有没有"值得等待的耗时操作"？有，就 async def 加 await；没有，普通 def 就行。**

今天不要求你会写并发代码，只要求你以后看到 `async def`、`await` 心里不发懵，知道"这是个会等待的函数，等待时不堵别人"。具体怎么写，L27 课上手把手来。

### [7:10-7:50] 小结

**【画面】** 字幕条："同步 = 干等 · 异步 = 等待时让路 · async def 声明会等的函数 · await 让出控制权 · asyncio.run 启动 · await 只能在 async def 里"。

**【旁白】** 四句话收束：同步代码等待时干站着，异步代码等待时把路让给别人；`async def` 声明"这个函数里有要等的事"；`await` 是"在这里等，但等待时让出控制权"，而且它只能写在 async def 里；`asyncio.run()` 是异步世界的入口。

### [7:50-8:10] 提问彩蛋：看不懂就问到懂

**【画面】** 字幕条逐条列出三个 prompt（编号 1/2/3，可暂停照抄）：
1. "请用'泡茶和烤面包'的例子讲清楚：为什么 time.sleep 在异步代码里会卡死整个程序，而 await asyncio.sleep 不会？'让出控制权'到底是什么意思？"
2. "我刚学会 async def、await 和 asyncio.gather。请给我出 3 道判断题：给一段代码让我判断是同步还是异步、会不会阻塞、总耗时大约多少——先别公布答案。"
3. "为什么 await 只能写在 async def 里？如果我想在普通函数里调用异步函数，正确做法是什么？请举具体代码例子。"

**【旁白】** 看不懂就问到看懂，这三条直接复制给 Kimi。特别是第二条——让 AI 出题你判断，答错了让它讲到你懂，这比把视频重看一遍管用。别让 AI 替你思考，让它检验你的思考。

### [8:10-8:20] 引出下集

**【画面】** 下集预告卡片："V049 FastAPI 路由与请求处理"。

**【旁白】** 语法装备齐了，下集正式进入 Web 开发——用 FastAPI 把你写的 AI 能力包装成任何人都能访问的 API 服务。下集见。

---

## 演示操作清单

### 演示1：同步 vs 异步耗时对比（demo_async.py）

```python
# demo_async.py —— 同步 vs 异步：耗时对比
import time
import asyncio


# ---------- 同步版：一个一个来 ----------
def make_tea():
    print("开始泡茶...")
    time.sleep(2)          # 死死地等 2 秒，谁都别想动
    print("茶泡好了 🍵")
    return "🍵"


def toast_bread():
    print("开始烤面包...")
    time.sleep(1)
    print("面包烤好了 🍞")
    return "🍞"


def sync_main():
    start = time.time()
    make_tea()
    toast_bread()
    print(f"同步版耗时: {time.time() - start:.1f} 秒")


# ---------- 异步版：等待时互相让路 ----------
async def make_tea_async():
    print("开始泡茶...")
    await asyncio.sleep(2)   # 等 2 秒，但等待时让出控制权
    print("茶泡好了 🍵")
    return "🍵"


async def toast_bread_async():
    print("开始烤面包...")
    await asyncio.sleep(1)
    print("面包烤好了 🍞")
    return "🍞"


async def async_main():
    start = time.time()
    # gather：两个任务一起开始，等它们全部完成
    await asyncio.gather(make_tea_async(), toast_bread_async())
    print(f"异步版耗时: {time.time() - start:.1f} 秒")


if __name__ == "__main__":
    print("========== 同步版 ==========")
    sync_main()
    print("\n========== 异步版 ==========")
    asyncio.run(async_main())
```

预期输出：

```
========== 同步版 ==========
开始泡茶...
茶泡好了 🍵
开始烤面包...
面包烤好了 🍞
同步版耗时: 3.0 秒

========== 异步版 ==========
开始泡茶...
开始烤面包...
面包烤好了 🍞
茶泡好了 🍵
异步版耗时: 2.0 秒
```

### 阅读材料：FastAPI 的异步端点（只需看懂，L27 才会真正运行）

```python
# fastapi_async_snippet.py —— 阅读材料：看懂 async def / await 在框架里的作用
# 注意：需要安装 fastapi 并定义 call_llm 才能运行，本集不要求运行，看懂即可
from fastapi import FastAPI

app = FastAPI()


@app.post("/chat")
async def chat(message: str):            # 端点里有"要等几秒"的操作 → 用 async def
    reply = await call_llm(message)      # 等待时让出控制权，服务器能去服务别人
    return {"reply": reply}
```

### 运行命令

```bash
cd ~/workspace/python-course

# 同步 vs 异步耗时对比
python demo_async.py
```

---

## 录制注意

1. **耗时对比必须真实运行**：3 秒 vs 2 秒是全片记忆点，两个版本都要完整跑完，不要快进等待过程——让观众真实感受"干等"和"让路"的差别。可以在画面角落加计时器辅助。
2. **异步版的输出顺序要讲透**："开始泡茶"和"开始烤面包"几乎同时出现、"面包烤好了"先于"茶泡好了"——这个打印顺序就是并发的直接证据，比耗时数字更直观，务必指着输出逐行讲。
3. **反面演示（可选）**：把异步版里的 `await asyncio.sleep(2)` 换回 `time.sleep(2)`，总耗时变回 3 秒——直观证明"只有能 await 的等才让路"。时间紧可省略，但建议保留。
4. **时长控制**：旁白约 1850 字，按 235 字/分钟控制在 8 分钟。不要展开讲事件循环、协程调度原理——超纲；本集目标只是"看懂不发懵"。
5. 提问彩蛋段的 prompt 字幕条需在后期加上，确保观众能暂停照抄。
