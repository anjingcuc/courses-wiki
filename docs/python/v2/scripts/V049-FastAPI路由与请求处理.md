# V049 FastAPI 路由与请求处理

## 视频信息

| 项目 | 内容 |
|---|---|
| 编号 | V049 |
| 标题 | FastAPI 路由与请求处理 |
| 目标时长 | 8 min |
| 对应课次 | L27 Web 应用基础：FastAPI 后端 |
| 前置微课 | V048 Python 异步编程基础 |
| 一句话定位 | 把 AI 调用函数从"自己跑的脚本"变成"别人能访问的 API 服务"——FastAPI 六行代码起步，Pydantic 自动校验加自动文档 |

---

## 逐字稿

### [0:00-0:35] 开场 hook：脚本 vs Web 服务

**【画面】** 屏幕分屏对比。左半"脚本模式"：终端运行 `python chat.py`，一个人在终端里和 AI 聊天。标注"只有你自己能用"。右半"Web 服务模式"：浏览器打开一个页面，URL 是 `http://127.0.0.1:8000/docs`，展示 FastAPI 自动生成的交互式 API 文档。标注"任何人访问 URL 就能用"。中间箭头标注"从一个 .py 文件到一个 URL"。

**【旁白】** 到目前为止你们写的所有 AI 代码——聊天、RAG、Agent——都是脚本：在终端运行 `python main.py`，只有你自己能用。如果要让别人也用你的 AI 功能呢？发一个 .py 文件给别人 `python main.py`？不现实。

Web 服务就是解决这个问题的——把你的代码变成一个 URL，别人访问 URL 就能用你的功能。今天用 FastAPI 框架，六行代码就能启动一个 Web 服务，还会自动生成交互式 API 文档。来看怎么做。

### [0:35-2:00] FastAPI Hello World 与路由概念

**【画面】** VS Code 中展示最简的 `main.py`——6 行代码。高亮 `@app.get("/")` 装饰器，标注"路由 = URL 路径与函数的绑定"。终端运行 `uvicorn main:app --reload`。切换到浏览器，访问 `http://127.0.0.1:8000/` 看到 JSON 响应。再访问 `http://127.0.0.1:8000/hello/张三` 看到带参数的响应。最后访问 `http://127.0.0.1:8000/docs` 展示自动文档页面。

**【旁白】** FastAPI 的 Hello World 只要 6 行：

```python
from fastapi import FastAPI

app = FastAPI(title="AI 聊天 API")

@app.get("/")
def root():
    return {"service": "AI Chat API", "status": "running"}
```

`app = FastAPI()` 创建一个应用实例。`@app.get("/")` 是一个装饰器——它把下面的函数和 URL 路径 `/` 绑定起来。这就是路由的核心概念：**一个 URL 路径对应一个 Python 函数**。用户访问这个 URL，FastAPI 自动调用对应的函数，把返回值变成 JSON 响应发给用户。

启动服务。终端运行 `uvicorn main:app --reload`。`main` 是文件名，`app` 是代码里的变量名，`--reload` 是代码改了自动重启。

浏览器打开 `http://127.0.0.1:8000/`——看到 JSON 响应。你的代码变成了一个 URL！

再访问 `/docs`——这是 FastAPI 自动生成的交互式 API 文档。你不需要写任何文档代码，FastAPI 根据你的类型标注自动生成。点击任何端点，Try it out，直接在页面上测试。这是 FastAPI 最让人惊喜的功能之一。

### [2:00-3:30] 三种参数：路径、查询、请求体

**【画面】** PPT 展示三种参数。①路径参数 `/items/42`——标注"URL 路径的一部分，标识资源"。②查询参数 `/search?q=python&limit=10`——标注"问号后面的，做筛选"。③请求体 POST JSON——标注"放在 body 里的结构化数据"。每个配一段 FastAPI 代码片段。底部口诀："路径回答'哪个'，查询参数回答'怎么给'，请求体传复杂数据"。

**【旁白】** Web API 有三种参数传递方式，必须分清。

第一种，路径参数。URL 路径的一部分，用来标识"哪个资源"。比如 `/users/42` 标识 42 号用户。FastAPI 里这样写：

```python
@app.get("/hello/{name}")
def hello(name: str):
    return {"message": f"你好，{name}！"}
```

`{name}` 是路径里的占位符，用户访问 `/hello/张三`，FastAPI 自动把"张三"传给函数的 `name` 参数。

第二种，查询参数。URL 问号后面的，用来做筛选或配置。比如 `/search?keyword=python&limit=10`。

```python
@app.get("/search")
def search(keyword: str, limit: int = 10):
    return {"keyword": keyword, "limit": limit}
```

函数参数里写了默认值的，FastAPI 自动识别为查询参数。

第三种，请求体。用于 POST 请求，传复杂的结构化数据——比如用户发送的聊天消息。这种用 Pydantic 模型定义，马上讲。

口诀：路径回答"哪个"，查询参数回答"怎么给"，请求体传复杂数据。

