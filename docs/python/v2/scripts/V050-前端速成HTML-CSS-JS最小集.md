# V050 前端速成：HTML/CSS/JS 最小集

## 视频信息

| 项目 | 内容 |
|---|---|
| 编号 | V050 |
| 标题 | 前端速成：HTML/CSS/JS 最小集 |
| 目标时长 | 8 min |
| 对应课次 | L28 Web 前端速成与 AI 整合 |
| 前置微课 | V049 FastAPI 路由与请求处理 |
| 一句话定位 | 不是前端课——只需看懂 div/input/button/script 四个标签加三行 CSS，搭出 AI 聊天页面的骨架，细节全交给 AI 生成 |

---

## 逐字稿

### [0:00-0:35] 开场 hook：从 API 文档到真正的聊天界面

**【画面】** 屏幕分屏对比。左半打开 `http://127.0.0.1:8000/docs`——FastAPI 的开发者文档页面，标注"这是给开发者用的"。右半打开一个漂亮的 AI 聊天页面——有标题栏、消息气泡、输入框、发送按钮——用户输入"Python 是什么"，AI 回复出现在气泡里。标注"这是给用户用的"。中间箭头："今天用一节课把左边变成右边"。

**【旁白】** 上节课你们做了一个 AI 聊天 API——`POST /chat` 发消息，返回 AI 回复。但 `/docs` 那个页面是给开发者用的——普通用户不会打开它。用户要的是这样的界面——一个聊天页面，输入消息，看到回复。今天用一节课，把 API 接上前端界面。不深入——HTML、CSS、JavaScript 各学够用的最小集，搭出骨架就行。

### [0:35-2:00] HTML 三件套：div、input、button

**【画面】** VS Code 中从空文件开始写 HTML。逐行添加：先写 `<div>` 容器——标注"盒子，装内容"；再写 `<input>` ——标注"输入框"；再写 `<button>` ——标注"按钮"；最后写 `<script>` 标签——标注"JS 代码放这里"。浏览器实时刷新展示效果——从空白页面逐步变成有输入框和按钮的页面。

**【旁白】** 先搭 HTML 骨架。一个聊天页面需要四个核心标签。

`<div>` ——盒子，用来装内容、做布局。页面上看到的每一块区域——标题栏、消息区域、输入区域——本质都是 div。

`<input type="text">` ——输入框。用户在这里打字。每个 input 有个 `id`，后面 JS 通过 id 找到它、读取里面的文字。

`<button onclick="sendMessage()">` ——按钮。`onclick` 属性告诉浏览器"点击时执行哪个 JS 函数"。

`<script>` ——JavaScript 代码写在这个标签里。DOM 操作、API 调用、事件处理全在这里面。

就这四个。一个聊天页面的骨架：

```html
<div id="chatBox"></div>
<input type="text" id="userInput" placeholder="输入消息...">
<button onclick="sendMessage()">发送</button>

<script>
// JavaScript 代码写这里
</script>
```

不深入 HTML——你不需要知道所有标签。div、input、button、script 四个够搭大多数页面。复杂的 HTML 交给 AI 生成——前端 UI 是 AI 最擅长的领域之一。

### [2:00-3:15] CSS 三属性：够用就好

**【画面】** VS Code 中在 `<style>` 标签里逐行添加 CSS。先加 `font-family`——页面字体变了。再加 `padding`——按钮和输入框有了内边距。最后加 `border-radius`——方角变成了圆角。浏览器实时刷新，页面从"丑"变成"能看"。

**【旁白】** HTML 骨架搭好了，但默认样式很丑。加三行 CSS 让它"能看"。

CSS 就是给 HTML 穿衣服。你不需要学 CSS 的全部——三个属性够用：

`font-family` ——字体。设成 `-apple-system, "Microsoft YaHei", sans-serif`，在 Mac 和 Windows 上都好看。

`padding` ——内边距。让内容不紧贴边缘，看起来有呼吸感。按钮加 `padding: 10px 24px`，点击区域更大、更好按。

`border-radius` ——圆角。方方正正的按钮看起来像上世纪的网页，加个 `border-radius: 8px`，立刻现代了。

就这三个属性。背景色 `background`、文字色 `color`、边框 `border` 也是常用的，但核心原则是：**CSS 不用手写，让 AI 帮你生成**。你只需要能看懂、能改颜色和大小。没人要求你从零手写 CSS——那是前端工程师的活。

