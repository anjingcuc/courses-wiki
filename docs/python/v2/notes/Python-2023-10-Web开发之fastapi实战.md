# Python-2023-10 Web开发之FastAPI实战

## 内容梗概

这是课程进入项目实战阶段的第一课（Web 开发两节课中的第一节）。老师先梳理了现代 Web 服务的典型架构（前端、后端、缓存、数据库、Docker），并用 IaaS/PaaS/SaaS 三个云计算概念说明"一切服务最终都落在 Web 上"。随后进入实战：先用 Pillow 在本地实现 jpg 转 png 的功能，再用 FastAPI 把它包装成一个 HTTP 服务，依次实现 Hello World 接口、文件上传接口、上传文件落盘、图片格式转换、静态文件挂载与下载。本课只完成后端，前端留待下一课。结尾布置了作业：用 FastAPI 实现一个类似的小服务。

## 知识点详解

### 课程安排与工具切换（约 00:00–03:00）

- 前 11 个章节是基础铺垫，从本章开始进入三个项目章节（Web 开发、爬虫、可视化）。
- 项目章节改用 **VS Code** 开发（可视化部分仍适合用 Jupyter Notebook，因为要边做边看图）。
- 后端框架从 Flask 改为 **FastAPI**（老师认为目前 Python 后端主流是 FastAPI；GitHub 上他的 `learn` 仓库里仍保留 Flask 的从零开始项目）。
- 两节课分配：第一节过概念、搭后端；第二节写前端、带写作业。

### 现代 Web 服务的典型架构（约 07:46–14:00）

- 简化架构：一个**前端**（形式很宽泛：网页 Vue.js/React.js/Angular、微信小程序等），一个**后端**。
- 后端之下通常还有三类配套软件：**Web 后端服务**（如 nginx + Flask/FastAPI）、**缓存**（Redis 最常用）、**数据库**（MySQL、MongoDB 等），初学阶段一般只涉及后端 + 数据库，Redis 不设计。
- 前端与后端通过 **HTTP** 交换数据，常用 **JSON**（JavaScript Object Notation）作为接口格式，结构类似 Python 字典（键值对）。
- **Docker**（约 11:57）：相比虚拟机更轻量级的环境隔离软件。类比 Python 虚拟环境：为每个软件创建独立命名空间（容器 container），容器内的动态链接库、环境变量互不影响，可解决依赖冲突（如 nginx 依赖 OpenSSL 1.0 而 MySQL 依赖 1.2）。常见玩法是一台云虚拟机上跑多个 Docker 容器（web 后端、Redis、数据库各一个）。

### 云计算概念：IaaS / PaaS / SaaS（约 18:44–25:00）

- **IaaS（基础设施即服务）**：厂商买好大量服务器，用虚拟化技术分配计算资源，用户开账号买虚拟机（VPS）即可。本质是"虚拟机 + Docker"。
- **PaaS（平台即服务）**：在虚拟机基础上一键初始化操作系统、数据库、开发环境（如选 Ubuntu、Kali），开箱即用。
- **SaaS（软件即服务）**：把本地软件的功能做成在线服务，例如把 docx 上传到网页转成 PDF——后端可能就是一个 FastAPI 服务调用 Python 包完成转换。
- 老师强调：这三种服务的提供途径最终都是 Web；并顺势畅想未来可能出现"模型即服务"（如 Hugging Face 上点 run 直接用模型，背后是即时构建、用完销毁的容器环境）。

### 实战第一步：本地实现 jpg 转 png（约 26:09–36:00）

整体思路三步走：①先实现功能；②用 FastAPI 包装成 HTTP 服务；③写前端。

- 新建文件夹 `SAAS`，用 VS Code 打开，新建 `convert.py`。
- 安装 **Pillow**（导入名为 `PIL`）：`from PIL import Image`。
- 命令行参数：用内置模块 `sys`，`sys.argv` 取参数（0 号是脚本名，1 号是传入的 jpg 文件名，类比 C 语言 argv）。
- 路径处理：`from pathlib import Path`，`Path` 对象有 `with_suffix()` 方法可替换文件后缀（如把 `.jpg` 换成 `.png`）。
- 后缀校验：`jpg_file.lower().endswith(".jpg")`（先转小写再判断，兼容大写后缀），不满足则提示"请指定 JPG"。
- 转换：`Image.open(jpg_file).save(new_file_name)`，Pillow 会根据后缀自动做格式转换。
- 测试：`python convert.py test.jpg`，52KB 的 jpg 转出 157KB 的 png（png 支持透明背景）。

