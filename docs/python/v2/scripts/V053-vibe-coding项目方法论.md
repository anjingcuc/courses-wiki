# V053 vibe coding 项目方法论

## 视频信息

| 项目 | 内容 |
|---|---|
| 编号 | V053 |
| 标题 | vibe coding 项目方法论 |
| 目标时长 | 9 min |
| 对应课次 | L30 vibe coding 项目方法论 |
| 前置微课 | V052 对话记忆与 Token 管理 |
| 一句话定位 | 把"让 AI 帮你写代码"升级为"你当架构师、AI 当执行者"——掌握从模糊需求到可运行产品的五步流程和四条协作纪律 |

---

## 逐字稿

### [0:00-0:35] 开场 hook：成果前置——一个完整 AI 应用怎么来的

**【画面】** 屏幕左边是一个"AI 翻译助手"的网页——用户输入"人工智能正在改变编程的方式"，选择日文，点击翻译，译文流畅返回，还显示了检测到的源语言。右边是 Trae / VSCode 中这个项目的文件树：`.env`、`main.py`、`static/index.html`，总共不到 300 行代码。画面底部弹出字幕条："从零到可运行 · 用 vibe coding 方式 · 不到 1 小时"。

**【旁白】** 看这个应用——AI 翻译助手，有前端页面、有后端 API、能自动检测语言、翻译结果即时返回。看起来像一个小团队做了一周的东西，实际上用 vibe coding 的方式，一个人不到一小时就能做出来。但关键不是速度——而是你有没有一套方法。今天这集就讲 vibe coding 的项目方法论：怎么从一句模糊的需求，一步步推进到一个能跑的产品。这是期末大项目的前导课，学完就能上手做项目了。

### [0:35-2:00] 核心认知：你当架构师，AI 当执行者

**【画面】** PPT 左右对比。左侧标题"误解：AI 替我写代码"——一个人把整个需求甩给 AI，AI 返回一大坨无法运行的代码，人一脸懵。右侧标题"正解：我设计 + AI 执行 + 我验证"——人画架构图，AI 写模块，人运行验证，循环推进。下方标注一行："vibe coding 的本质 = 你是架构师，AI 是执行者"。

**【旁白】** 先纠正一个常见误解。很多人觉得 vibe coding 就是"把需求发给 AI，让 AI 替我写代码"。这么干的结果通常是——AI 给你返回一大坨代码，几百行，一堆占位符，跑都跑不起来，你还不知道从哪改。

vibe coding 的本质不是"AI 替你干活"，而是**你当架构师，AI 当执行者**。你的职责是三件事：设计——做什么、怎么拆；指挥——一次给 AI 一个明确任务；验证——AI 写完你马上运行，确认能用。AI 的职责是按你的指令生成代码。

这个认知转变非常重要。你不再是"写代码的人"，你是"指挥 AI 写代码并对结果负责的人"。这意味着你需要更强的设计能力和判断力，而不是更弱的。

### [2:00-3:15] 五步流程总览

**【画面】** PPT 展示五步流程横向图，每一步用一个图标和一个关键词标注，箭头依次连接形成闭环：

```
需求拆解 → 架构设计 → 增量生成 → 每步验证 → 调试修复
  做什么      怎么拆     一步步做    能跑了再走  出问题怎么办
```

每一步下方有一行小字说明核心产出。最后用循环箭头标注"增量生成和验证之间反复迭代"。

**【旁白】** vibe coding 的核心是一套五步流程。记住这五步，做任何项目都不会乱。

第一步，**需求拆解**。拿到一句话需求，先别写代码。问自己：这个产品要解决什么问题？核心功能有哪几个？最小可行产品是什么？把大需求拆成几个小模块。

第二步，**架构设计**。确定项目结构——哪些文件、每个文件干什么、API 接口长什么样。这一步写在 Markdown 里，不写代码。

第三步，**增量生成**。按模块逐个让 AI 写代码。关键纪律是——一次只让 AI 做一个模块，不要一次甩整个项目。

第四步，**每步验证**。AI 写完一个模块马上运行，确认能用再进下一步。不要攒一堆再测。

第五步，**调试修复**。出了问题怎么办？读报错、定位模块、修复、再验证。

