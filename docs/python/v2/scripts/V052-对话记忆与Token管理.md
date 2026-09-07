# V052 对话记忆与 Token 管理

## 视频信息

| 项目 | 内容 |
|---|---|
| 编号 | V052 |
| 标题 | 对话记忆与 Token 管理 |
| 目标时长 | 8 min |
| 对应课次 | L29 AI 应用进阶：对话记忆与状态管理 |
| 前置微课 | V051 fetch/async-await 调用 API |
| 一句话定位 | 让 AI 记住你上句话说了什么——多轮对话记忆的原理、会话管理与 Token 预算控制 |

---

## 逐字稿

### [0:00-0:30] 开场 hook：成果前置——AI 从"失忆"到"有记忆"

**【画面】** 浏览器中打开聊天页面。第一条消息发送"我叫张三，正在学 Python"——AI 回复"你好张三！"。第二条发送"我叫什么名字？"——AI 回复"抱歉，我不知道你的名字。"。画面暂停，红色标注"❌ AI 失忆了"。然后画面切换到改进后的版本：同样两条消息，第二条 AI 回复"你叫张三呀！"。绿色标注"✅ 有记忆了"。字幕条："多轮对话记忆 · 会话管理 · Token 预算控制"。

**【旁白】** 看这两个画面对比。左边，用户先说"我叫张三"，再问"我叫什么"——AI 居然说不记得。右边，同样的问题，AI 准确回答"你叫张三"。差别在哪？左边每次调用 API 只传了当前这条消息，历史消息全丢了。右边把完整对话历史传给了 API。今天这集就讲三件事：怎么让 AI 有记忆、怎么管理多个用户的会话、以及对话太长时怎么控制 Token。

### [0:30-2:00] 记忆的本质：你是大模型的"外挂记忆"

**【画面】** PPT 动画。左侧画一个大模型 API 图标，标注"无状态：每次调用独立，不保存任何上下文"。右侧画一个后端服务器图标，里面有一个 messages 列表在不断追加消息。箭头从后端指向 API，标注"每次请求把完整历史一起发送"。底部类比图：一个人拿着小本本给另一个人看——"这是之前聊的，你先看看"。

**【旁白】** 先搞清楚一个根本认知——大模型 API 是无状态的。

什么意思？你每次调一次 API，它处理完就忘了。下次再调，它完全不记得上次说了什么。这不是 bug，是设计如此。

那 ChatGPT 为什么能记住对话？因为它的后端在每次请求时，把之前的全部对话历史打包在一起发给大模型。大模型看到的是一整段聊天记录，自然就"记得"了。

打个比方。大模型像一个每次见面都不记得你的熟人。你每次和他说话前，先把之前的聊天记录给他看一遍——他就"记得"了。你就是他的外挂记忆。

这个认知很重要——它意味着"记忆"不是调一个 API 开关就能有的，而是需要你在自己的代码里维护历史。L11 我们学过用类封装一个 AIChatManager，当时就是在脚本里维护 history 列表。现在要把这个思路搬到 Web 服务里。

回到代码。V051 写的 `/chat` 端点长这样：

```python
messages = [
    {"role": "system", "content": "你是助手"},
    {"role": "user", "content": current_message}
]
```

每次只传了 system 和当前这条消息——历史全丢了。改成有记忆的写法，就是把之前所有的消息也加进去：

```python
messages = session.history.copy()
messages.append({"role": "user", "content": current_message})
```

这样 AI 每次都能看到完整对话。就这么简单——记忆不是大模型的功能，是你的代码在维护。

### [2:00-3:30] 会话管理：不同用户各自的记忆

**【画面】** VS Code 中展示 `SessionManager` 类的代码结构。用高亮标注 `sessions` 字典的嵌套结构：外层 key 是 `session_id`，value 是一个包含 `messages` 列表和 `summary` 字符串的字典。旁边画两个浏览器窗口，各自带不同颜色的 session_id 标签，指向后端字典中不同的条目。

**【旁白】** 光有历史还不够。想象你的聊天应用同时有十个用户——他们各自在聊天，不能互相串。张三说的"我叫张三"，不能被李四的会话看到。

