# V051 fetch/async-await 调用 API

## 视频信息

| 项目 | 内容 |
|---|---|
| 编号 | V051 |
| 标题 | fetch/async-await 调用 API |
| 目标时长 | 7 min |
| 对应课次 | L28 Web 前端速成与 AI 整合 |
| 前置微课 | V050 前端速成：HTML/CSS/JS 最小集 |
| 一句话定位 | 用 JavaScript 的 fetch 调后端 API、用 async/await 处理异步——把上集的聊天骨架接上真正的 AI，前后端联调跑通 |

---

## 逐字稿

### [0:00-0:30] 开场 hook：骨架活了——真正和 AI 聊天

**【画面】** 浏览器中打开聊天页面。用户输入"Python 是什么？"，点击发送——用户消息出现在右侧蓝色气泡，页面显示"AI 正在思考..."，几秒后 AI 回复出现在左侧白色气泡"Python 是一种广泛使用的高级编程语言..."。接着再输入"列表和元组有什么区别？"，同样流程，AI 回复出现。画面定格，字幕条："骨架活了 · fetch 调 API · AI 真正回复"。

**【旁白】** 上集搭了聊天页面骨架——能输入能显示，但回复是假的桩文字。今天给它接上真正的 AI。用户输入"Python 是什么"——发送后等几秒，AI 真正的回复出现在页面上。从骨架到能用，中间就差一个 fetch。今天七分钟搞定它。

### [0:30-2:00] fetch：浏览器里调 API 的标准方法

**【画面】** VS Code 中展示 `sendMessage` 函数里的 fetch 调用。逐行高亮：`fetch(API_URL, {...})`——发请求；`method: "POST"`——HTTP 方法；`headers`——请求头指定 JSON；`body: JSON.stringify({message: message})`——请求体。旁边对比 Python 的 requests 调用——标注"fetch 就是 JS 版的 requests"。

**【旁白】** fetch 是浏览器里调 API 的标准方法。你可以把它理解为 JavaScript 版的 Python requests——发一个 HTTP 请求，拿到响应。

来看调用结构：

```javascript
const response = await fetch("http://127.0.0.1:8000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: message })
});
```

第一个参数是 URL——上节课做的 `/chat` 端点。第二个参数是配置对象：`method` 指定 POST 方法；`headers` 告诉后端"我发的是 JSON 数据"；`body` 是请求体——用 `JSON.stringify` 把 JavaScript 对象转成 JSON 字符串。

注意请求体里的字段名 `message`——必须和后端 Pydantic 模型 `ChatRequest` 里的字段名完全一致。后端定义的是 `message: str`，前端就发 `{message: "..."}`。字段名拼错是前后端联调最高频的 bug。

fetch 和 requests 的核心区别在于——fetch 是异步的。网络请求需要时间等待，JavaScript 不会卡住干等，而是"先去干别的，等响应回来了再处理"。这就需要 async/await。

### [2:00-3:15] async/await：处理异步响应

**【画面】** PPT 动画展示异步过程。时间轴上：①发 fetch 请求 → ②"代码暂停等待"（标注 await）→ ③响应回来 → ④继续执行解析 JSON。对比"没有 await"的情况：发请求后立刻执行下一行，但 response 还没回来，报错。标注："await = 等这行完成再继续"。

**【旁白】** async/await 是处理异步操作的语法。概念和 Python 里的 async/await 完全一样。

为什么需要它？fetch 发出请求后，响应不会立刻回来——网络传输需要时间。如果不用 await，代码会立刻执行下一行，但这时候 response 还没到，程序就出错了。

```javascript
async function sendMessage() {
    const response = await fetch(API_URL, { ... });
    const data = await response.json();
    // data.reply 就是 AI 的回复
}
```

两个关键点。第一，函数声明前加 `async`——告诉浏览器"这个函数里有异步操作"。第二，异步操作前加 `await`——"等这行完成，拿到结果，再继续"。

`await fetch(...)` 等待 HTTP 响应回来。`await response.json()` 等待把响应体解析成 JavaScript 对象。两次 await——第一次等网络，第二次等解析。

拿到 `data` 后，`data.reply` 就是后端返回的 AI 回复——因为后端 `ChatResponse` 模型里的字段叫 `reply`。又是字段名对应——后端 reply，前端也读 reply。

