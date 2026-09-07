# Python-2023-11 Web开发之FastAPI实战续

## 内容梗概

这是 FastAPI 实战的第二课，目标是为上一课写好的图片格式转换后端补一个前端页面，打通"上传—转换—下载"的完整服务。老师先演示了"遇到不会的任务如何搜索"（upload file pure javascript），然后搭建 backend/frontend 的项目结构，用原生 HTML + JavaScript 写了一个文件上传页面，逐行讲解了 FormData、fetch、async/await 等概念。调试过程中刻意展示了两个典型坑：FastAPI 路径末尾斜杠省略导致 307 重定向、`response.json()` 漏写 await 导致 undefined。最后引出并解决了前后端分离开发中必然遇到的 **CORS 跨域**问题，用 CORSMiddleware 放行后整个服务跑通。

## 知识点详解

### 项目结构调整（约 00:00–03:10）

- 上节成果：FastAPI 后端可通过命令行启动，`/docs` 提供测试接口，但缺少上传文件的前端和下载入口——"单独有后端是没有用的"。
- 现代网站常见仓库结构：一个项目分两个文件夹，把原来的后端文件夹改名为 `backend`，新建 `frontend` 放前端代码。
- 前端文件夹中新建 `index.html`：任何 Web 服务器（nginx/Apache/Tomcat）加载网站时默认到根目录找 index 文件作为首页（index.html / index.php 等，是约定俗成）。

### 搜索技巧（约 01:03–02:30）

- 完成任务的第一步是把需求翻译成搜索关键词。不会框架就搜原生的：`upload file pure javascript`；会 Vue/React 就按框架搜。
- 自己实操时要逐个打开结果、比较挑选最优方案；老师课上直接跳到备课时选定的代码段。

### HTML 页面基础结构（约 03:30–04:50）

- 一个 HTML 页面有一个 `html` 根节点，内含 `head` 和 `body` 两个子节点；是 XML 式的开始/结束标签结构。
- 顶部 `<!DOCTYPE ...>` 不是注释而是说明：声明本文档是 HTML 格式文档。
- `head` 里放基本信息（如 `title`，显示在浏览器标签页上），不直接参与页面显示；页面上看到的内容基本都在 `body` 里。
- 本页 body 里只有两个元素：选择文件的 `input`（id/name 为 `fileupload`）和"上传"按钮；绿色的是注释。

### JavaScript 上传逻辑逐行拆解（约 04:53–13:30）

`script` 标签内只有一个函数 `uploadFile`：

- **async 异步函数**（约 05:22）：函数前 `async` 表示异步，不会像排队一样阻塞整个网页，函数在后台"偷偷地跑"，页面仍可正常操作；与之相对，`await` 表示**等待/阻塞**在该语句直到操作完成。
- **FormData**（约 09:40）：表单数据对象。登录页的表单（form）包含 username、password 等字段；在 JS 里用 `new FormData()` 创建空表单数据对象，再 `append` 字段。
  - `formData.append('file', fileupload.files[0])`：字段名为 `file`（要与后端接口参数名对应），内容取页面上 id 为 `fileupload` 的 input 元素选中的第 0 号文件（单文件控件取 0 号）。
  - 文件的二进制数据会经 base64 编码后放进 HTTP 请求（呼应之前学过的 base64——HTTP 不能直接传二进制内容）。
- **fetch 发请求**（约 12:29）：`await fetch(url, {method: 'POST', body: formData})`——向指定 URL 发 POST 请求，body 是表单数据；执行完说明上传成功，后面 `alert` 弹窗提示。

### 对接后端地址与 307 重定向坑（约 13:36–22:00）

- 复制的示例里请求地址是 `upload.php`，要改成自己的后端：`let url = 'http://127.0.0.1:8000'`（localhost 是本地环回域名），路径是 `/uploadfile/`；JS 里字符串拼接和 Python 一样用加号，`fetch(url + path, ...)`。
- **FastAPI 路径末尾斜杠不可省略**（约 17:00）：省略后请求会得到 `307 Temporary Redirect`，服务器自动重定向到带斜杠的地址再 200 OK——功能上能成功，但一个请求变两个，不合理，应一开始就写对。
- **善用开发者工具**（约 18:28）：F12 打开，最常用的两个标签页：
  - **控制台 Console**：JavaScript 运行报错都显示在这里；
  - **网络 Network**：实时列出与服务器往来的所有 HTTP 请求，可查看负载、请求/响应标头。
- 演示插曲：上传失败先怀疑跨域，结果是忘了启动后端——排错时记得确认服务在跑。
- 另一个小坑：重复上传同名文件后端报 422（服务器上已存在该文件不能覆盖），删掉旧文件即可。