这就需要会话管理。核心思路：给每个用户的对话分配一个唯一 ID——session_id。后端用一个字典把所有会话存起来：

```python
sessions = {
    "a1b2c3d4": {"messages": [...], "summary": ""},
    "e5f6g7h8": {"messages": [...], "summary": ""},
}
```

每个 session_id 对应一个独立的 messages 列表。用户 A 的请求带上自己的 session_id，后端就取 A 的历史；用户 B 带 B 的 ID，取 B 的历史。互不干扰。

具体怎么实现？定义一个 `SessionManager` 类。核心方法就三个——`create_session` 生成一个新 ID 并初始化消息列表，`add_message` 往指定会话追加消息，`get_messages` 取出完整历史。

session_id 怎么生成？用 `uuid` 模块，取前 8 位就够用了。前端第一次请求不带 ID，后端创建会话后把 ID 返回去。前端保存这个 ID，后续每次请求都带上——就这么来回传递，就实现了会话隔离。

这套机制在实际产品里到处都是。你打开 ChatGPT，左边每个对话窗口就是一个独立的 session。切到另一个窗口，AI 就"忘了"上一个窗口的上下文——其实是后端按 session_id 分别管理历史而已。

### [3:30-5:00] Token 预算：历史越长，越贵越慢

**【画面】** PPT 展示一个进度条动画。标题"Token 消耗随对话轮次增长"。横轴是对话轮数（1, 5, 10, 20, 50），纵轴是 Token 数。进度条从绿色逐渐变黄、变红。标注关键数字："1 轮 ≈ 100 Token"、"20 轮 ≈ 4000 Token"、"64K = DeepSeek 上下文上限 → 超限报错"。下方公式框："每次请求 Token 数 = 全部历史 + 当前消息"。

**【旁白】** 有了记忆，AI 聊天体验好了。但问题也来了——对话越长，历史越大，每次请求要传的 Token 就越多。

先说 Token 是什么。大模型的计费单位就是 Token。粗略估算：一个中文字大约一到两个 Token，一个英文单词大约一到两个 Token。

关键问题来了。每次调 API，你传的历史越长，消耗的 Token 越多。第一轮对话可能才一百个 Token，聊到二十轮可能就四五千了。你想想，每次请求都把全部历史发一遍——第二轮发前两轮的内容，第十轮发前十轮的内容，越往后越多。

DeepSeek 的上下文窗口是六万四——一旦超过，API 直接报错。

所以你如果做一个聊天产品，用户和你聊了两百轮，每次请求都把两百轮历史全传过去——合理吗？不合理。越来越贵、越来越慢、最终还会超限。

那怎么办？核心思路是：旧消息可以压缩。把前几十轮对话压缩成一段摘要，用一条 system 消息替代，腾出 Token 预算。这就是下一节要讲的自动摘要。

记住这个权衡——完美的记忆成本太高，完全遗忘体验太差，摘要是中间方案。

### [5:00-6:30] 自动摘要：用 AI 压缩对话历史

**【画面】** VS Code 中展示 `summarize_if_needed` 方法。动画分三步展示：第一步，检查 Token 是否超阈值（条件判断高亮）；第二步，把旧消息拼成文本（红框圈出 `KEEP_RECENT_TURNS` 之前的消息）；第三步，调用 DeepSeek 做摘要（标注"temperature=0.3 低温度更稳定"），然后用摘要替换旧消息。旁边展示摘要前后的对比：左侧 messages 列表有 18 条，右侧压缩成"system 摘要 + 4 条近期消息"。

**【旁白】** 自动摘要的思路很直接。先设一个阈值——比如历史超过三千 Token 就触发摘要。每次 API 调用后检查一下，超了就压缩。

压缩怎么压缩？不是简单删掉，而是用 AI 来做有损压缩。把旧消息拼成一段文本，发给 DeepSeek，让它生成一段不超过两百字的摘要。Prompt 大概是这样的：

"请将以下对话历史压缩为简洁摘要，保留关键信息——人名、偏好、已解决的问题、重要结论。"

注意用低温度——0.3，让摘要更稳定、不容易跑偏。

