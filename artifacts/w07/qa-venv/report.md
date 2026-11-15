# W07-B 终审修复与 QA 报告

日期：2026-11-15  
工作区：`D:\workspace\courses-wiki-worktrees\w07`  
本轮范围：只修改 `docs/python/v2/slides/w07-venv.html`、`docs/python/demos/w07-venv-lab.html`，并更新 `artifacts/w07/qa-venv/` 的既有 QA 与报告。未执行 Git，未运行 MkDocs / 共享 build，未写 `site/`。

## 1. 终审问题修复

### M1：B 统一为可执行的 42 分钟

- 第二页 B 课表改为：**58–70 案例、70–86 机制与跨语言、86–94 UV + DSH、94–100 收束**。
- 五个课内核心互动明确为：case **58–63**、conflict **63–70**、principles **73–79**、ecosystem **79–86**、practice **88–94**。
- 70–73 为四层统一模型过渡，86–88 为提示词与实跑素材审查；Quiz **94–98**，作业与 W08 衔接 **98–100**。
- 静态总结页均标注“对应时段内快速回收，不另增分钟”。diagnostics 在 deck 与 lab 均标为“备用 / 课后，不占课内分钟”。
- 已删除旧的 58–64、64–72、72–80、80–86、86–92、92–96、88–95、95–100 标时。A 课表同步属于 lead 范围，本轮未改 A。

### M2 / 建议 3：实跑入口与 A/B 样例层级

- 封面明确：**A 用 9 行天气 records 微样例学机制；B 用 10 行 answers.csv 教学合成数据做综合作业，数据并不相同**。
- B 第 12 页提供完整项目包与说明页两个原生 HTML 最终 URL：
  - `../../demos/w07-case.zip`（包含 pyproject.toml、uv.lock、.python-version、.gitignore、README、脚本、探针与 data/answers.csv）
  - `../../demos/w07-case/`（MkDocs 将 README.md 渲染为案例说明页）
- 文案说明 answers.csv 是教学合成数据；ZIP 解压后即可按 README 运行，不需要手工重建目录或寻找锁文件。
- 完整 ZIP 已由 lead 实际解压，并用 `uv sync --locked` + `uv run --locked python visualize.py` 验证成功。
- 新增 1366×768 下载卡视口断言。该断言曾发现下载区越界；已移除重复命令块、收敛为右侧素材卡，最终卡片与 ZIP / 说明页两个链接均在幻灯片视口内。

### M3：VB 代码、提示词与累积文件树

- `visualizeCode` 采用研究目录已实测脚本的完整结构，包含：
  - `Path(__file__).resolve().parent` 定位 CSV 与输出；
  - `matplotlib.use("Agg")`；
  - Microsoft YaHei / SimHei / Noto Sans CJK SC / Arial Unicode MS / DejaVu Sans 字体候选；
  - `axes.unicode_minus = False`、constrained layout、保存后关闭 fig；
  - 匿名合集与缺失点赞清洗、groupby/sum/nlargest/sort_values。
- 额外做过去除首尾空白后的原文比对：VB `visualizeCode` 与研究目录实测 `lab/visualize.py`、站点发布 `w07-case/visualize.py` 完全一致。
- 模拟输出继续与代码一致：10 → 8 行，小周 25.0、阿岚 31.0、小林 35.0，平均 30.3，并明确标为教学模拟。
- DSH 提示词新增 `README.md`、`.gitignore`、教学合成数据或替换数据的来源/授权、字段与清洗规则、输出限制，以及 `uv sync --locked` / `uv run --locked python visualize.py` 运行说明。
- 文件树改为 `makePracticeTree(step)` 累积生成，后续步骤不再丢文件。最终包含 pyproject.toml、uv.lock、.python-version、README.md、.gitignore、visualize.py、data/answers.csv、output/top_authors.png 与 .venv；`.venv` 标为“可重建：不提交”。

### M5：不再把普通运行/构建笼统称为只读