### 封装成函数（约 36:57–38:00）

- 把转换逻辑改写成函数 `convert(jpg_file)`：失败 `return None`，成功返回新文件路径。
- 注意 `Path` 返回的是路径对象，需 `str()` 强制转成字符串再返回。

### 搭建 FastAPI 环境（约 38:00–41:00）

- FastAPI 官网有中文文档，安装：`pip install fastapi`，生产/运行用 `uvicorn`（课上装的是 `uvicorn[standard]`）。
- 用 conda 建虚拟环境：`conda create -n FA python=3.9`（FastAPI 要求 3.8 及以上），`conda activate FA` 后在环境内装 Pillow 和 FastAPI。
- 老师自我批评：不要在 conda 的 base 环境里乱装包，应先建虚拟环境再装依赖。

### main.py 示例与路由概念（约 41:26–47:30）

- 从官网复制示例：`from fastapi import FastAPI`，创建 `app = FastAPI()`（Web 框架普遍自称 app，即 Web 应用）。
- `@app.get("/")` 装饰器（约 45:09）：把"用户访问网站根目录"这个行为**绑定**到下面的函数上——URL 路径与函数的绑定关系叫**路由**。访问根目录时运行该函数，`return {"Hello": "World"}`（Python 字典会被 FastAPI 自动转成 JSON 字符串返回前端）。
- **VS Code 波浪线问题**（约 42:06）：Pylance 插件报"无法解析导入 fastapi"，是因为插件不会自动切换虚拟环境，右下角解释器还停在 base。解决办法：点击右下角切换解释器到刚创建的 FA 环境；不切换也不影响终端里运行。

### 启动服务与访问测试（约 47:33–52:30）

- 启动命令：`uvicorn main:app --reload`。
  - `main` 是模块名（main.py），`app` 是模块里的应用变量名，结构固定为"模块:应用变量"；
  - `--reload` 表示文件修改保存后自动重载，免去了反复手动重启。
- 默认在本地 **8000 端口**启动。VS Code 终端里 Ctrl+单击链接即可在浏览器打开。
- 访问根目录返回 JSON 串；后端日志显示收到 GET 请求、HTTP/1.1 协议、响应 `200 OK`。

### 接入转换功能与文件上传接口（约 52:30–1:04:00）

- `from convert import convert` 导入自己写的函数，先在根路由里写死调用 `convert("test.jpg")` 返回 `{"filename": fn}` 验证打通。
- 查 FastAPI 文档的 File / UploadFile 部分，复制示例写上传接口（约 55:41）：
  - 装饰器用 `@app.post("/uploadfile/")`——HTTP 有不同 method：**GET 用于获取/下载，POST 用于提交/上传**（如登录提交用户名密码），上传文件是浏览器到服务器的过程，故用 POST。
  - 函数参数 `file: UploadFile`，先返回 `{"filename": file.filename}`。
- **报错实战**（约 57:31）：刷新后服务报错 `form data requires python-multipart to be installed`。上传文件是 multipart（多组成部分）过程，需安装 `python-multipart` 库——强调"解决方案就在报错里"，要学会读报错。
- **`/docs` 交互式文档**（约 54:40、1:00:22）：FastAPI 自动生成的接口文档页，列出所有路由，点 **Try it out** 会自动生成上传控件，无需前端即可测试接口；配合 F12 开发者工具的"网络"标签页可看到 POST 请求的负载（二进制文件）和响应 JSON。

### 上传文件落盘与类型标注（约 1:04:00–1:16:00）