还有个细节：最近几轮的消息不摘要。比如保留最近四轮对话原样不动，只压缩更早的消息。因为最近的上下文最重要，不能丢。

摘要完成后，更新会话数据：system 消息加上"之前的对话摘要"这一段，加上保留的近期消息。旧消息被替换掉了，Token 预算就腾出来了。

实际运行时，你会在后端终端看到这样的日志："会话 a1b2c3d4 已自动摘要，历史从 18 条压缩到 5 条"。效果一目了然。

### [6:30-7:30] 可运行演示：带记忆的聊天应用

**【画面】** 终端中运行 `uvicorn main:app --reload --port 8000`。浏览器打开聊天页面。依次发送：1."我叫张三，正在学 Python 编程。" 2."我最喜欢的编程语言是什么？" AI 回答"Python"。3."帮我写一个列表反转的函数。" AI 返回代码。4."刚才我请你写的是什么函数？" AI 回答"列表反转"。画面切换到终端日志，展示 session_id 和消息计数。然后点击"清空"按钮，再发"我叫什么名字？"，AI 回答"不知道"。

**【旁白】** 来看完整演示。启动后端，打开聊天页面。

第一条消息"我叫张三，正在学 Python"——后端创建新会话，返回 session_id。第二条"我最喜欢的编程语言是什么"——AI 准确回答"Python"，记忆生效了。第三条让它写个列表反转函数，第四条问"刚才请你写的是什么"——AI 回答"列表反转"。多轮记忆完整工作。

终端日志里能看到每次请求的消息数在增长。如果对话够长，还会看到自动摘要触发的日志。

现在点"清空"按钮。后端调用 `clear_session`，保留 system 提示、清空历史和摘要。再问"我叫什么"——AI 回答"不知道"。记忆被彻底清除了。

### [7:30-7:45] 小结

**【画面】** 字幕条逐条出现："记忆 = 每次请求传完整历史 · 会话管理 = session_id 隔离不同用户 · Token 预算 = 设阈值控制成本 · 自动摘要 = 用 AI 压缩旧消息"。

**【旁白】** 核心记住四件事：记忆的本质是每次请求都把完整历史传给 API；用 session_id 实现多用户会话隔离；设 Token 阈值控制成本和避免超限；旧消息用 AI 自动摘要来压缩。这四个概念从简单到复杂，构成了生产级聊天应用的记忆架构。

### [7:45-8:10] 提问彩蛋：用 AI 检验你的"记忆"理解

**【画面】** 字幕条逐条列出三个 prompt："① 大模型 API 是无状态的，但 ChatGPT 能记住对话——请用苏格拉底式提问引导我自己想明白记忆是怎么实现的，不要直接给答案。 ② 请给我出 3 道 Token 预算计算题：给定每轮对话字数，算聊到第几轮会超过 64K 上下文上限，我算完发给你批改。 ③ 自动摘要为什么要保留最近几轮不压缩？请解释这个设计权衡，并举一个'如果全部压缩会出什么问题'的具体例子。"

**【旁白】** 三个 prompt 已经在屏幕上，照抄去用。同样是问 AI，"给我讲讲"和"你考考我"，学到的东西完全不是一个量级。从今天起，每学完一集都让 AI 给你出道题。

### [8:10-8:25] 引出下集

**【画面】** 下集预告卡片。标题"V053 vibe coding 项目方法论"。下方文字："从零到 AI 应用的完整流程——需求拆解、增量生成、每步验证。学完方法论就开始做期末项目了。"

**【旁白】** 今天给聊天应用加上了记忆。L19 到 L29，从调 API 到做应用，技术链路基本走完了。但写一个完整项目和写一个演示代码完全不同——怎么拆需求、怎么跟 AI 协作、怎么一步步把项目做出来？下集讲 vibe coding 项目方法论，这是期末项目的启动钥匙。我们下集见。

---

## 演示操作清单

### 文件结构

```
ai_chat_memory/
├── .env                         # DEEPSEEK_API_KEY=sk-xxx
├── requirements.txt             # openai, fastapi, uvicorn, python-dotenv, pydantic
├── session_manager.py           # 会话管理 + Token 预算 + 自动摘要
└── main.py                      # FastAPI 后端（/chat, /sessions/{id}）
```