### [3:15-4:30] DOM 操作：用 JS 操作页面元素

**【画面】** VS Code 中在 `<script>` 里写 JS。展示 `document.getElementById("userInput").value`——从输入框取值。展示 `document.getElementById("chatBox").innerHTML += "..."`——往聊天区域追加内容。浏览器中演示：在输入框打字、点按钮、看到消息出现在页面上。

**【旁白】** JavaScript 怎么和 HTML 交互？通过 DOM 操作。

DOM 就是浏览器把 HTML 解析成一棵树——每个标签是一个节点，你可以用 JS 找到节点、修改节点、创建新节点。

两个最常用的操作：

第一个，从页面取值。`document.getElementById("userInput").value` ——用 id 找到输入框元素，读取它的 `value` 属性，就是用户打的字。

第二个，往页面写内容。`document.getElementById("chatBox").innerHTML += "<div>新消息</div>"` ——找到聊天区域，往里面追加一段 HTML。

聊天应用的核心交互循环就是这两个操作：从输入框读用户消息 → 调 API 拿到 AI 回复 → 把回复写进聊天区域。具体的 API 调用下集讲，今天先把骨架搭好。

### [4:30-6:00] 可运行闭环：聊天页面骨架

**【画面】** VS Code 中展示完整的 `index.html` 骨架版——包含 HTML 结构、CSS 样式、一个 `sendMessage` 桩函数（暂时只显示用户输入，不调 API）。浏览器打开，用户输入"你好"，点发送，消息出现在页面上。标注："骨架完成，下集加 fetch 调 API"。

**【旁白】** 来搭一个能跑的聊天页面骨架。今天先不调 API——把 HTML 结构、CSS 样式、DOM 操作串起来，实现"输入消息 → 显示在页面上"的基本交互。调 API 是下集的内容。

HTML 部分：一个 `chatBox` div 显示消息，一个 `input` 输入框，一个 `button` 发送按钮，加一个"清空"按钮。

CSS 部分：标题栏深色背景白字，消息区域可滚动，用户消息靠右蓝色气泡，AI 消息靠左白色气泡。这些都是最常见的聊天界面样式。

JS 部分：`sendMessage` 函数——从输入框读文字，创建一个 div 元素追加到聊天区域，清空输入框。`clearChat` 函数——清空聊天区域的内容。

浏览器打开，输入"你好"，点发送——消息出现在右侧蓝色气泡里。骨架搭好了。下集把 `sendMessage` 里的桩逻辑替换成真正的 fetch 调用，就能和 AI 聊天了。

### [6:00-7:15] 让 AI 生成前端：vibe coding 的日常

**【画面】** 屏幕展示一段给 AI 的 prompt——描述聊天页面需求。然后展示 AI 返回的完整 HTML 代码（约 70 行）。标注 AI 返回的代码中几个关键位置：fetch 调用、async/await、错误处理。旁边文字："前端 UI 是 AI 最擅长的领域——描述需求 → AI 生成 → 你审查微调"。

**【旁白】** 聊一个重要实践——前端 UI 用 AI 生成。

前端 UI 是当前 AI 编程工具最成熟的应用场景。你给 AI 一段需求描述——"写一个 AI 聊天页面，有消息区域、输入框、发送按钮，用户输入后调 POST /chat API，样式简洁现代"——AI 返回完整的 HTML 代码，通常 60 到 80 行，直接可用。

但你不能直接复制粘贴就完事。要审查几个关键点：

第一，fetch 的 URL 对不对？是不是你后端的 `http://127.0.0.1:8000/chat`。

第二，请求体字段名对不对？后端返回 `reply`，前端读的也是 `reply` 吗——字段名不匹配是前后端联调最高频的 bug。

第三，有没有用框架？如果你要求纯原生但 AI 给你塞了 jQuery 或 React，得删掉。

这就是 vibe coding 的日常——描述需求、AI 生成、你审查微调。前端尤其适合这个模式，因为 UI 代码高度模式化，AI 生成质量很高。

### [7:15-7:45] 小结

**【画面】** 字幕条："HTML 四标签：div/input/button/script · CSS 三属性够用 · DOM 操作：取值 + 写内容 · 前端 UI 让 AI 生成"。