### [3:30-5:00] Pydantic 模型：自动校验 + 自动文档

**【画面】** VS Code 中展示 `ChatRequest` 和 `ChatResponse` 两个 Pydantic 模型。高亮 `message: str` 和 `model: str = "deepseek-chat"`。终端演示：在 `/docs` 页面测试 POST /chat，故意把 message 传成数字 123，FastAPI 自动返回 422 校验错误。

**【旁白】** 请求体用 Pydantic 的 `BaseModel` 定义。看这段代码：

```python
from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str                      # 必填，字符串
    model: str = "deepseek-chat"      # 可选，有默认值

class ChatResponse(BaseModel):
    reply: str
    model: str
```

`ChatRequest` 定义了 API 接收的数据结构——用户必须传 `message` 字段（字符串类型），可选传 `model` 字段（不传就用默认值）。

Pydantic 带来两个核心好处。第一，自动校验。如果调用方传的 `message` 不是字符串而是数字——FastAPI 自动返回 422 错误，告诉你哪个字段类型不对。你不用写任何校验代码。

第二，自动文档。FastAPI 根据 Pydantic 模型自动在 `/docs` 里生成请求体和响应体的格式说明——别人一看文档就知道你的 API 需要什么参数、返回什么结构。这就是"类型标注驱动文档"——你写了类型标注，文档就免费送了。

### [5:00-6:30] 可运行闭环：POST /chat——把 LLM 包装成 API

**【画面】** VS Code 中展示完整的 `main.py`——FastAPI app 初始化 + OpenAI client 初始化 + ChatRequest/ChatResponse 模型 + `/health` 和 `/chat` 两个路由。重点高亮 `/chat` 路由里的 `client.chat.completions.create` 调用和异常处理。切换到 `/docs` 页面，输入测试消息 "Python 的列表和元组有什么区别？"，点击 Execute，展示返回的 AI 回复。

**【旁白】** 来把大模型调用包装成 API 服务。完整的 `main.py`——初始化 FastAPI app 和 OpenAI client，定义两个 Pydantic 模型，写两个路由。

`GET /health` 是健康检查——返回 `{"status": "ok"}`。这是 API 服务的标配，让别人能快速检查"服务还活着吗"。

`POST /chat` 是核心端点。接收 `ChatRequest`——用户的消息和可选的模型名。调用 DeepSeek API，拿到回复后包装成 `ChatResponse` 返回。

注意异常处理——如果 DeepSeek API 调用失败（超时、限流、Key 过期），不能让用户看到 500 内部错误。用 try/except 捕获，抛出 HTTP 502 加上有意义的错误信息。

用 `/docs` 测试。输入消息"Python 的列表和元组有什么区别"，点击 Execute——后端调 DeepSeek API，返回"列表是可变序列，元组是不可变序列"。你的 AI 能力现在是一个 API 了——任何人发一个 POST 请求就能用。

### [6:30-7:30] 架构理解：后端是 AI 应用的调度中心

**【画面】** PPT 展示架构图。从左到右四个节点：用户浏览器 → 前端页面(HTML/JS) → 后端 API(FastAPI) → 大模型 API(DeepSeek)。后端标注"调度层"。下方列出后端的三个职责："安全（API Key 不暴露）· 控制（限流日志过滤）· 灵活（随时切换模型）"。

**【旁白】** 最后理解一下后端在 AI 应用架构中的位置。

完整链路是：用户浏览器 → 前端页面 → 后端 API → 大模型 API。后端是中间的调度层。

为什么不直接让前端调大模型 API？三个原因。

第一，安全。API Key 不能暴露在前端代码里——用户按 F12 就能看到你的 Key，然后盗刷你的额度。API Key 只放在后端的环境变量里。

第二，控制。后端可以做限流、日志、内容过滤。某个用户一分钟发了 100 条消息？后端可以拦住他。

第三，灵活。后端可以随时切换模型——今天用 DeepSeek，明天换 Kimi，前端代码一行都不用改。

后端是 AI 应用的调度中心。前端负责和用户交互，大模型负责智能，后端负责把两者安全地连起来。这就是为什么要单独学后端。

### [7:30-7:50] 小结

**【画面】** 字幕条："路由 = URL 绑定函数 · 三种参数：路径/查询/请求体 · Pydantic 自动校验 + 自动文档 · 后端是 AI 应用的调度层"。

**【旁白】** 核心记住几件事：路由就是把 URL 路径和 Python 函数绑定；三种参数——路径参数标识资源，查询参数做筛选，请求体传复杂数据；Pydantic 模型自动校验数据类型并生成 API 文档；后端是 AI 应用的调度中心——管安全、管控制、管灵活扩展。

### [7:50-8:15] 提问彩蛋：把 AI 当家教