- 跨语言栏改为“观察 / 验证命令”，逐类提示同步、缓存、网络、node_modules 与构建副作用。
- 仅观察已建项目环境时采用 `uv run --no-sync --locked ...`，并写明前提：已成功 sync、依赖齐全、uv.lock 与 pyproject 一致；未满足前提先修复，不能用 no-sync 掩盖问题。
- 普通 `uv run --locked` 明确仍可能同步项目环境和写缓存。
- `cargo +stable build --locked` 明确是构建验证，会写 `target/`；`--locked` 只限制锁文件改写，也可能使用缓存或网络。
- diagnostics 改为“先证据，后修复”，不再说“全部只读”或“先执行只读诊断”。Go 模块下载缓存本身的只读属性说明保留，不与命令副作用混淆。

### 建议 1 / 2：reduced-motion 与真实图拓扑

- reduced-motion 下禁用 practice 自动播放，按钮显示“减少动态 · 请单步”，状态明确“不跳到末尾”；步骤按钮和“即时单步”仍立即可用，无定时推进。
- 动态偏好切换会同步刷新播放控件；`visibilitychange` 在页面 hidden 时清除 timer 并暂停，返回后可从当前步骤继续。
- case 独立模式显示两套 `.venv` 与两条绿色局部依赖连线；切到全局反例时，这些节点和连线退出，项目节点进入共享警告状态，两条红色依赖流汇入同一个全局 site-packages。切回/重置恢复真实拓扑，不只是更换文字。

## 2. 最终自动验证

### 主 Playwright 套件：**255 / 255 通过，0 失败**

证据：`summary.json`。除原有功能外，新增关键断言：

- 精确 B 时间线、旧标时清除、备用 diagnostics、静态页不另增分钟、A/B 数据层级、四个最终下载 URL。
- 实测脚本字体/负号/Agg/路径要素、DSH README 与来源/运行说明、最终累积文件树。
- case 两种模式的节点可见性、局部/汇流连线、项目节点状态及重置恢复。
- no-sync 前提、普通 uv run 副作用、Cargo target/ 构建副作用。
- reduced-motion 禁自动播放且不跳末步、即时单步；hidden 后 timer 停止且步骤不前进。
- 四个下载链接在 B 实操页存在，下载卡与链接不越出 1366×768 幻灯片视口。

原有回归也全部通过：18 页、6 个 iframe、4 题 Quiz、16 个跨语言组合、正常播放、键盘隔离、Home/End/深链、44px 目标、file:// 六模式、console/pageerror/HTTP/外部请求为 0，以及 inline JS `node --check`。

### 投影与移动端几何：**72 / 72 通过**

证据：`projection-geometry.json`。覆盖六个 lab 和 18 页 deck 的 1366×768、1920×1080、390×844 检查。

### HTML 与本地互链：通过

证据：`static-integrity.json`。

- 无重复 ID、无缺失 button type、无不合规 iframe、无缺少 noopener 的新窗口链接、无外部资产。
- deck 的 **24 个本地链接目标均存在**，包括四个 `w07-case` 最终下载 URL；`../../#weeks` 继续按 MkDocs 目录 URL 规则单独核对。

### 截图：22 张

在原有 20 张基础上新增 `case-global-1366.png` 与 `deck-practice-downloads-1366.png`，供集成方人工复核真实汇流拓扑和下载卡。

## 3. 复现命令

使用系统 Python Playwright 与源码树临时 HTTP 服务；测试结束自动关闭服务，不启动共享预览：

```powershell
python artifacts\w07\qa-venv\test_w07_venv.py
python artifacts\w07\qa-venv\check_html_integrity.py
python artifacts\w07\qa-venv\check_projection.py
```

## 4. 剩余风险与集成边界

1. 按要求未运行 MkDocs / 全站 linkcheck / 共享 build，未写 `site/`；本轮证据来自源码树临时 HTTP 与 file://，不替代最终 `/courses-wiki/` 构建产物验收。
2. 实验室仍是教学仿真。本轮没有重新安装依赖或重跑 UV/DSH 实验；实测摘录继续来自研究材料。教师机版本不同应以实际输出为准。
3. 当前模型无图像输入能力，22 张截图已保存但未做模型像素级读图。DOM、视口、重叠、裁切、字号与交互断言均通过；集成方仍应人工审阅投影截图，尤其是新增全局汇流图和实操下载卡。
4. 真实 Matplotlib 中文 PNG 受教师机字体影响；课前需用同一 lockfile 预热缓存，运行探针并打开输出图检查，不因网络问题退回全局安装。
5. A 课表与其他终审项由 lead 同步；本轮未改 A、M4、W08、共享组件或实跑素材。