### [3:15-4:30] 可运行闭环：完整 sendMessage 函数

**【画面】** VS Code 中展示完整的 `sendMessage` 函数。用流程标注六个步骤：①取输入框文字；②显示用户消息 + 禁用按钮；③显示"AI 正在思考..."；④fetch 调 API；⑤移除思考提示 + 显示 AI 回复；⑥finally 恢复按钮。终端启动后端 `uvicorn main:app --reload`，浏览器打开页面，输入消息发送，展示完整交互流程。

**【旁白】** 来写完整的 `sendMessage` 函数。六步走通从前端输入到 AI 回复。

第一步，取输入框的文字，空消息不发。

第二步，把用户消息显示在聊天区域，同时清空输入框、禁用发送按钮——防止用户连点。

第三步，显示"AI 正在思考..."提示，让用户知道正在处理。用户体验上这很重要——没有等待提示，用户会以为页面卡了。

第四步，核心——fetch 调 API。用 async/await 等待响应，解析 JSON。

第五步，移除"正在思考"提示，把 AI 回复显示在聊天区域。

第六步，finally 里恢复发送按钮——不管成功还是失败，按钮都要恢复可点。

完整流程跑一遍。终端启动后端 `uvicorn main:app --reload`，浏览器打开页面。输入"Python 是什么"——用户消息出现，"正在思考..."出现，几秒后 AI 回复出现。成功！

注意一个细节——前后端必须同时运行。后端 uvicorn 跑着，前端才能 fetch 到它。这是前后端开发的基本工作模式：两个进程同时跑。

### [4:30-5:15] CORS：前后端联调的第一个坑

**【画面】** 浏览器按 F12 打开 Console 面板。展示 CORS 报错信息："Access-Control-Allow-Origin ... has been blocked by CORS policy"。红色错误高亮。然后切换到后端代码，展示添加 `CORSMiddleware` 的过程。刷新前端，报错消失，正常通信。字幕条："CORS = 浏览器的安全策略 · 后端必须声明允许跨域"。

**【旁白】** 前后端联调时你一定会遇到一个坑——CORS。

现象是这样的：前端页面在浏览器打开后调 fetch，F12 Console 里报一个红色错误"has been blocked by CORS policy"。请求发出去了但被浏览器拦住了。

原因：浏览器有同源策略——默认不允许一个地址的页面访问另一个地址的 API。前端在 `localhost:5500` 打开，后端在 `localhost:8000` 跑——端口不同就是"不同源"，浏览器拦住。

