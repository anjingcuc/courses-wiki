# W07-A 数据可视化课件 · QA 与交付报告

日期：2026-11-15  
工作区：`D:\workspace\courses-wiki-worktrees\w07`  
范围：仅 W07-A deck、专属单文件 lab、`artifacts/w07/qa-viz/`。未执行 Git，未运行 MkDocs / 共享 build，未写 `site/`。

## 交付文件

1. `docs/python/v2/slides/w07.html`
   - 规范主 URL 不变；周级 `<title>` 不变；WEEKMAP button marker 与第 13 章主对照不变。
   - 13 页：封面、整周 100 分钟课表、DataFrame、检查清洗、筛选聚合排序、pipeline、charts、mapping、Matplotlib、实用陷阱、3 题 Quiz、作业、W07-B 下一步。
   - 封面明确 A/B；第 2 页高亮 A 的 0–58 分钟，同时保留 58–100 的 B 段与整周收束；末页主 CTA 为 `w07-venv.html`。
2. `docs/python/demos/w07-visualization-lab.html`
   - 单文件原生 HTML/CSS/JS + SVG；无网络、无图表库、无 Pyodide / Pandas 执行伪装。
   - 同一份 9 行天气爬虫结果派生所有代码、表、图与读数。
   - 可通过 HTTP 与 `file://...?mode=charts` 直接打开。
3. 本目录：Playwright 套件、Pandas 参考链验证、机器摘要和 14 张截图。

## 三种图内模式

| 模式 | 已实现交互 | 文本等价 / 可访问性 |
|---|---|---|
| `?mode=pipeline` | read → clean → group → plot/save；上一步、下一步、播放/暂停、重置；代码 / 表 / SVG / 读数同步；保存仅记录仿真动作 | 当前步骤 `aria-current`；播放 `aria-pressed`；状态 `role=status`；每步可读数据表；明确不写文件 |
| `?mode=charts` | 比较 / 趋势 / 占比三任务；柱 / 线 / 饼 / 散点均真实重绘；正确理由与错误教学反馈同步；重置 | 任务和图型 `aria-pressed`；反馈 live region；图表等价数据表与读数结论 |
| `?mode=mapping` | 8 个表行按钮 ↔ 8 个 SVG `g[role=button]` 双向点击；Tab 聚焦；Enter / Space；同步 `aria-pressed` 与读数；重置 | 表内保留所有数值；SVG 有可访问名；缺失 r03 有文字解释；选择不仅靠颜色 |

所有实验室按钮与模式链接均通过 44×44 CSS px 检查；deck 顶栏、主要 CTA、新窗口链接、Quiz 选项和 slides.js 导航按钮也纳入 44px 检查。

## 自动验证结果

最终：**137 / 137 通过，0 失败；14 张截图。** 详见 `summary.json`。

覆盖：

- 源码契约：13 页、周级 title、WEEKMAP、100 分钟与 0–58 分界、三种 iframe 的 lazy / title / 新窗口链接、3 题 Quiz、无 `read_csv("weather.csv")` 悬空依赖。
- `node --check`：实验页内联 JS 通过。
- pipeline：初始 9 行、清洗 8 行、聚合 3 行，均温 32.0 / 29.0 / 27.3；正常模式播放不变，页面 hidden 会停止并清空 timer；重置与保存仿真边界。
- charts：错误饼图 / 折线会重绘并给出原因；趋势线和记录数占比正确；`file://` 直开可用。
- mapping：鼠标双向映射、SVG Enter、表格 Space、ARIA 状态、重置。
- deck：slides.js 13 页、深链、Home / End、Quiz 3/3 与 100 分；iframe 内点击、ArrowRight、Space 不误翻父 deck，iframe 外键盘翻页正常。
- 视口：1366×768、1920×1080、390×844；13 页逐页检查活动 slide 无横向溢出，deck flex 外壳不超出视口，宽 SVG 仅局部滚动。
- reduced-motion：自动播放按钮禁用，调度器拒绝定时推进，并提供可见说明与 `aria-describedby`；上一步、下一步和步骤按钮即时可用；等待 1.1 秒仍不推进，交互后 `document.getAnimations().length === 0`。
- 健康：console error / pageerror / HTTP 4xx–5xx / 外部请求均为 0。

命令：

```powershell
python artifacts\w07\qa-viz\test_w07_visualization.py
```

### 真实 Pandas 参考链

使用已有 DSH Python 3.12.14 + Pandas 3.0.1，未安装依赖：

```powershell
& "C:\Users\anjing\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe" `
  artifacts\w07\qa-viz\verify_reference.py
```

结果见 `reference-results.json`：`df.shape=(9,3)`、`clean_df.shape=(8,3)`、高温筛选 4 行、排序均温 `广州 32.0 / 北京 29.0 / 上海 27.3` 均与课件一致。

Matplotlib 不在可用运行时中，因此没有伪造其执行结果：对展示代码做了 AST 语法和 savefig-before-show 顺序验证；浏览器中的图均为明确标注的原生 SVG 教学仿真。

## 截图索引

- 实验：`pipeline-1366.png`、`pipeline-390.png`、`pipeline-reduced.png`
- 选图：`charts-1920.png`、`charts-390.png`
- 映射：`mapping-1366.png`、`mapping-390.png`
- Deck：`deck-cover-1366.png`、`deck-schedule-1366.png`、`deck-pipeline-1366.png`、`deck-charts-1920.png`、`deck-quiz-1366.png`、`deck-final-1366.png`、`deck-mapping-390.png`

## 剩余风险 / 集成边界

1. `w07-venv.html` 属于另一交付范围；本轮 reduced-motion 修复未复验 B 的内容，A 的链接契约仍由套件检查。
2. 按要求没有运行 MkDocs / 全站 linkcheck / 共享 build；本轮是源码树临时 HTTP 服务测试，不替代最终 `/courses-wiki/` 构建产物验收。
3. 中文字体依赖实际机器；课件提供 Windows / 常见中文字体候选并说明需实际安装。真实 Matplotlib 图形与教师机字体仍建议课前打开一次。
4. 截图已保存，布局由 DOM 尺寸、横溢和交互测试验证；当前代理不具备图像输入能力，建议集成方在课堂投影上做一次人工视觉审阅。