- 直接把 `file.filename` 扔给 convert 报 `Internal server error`：`file.filename` 只是文件名，文件内容还没写到服务器本地，且文件路径未知，报 `no such file or directory`。
- 参考 Stack Overflow 写 `save_upload_file` 函数：用内置模块 **shutil**（shell 工具）的 `shutil.copyfileobj` 把上传文件内容拷贝到本地以 `wb`（二进制写）模式打开的文件中，配合 `try...finally` 确保关闭。
- **Python 类型标注新语法**（约 1:09:06）：参数名后加冒号写类型（如 `destination: Path`），还可标注返回值类型。解决"看参数名不知道该传 str 还是 Path"的问题；课上翻车示例：把 Path 对象传给期望 str 的 convert 报 `lower` 相关错误，`str()` 强转后解决。
- 串联逻辑：`save_upload_file` 落盘 → `convert` 转换 → 返回新文件名。

### 静态文件挂载与下载（约 1:18:48–1:28:00）

- **搜索技巧**（约 1:17:05）：把需求拆碎翻译成英文关键词，如"fastapi serve static file to download"。
- **静态文件 static files**：服务器上不需要用代码修改、只供用户下载的文件（JavaScript、CSS、图片、供下载的结果文件）；与之相对的是要执行的 `.py`。
- 用法两步：
  1. `from fastapi.staticfiles import StaticFiles`；
  2. `app.mount("/static", StaticFiles(directory="static"), name="static")`——本质是**绑定 URL 路径与本地文件夹**：本地新建 `static` 文件夹后，`static/test.png` 就映射到 `http://127.0.0.1:8000/static/test.png`，浏览器直接可下载。
- 用 `shutil.move(fn, "static/" + fn)` 把转换结果移入 static 文件夹，返回的 filename 改成 `/static/xxx.png` 即得下载链接。
- **导入库的分区习惯**（约 1:20:04）：最上面内置库、中间第三方库、最后自己的模块，不要乱放。
- 拓展提及：**重定向**（302 响应，如登录后自动跳首页），可用 RedirectResponse 把响应重定向到图片地址；或返回 JSON 让前端显示下载链接。
- **作业**（约 1:28:05）：用 FastAPI 实现一个类似功能的小服务，建议不要做转图片（课上已全演示），换一个别的功能；用 git 的 0x04 分支提交，先把后端写出来。

## 示例与演示

- `convert.py`：命令行版 jpg→png 转换器（sys.argv + pathlib + Pillow）。
- `main.py` 演进过程：
  1. 官网 Hello World 示例，`@app.get("/")` 返回 `{"Hello": "World"}`；
  2. 根路由内调用 `convert("test.jpg")` 返回转换结果文件名；
  3. `@app.post("/uploadfile/")` 上传接口，先只返回文件名；
  4. 加 `save_upload_file` 落盘 + convert 转换 + 返回新文件名；
  5. 加 StaticFiles 挂载，转换结果 move 进 static，返回可下载路径。
- 全程用 `/docs` 的 Try it out 测试上传，用 F12 网络面板观察 POST 请求与响应。

## 重点与难点

- **路由 = URL 路径与函数的绑定**，装饰器 `@app.get` / `@app.post` 干的就是绑定这件事；GET 与 POST 的语义区别要分清。
- `uvicorn main:app --reload` 的"模块:变量"结构是固定的，变量名变了冒号后也要跟着变。
- VS Code 的 Pylance 报错多半是解释器/虚拟环境没切换，不是代码问题。
- `UploadFile.filename` 只给文件名，文件必须自己落盘后才能被本地函数处理——这是第一个 Internal server error 的根源。
- 上传文件必须装 `python-multipart`，报错信息会直接告诉你。
- 类型标注能帮助发现"把 Path 当 str 传"这类参数类型错误。
- 强调工程习惯：虚拟环境隔离、导入分区、先实现功能再包装成服务的分步思路。

## 关联内容

- 直接续接下一课《Python-2023-11 Web开发之FastAPI实战续》（写前端页面、处理 CORS 跨域）。
- 依赖前置章节：第三方库与虚拟环境（conda/pip）、pathlib 路径处理、函数与装饰器（装饰器详见视频）、文件读写与二进制模式。
- JSON 与前后端分离的概念在后续《爬虫之豆瓣》中再次用到（爬虫直接请求数据接口拿 JSON）。
- Docker/虚拟环境隔离思想呼应第 10 章《第三方库与虚拟环境》。
- 作业成果为后续 Web 部分作业（前后端完整服务）的基础。