### 接收响应并生成下载链接（约 22:00–30:40）

- 后端上传接口返回的 JSON 里带有转换结果的 `filename`（下载地址），前端要接收并显示。
- `let response = await fetch(...)` 存下响应，取 JSON：`response.json()`，再用 `console.log`（相当于 JS 的 print，输出到控制台）查看 `file.filename`。
- **await 排错**（约 27:27）：直接打印得到 `undefined`——因为 `response.json()` 也是异步操作，没加 `await` 时响应还没解析完就往下执行了；改成 `let file = await response.json()` 后正常。理解"代码跑得太快，response 还没回来"的阻塞逻辑。
- **动态创建下载链接**（约 28:37）：
  - `let a = document.createElement('a')` 创建超链接元素；
  - `a.href = url + file.filename` 指向转换结果地址；
  - 把链接文字设为"下载"，再 `append` 到 body 末尾。
  - 上传成功后页面多出"下载"链接；因为结果是图片，浏览器直接显示而非下载，右键另存为即可得到 PNG。至此"在线图片格式转换服务"一条龙完成。

### CORS 跨域问题（约 31:13–39:20）

- 老师还原后端到上节课状态（注释掉预先加好的中间件），演示前端报一堆错——引出 **CORS（Cross-Origin Resource Sharing，跨源/跨域资源共享）**。
- 什么是跨域（约 32:48）：浏览器当前访问的域名（如 CSDN 博客页）内的资源引用了另一个域名（如微博图床）的内容，就构成跨域。常见现象：博客图片显示"未经允许链接的外部资源"。
- 为什么有这个机制：图片/资源放在服务器上要付带宽成本，不能任由别的站点白嫖；同时也是一种安全机制。
- 实现原理（约 35:30）：浏览器发请求时标头带 `origin` 字段（本地文件打开时为 `null/none`），告诉服务器请求来源；后端根据配置的跨域策略决定是否响应。默认不放行，于是报错。
- 解决方案（约 36:19）：搜 "CORS FastAPI"，官方文档给出最小方案——引入 `CORSMiddleware`，用 `app.add_middleware` 添加并配置参数：
  - **中间件 middleware**：在处理请求之前预先对请求做处理的组件；
  - `allow_origins` 是允许来源列表，开发演示时改为通配符 `*`（谁都可以访问）；生产环境应指定具体域名（如前端的域名），就不算跨域/被允许跨域。
- 前后端分离架构下前端、后端在不同服务器/域名，几乎必然遇到跨域，这是开发中一定会踩的点。

## 示例与演示

- 完整前端 `frontend/index.html`：两个控件（选择文件、上传按钮）+ 一段 JS（uploadFile 异步函数）。
- 演示流程：启动后端 → 本地双击打开 index.html → F12 打开网络面板 → 选 test.jpg 点上传 → 观察 POST 请求与响应 → 页面出现"下载"链接 → 打开转换后的 PNG 并另存。
- 两次刻意翻车教学：
  1. 漏写路径末尾斜杠 → 网络面板出现 307 重定向 + 200 两条请求；
  2. `response.json()` 漏写 `await` → 控制台打印 undefined，加 await 后正常。
- 注释/恢复 CORSMiddleware 对比演示跨域报错与修复。

## 重点与难点

- **async/await 的阻塞语义**是本课最易错点：fetch、`response.json()` 都是异步的，该等的地方必须 await，否则拿到 undefined。
- FastAPI 路由末尾斜杠：虽然会自动 307 重定向，但应直接写对，避免一次操作发两个请求。
- 前端字段名 `'file'` 要与后端 `UploadFile` 参数名一致（表单字段名对应关系）。
- F12 开发者工具是 Web 开发的排错主力：Console 看 JS 报错，Network 看 HTTP 请求细节。
- CORS 是前后端分离开发的必经坑：理解 origin 标头与后端白名单机制，知道用 CORSMiddleware 解决；通配符 `*` 仅限开发演示。

## 关联内容

- 直接承接上一课《Python-2023-10 Web开发之FastAPI实战》：本课为其后端补前端，构成完整作业（FastAPI 服务 + 上传下载前端）。
- base64 编码、HTTP 请求标头（header）、JSON 通信等概念与前面章节及后续《爬虫之豆瓣》（请求头、User-Agent、数据接口）互相呼应。
- 前端基础（HTML 结构、表单、CSS 选择器思想）与选修的 Web 课及后续爬虫课中"分析网页结构"相关。
- 本课完成的功能是 Web 开发作业的完整形态，之后课程进入爬虫与可视化部分。