解决方法在后端——加 CORS 中间件，声明"我允许其他地址来访问我"：

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # 开发阶段允许所有来源
    allow_methods=["*"],
    allow_headers=["*"],
)
```

加了之后刷新前端，报错消失，正常通信。这是前后端联调的第一坑，也是必须知道的一个坑——几乎所有新手都会踩。

### [5:15-6:00] F12 调试：前后端联调的两把利器

**【画面】** 浏览器 F12 开发者工具。展示两个面板。Console 面板——查看 JS 报错（如 `fetch failed`、`Cannot read property`）。Network 面板——点击 `/chat` 请求，展示请求头、请求体、响应体。标注："console.log() 打印数据 · Network 查看请求详情"。

**【旁白】** 前后端联调出问题时，F12 开发者工具是核心武器。

Console 面板看 JavaScript 错误——如果 fetch 失败、变量是 undefined、字段名不匹配，这里会报错。调试时养成习惯——在代码里加 `console.log(data)` 打印响应内容，看后端到底返回了什么。

Network 面板看 HTTP 请求——点击 `/chat` 请求能看到完整的请求头、请求体、响应体。后端返回的 JSON 在这里一目了然。如果前端拿不到数据，先来 Network 看响应体——是字段名拼错了？还是后端返回了错误？

记住两把利器：`console.log()` 打印数据，Network 面板查看请求。这两个能帮你定位绝大多数前后端联调问题。

### [6:00-6:45] 小结

**【画面】** 字幕条："fetch = JS 版 requests · async/await 处理异步 · 字段名必须前后端一致 · CORS 是联调第一坑 · F12 是调试利器"。

**【旁白】** 核心记住几件事：fetch 是浏览器里调 API 的标准方法，和 Python 的 requests 本质一样；async/await 处理异步——await 等 fetch 完成再继续；请求体字段名必须前后端完全一致——这是联调最高频的 bug；CORS 是前后端联调第一坑——后端加中间件解决；F12 的 Console 和 Network 是调试两把利器。

### [6:45-7:10] 提问彩蛋：让 AI 反过来考你

**【画面】** 字幕条逐条列出三个 prompt："① 请用一个生活类比讲清 JavaScript 的 async/await 到底在'等'什么，然后出 3 道判断题检验我是否真懂。 ② 浏览器报 'blocked by CORS policy' 时，请解释同源策略是什么、为什么后端加 CORSMiddleware 就能解决，并对比 2 个容易混淆的相关概念。 ③ 请扮演前后端联调面试官，围绕 fetch 请求体字段名、F12 的 Network 面板、async/await 连续追问我，答错了就纠正我。"

**【旁白】** 这集的知识光靠看视频记不牢——暂停一下，挑一个 prompt 发给 AI，让它反过来考你。能被追问住还能答上来，才算真懂了；问它"为什么"，比问它"怎么做"学到得多。

### [7:10-7:25] 引出下集

**【画面】** 回顾 M5 模块全景图——从 L19 API 调用到 L28 前端整合，完整链路已打通。标注"下一步：对话记忆与状态管理"。下集预告卡片："V052 对话记忆与 Token 管理——你的聊天页面每次发消息 AI 都'失忆'，怎么让它记住上下文？"

**【旁白】** 恭喜——你现在有了一个能用的 AI 聊天页面：前端发消息、后端调 AI、AI 回复显示在页面上。但有个问题——每次发消息 AI 都是"失忆"的，不记得上一句说了什么。怎么让 AI 记住对话历史？那就是下一站的内容了。我们下集见。

---

## 演示操作清单

### 文件结构

```
v048_demo/
├── main.py             （后端：加 CORS 中间件）
└── static/
    └── index.html      （前端：完整聊天页面）
```

### 后端代码：main.py（加 CORS）

```python
# main.py —— FastAPI 后端（在 V049 基础上加 CORS + 静态文件服务）
import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from openai import OpenAI
from pydantic import BaseModel
from pathlib import Path

load_dotenv()

app = FastAPI(title="AI 聊天 API")

# ---- CORS 中间件：允许前端跨域访问 ----
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(
    api_key=os.environ.get("DEEPSEEK_API_KEY", ""),
    base_url="https://api.deepseek.com"
)


class ChatRequest(BaseModel):
    message: str
    model: str = "deepseek-chat"


class ChatResponse(BaseModel):
    reply: str
    model: str


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    try:
        response = client.chat.completions.create(
            model=request.model,
            messages=[
                {"role": "system", "content": "你是一个友好的 AI 助手。"},
                {"role": "user", "content": request.message}
            ]
        )
        reply = response.choices[0].message.content
        return ChatResponse(reply=reply, model=request.model)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"大模型调用失败: {e}")


# ---- 提供前端页面 ----
@app.get("/")
def serve_index():
    """返回聊天页面"""
    index_path = Path(__file__).parent / "static" / "index.html"
    return FileResponse(index_path)
