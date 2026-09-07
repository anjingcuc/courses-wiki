# 在线课件仓库

使用 [MkDocs](https://www.mkdocs.org/) + [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) 构建课程网站；旧版课件仍以 [reveal.js](https://revealjs.com/) 幻灯片形式嵌入。

## Python 程序设计 · AI 原生版（V2）

Python 板块已完成 AI 原生化重构，特性包括：

- **现代主题**：mkdocs-material 9.x（明暗双主题、即时搜索、响应式导航）
- **浏览器 Python 运行场**：基于 Pyodide（Web Worker 沙箱，死循环可终止），零安装运行真·Python
- **交互演示**：GSAP 步进动画（编译 vs 解释）、Three.js 3D 内存模型（一切皆对象）、Manim 风格 Base64 位运算动画、RAG 流程模拟
- **AI 学伴**：内置 OpenAI 兼容对话面板（DeepSeek / Kimi / GLM / 自定义端点），自动携带页面上下文
- **交互组件**：随堂测验、课程知识图谱（Canvas 力导向图）、打字机终端、滚动动效
- **内容重构**：48 课时 · 8 模块（M0–M7）的新版课程页 + 59 集微课讲义 + 88 篇经典课程笔记存档

新板块目录结构：

```
docs/
├── python.md              # 课程主页（hero / 模块地图 / 知识图谱 / 实验室入口）
├── python/v2/             # M0–M7 模块页 + 考核 + 讲义索引 + 笔记索引
│   ├── scripts/           # V001–V059 微课讲义
│   └── notes/             # 旧版 15 章 88 篇课程笔记
├── python/demos/          # 四个全屏交互演示（纯静态 HTML）
├── javascripts/
│   ├── pyv2-loader.js     # 按需加载器（按页面标记注入组件）
│   ├── pyv2/              # 运行场 / 测验 / AI 学伴 / 图谱 / 动效组件
│   └── vendor/            # 本地化 gsap / ScrollTrigger / three
└── stylesheets/pyv2.css   # V2 设计系统（深色玻璃拟态）
```

旧版 15 章 reveal.js 课件保留在「经典版课件」导航下，语法深挖时仍可使用。

## 本地开发

```bash
uv sync
uv run mkdocs serve
# 打开 http://127.0.0.1:8000/courses-wiki/（site_url 配置了子路径前缀）
```

## CI/CD

推送到 `master`/`main` 后由 GitHub Actions 自动部署到 GitHub Pages。
