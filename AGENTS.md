# AGENTS.md — courses-wiki 仓库

《课程资料》站点：MkDocs + Material for MkDocs 9.x，部署到 GitHub Pages（<https://anjingcuc.github.io/courses-wiki/>）。姊妹仓库 `D:\workspace\python-course` 是内容生产区（微课脚本/教案/录像），发布时拷贝进 `docs/python/v2/`。

## 构建与验证

```bash
uv sync                    # 安装依赖
uv run mkdocs build        # 构建到 site/（本地与 CI 同一条）
uv run python linkcheck.py # 全站断链检查（已知误报 2 条：reveal notes-server ×2）
```

本地预览用 junction 静态托管（Git Bash 后台热重载不可靠，site_url 带 `/courses-wiki/` 子路径）：

```bash
mklink /J D:\workspace\pyserv-8000\courses-wiki D:\workspace\courses-wiki\site
python -m http.server 8000 -d D:\workspace\pyserv-8000   # http://127.0.0.1:8000/courses-wiki/
```

push 到 `master`（或 `main`）触发 CI：uv sync → sed 重写 `/img/`、`/assets/` 前缀 → `mkdocs gh-deploy --force`。线上生效有最长 10 分钟 CDN 缓存。

## 目录

```
docs/
├── python.md                        # Python V2 主页
├── python/v2/m0.md … m7.md          # 8 个模块页（要点+运行场+小测+互链）
├── python/v2/slides/w01–w16.html    # 16 周高交互课件（slides.js 框架）
├── python/v2/extensions.md          # 拓展自学长廊（汇总各周拓展章节）
├── python/v2/notes/ + notes-index.md  # 88 篇经典笔记
├── python/demos/                    # 4 个全屏交互演示（interpreter/objects/base64/rag.html）
├── aissop.md + aissop/              # 智能系统安全运维与实践
├── javascripts/                     # pyv2-loader.js（懒加载组件）+ pyv2/ + vendor/（本地 GSAP/Three/Pyodide）
├── stylesheets/pyv2.css             # V2 设计系统
└── assets/reveal/                   # reveal.js（复制自 material/，供旧课件 symlink 用）
```

两套课件并存，勿混：**新版** `docs/python/v2/slides/wXX.html`（slides.js 自研）；**旧版**各 `docs/<课程>/章目录/` 下 `slide.txt` + `slideshow.html` symlink → 根 `material/slideshow.html`。本地 Windows 检出 symlink 为纯文本属正常——Linux CI 上 mkdocs 跟随 symlink 复制播放器并改写资源前缀，旧课件只能在线上验证。

## 关键约定（改之前读）

### Git 与 LFS
本地缺失的 LFS 附件（.exe/.zip/.whl/.mp4）在 `git status` 里呈现为「幽灵删除」。暂存改动时**逐个列文件名**（不要用 `git add <目录>/`），提交前 `git diff --cached --name-only --diff-filter=D` 应为空（除非有意删除）。误删后恢复：`git reset HEAD~1 -- <路径>` + `git commit --amend`。功能在 `feature/python-v2-ai-native` 上做，`--no-ff` 合并回 `master` 后两边都推。

### MkDocs 链接
markdown 链接会被重写，**原生 HTML `<a href>` 不会**——HTML 块里的链接必须手写最终 URL。`use_directory_urls` 下页面 URL 比源文件多一层目录：`docs/python.md` → `/python/`，`docs/python/v2/m0.md` → `/python/v2/m0/`，`docs/python/v2/slides/w01.html` → `/python/v2/slides/w01.html`。改完链接跑 `linkcheck.py`。

### Python V2 交互组件（loader 懒加载）
- **运行场**：`<div class="py-playground" data-py-title="…"><textarea>代码</textarea></div>`（HTML 转义 `<`，textarea 里不放 `<script>`）。
- **小测**：`<div class="pyv2-quiz"><script type="application/json" class="quiz-data">{"title":..,"questions":[{q,opts,a,explain}]}</script></div>`；题干与解析是纯文本（不支持 HTML 标签）。
- **知识图谱**：`#pyv2-kgraph` canvas + `#pyv2-kgraph-data` JSON（modules/lessons/links/crosslinks）。
- **AI 学伴**：页含 `<div data-pyv2-ai hidden></div>` 出现浮窗（OpenAI 兼容接口，密钥存 localStorage）。
- 组件脚本加载带 `?v=N`——改动 `docs/javascripts/pyv2/` 下任何组件后，把 `pyv2-loader.js` 里的 `VER` 递增。

### 课件框架（slides.js）
- 结构：`body.sl-page` > `header.sl-top`（顶栏：周次/链接）+ `div.pyv2-slides` > 若干 `section.slide`（封面加 `.cover`）。
- 分步：内容元素加 `class="frag"`，按 → 逐条展开。
- 翻页：键盘 ←→/空格、右下角按钮、触摸滑动、深链 `#/n`。
- 每份课件第二页放「今日课表（100 分钟）」表格；嵌演示用 `<div class="demo-frame"><iframe src="../../demos/X.html" loading="lazy"></iframe></div>`。
- 视觉对齐参考 `D:\workspace\AI4teacher\工作坊-自定义SKILL\index.html`：浅色纸面卡片、圆角 16px、悬停上浮、h2 左竖条。

### 内容原则
- 文案用专业教师口吻：说「AI 结对编程/开发」「答辩三问」「延伸阅读」等。
- 课程安排以课堂说明为准：页面不写成绩构成、评分比例与考核方式（由教师线下口述）。
- 生产资料（微课源稿、字幕、录像）放 `D:\workspace\python-course`，本仓库只放发布内容。

## Agent skills

### Issue tracker

Issues are tracked as GitHub issues on `anjingcuc/courses-wiki`, via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical triage roles use their default label strings (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout: `GLOSSARY.md` and `docs/adr/` at the repo root (created lazily by `/domain-modeling`). See `docs/agents/domain.md`.