第三步和第四步之间是反复循环的——写一个模块，验证一下，过了再写下一个。这就像搭积木，每搭一块检查稳不稳，而不是一口气搭完再推一把看倒不倒。

### [3:15-4:30] 实操演示：需求拆解与架构设计

**【画面】** VS Code 中新建 `ai_translator/` 目录，创建 `requirements.md` 文件。屏幕上输入需求文档内容，逐行展示：目标、核心功能列表、技术选型、MVP 定义。然后创建项目目录结构示意图。切换到 API 接口定义。画面重点标注 MVP 的 ✅ 和 ❌ 标记。

**【旁白】** 来实战。需求是"做一个 AI 翻译助手"。

第一步需求拆解——写一份需求文档。核心功能是什么？用户输入文本，选目标语言，点翻译，结果即时返回。技术选型？后端用 FastAPI，前端用原生 HTML，AI 用 DeepSeek API。然后定义 MVP——最小可行产品包括什么，不包括什么。后端翻译端点和前端页面是必须的，历史记录和批量翻译先不做。这一步的关键是**砍范围**——先做能跑的最小版本，功能以后加。

第二步架构设计——画出项目结构。`main.py` 放 FastAPI 后端，`static/index.html` 放前端页面，`.env` 放 API Key。再定义 API 接口：`POST /translate`，接收文本和目标语言，返回译文和检测到的源语言。

这两步不写一行代码，全是设计。但它们决定了后面 AI 生成代码的质量——你给 AI 的上下文越清晰，它生成的代码越靠谱。

### [4:30-5:45] 实操演示：增量生成与 Prompt 拆解

**【画面】** 先展示一段反面 Prompt（整个需求一次性发给 AI），用红色叉标注。然后展示正确的第一步 Prompt（只写后端 /translate 端点），用绿色勾标注。接着在 Trae 中用 AI 生成 `main.py` 代码，手动审查修改（高亮 try/except、.env 读取等人工修改处）。终端运行 `uvicorn main:app --reload`，浏览器打开 `/docs` 测试翻译接口，返回正确结果。

**【旁白】** 第三步增量生成，这里有个核心原则——**Prompt 拆解，一次一个模块**。

反面做法是什么？"帮我做一个 AI 翻译助手，要后端前端，用 FastAPI 和 HTML"——AI 会尝试一次生成所有代码，结果是一堆占位符和跑不起来的半成品。

正确做法是拆成小步。第一步 Prompt 只写后端端点："用 FastAPI 写一个 POST /translate 端点，接收 JSON，调 DeepSeek API 做翻译，返回结构化结果。" AI 生成代码后，你不要直接用——先审查。

看这段 AI 生成的 `main.py`。它用 Pydantic 定义了请求和响应模型，调 DeepSeek API 做翻译，用了 JSON Mode 让 AI 返回结构化数据。但有几个问题：AI 没加异常处理，如果 API 挂了程序直接崩——补上 try/except 和 HTTPException。AI 没加 CORS 中间件，前端调不通——补上。这些就是**你的判断力的体现**。

修完后运行 `uvicorn main:app --reload`，打开 `/docs` 测试。输入"你好世界"，目标语言选英文——返回了正确的译文和源语言检测。后端跑通了，提交代码：`git commit -m "feat: 后端 /translate 端点完成"`。

### [5:45-6:45] 实操演示：前端生成、联调与调试修复

**【画面】** 展示第二步 Prompt（前端页面），AI 生成 `index.html`，包含输入框、语言选择、翻译按钮、fetch 调用。浏览器打开页面，前后端联调成功。然后故意把 `API_URL` 端口改成 9000，点击翻译显示失败——F12 打开 Console 看到 `ERR_CONNECTION_REFUSED`，Network 面板定位到请求失败。修复端口后重新测试通过。

**【旁白】** 第四步——每步验证之后，继续增量生成。第二步 Prompt 写前端："帮我写一个单页 HTML 翻译界面，有文本框、语言下拉选择、翻译按钮，用 fetch 调后端。" AI 生成了 `index.html`，包含完整的界面和交互逻辑。打开浏览器，输入文本，选日文，点击翻译——成功返回译文。前后端联调通过，提交代码。