**【画面】** 字幕条逐条列出三个 prompt（编号 1/2/3，可暂停照抄）：
1. "请给我 5 个 Web API 场景（比如'删除 42 号用户''按关键词搜索''提交一条聊天消息'），让我判断每个该用路径参数、查询参数还是请求体，我答完你再逐题讲评。"
2. "请讲清楚为什么 AI 应用不能让前端直接调大模型 API？从 API Key 安全、限流控制、切换模型三个角度，各举一个会出事的例子。"
3. "Pydantic 模型为什么能同时做到自动校验和自动文档？请用 ChatRequest 的例子解释类型标注是怎么驱动这两件事的。"

**【旁白】** 这三条原样发给 AI。重点是第一条——它出题你判断、答错它讲评，这才是把 AI 当家教。直接让它替你写 API，答辩的时候就得现原形。

### [8:15-8:25] 引出下集

**【画面】** 下集预告卡片："V050 前端速成：HTML/CSS/JS 最小集——API 返回的是 JSON 数据，用户要的是界面。下集写前端"。

**【旁白】** 今天你们把 AI 能力变成了 API 服务。但 `/docs` 页面是给开发者用的——普通用户不会用。下节课写前端，把它变成一个能用的聊天页面。我们下集见。

---

## 演示操作清单

### 文件结构

```
v046_demo/
├── .env
├── requirements.txt
└── main.py    （FastAPI AI 聊天后端）
```

### 完整代码：main.py

```python
# main.py —— FastAPI AI 聊天后端
"""把 DeepSeek 大模型能力包装成 Web API 服务"""
import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from openai import OpenAI
from pydantic import BaseModel

load_dotenv()

app = FastAPI(title="AI 聊天 API", description="把大模型能力包装成 Web 服务")

# 初始化大模型客户端
client = OpenAI(
    api_key=os.environ.get("DEEPSEEK_API_KEY", ""),
    base_url="https://api.deepseek.com"
)


# ---- Pydantic 模型 ----

class ChatRequest(BaseModel):
    """聊天请求体"""
    message: str                        # 用户消息（必填）
    model: str = "deepseek-chat"        # 模型名（可选，有默认值）


class ChatResponse(BaseModel):
    """聊天响应体"""
    reply: str                          # AI 回复内容
    model: str                          # 实际使用的模型名


# ---- 路由 ----

@app.get("/")
def root():
    """根路径——服务信息"""
    return {"service": "AI Chat API", "status": "running"}


@app.get("/health")
def health_check():
    """健康检查端点"""
    return {"status": "ok"}


@app.get("/hello/{name}")
def hello(name: str):
    """路径参数示例"""
    return {"message": f"你好，{name}！"}


@app.get("/search")
def search(keyword: str, limit: int = 10):
    """查询参数示例"""
    results = [{"id": i, "content": f"关于 {keyword} 的第 {i} 条结果"} for i in range(1, limit + 1)]
    return {"keyword": keyword, "results": results}


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    """AI 聊天接口——接收用户消息，返回 AI 回复"""
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
```

### .env 文件

```bash
DEEPSEEK_API_KEY=sk-你的真实密钥
```

### 运行命令

```bash
cd ~/workspace/python-course/v046_demo

# 安装依赖
pip install fastapi "uvicorn[standard]" openai python-dotenv

# 启动服务
uvicorn main:app --reload --port 8000
```

启动后：
- 浏览器打开 `http://127.0.0.1:8000/` → 服务信息
- 浏览器打开 `http://127.0.0.1:8000/hello/张三` → 路径参数
- 浏览器打开 `http://127.0.0.1:8000/search?keyword=Python&limit=5` → 查询参数
- 浏览器打开 `http://127.0.0.1:8000/docs` → **自动交互式文档**，点击 POST /chat → Try it out → 输入测试消息 → Execute

### 测试 /chat 的请求体

```json
{
  "message": "Python 的列表和元组有什么区别？",
  "model": "deepseek-chat"
}
```

### 预期响应

```json
{
  "reply": "列表是可变序列，可以增删改元素；元组是不可变序列，创建后不能修改...",
  "model": "deepseek-chat"
}
```

---

## 录制注意

1. **开场对比要直击痛点**：脚本 vs Web 服务的对比——左边是一个人孤零零在终端聊天，右边是浏览器里任何人都能访问的 API 文档页面。视觉反差要大，让观众立刻理解"为什么要学 Web 服务"。
2. **/docs 自动文档是全片"wow moment"**：FastAPI 自动生成交互式文档是它最吸引人的功能。展示 `/docs` 页面时，实际点击 Try it out → Execute，让观众看到"输入参数 → 点一下 → 拿到 AI 回复"的完整流程。这个功能比任何口述都更有说服力。
3. **三种参数不要过度展开**：路径参数、查询参数、请求体各给一个简短代码片段即可，不要深入 RESTful 设计规范。核心让观众理解"什么时候用哪种"，而不是 API 设计理论。
4. **语速控制**：整体旁白约 1850 字，按 235 字/分钟控制在 8 分钟以内。Hello World 和 Pydantic 模型部分适当放慢，架构理解部分可以稍快。
5. 提问彩蛋段的 prompt 字幕条需在后期加上，确保观众能暂停照抄。
