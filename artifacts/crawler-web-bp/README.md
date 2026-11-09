# Web 演进 × 爬虫技术 · 交互蓝图

一份**单文件、离线可用**的横屏教学页面。以「总览 → 机制 → 工具 → 案例 → 自检」串起两节课，
把 Web 内容生成的位置与爬虫手段一一对应；CSS 与 XPath 在同一棵 DOM 树上对照操作。

- **7 屏总分结构**，不再把相关机制拆成许多孤立页面。
- **主流程图在 1920×1080 首屏完整呈现**；代码、报文、速查表与扩展说明可向下滚动。
- 默认浅色纸面，与 courses-wiki 的 **slate + sky + violet** 色板一致；可切深色蓝图。
- 交互主要发生在架构图、流程图、DOM 节点与表达式本身。

## 打开

直接双击 `index.html`（约 391 KB，已内联 GSAP，不联网、不依赖任何 CDN）。
建议 **F11 全屏 + 1920×1080 横屏**。

## 操作

| 操作 | 作用 |
|---|---|
| **鼠标滚轮 / 触控板** | **只在当前图纸内纵向滚动**（到顶/到底也不翻页） |
| `Space` / `PageDown` | 页内下滚；已经到底才翻下一张 |
| `PageUp` | 页内上滚；已经在顶才翻上一张 |
| `←` `→` | 直接上一张 / 下一张 |
| 左下角 `← 03 / 07 →` | 同上，鼠标可点 |
| `O` | 图纸目录（7 张随便跳） |
| `T` | 纸面（默认，与课件站一致）/ 深色蓝图 |
| `R` | 重播当前场景动效 |
| `F` | 全屏 |
| `Esc` | 关闭目录 |

右上角「放映」：每 14 秒自动翻一张。

## 7 屏总分结构

| # | 场景 | 核心问题与口播案例 |
|---|---|---|
| 01 | **总图** | Web 内容在哪生成、响应里有什么、爬虫怎么办；课程站 MkDocs、B 站个性化首页、库存与 `/data?page=N` 先露脸 |
| 02 | **一次往返** | 浏览器 ↔ HTTP ↔ 服务器；一次回车会引出多个子资源请求，课程站字体外链造成长等待 |
| 03 | **完整 HTML** | 磁盘静态文件与 Jinja2 后端模板都返回完整 HTML；`username=安静/小王`、静态学生名单与 URL 归一化 |
| 04 | **两条路** | `resp.text` 只有空壳时：无头浏览器执行 JS，或 F12 找到 XHR 后直接取 JSON；无限滚动名单与库存 1000→999 |
| 05 | **CSS / XPath** | 同一页面、同一 DOM 树、两种定位语法；B 站标题「我的双脚不受自己控制」，点节点同时生成两种写法 |
| 06 | **课堂实战** | 三个案例共用「观察证据 → 选择路线 → 验证结果」：URL 判重、直取分页 JSON、按序点亮 AJAX 路径 |
| 07 | **回到总图** | 七屏学习路径、决策树与三题即时自测 |

> CSS 基础与 B 站 F12 示例来自讲师第十二节 P2；XPath 完整语法是为对照教学补充的扩展，页面内已明确标注，不作为讲师原话。

## 源视频与字幕

- 视频 A：[Python程序设计-第十一节-Web开发](https://www.bilibili.com/video/BV1nQ4y1P7NB/)（7 P / 173 min）
- 视频 B：[Python程序设计-第十二节-Web分析与爬虫](https://www.bilibili.com/video/BV1dz4y197jr/)（5 P / 90 min）

转写稿只作为**内容参考**，不进入页面：
`artifacts/web-evolution/`、`artifacts/crawler/` 下各有 `transcript.md` 与 `notes.md`。

## 目录结构

```
crawler-web-bp/
  index.html                  ← 交付物（单文件，可单独拷走）
  build/
    shell.html                ← courses-wiki 色板 + 场景引擎 + 导航
    build.py                  ← 默认组装 scenes-v3/*
    CONTRACT.md               ← 场景开发契约
    scenes-v3/                ← 当前 7 组「html + css + js」
    scenes/                   ← 旧版归档，不参与默认构建
  _qa/
    audit_v3.py               ← 30 项布局与交互回归
    shot.py                   ← Playwright 双主题截图
```

## 重建与验证

```bash
cd build
python build.py
cd ../_qa
python audit_v3.py
python shot.py --theme paper --width 1920 --height 1080
python shot.py --theme blueprint --width 1920 --height 1080
```

## 关联产物

- 转写稿与知识要点：`artifacts/web-evolution/`、`artifacts/crawler/`
- 设计规范：`artifacts/design/DESIGN-SPEC.md`