但实际开发不会这么顺利。来看第五步调试修复。我故意把前端的 API 地址端口改成 9000——后端跑在 8000，前端请求 9000，当然连不上。点击翻译，页面显示"翻译失败"。

怎么排查？F12 打开开发者工具，Console 里看到 `ERR_CONNECTION_REFUSED`——连接被拒绝。切到 Network 面板，看到 `/translate` 请求标红。定位到问题：端口写错了。改回 8000，重新测试，通过。

**这就是每步验证的价值**——如果你一口气让 AI 生成了五个模块再一起测，出了错你根本不知道是前端、后端、还是 API 的问题。增量开发，一步一验，问题永远只在最近改的那个模块里。

### [6:45-7:45] AI 结对开发四条纪律

**【画面】** PPT 逐条展示四条纪律，每条配一个简短的场景图标：

```
① Prompt 拆解——一次一个模块（不要一次甩整个项目）
② 大改前先 commit——随时能回退（git 是安全网）
③ 每步验证——AI 写完马上运行（不要攒一堆再测）
④ 不懂的代码不放过——每一行你都要能解释
```

**【旁白】** 把刚才演示中体现的纪律总结成四条。

第一，**Prompt 拆解**。一次只让 AI 做一个模块。这是 vibe coding 的第一原则。大需求拆成小任务，每个任务都是一个明确的、可验证的单元。

第二，**大改前先 commit**。每次让 AI 大段改代码之前，先 `git commit`。为什么？AI 改完如果出了问题，你一条 `git diff` 就能看清它改了什么，一条 `git checkout` 就能回退。没有 git 兜底，AI 改崩了你只能手动找 undo，心态会崩。

第三，**每步验证**。AI 写完马上运行，不要攒着。跑通了再进下一步。

第四，**不懂的代码不放过**。AI 生成的每一行你都要能解释。看到看不懂的代码——问 AI"这行什么意思"，理解了再保留；如果不影响功能，试着删掉看还能不能跑。**答辩时评委会随机指一行代码问你"这是干什么的"，说"AI 写的我不知道"直接扣分。**

### [7:45-8:30] AI 协作日志：对你和 AI 的协作过程负责

**【画面】** 展示一份 AI 协作日志的 Markdown 片段，包含功能名、AI 生成比例、Prompt 要点、人工修改列表（逐条列出改了什么、为什么改）、验证方式、花费时间。重点高亮"人工修改"区域。

**【旁白】** 最后讲一个期末项目的要求——AI 协作日志。每个功能模块记录一条：AI 生成了什么、你做了哪些人工修改、为什么改、怎么验证的。

这不是形式主义。记录日志的过程就是你审视代码的过程。写"人工修改"的时候你会想"我为什么改了这里"——这种反思就是成长。

答辩时评委会看你的日志，关注两点：你能不能说清 AI 做了什么、你做了什么；你的修改有没有体现判断力。"AI 全写的"和"我全改了"都不是好答案——好答案是"AI 生成了框架，我在关键处做了判断和修正"。

### [8:30-8:50] 小结

**【画面】** 字幕条逐条出现："五步流程：需求→架构→增量→验证→调试 · 四条纪律：拆解/commit/验证/看懂 · 你是架构师，AI 是执行者 · AI 协作日志 = 对代码负责"。

**【旁白】** 核心记住几件事：五步流程——需求拆解、架构设计、增量生成、每步验证、调试修复，做任何项目都按这个节奏走。四条纪律——Prompt 拆解、大改前 commit、每步验证、不懂的代码不放过。本质是一条——你是架构师，AI 是执行者，你对最终代码负责。

### [8:50-9:15] 提问彩蛋：把方法论立刻用起来

**【画面】** 字幕条逐条列出三个 prompt："① 我想做一个【填你的项目想法】，请扮演架构师，用提问带我走完需求拆解和 MVP 定义，帮我砍范围，但不要替我写代码。 ② 请讲解'Prompt 拆解、一次一个模块'为什么有效，然后带我练习：把'帮我做一个 AI 翻译助手'这种大 Prompt 拆成 3 到 4 个可单独验证的小 Prompt。 ③ AI 协作日志里的'人工修改'栏该怎么写才体现判断力？请各给一个好例子和一个差例子，并点评差别在哪。"