```

### 前端代码：static/index.html（完整版）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI 聊天助手</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: -apple-system, "Microsoft YaHei", sans-serif;
            background: #f5f5f5;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }

        header {
            background: #4a4a4a;
            color: white;
            padding: 12px 20px;
            font-size: 18px;
            font-weight: bold;
        }

        #chatBox {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
        }

        .message {
            max-width: 70%;
            margin-bottom: 12px;
            padding: 10px 16px;
            border-radius: 12px;
            line-height: 1.6;
            word-wrap: break-word;
        }

        .user-msg {
            background: #4a90d9;
            color: white;
            margin-left: auto;
        }

        .ai-msg {
            background: white;
            color: #333;
            border: 1px solid #e0e0e0;
        }

        .loading { color: #999; font-style: italic; }

        #inputArea {
            display: flex;
            padding: 12px;
            background: white;
            border-top: 1px solid #e0e0e0;
        }

        #userInput {
            flex: 1;
            padding: 10px 14px;
            font-size: 15px;
            border: 1px solid #d0d0d0;
            border-radius: 8px;
            outline: none;
        }

        #userInput:focus { border-color: #4a90d9; }

        button {
            margin-left: 8px;
            padding: 10px 24px;
            font-size: 15px;
            background: #4a90d9;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
        }

        button:hover { background: #357abd; }
        button:disabled { background: #ccc; cursor: not-allowed; }

        #clearBtn { background: #e0e0e0; color: #666; }
    </style>
</head>
<body>
    <header>🤖 AI 聊天助手</header>

    <div id="chatBox">
        <div class="message ai-msg">你好！我是你的 AI 助手，有什么可以帮你的吗？</div>
    </div>

    <div id="inputArea">
        <input type="text" id="userInput" placeholder="输入消息..."
               onkeypress="if(event.key==='Enter') sendMessage()">
        <button id="clearBtn" onclick="clearChat()">清空</button>
        <button id="sendBtn" onclick="sendMessage()">发送</button>
    </div>

    <script>
        const API_URL = "http://127.0.0.1:8000/chat";

        async function sendMessage() {
            const input = document.getElementById("userInput");
            const message = input.value.trim();
            if (!message) return;

            // 1. 显示用户消息
            addMessage(message, "user-msg");

            // 2. 清空输入框，禁用按钮
            input.value = "";
            const sendBtn = document.getElementById("sendBtn");
            sendBtn.disabled = true;
            sendBtn.textContent = "发送中...";

            // 3. 显示等待提示
            const loadingMsg = addMessage("AI 正在思考...", "ai-msg loading");

            try {
                // 4. fetch 调用后端 API
                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: message })
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                // 5. 解析响应
                const data = await response.json();

                // 6. 显示 AI 回复
                loadingMsg.remove();
                addMessage(data.reply, "ai-msg");

            } catch (error) {
                loadingMsg.remove();
                addMessage(`⚠️ 请求失败: ${error.message}`, "ai-msg");
                console.error("API 调用失败:", error);
            } finally {
                sendBtn.disabled = false;
                sendBtn.textContent = "发送";
                input.focus();
            }
        }

        function addMessage(text, className) {
            const chatBox = document.getElementById("chatBox");
            const msgDiv = document.createElement("div");
            msgDiv.className = "message " + className;
            msgDiv.textContent = text;
            chatBox.appendChild(msgDiv);
            chatBox.scrollTop = chatBox.scrollHeight;
            return msgDiv;
        }

        function clearChat() {
            document.getElementById("chatBox").innerHTML = "";
            addMessage("对话已清空。", "ai-msg");
        }
    </script>
</body>
</html>
```

### 运行命令

```bash
cd ~/workspace/python-course/v048_demo

# 安装依赖（如尚未安装）
pip install fastapi "uvicorn[standard]" openai python-dotenv

# 启动后端
uvicorn main:app --reload --port 8000
```

启动后浏览器打开 `http://127.0.0.1:8000/` 即可看到聊天页面。输入消息发送，和 AI 聊天。

### 调试技巧

- **F12 Console**：查看 JS 错误，加 `console.log(data)` 打印响应内容
- **F12 Network**：点击 `/chat` 请求查看请求体和响应体，确认字段名匹配
- **CORS 报错**：确保后端加了 `CORSMiddleware`（上方代码已包含）

---

## 录制注意

1. **开场必须真实运行**：开场展示的聊天交互——用户输入消息、AI 真正回复——必须前后端同时运行、真实调通。这是上集骨架"活了"的关键时刻，观众要看到"上集的桩文字变成了真正的 AI 回复"。
2. **fetch 和 async/await 讲解要对比 Python**：学生已经学过 Python 的 requests，把 fetch 类比为"JS 版 requests"能大幅降低理解门槛。async/await 也提到"和 Python 的概念一样"——利用已有知识建立桥梁。
3. **CORS 坑要"先触发再解决"**：不要一上来就展示加了 CORS 的代码。先不加 CORS、展示 F12 Console 的红色报错，让观众看到"坑长什么样"，再加上 CORS 解决。这种"先踩坑再填坑"的演示比直接给答案更有教学效果。
4. **语速控制**：整体旁白约 1650 字，按 235 字/分钟控制在 7 分钟以内。fetch 和 async/await 是核心，适当放慢；CORS 和 F12 调试部分可以稍快。
5. 提问彩蛋段的 prompt 字幕条需在后期加上，确保观众能暂停照抄。
