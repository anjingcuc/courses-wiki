# 课程主页以周课件为主线

Status: accepted

**Context**：`docs/python.md` 曾同时承载八大模块卡片、知识图谱、微课编号、课件入口、演示、作业线等八类内容，主线混乱；课堂上需要在新旧两套课件间即时切换对比；微课讲义（V001–V059）在发布仓已成孤儿页（唯一入口 scripts-index.md 无任何入链），源稿由生产仓 python-course 保管。

**Decision**：Python 课程主页改为以 16 周周课件为唯一主线，按 M0–M7 模块分组呈现；周课件与经典课件（15 章）建立主/次对照章节映射，slides.js 顶栏提供「旧版对照」按钮，经典播放器提供反向链接；微课（scripts/ 与 scripts-index.md）从发布仓整体移除；slides-index.md 并入主页后删除；扩展原理以周课件末尾「拓展自学」章节承载，并设独立长廊页汇总。

**Considered Options**：模块为主线被否决（模块是「幕」不是「场」，无法承载 16 周的教学节奏）；保留 slides-index 双入口被否决（两个相似周列表是主线混乱的温床）；无对照周渲染「就近章节」按钮被否决（易误导，改为「全新内容」徽章）。

**Consequences**：59 篇微课页面的直链失效（git 历史可恢复，源稿在生产仓）；`material/slideshow.html` 的反向链接改动只能在 Linux CI / 线上验证；linkcheck.py 白名单随 V025 误报条目的消失而缩减；知识图谱组件保留（aissop.md 仍在用），仅从 Python 主页摘除。