**【旁白】** 方法论不是背下来的，是用出来的。这三个 prompt 直接照抄——让 AI 扮演架构师陪你把自己的项目拆一遍，比把这集再看五遍都有用。记住，你是提问的那个人，方向得你定。

### [9:15-9:25] 引出下集

**【画面】** 下集预告卡片：M5 收官，L31 期末大项目正式发布——展示项目池列表（AI 知识库助手 / 智能学伴 / AI 创意工坊 / 智能数据分析师 / AI 客服机器人）。

**【旁白】** M5 全部讲完了——你们已经具备做 AI 应用的全部基础。下一集就是期末大项目启动：选题、分组、开始做。方法已经给你了，接下来就是实战。我们下集见。

---

## 演示操作清单

### 文件结构

```
ai_translator/
├── .env
├── requirements.txt
├── main.py               # FastAPI 后端
├── requirements.md        # 需求文档（第一步产出）
└── static/
    └── index.html         # 前端页面
```

### 演示1：需求文档（五步流程第一步）

```markdown
# AI 翻译助手——需求文档

## 目标
做一个支持多语言的 AI 翻译 Web 应用。

## 核心功能
1. 用户输入文本，选择目标语言，点击翻译
2. AI 自动检测源语言并翻译
3. 翻译结果即时显示

## 技术选型
- 后端：FastAPI（L27）
- 前端：原生 HTML/CSS/JS（L28）
- AI：DeepSeek API（L19）
- API Key 管理：.env + python-dotenv（L18）

## MVP 定义
- ✅ 后端 POST /translate 端点
- ✅ 前端单页翻译界面
- ✅ 支持 4 种目标语言
- ❌ 历史记录（后续迭代）
- ❌ 文件批量翻译（后续迭代）
```

### 演示2：架构设计与 API 定义（五步流程第二步）

```
ai_translator/
├── .env
├── requirements.txt
├── main.py           # FastAPI 后端
└── static/
    └── index.html    # 前端页面

API 定义：
POST /translate
  请求体: {"text": "你好世界", "target_lang": "英文"}
  响应体: {"original": "你好世界", "translated": "Hello World", "detected_lang": "中文"}
```

### 演示3：后端端点（五步流程第三步）

**给 AI 的 Prompt**：

```
用 FastAPI 写一个 POST /translate 端点。
要求：
1. 请求体（Pydantic BaseModel）：text: str, target_lang: str = "英文"
2. 响应体（Pydantic BaseModel）：original: str, translated: str, detected_lang: str
3. 调用 DeepSeek API（from openai import OpenAI, base_url="https://api.deepseek.com"）
4. System prompt 指示 AI 做翻译并返回 JSON 格式结果
5. API Key 从环境变量 DEEPSEEK_API_KEY 读取（用 python-dotenv）
6. 加 CORS 中间件
7. 加异常处理（API 调用失败时返回 HTTP 502）
```

**审查修正后的完整代码：main.py**

```python
# main.py —— AI 翻译助手后端
import os
import json

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pathlib import Path
from pydantic import BaseModel

load_dotenv()

app = FastAPI(title="AI 翻译助手")

# 人工修改：AI 漏了 CORS，前端调不通，补上
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

from openai import OpenAI

client = OpenAI(
    api_key=os.environ.get("DEEPSEEK_API_KEY", ""),
    base_url="https://api.deepseek.com"
)


class TranslateRequest(BaseModel):
    text: str
    target_lang: str = "英文"


class TranslateResponse(BaseModel):
    original: str
    translated: str
    detected_lang: str


@app.post("/translate", response_model=TranslateResponse)
def translate(request: TranslateRequest):
    """AI 翻译接口"""
    system_prompt = f"""你是一个专业翻译。请将用户输入的文本翻译成{request.target_lang}。
同时检测原文是什么语言。

请以 JSON 格式返回（不要有其他内容）：
{{"translated": "翻译结果", "detected_lang": "检测到的源语言名称"}}"""

    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.text}
            ],
            response_format={"type": "json_object"}
        )

        result = json.loads(response.choices[0].message.content)

        return TranslateResponse(
            original=request.text,
            translated=result.get("translated", ""),
            detected_lang=result.get("detected_lang", "未知")
        )

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI 返回格式解析失败")
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"翻译失败: {e}")


@app.get("/")
def serve_index():
    return FileResponse(Path(__file__).parent / "static" / "index.html")
```

