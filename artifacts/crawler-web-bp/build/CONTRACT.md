# 场景开发契约（所有 builder 必读）

## 0. 我们在造什么

一份**单文件、离线可用**的中文教学页面 `artifacts/crawler-web-bp/index.html`：
用 **7 屏总分结构**讲清 Web 演进与爬虫对策，并让 CSS 选择器 / XPath 在同一棵 DOM 树上**对照上手**。
课堂横屏投影为主；先总览，再拆机制、工具与案例，最后自检。

## 1. 构建方式

```
build/
  shell.html        ← Lead 维护，勿改。设计 tokens + 场景引擎 + 左侧导航
  build.py          ← Lead 维护，勿改。把 shell + scenes/* 组装成单文件 index.html
  CONTRACT.md       ← 本文件
  scenes-v3/
    01-overview.html / .css / .js   ← 当前 7 屏总分版本
  scenes/                         ← 旧版归档，不参与默认构建
```

- 一个场景 = **同 stem 三件套**：`NN-name.html`（片段）、`NN-name.css`、`NN-name.js`。
- 顺序由文件名数字决定，已分配好编号，**不要改别人的编号**。
- 自检：`cd build; python build.py` → 输出 `OK -> …/index.html`（默认读取 `scenes-v3/`）。
- JS 语法自检：`node --check build/scenes/NN-name.js`。

## 2. HTML 片段格式

```html
<section class="scene sc-flow" id="sc-flow"
         data-nav="基本流程"                          <!-- 左侧导航短标签，≤6 字 -->
         data-kicker="SCENE 02 · 浏览器与服务器的一次往返">  <!-- 目录卡片副标题 -->
  <div class="sheet-ticks"><span></span><span></span><span></span><span></span></div>
  …内容…
</section>
```

- `id="sc-xxx"` 必须与 JS 中 `BP.scene('sc-xxx', …)` 一致。
- 根节点会自动 `position:absolute; inset:0; display:none`，激活时 `display:flex`；**内容允许超过一屏并纵向滚动**，不要为塞满一屏而缩字号。
- **关键架构图 / 流程图本身应在 1920×1080 首屏完整可见**；报文、代码、速查表、扩展说明放图后滚动区。
- 交互优先绑定图内节点、连线、DOM 元素；额外按钮只保留播放、模式切换等必要控制。
- ⚠️ **禁止在你的 CSS 里给根节点 `.sc-xxx` 写 `display` / `visibility` / `opacity`**（引擎用 `!important` 管控切换）。要给根节点排版请用 `flex-direction` / `gap` / `padding` / `grid-template-*` 等不影响 display 的属性。
- 目标投影 1920×1080；有效内容区约 **1500×940**。安全区：左右各 44px、上下各 30px。

## 3. CSS 规则

- 只能用 `#sc-xxx` 或 `.sc-xxx` 前缀作用域，**禁止全局选择器**（`body{…}` `*{…}` `.panel{…}` 之外的裸类名）。
- 可用设计 tokens（**不要写死颜色**，否则切「纸面」主题会瞎）：

| 用途 | 变量 |
|---|---|
| 背景 / 更深 | `--bg` `--bg-deep` `--sheet` `--sheet-2` `--sheet-3` |
| 文字 三档 | `--text` `--text-2` `--text-3` |
| 线 三档 | `--line` `--line-2` `--line-3` |
| 网格 | `--grid` `--grid-2` |
| 强调（Web 侧） | `--accent` `--accent-soft` `--accent-dim` |
| 强调（爬虫侧 / 多端侧） | `--amber` `--amber-soft` `--violet` `--violet-soft` |
| 成功/数据 | `--lime` `--lime-soft` `--blue` `--blue-soft` |
| 危险/中断 | `--red` `--red-soft` |
| 字体 | `--sans` `--mono` |
| 动效缓动 | `--ease` |