### 完整代码

#### session_manager.py

```python
# session_manager.py —— 会话管理模块
"""维护多用户的对话历史，支持 Token 预算控制和自动摘要"""
import uuid
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.environ.get("DEEPSEEK_API_KEY", ""),
    base_url="https://api.deepseek.com"
)

# Token 预算阈值（超过则触发摘要）
MAX_HISTORY_TOKENS = 3000
# 摘要时保留的最近消息轮数（这些不摘要）
KEEP_RECENT_TURNS = 4


class SessionManager:
    """管理所有用户的对话会话"""

    def __init__(self):
        # {session_id: {"messages": [...], "summary": "..."}}
        self.sessions = {}

    def create_session(self, system_prompt="你是一个友好的 AI 助手。"):
        """创建新会话，返回 session_id"""
        session_id = str(uuid.uuid4())[:8]
        self.sessions[session_id] = {
            "messages": [{"role": "system", "content": system_prompt}],
            "summary": ""
        }
        return session_id

    def get_session(self, session_id):
        """获取会话，不存在则创建"""
        if session_id not in self.sessions:
            return self.create_session()
        return self.sessions[session_id]

    def get_messages(self, session_id):
        """获取完整消息列表（系统提示 + 摘要 + 历史）"""
        session = self.get_session(session_id)
        messages = [session["messages"][0]]  # 系统提示

        if session["summary"]:
            messages.append({
                "role": "system",
                "content": f"之前的对话摘要：{session['summary']}"
            })

        messages.extend(session["messages"][1:])  # 历史消息
        return messages

    def add_message(self, session_id, role, content):
        """向会话追加消息"""
        session = self.get_session(session_id)
        session["messages"].append({"role": role, "content": content})

    def clear_session(self, session_id):
        """清空会话历史，保留系统提示"""
        if session_id in self.sessions:
            system_msg = self.sessions[session_id]["messages"][0]
            self.sessions[session_id] = {
                "messages": [system_msg],
                "summary": ""
            }

    def estimate_tokens(self, messages):
        """粗略估算 Token 数（1 字 ≈ 1.5 token）"""
        total_chars = sum(len(m["content"]) for m in messages)
        return int(total_chars * 1.5)

    def summarize_if_needed(self, session_id):
        """历史超过 Token 预算时自动摘要旧消息"""
        session = self.get_session(session_id)
        messages = session["messages"]

        if self.estimate_tokens(messages) < MAX_HISTORY_TOKENS:
            return

        system_msg = messages[0]
        conversation = messages[1:]

        if len(conversation) <= KEEP_RECENT_TURNS * 2:
            return

        # 旧消息送摘要，近期消息保留
        old_messages = conversation[:-KEEP_RECENT_TURNS * 2]
        recent_messages = conversation[-KEEP_RECENT_TURNS * 2:]

        conversation_text = "\n".join(
            f"[{m['role']}]: {m['content']}" for m in old_messages
        )
        prev_summary = session["summary"]
        summary_prompt = f"""请将以下对话历史压缩为简洁摘要。
保留关键信息（人名、偏好、已解决的问题、重要结论）。
{"已有摘要：" + prev_summary if prev_summary else ""}

对话历史：
{conversation_text}

更新后的摘要（不超过200字）："""

        try:
            response = client.chat.completions.create(
                model="deepseek-chat",
                messages=[{"role": "user", "content": summary_prompt}],
                max_tokens=300,
                temperature=0.3
            )
            new_summary = response.choices[0].message.content
            session["messages"] = [system_msg] + recent_messages
            session["summary"] = new_summary
            print(f"[会话 {session_id}] 已自动摘要，"
                  f"历史从 {len(messages)} 条压缩到 {len(session['messages'])} 条")
        except Exception as e:
            print(f"摘要失败: {e}")
```

#### main.py

