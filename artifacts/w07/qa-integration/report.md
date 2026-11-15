# W07 双课件最终构建后验收报告

## 最终结论

**PASS — 554/554 项通过，0 项失败。**

验收使用修复后工作树重新生成的 `site/`，通过 `/courses-wiki/` 子路径临时服务器、系统 Python Playwright 和本机 Google Chrome 执行。最终构建包含 B 第 12 页案例说明目录链接修复。

已知宿主入口页请求 `https://api.github.com/repos/anjingcuc/courses-wiki/releases/latest` 仍返回 404，按要求单列为既有基线；它不计入双课件失败，且没有掩盖任何其它导航、课件或 lab 错误。

## 构建与链接命令

### `uv run mkdocs build` — PASS / exit 0

```text
INFO    -  Documentation built in 4.50 seconds
EXIT_CODE=0
```

完整输出（含站点既有 nav/LFS 警告）：`mkdocs-build.txt`。

### `uv run python sync-week-map.py --check` — PASS / exit 0

```text
OK: 4 类消费点与 week-map.json 一致，无漂移
EXIT_CODE=0
```

完整输出：`week-map-check.txt`。

### `uv run python linkcheck.py` — PASS / exit 0

真实扫描最终 `site/` 全站清单：

```text
checked 4754 link refs, unique broken: 2
  assets/reveal/plugin/notes-server/notes.html  ->  /socket.io/socket.io.js
  assets/reveal/plugin/notes-server/notes.html  ->  /plugin/markdown/marked.js
EXIT_CODE=0
```

只有两条已知 reveal 误报，无 W07 断链。完整输出：`linkcheck.txt`。

## 浏览器与交互回归

| 验收项 | 最终结果 |
|---|---|
| W07-A / W07-B 直达 | PASS；分别初始化 `1 / 13`、`1 / 18` |
| A→B、B→A、B→W08 | PASS；实际点击并核对部署 URL |
| M4→B、M4→A、主页周卡片→A、主页跨模块→B | PASS；实际点击通过 |
| A 的 pipeline/charts/mapping iframe | PASS；3/3 在构建后课件加载，frame URL 和 mode 正确 |
| B 的 case/conflict/principles/ecosystem/practice/diagnostics iframe | PASS；6/6 在构建后课件加载，frame URL 和 mode 正确 |
| 课程键盘与 iframe 隔离 | PASS；iframe 内点击、ArrowRight、Space 不翻父页，父课件导航正常 |
| Quiz | PASS；A 3/3、100 分，B 4/4、100 分 |
| Labs 三模式/六模式及状态 | PASS；播放、单步、重置、故障/修复、联动状态均通过 |
| 1920×1080 / 1366×768 / 390×844 | PASS；31 张课件页与 9 个 lab 模式均无全页横向溢出 |
| Reduced-motion | PASS；自动播放禁用且有说明，手动步骤可到完整终态，无活动动画 |
| Console/pageerror/HTTP/意外网络 | PASS；双课件、labs 和导航均无意外错误 |

套件输出：

```text
python artifacts/w07/qa-integration/test_built_viz.py
SUMMARY: 204/204 passed; failed=0; screenshots=16
EXIT_CODE=0

python artifacts/w07/qa-integration/test_built_venv.py
SUMMARY: 325/325 passed; failed=0; screenshots=20
EXIT_CODE=0
```

B 全回归在案例说明链接调整前一轮相同内容构建上完成；随后仅该链接变化。最终构建上又由 A 导航套件复验 A/B/W08/M4/主页入口，由素材套件复验 B 第 12 页说明链接与下载。完整逐项结果见 `summary-viz.json`、`summary-venv.json`、`playwright-viz.txt`、`playwright-venv.txt`。

## 实跑素材、下载与课表

### `site` 中的公开案例产物 — PASS

以下 8 项均存在且非空：

- `answers.csv` 与 `data/answers.csv`（各 304 bytes）
- `visualize.py`（2329 bytes）
- `numpy_probe.py`（329 bytes）
- `conflict-requirements.txt`（27 bytes）
- `pyproject.toml`（166 bytes）
- `uv.lock`（102672 bytes）
- 由 README 渲染的案例说明 `index.html`（25908 bytes）

### B 第 12 页链接 — PASS

- 恰好三个 `download` 文件：`answers.csv`、`visualize.py`、`numpy_probe.py`，均 **HTTP 200**。
- `../../demos/w07-case/` 案例说明页不带 `download`，最终目录 URL **HTTP 200**。
- MkDocs 将 README 渲染为目录索引，不再要求原始 `README.md` 下载路径存在。

### A/B 课表 — PASS

两份构建后课表的段落类别和时间轴完全一致，连续覆盖 0–100 分钟：

```text
0–8 → 8–18 → 18–30 → 30–40 → 40–52 → 52–58
58–70 → 70–86 → 86–94 → 94–100
```

均为六个 A 行、四个 B 行。素材/下载/课表套件结果：

```text
python artifacts/w07/qa-integration/test_final_assets.py
SUMMARY: 19/19 passed; failed=0; screenshots=1
EXIT_CODE=0
```

证据：`final-assets.txt`、`final-assets.json`、`venv-deck-downloads-1366.png`。

## 变量与 CSV 依赖

从最终构建的 W07-A 第 3、4、5、9 页顺序抽取代码并进行 AST 校验：

```text
PASS | A code has no load-before-definition variables | []
PASS | A definition chain includes df clean_df city_mean fig ax
PASS | A code has no read_csv call | []
PASS | A deck and visualization lab do not read phantom weather.csv
PASS | labs do not fetch CSV over the network
SUMMARY: 6/6 passed; failed=0
EXIT_CODE=0
```

`df / clean_df / city_mean / fig / ax` 定义链完整；A 不依赖不存在的 `weather.csv`，labs 不发起 CSV 网络请求。此项不冒充真实 Pandas/Matplotlib 执行，系统 Python 未安装这两包，本次未额外安装依赖。证据：`code-chain.txt`、`code-chain.json`。

## 既有宿主基线与产物边界

- 入口页 GitHub Releases API 404 被记录在 `summary-viz.json` 的 `baseline_console_errors` / `baseline_http_errors`；其它导航 console/pageerror/HTTP/意外外部请求均为 0。
- 正式最终套件共 **37 张截图**，均位于本目录且完整性检查无缺失。
- Chrome 隐式请求的根 `/favicon.ico` 由测试服务器返回 harness-only 204，未修改任何内容或构建资源。
- 未运行 crawler `build.py`，未执行 git，未修改内容源或共享 CSS/JS。
- 总汇总为 `summary.json`；带有 `initial` / `parallel` 字样的旧日志仅是前期调试历史，不属于最终结论。