**【旁白】** 核心记住几件事：HTML 只需 div、input、button、script 四个标签搭骨架；CSS 三属性 font-family、padding、border-radius 够用；DOM 操作就是用 getElementById 取值、用 innerHTML 写内容；前端 UI 是 AI 最擅长生成的领域——描述需求让 AI 写，你负责审查。

### [7:45-8:10] 提问彩蛋：让 AI 当你的前端陪练

**【画面】** 字幕条逐条列出三个 prompt："① 我刚学了前端最小集，请扮演面试官，围绕 div/input/button/script 四个标签和 getElementById、innerHTML 这两个 DOM 操作连续问我 5 道题，我答一题你点评一题。 ② 请给我一份'AI 生成前端代码审查清单'，列出拿到 AI 写的 HTML/JS 后必须检查的 5 个关键点，并解释每项为什么容易出错。 ③ 请出 3 道 DOM 操作变式练习——只描述需求不给代码，我写完后发给你批改。"

**【旁白】** 最后送你三个可以直接照抄去问 AI 的 prompt——暂停视频，挑一个发给 Kimi 或 DeepSeek。别把 AI 只当答案机，让它给你出题、当你的审查教练，才是这门课想让你养成的习惯。

### [8:10-8:25] 引出下集

**【画面】** 下集预告卡片："V051 fetch/async-await 调用 API——骨架搭好了，下集加 fetch 让页面真正能和 AI 聊天"。

**【旁白】** 今天搭好了聊天页面的骨架——能输入、能显示，但还没接 API。下集学 fetch 和 async/await，让页面真正能和后端通信、和 AI 聊天。我们下集见。

---

## 演示操作清单

### 文件结构

```
v047_demo/
└── index.html    （聊天页面骨架版）
```

### 完整代码：index.html（骨架版）

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

        #userInput:focus {
            border-color: #4a90d9;
        }

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

        #clearBtn {
            background: #e0e0e0;
            color: #666;
        }
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
        <button onclick="sendMessage()">发送</button>
    </div>

    <script>
        // === 骨架版：暂不调 API，只做页面交互 ===

        function sendMessage() {
            const input = document.getElementById("userInput");
            const message = input.value.trim();
            if (!message) return;

            // 显示用户消息
            addMessage(message, "user-msg");

            // 暂时显示桩回复（下集替换为 fetch 调用）
            addMessage("（骨架版：API 调用将在 V051 实现）", "ai-msg");

            // 清空输入框
            input.value = "";
            input.focus();
        }

        function addMessage(text, className) {
            const chatBox = document.getElementById("chatBox");
            const msgDiv = document.createElement("div");
            msgDiv.className = "message " + className;
            msgDiv.textContent = text;
            chatBox.appendChild(msgDiv);
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        function clearChat() {
            document.getElementById("chatBox").innerHTML = "";
            addMessage("对话已清空。", "ai-msg");
        }
    </script>
</body>
</html>
```

### 运行方式

```bash
# 方式一：直接用浏览器打开 index.html
# 方式二：如果后端已启动，放在后端的 static/ 目录下访问
```

浏览器直接打开 `index.html` 即可看到聊天页面骨架。输入消息点发送——用户消息出现在右侧蓝色气泡，桩回复出现在左侧白色气泡。下集 V051 会把桩回复替换为真正的 fetch API 调用。

---

## 录制注意

1. **开场对比要鲜明**：`/docs` 开发者页面 vs 聊天界面的对比——让观众立刻理解"API 做好了但用户用不了，需要前端"。两个画面放在同一屏幕，差异一目了然。
2. **HTML/CSS 从零写到有**：不要一上来展示完整代码。从空文件开始，逐行加 div、input、button、CSS 属性——每加一行浏览器刷新一次，让观众看到页面"从无到有"的过程。这种"增量构建"比直接展示成品更有教学效果。
3. **强调"够用就好"的立场**：反复强调"这不是前端课""不需要从零手写 CSS""复杂 UI 交给 AI 生成"。降低学生的心理门槛——他们只需要能看懂、能改、能让 AI 生成。
4. **语速控制**：整体旁白约 1850 字，按 235 字/分钟控制在 8 分钟以内。HTML 标签和 DOM 操作讲解适当放慢，CSS 和 AI 生成部分可以稍快。
5. 提问彩蛋段的 prompt 字幕条需在后期加上，确保观众能暂停照抄。