- 已内置工具类（直接用，别重造）：`.panel`（带角标的面板）、`.panel.flat/.hi`、`.tag`（`.a .m .g .r`）、`.code`（含 `.k .s .c .f .p` 着色 span）、`.btn`、`.chip`、`.kicker`、`.h1` `.h2` `.lede` `.small` `.tiny` `.mono`、`.row .col .g2 .g3 .g4 .spread .fill`、`.dim`（尺寸标注）、`.legend`、`.bp-node`（`.acc/.amb/.ghost`）、`kbd`、`.tiny`。
- 视觉语言：**工程蓝图 + courses-wiki 配色**。细边框、直角（圆角 ≤2px）、角标刻度、尺寸标注、单色线稿 + 少量高亮；默认浅色纸面，深色蓝图可切换。色板对齐 `docs/stylesheets/pyv2.css`：slate 文字/边框、sky 主强调、violet 次强调。

## 4. JS 规则

```js
BP.scene("sc-flow", function (root, gsap, api) {
  // root: <section>；gsap: 已内联的 GSAP；api: {replay, reduced}
  // 在 root 内 querySelector，不要用全局选择器
  function play() { … }
  play();
  return {
    replay: play,              // 切回本场景 / 点「重播」时调用，必须完整复位后重播
    onKey: function (e) {      // 可选：拦截按键（返回 true 表示已消费）
      if (e.key === "ArrowRight" && step < 3) { step++; playStep(); return true; }
    }
  };
});
```

- 纯原生 JS + GSAP，**无网络请求、无外部 CDN、无 ES module**（内联执行）。
- `gsap.timeline()` 必须每次 `play()` 时 **kill 旧时间轴并 `gsap.set()` 复位**，否则重播会叠加。
- 循环动效（脉冲、数据包流动）用 `repeat:-1`，但**幅度要小、频率要慢**（≥1.8s/次），课堂不晃眼。
- 需要入场级联时可直接给元素加 `data-rv`（引擎自动 stagger 淡入）和 `data-draw`（SVG path 描线）；**若你自己写了 timeline，就不要用 `data-rv`**，避免两套动画打架。
- 尊重 `api.reduced`：为 true 时直接 `gsap.set(…, {clearProps:'all'})` 跳动画。
- 交互一律用事件委托绑在 `root` 上，避免重复绑定。

## 5. 内容与口吻

- 中文，**专业教师口吻**：讲结论、讲对比、讲坑，不喊口号、不写"让我们一起来"。
- 叙事顺序固定为：**总览 → 一次往返 → 完整 HTML → 动态与接口 → CSS/XPath 选择器 → 课堂案例 → 总结自检**。
- 案例优先使用口播中真实出现的课程站字体外链、`username=安静/小王`、学生名单、库存 1000→999、`/data?page=N`、B 站标题定位；不要把教学扩展写成讲师原话。
- 技术术语保留英文原词：`AJAX` `SPA` `CGI` `WSGI` `Jinja2` `DOM` `XHR` `headless` `network idle`。
- 每个场景必须回答三个问题：**这一层是什么 → 为什么爬虫在这一层要换手段 → 代码上落到哪个库/哪一行**。
- 文案要具体：给选择器例子、给状态码、给函数名（`requests.get` `soup.select` `driver.find_element`），不要泛泛而谈。
- 允许引用讲师原话时用引号；不要编造讲师没说过的话。转写稿在 `artifacts/web-evolution/notes.md`、`artifacts/crawler/notes.md`（**如已存在务必先读**，用其中的真实例子/术语）。

## 6. 禁止清单

- ❌ 紫色/粉色渐变、玻璃拟态、霓虹发光堆叠、巨大圆角卡片、卡片里套卡片再套卡片
- ❌ emoji 泛滥（全页 ≤2 个，最好 0）
- ❌ 纯文字堆砌（每个场景至少 1 个可交互元素 + 1 个动效）
- ❌ 用 `<img>` 外链、CDN、webfont、fetch
- ❌ 修改 `shell.html` / `build.py` / `CONTRACT.md` / 别人编号的场景文件
- ❌ 把内容写成"PPT 罗列"：每屏结论要能被一句话说清

## 7. 完成自检

1. `node --check build/scenes/NN-name.js`
2. `python build.py` 通过、无 WARN
3. 浏览器打开 `index.html`，翻到自己场景：动效播完、重播正常、交互可点、切「纸面」主题后文字仍可读
4. `send_message` 给 lead：场景编号 + 一句话说明 + 有哪些交互点 + 遗留风险