```python
# main.py —— FastAPI 后端（带多轮对话记忆）
import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from openai import OpenAI
from pydantic import BaseModel

from session_manager import SessionManager

load_dotenv()

app = FastAPI(title="AI 聊天 API（带记忆）")

client = OpenAI(
    api_key=os.environ.get("DEEPSEEK_API_KEY", ""),
    base_url="https://api.deepseek.com"
)

session_mgr = SessionManager()


class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None


class ChatResponse(BaseModel):
    reply: str
    session_id: str
    history_count: int


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    """AI 聊天接口（带多轮对话记忆）"""
    # 1. 获取或创建会话
    session_id = request.session_id or session_mgr.create_session()

    # 2. 用户消息加入历史
    session_mgr.add_message(session_id, "user", request.message)

    # 3. 获取完整消息列表
    messages = session_mgr.get_messages(session_id)

    # 4. 调用大模型
    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=messages
        )
        reply = response.choices[0].message.content
    except Exception as e:
        # 调用失败时移除刚加的用户消息
        session = session_mgr.get_session(session_id)
        if session["messages"] and session["messages"][-1]["role"] == "user":
            session["messages"].pop()
        raise HTTPException(status_code=502, detail=f"大模型调用失败: {e}")

    # 5. AI 回复加入历史
    session_mgr.add_message(session_id, "assistant", reply)

    # 6. 检查是否需要摘要
    session_mgr.summarize_if_needed(session_id)

    # 7. 返回结果
    history_count = len(session_mgr.get_session(session_id)["messages"])
    return ChatResponse(
        reply=reply,
        session_id=session_id,
        history_count=history_count
    )


@app.delete("/sessions/{session_id}")
def clear_session(session_id: str):
    """清空指定会话"""
    session_mgr.clear_session(session_id)
    return {"message": "会话已清空", "session_id": session_id}
```

### 运行命令

```bash
cd ~/workspace/ai_chat_memory

# 安装依赖
pip install openai fastapi uvicorn python-dotenv

# 启动后端
uvicorn main:app --reload --port 8000
```

### 测试流程

用 curl 测试多轮对话记忆：

```bash
# 第一轮（不传 session_id，后端自动创建）
curl -X POST http://127.0.0.1:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "我叫张三，正在学 Python 编程。"}'

# 预期输出（session_id 每次不同）：
# {"reply":"你好张三！Python 是一门...","session_id":"a1b2c3d4","history_count":3}

# 第二轮（带上第一轮返回的 session_id）
curl -X POST http://127.0.0.1:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "我叫什么名字？", "session_id": "a1b2c3d4"}'

# 预期输出：
# {"reply":"你叫张三呀！","session_id":"a1b2c3d4","history_count":5}

# 清空会话
curl -X DELETE http://127.0.0.1:8000/sessions/a1b2c3d4

# 再问（记忆已清空）
curl -X POST http://127.0.0.1:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "我叫什么名字？", "session_id": "a1b2c3d4"}'

# 预期输出：
# {"reply":"抱歉，我不知道你的名字。","session_id":"a1b2c3d4","history_count":3}
```

---

## 录制注意

1. **开场对比必须真实运行两次**：开场 30 秒展示两个版本的聊天页面——"无记忆版"和"有记忆版"发同样的消息，对比 AI 的不同回复。建议提前录好无记忆版的画面（直接用 V051 的代码跑），录制时切换到有记忆版实机演示。对比效果越直观，观众越想看下去。
2. **Token 概念要用数字让观众"感受到"**：讲 Token 预算时不要只说"Token 会增长"，要展示具体数字——1 轮约 100 Token、20 轮约 4000 Token、64K 上限。用进度条或图表可视化比纯口播有效得多。可以让观众自己算："200 轮对话，每轮 200 Token，每次请求传多少？"——答案是 4 万，快到上限了。
3. **摘要部分用日志佐证**：自动摘要在课堂上不容易自然触发（需要聊很多轮才超 3000 Token）。建议录制前把 `MAX_HISTORY_TOKENS` 临时调到 500，这样聊三四轮就会触发摘要，终端日志清晰可见。录完再改回来，或在录制中说明"为了演示效果我把阈值调小了"。
4. **语速控制**：整体旁白约 1850 字，按 230 字/分钟控制在 8 分钟以内。Token 预算和自动摘要是信息密集段，适当放慢；开场和结尾正常语速。
5. 提问彩蛋段的 prompt 字幕条需在后期加上，确保观众能暂停照抄。