### 演示4：前端页面（五步流程第四步）

**给 AI 的 Prompt**：

```
帮我写一个单页 HTML 翻译界面（不用框架）：
1. 有一个多行文本输入框（输入待翻译文本）
2. 有一个下拉选择框（目标语言：英文/日文/法文/韩文）
3. 有一个"翻译"按钮
4. 点击后用 fetch 调用 POST http://127.0.0.1:8000/translate
5. 显示：原文、源语言标签、译文
6. 翻译时显示 loading 状态
7. 用 async/await，加 try/catch 错误处理
8. 样式简洁现代
```

**AI 生成 + 审查微调后的完整代码：static/index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI 翻译助手</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, "Microsoft YaHei", sans-serif;
            background: #f0f2f5;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding: 40px 20px;
        }
        .container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.08);
            padding: 32px;
            max-width: 600px;
            width: 100%;
        }
        h1 { font-size: 24px; margin-bottom: 24px; color: #333; }
        textarea {
            width: 100%;
            height: 100px;
            padding: 12px;
            border: 1px solid #d0d0d0;
            border-radius: 8px;
            font-size: 15px;
            resize: vertical;
            outline: none;
        }
        textarea:focus { border-color: #4a90d9; }
        .controls { display: flex; gap: 12px; margin: 12px 0; }
        select {
            padding: 10px 14px;
            border: 1px solid #d0d0d0;
            border-radius: 8px;
            font-size: 15px;
            background: white;
        }
        button {
            padding: 10px 28px;
            background: #4a90d9;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 15px;
            cursor: pointer;
        }
        button:hover { background: #357abd; }
        button:disabled { background: #ccc; cursor: notallowed; }
        .result {
            margin-top: 20px;
            padding: 16px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #4a90d9;
        }
        .result .label { font-size: 13px; color: #999; margin-bottom: 4px; }
        .result .translation { font-size: 20px; color: #333; line-height: 1.6; }
        .lang-tag {
            display: inline-block;
            padding: 2px 8px;
            background: #e8f0fe;
            color: #4a90d9;
            border-radius: 4px;
            font-size: 12px;
            margin-bottom: 8px;
        }
        .loading { color: #999; font-style: italic; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌐 AI 翻译助手</h1>

        <textarea id="inputText" placeholder="输入要翻译的文本..."></textarea>

        <div class="controls">
            <select id="targetLang">
                <option value="英文">English</option>
                <option value="日文">日本語</option>
                <option value="法文">Français</option>
                <option value="韩文">한국어</option>
            </select>
            <button id="translateBtn" onclick="doTranslate()">翻译</button>
        </div>

        <div id="resultArea"></div>
    </div>

    <script>
        const API_URL = "http://127.0.0.1:8000/translate";

        async function doTranslate() {
            const text = document.getElementById("inputText").value.trim();
            if (!text) return;

            const targetLang = document.getElementById("targetLang").value;
            const btn = document.getElementById("translateBtn");
            const resultArea = document.getElementById("resultArea");

            btn.disabled = true;
            btn.textContent = "翻译中...";
            resultArea.innerHTML = '<div class="loading">正在翻译...</div>';

            try {
                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: text, target_lang: targetLang })
                });

                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                const data = await response.json();

                resultArea.innerHTML = `
                    <div class="result">
                        <span class="lang-tag">原文: ${data.detected_lang}</span>
                        <div class="label">翻译结果（${targetLang}）</div>
                        <div class="translation">${data.translated}</div>
                    </div>
                `;
            } catch (error) {
                resultArea.innerHTML = `<div class="result">⚠️ 翻译失败: ${error.message}</div>`;
                console.error("翻译失败:", error);
            } finally {
                btn.disabled = false;
                btn.textContent = "翻译";
            }
        }
    </script>
</body>
</html>
```

### 运行命令

```bash
# 创建项目目录
mkdir -p ~/workspace/ai_translator/static
cd ~/workspace/ai_translator

# 创建 .env 文件（填入你的 API Key）
echo 'DEEPSEEK_API_KEY=sk-your-key-here' > .env

# 安装依赖
pip install fastapi "uvicorn[standard]" openai python-dotenv

# 启动后端
uvicorn main:app --reload --port 8000

# 浏览器测试
# 后端 API 文档: http://127.0.0.1:8000/docs
# 前端页面:      http://127.0.0.1:8000/
```

### 预期输出

```
# 浏览器打开 http://127.0.0.1:8000/docs，测试 /translate：

请求: {"text": "你好世界", "target_lang": "英文"}
响应: {"original": "你好世界", "translated": "Hello World", "detected_lang": "中文"}

请求: {"text": "人工智能正在改变编程的方式", "target_lang": "日文"}
响应: {"original": "人工智能正在改变编程的方式", "translated": "人工知能はプログラミングのあり方を変えています", "detected_lang": "中文"}

# 浏览器打开 http://127.0.0.1:8000/，前端页面输入文本，选择语言，点击翻译，结果正常显示。
```

### git commit 节奏

```bash
# 第一步完成后（后端端点验证通过）
git add .
git commit -m "feat: 后端 /translate 端点完成"

# 第二步完成后（前端联调通过）
git add .
git commit -m "feat: 前端翻译界面完成，前后端联调通过"

# 调试修复后
git commit -m "fix: 修复前端 API 端口配置"
```

### AI 协作日志模板

```markdown
## AI 协作日志

### 功能：POST /translate 端点
- **AI 生成**：80% 代码由 AI 生成
- **Prompt 要点**："用 FastAPI 写 POST /translate，调 DeepSeek API，返回翻译结果"
- **人工修改**：
  1. AI 没加异常处理 → 补了 try/except 和 HTTPException
  2. AI 没加 CORS 中间件 → 手动添加（前端联调时发现）
  3. AI 用了 response_format JSON Mode → 保留（V040 学过的技巧）
- **验证方式**：用 /docs 测试，输入"你好世界"→目标语言"英文"→返回"Hello World"
- **花费时间**：AI 生成 5 分钟，人工修改 15 分钟，测试 5 分钟

### 功能：前端翻译页面
- **AI 生成**：95% 代码由 AI 生成
- **人工修改**：CSS 微调按钮颜色
- **验证方式**：浏览器打开，翻译测试 5 轮，交互正常
- **花费时间**：AI 生成 3 分钟，人工修改 10 分钟
```

---

## 录制注意

1. **开场成果前置要展示完整的应用运行效果**：开场 30 秒必须真实运行 AI 翻译助手——前端页面输入文本、选语言、点翻译、看到结果。同时屏幕右侧展示项目的文件树和代码行数（不到 300 行），让观众直观感受"一个人一小 时能做出来的完整应用长什么样"。不要用截图，要真实操作。

2. **五步流程讲解时配合 PPT 流程图动画**：五步流程信息密度高，纯口播观众容易迷失。建议用 PPT 横向流程图，讲到哪步高亮哪步，第三步和第四步之间用循环箭头标注"反复迭代"。核心让观众记住五步的名称和顺序，细节在后面的实操演示中自然呈现。

3. **增量生成的反面案例和正面案例必须对比展示**：Prompt 拆解是这集最重要的实操知识点。一定要先展示反面做法（一次性甩整个需求给 AI），让观众感受到"一坨代码"的痛点；再展示正确做法（一次一个模块），形成鲜明对比。两个 Prompt 文本要完整展示在屏幕上，方便学生截图保存。

4. **调试修复环节要真实操作 F12 面板**：第五步调试修复不是口讲——要真实操作：故意改错端口 → 点击翻译看到失败 → 打开 F12 → 展示 Console 的报错和 Network 的红色请求 → 定位问题 → 修复 → 重新测试通过。整个过程不超过 60 秒，但让学生看到完整的调试思路链。
5. 提问彩蛋段的 prompt 字幕条需在后期加上，确保观众能暂停照抄。
