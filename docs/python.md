---
title: Python 程序设计
hide:
  - navigation
  - toc
---

<div class="pyv2-hero" data-pyv2-page>
  <div class="inner">
    <div class="cols">
      <div>
        <div class="badge-row">
          <span class="badge">V2 · 2026 修订版</span>
          <span class="badge v">48 课时 · 8 模块</span>
          <span class="badge">2026 秋季</span>
        </div>
        <h1>Python 程序设计<br><span class="grad">面向 AI 时代的修订版</span></h1>
        <p class="sub">AI 已经能写出可运行的代码，编程课还教什么？本课程的回答：<b style="color:#0f172a">读代码、调试、系统设计</b>。
        48 课时从第一行代码走到独立交付一个包含前端、后端与 AI 能力的完整应用——全程与 AI 结对开发，
        并在期末答辩中说明每一行代码的作用。</p>
        <div class="cta-row">
          <a class="pyv2-btn primary" href="v2/m0/">从 M0 开始学习 →</a>
          <a class="pyv2-btn ghost" href="#_2">查看课程地图</a>
        </div>
      </div>
      <div>
        <div class="pyv2-terminal" data-terminal>
          <script type="application/json" class="term-data">
          {
            "loop": true,
            "lines": [
              {"t": "dim",  "x": "# 第一节课：10 分钟做出一个 AI 聊天网页"},
              {"t": "in",   "x": "$ kimi \"做一个 AI 聊天页面，流式输出\""},
              {"t": "dim",  "x": "⠿ 生成 index.html + chat.js ..."},
              {"t": "out",  "x": "✓ 完成（37 行，含流式渲染）"},
              {"t": "in",   "x": "$ python -m http.server 8000"},
              {"t": "dim",  "x": "Serving HTTP on http://localhost:8000"},
              {"t": "ai",   "x": "你：用一句话解释什么是列表推导式"},
              {"t": "ai",   "x": "AI：边遍历边加工、直接产出列表的紧凑写法："},
              {"t": "ai",   "x": "    [x*2 for x in range(5)] → [0, 2, 4, 6, 8]"},
              {"t": "dim",  "x": "# 学期末，你将独立完成同级别的应用"}
            ]
          }
          </script>
          <div class="bar">
            <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
            <span class="title">第 1 节课现场 · AI 结对编程演示</span>
          </div>
          <div class="body"></div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 id="_1" style="font-size:22px;">课程概览</h2>
  <div class="pyv2-stats">
    <div class="pyv2-stat" data-anim><div class="n" data-count="48">0</div><div class="l">线下课时</div></div>
    <div class="pyv2-stat" data-anim><div class="n" data-count="8">0</div><div class="l">教学模块</div></div>
    <div class="pyv2-stat v" data-anim><div class="n" data-count="12">0</div><div class="l">AI 应用开发课时</div></div>
    <div class="pyv2-stat v" data-anim><div class="n" data-count="5" data-suffix="+">0</div><div class="l">期末项目池</div></div>
    <div class="pyv2-stat" data-anim><div class="n" data-count="88" data-suffix="+">0</div><div class="l">经典课程笔记</div></div>
    <div class="pyv2-stat" data-anim><div class="n" data-count="6">0</div><div class="l">项目化作业</div></div>
  </div>

  <h3 style="margin:22px 0 6px;font-size:17px;">三个锚点 · AI 会写代码，你学什么</h3>
  <div class="pyv2-lab">
    <div class="pyv2-demo-card" data-anim>
      <span class="tag g">能力一</span>
      <b>读代码</b>
      <p>AI 生成的代码，你能看懂、能审查、能发现隐患（命名混乱、超出课程范围的语法、边界条件缺失）。这是全课程反复训练的第一项能力。</p>
    </div>
    <div class="pyv2-demo-card" data-anim>
      <span class="tag g">能力二</span>
      <b>调试</b>
      <p>报错是常态。读 traceback、print 定位、二分注释、最小复现——L37 专门设有「AI-free 调试日」，训练不依赖 AI 的排错能力。</p>
    </div>
    <div class="pyv2-demo-card" data-anim>
      <span class="tag g">能力三</span>
      <b>系统设计</b>
      <p>把模糊需求拆成模块、接口与数据流；知道何时该用 RAG、何时用 Agent、何时一个 if 就够。期末项目将全面检验这一能力。</p>
    </div>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <span id="_2"></span>
  <h2 id="weeks" class="pyv2-weeks-h2" style="font-size:22px;">8 幕 × 16 周 · 课程时间线</h2>
  <p>模块是「幕」，周课件是「场」：8 个模块把 16 周分为 8 幕，幕标题直达模块页（要点串讲、运行场、随堂小测）。
  每张周卡片直达当周周课件，并按主/次顺序列出经典课件的对照章节，课堂上可即时对照切换新旧讲法。
  在经典课件中没有对照章节的周标注「全新内容」——本课程近半内容为本次修订新增。</p>

  <section class="pyv2-act" id="act-m0">
    <div class="act-head">
      <span class="act-mid">M0</span>
      <h3>导论</h3>
      <span class="act-range">L1–L2 · W01</span>
      <a class="act-link" href="v2/m0/">模块页 →</a>
    </div>
    <div class="act-weeks">
      <div class="pyv2-week-card" data-anim>
        <div class="wk-head">
          <span class="wk-no">W01</span>
          <span class="wk-lessons">L1–L2</span>
        </div>
        <b class="wk-title">导论 · AI 时代为什么学编程</b>
        <p class="wk-summary">三种能力 · 现场 AI 结对演示 · 提问的艺术 · 环境安装</p>
        <div class="wk-links">
          <a class="wk-go" href="v2/slides/w01.html">周课件 →</a>
          <span class="wk-ref">对照章节 <a class="pri" href="introduction/slideshow.html">第 00 章 课程概述</a></span>
        </div>
      </div>
    </div>
  </section>

  <section class="pyv2-act" id="act-m1">
    <div class="act-head">
      <span class="act-mid">M1</span>
      <h3>环境与工具链</h3>
      <span class="act-range">L3–L5 · W02</span>
      <a class="act-link" href="v2/m1/">模块页 →</a>
    </div>
    <div class="act-weeks">
      <div class="pyv2-week-card" data-anim>
        <div class="wk-head">
          <span class="wk-no">W02</span>
          <span class="wk-lessons">L3–L5</span>
        </div>
        <b class="wk-title">环境与工具链</b>
        <p class="wk-summary">命令行运行 · AI 编程工具 · 亲手调通大模型 API · Git 提交流程</p>
        <div class="wk-links">
          <a class="wk-go" href="v2/slides/w02.html">周课件 →</a>
          <span class="wk-ref">对照章节 <a class="pri" href="basic/slideshow.html">第 01 章 基本概念</a></span>
        </div>
      </div>
    </div>
  </section>

  <section class="pyv2-act" id="act-m2">
    <div class="act-head">
      <span class="act-mid">M2</span>
      <h3>语言核心</h3>
      <span class="act-range">L6–L11 · W03–W05</span>
      <a class="act-link" href="v2/m2/">模块页 →</a>
    </div>
    <div class="act-weeks">
      <div class="pyv2-week-card" data-anim>
        <div class="wk-head">
          <span class="wk-no">W03</span>
          <span class="wk-lessons">L6–L7</span>
        </div>
        <b class="wk-title">类型与数据结构</b>
        <p class="wk-summary">看数据先看类型 · 四种结构一句话选型 · 推导式入门</p>
        <div class="wk-links">
          <a class="wk-go" href="v2/slides/w03.html">周课件 →</a>
          <span class="wk-ref">对照章节 <a class="pri" href="data-types-basic/slideshow.html">第 02 章 数据类型基础</a><a href="data-types-advanced/slideshow.html">第 04 章 数据类型进阶</a></span>
        </div>
      </div>
      <div class="pyv2-week-card" data-anim>
        <div class="wk-head">
          <span class="wk-no">W04</span>
          <span class="wk-lessons">L8–L9</span>
        </div>
        <b class="wk-title">控制流与函数</b>
        <p class="wk-summary">分支循环 · 循环两大杀手 · 函数契约四要素</p>
        <div class="wk-links">
          <a class="wk-go" href="v2/slides/w04.html">周课件 →</a>
          <span class="wk-ref">对照章节 <a class="pri" href="control-flow/slideshow.html">第 03 章 程序结构</a><a href="class/slideshow.html">第 09 章 函数进阶与类</a></span>
        </div>
      </div>
      <div class="pyv2-week-card" data-anim>
        <div class="wk-head">
          <span class="wk-no">W05</span>
          <span class="wk-lessons">L10–L11</span>
        </div>
        <b class="wk-title">IO、异常与类</b>
        <p class="wk-summary">文件持久化 · 异常处理 · 类封装状态 · 模块与包</p>
        <div class="wk-links">
          <a class="wk-go" href="v2/slides/w05.html">周课件 →</a>
          <span class="wk-ref">对照章节 <a class="pri" href="io-file/slideshow.html">第 05 章 输入输出</a><a href="file-and-path/slideshow.html">第 06 章 文件与目录</a><a href="class/slideshow.html">第 09 章 函数进阶与类</a></span>
        </div>
      </div>
    </div>
  </section>

  <section class="pyv2-act" id="act-m3">
    <div class="act-head">
      <span class="act-mid">M3</span>
      <h3>数据获取与处理</h3>
      <span class="act-range">L12–L15 · W06–W07</span>
      <a class="act-link" href="v2/m3/">模块页 →</a>
    </div>
    <div class="act-weeks">
      <div class="pyv2-week-card" data-anim>
        <div class="wk-head">
          <span class="wk-no">W06</span>
          <span class="wk-lessons">L12–L14</span>
        </div>
        <b class="wk-title">HTTP 与数据获取</b>
        <p class="wk-summary">请求-响应模型 · F12 实测 · requests 调 API · 爬虫精要与伦理</p>
        <div class="wk-links">
          <a class="wk-go" href="v2/slides/w06.html">周课件 →</a>
          <span class="wk-ref">对照章节 <a class="pri" href="web-and-crawler/slideshow.html">第 11 章 Web 分析与爬虫</a><a href="crawler/slideshow.html">第 12 章 爬虫</a></span>
        </div>
      </div>
      <div class="pyv2-week-card" data-anim>
        <div class="wk-head">
          <span class="wk-no">W07</span>
          <span class="wk-lessons">L15–L16</span>
        </div>
        <b class="wk-title">数据可视化与虚拟环境</b>
        <p class="wk-summary">Pandas 筛选统计 · Matplotlib 画图 · 依赖隔离与复现</p>
        <div class="wk-links">
          <a class="wk-go" href="v2/slides/w07.html">周课件 →</a>
          <span class="wk-ref">对照章节 <a class="pri" href="data-process-and-visualization/slideshow.html">第 13 章 数据处理与可视化</a><a href="virtualenvs/slideshow.html">第 08 章 第三方库与虚拟环境</a><a href="data-process-and-visualization-example/slideshow.html">第 14 章 数据处理与可视化实例</a></span>
        </div>
      </div>
    </div>
  </section>

  <section class="pyv2-act" id="act-m4">
    <div class="act-head">
      <span class="act-mid">M4</span>
      <h3>工程化</h3>
      <span class="act-range">L16–L18 · W07–W08</span>
      <a class="act-link" href="v2/m4/">模块页 →</a>
    </div>
    <div class="act-weeks">
      <div class="pyv2-week-card" data-anim>
        <div class="wk-head">
          <span class="wk-no">W08</span>
          <span class="wk-lessons">L17–L18</span>
        </div>
        <b class="wk-title">代码质量与模块化</b>
        <p class="wk-summary">AI 代码五类问题 · 审查三步法 · assert 测试 · 项目结构</p>
        <div class="wk-links">
          <a class="wk-go" href="v2/slides/w08.html">周课件 →</a>
          <span class="wk-ref">对照章节 <a class="pri" href="lib-and-packages/slideshow.html">第 07 章 模块与包</a></span>
        </div>
      </div>
    </div>
    <p class="act-cross">W07「数据可视化与虚拟环境」跨 M3 / M4 两幕，周卡片见 <a href="#act-m3">M3 幕</a>。</p>
  </section>

  <section class="pyv2-act" id="act-m5">
    <div class="act-head">
      <span class="act-mid">M5</span>
      <h3>AI 应用开发</h3>
      <span class="act-range">L19–L30 · W09–W13 · 课程核心模块</span>
      <a class="act-link" href="v2/m5/">模块页 →</a>
    </div>
    <div class="act-weeks">
      <div class="pyv2-week-card" data-anim>
        <div class="wk-head">
          <span class="wk-no">W09</span>
          <span class="wk-lessons">L19–L20</span>
          <span class="wk-badge">全新内容</span>
        </div>
        <b class="wk-title">API 深入与 Prompt 工程</b>
        <p class="wk-summary">四参数 · 流式输出 · Prompt 五组件 · Few-shot 与 CoT</p>
        <div class="wk-links">
          <a class="wk-go" href="v2/slides/w09.html">周课件 →</a>
        </div>
      </div>
      <div class="pyv2-week-card" data-anim>
        <div class="wk-head">
          <span class="wk-no">W10</span>
          <span class="wk-lessons">L21–L22</span>
          <span class="wk-badge">全新内容</span>
        </div>
        <b class="wk-title">结构化输出与 RAG 基础</b>
        <p class="wk-summary">JSON Mode · Function Calling · 幻觉与 RAG 原理</p>
        <div class="wk-links">
          <a class="wk-go" href="v2/slides/w10.html">周课件 →</a>
        </div>
      </div>
      <div class="pyv2-week-card" data-anim>
        <div class="wk-head">
          <span class="wk-no">W11</span>
          <span class="wk-lessons">L23–L24</span>
          <span class="wk-badge">全新内容</span>
        </div>
        <b class="wk-title">RAG 实战与多模态</b>
        <p class="wk-summary">numpy 手搓完整 RAG 链路 · Vision 看图 · TTS 说话</p>
        <div class="wk-links">
          <a class="wk-go" href="v2/slides/w11.html">周课件 →</a>
        </div>
      </div>
      <div class="pyv2-week-card" data-anim>
        <div class="wk-head">
          <span class="wk-no">W12</span>
          <span class="wk-lessons">L25–L26</span>
          <span class="wk-badge">全新内容</span>
        </div>
        <b class="wk-title">AI Agent</b>
        <p class="wk-summary">ReAct 循环手写 · 工具设计 · 故障防护与能力边界</p>
        <div class="wk-links">
          <a class="wk-go" href="v2/slides/w12.html">周课件 →</a>
        </div>
      </div>
      <div class="pyv2-week-card" data-anim>
        <div class="wk-head">
          <span class="wk-no">W13</span>
          <span class="wk-lessons">L27–L30</span>
        </div>
        <b class="wk-title">FastAPI 前后端与方法论</b>
        <p class="wk-summary">路由与 Pydantic · fetch 前端 · 对话记忆 · 五步开发流程</p>
        <div class="wk-links">
          <a class="wk-go" href="v2/slides/w13.html">周课件 →</a>
          <span class="wk-ref">对照章节 <a class="pri" href="web/slideshow.html">第 10 章 Web 开发</a></span>
        </div>
      </div>
    </div>
  </section>

  <section class="pyv2-act" id="act-m6">
    <div class="act-head">
      <span class="act-mid">M6</span>
      <h3>综合项目实战</h3>
      <span class="act-range">L31–L44 · W14–W16</span>
      <a class="act-link" href="v2/m6/">模块页 →</a>
    </div>
    <div class="act-weeks">
      <div class="pyv2-week-card" data-anim>
        <div class="wk-head">
          <span class="wk-no">W14</span>
          <span class="wk-lessons">L31–L34</span>
          <span class="wk-badge">全新内容</span>
        </div>
        <b class="wk-title">项目启动与冲刺一</b>
        <p class="wk-summary">项目池选题 · MVP 定义 · 架构设计 · 后端与 AI 核心</p>
        <div class="wk-links">
          <a class="wk-go" href="v2/slides/w14.html">周课件 →</a>
        </div>
      </div>
      <div class="pyv2-week-card" data-anim>
        <div class="wk-head">
          <span class="wk-no">W15</span>
          <span class="wk-lessons">L35–L39</span>
          <span class="wk-badge">全新内容</span>
        </div>
        <b class="wk-title">联调、调试日与部署</b>
        <p class="wk-summary">联调三坑 · AI-free 调试日 · Bug Bash · 部署就绪</p>
        <div class="wk-links">
          <a class="wk-go" href="v2/slides/w15.html">周课件 →</a>
        </div>
      </div>
      <div class="pyv2-week-card" data-anim>
        <div class="wk-head">
          <span class="wk-no">W16</span>
          <span class="wk-lessons">L40–L48</span>
          <span class="wk-badge">全新内容</span>
        </div>
        <b class="wk-title">答辩与课程总结</b>
        <p class="wk-summary">打磨与答辩 · 优秀代码复盘 · 能力模型与进阶路线</p>
        <div class="wk-links">
          <a class="wk-go" href="v2/slides/w16.html">周课件 →</a>
        </div>
      </div>
    </div>
  </section>

  <section class="pyv2-act" id="act-m7">
    <div class="act-head">
      <span class="act-mid">M7</span>
      <h3>总结与展望</h3>
      <span class="act-range">L45–L48 · W16</span>
      <a class="act-link" href="v2/m7/">模块页 →</a>
    </div>
    <p class="act-cross">W16「答辩与课程总结」跨 M6 / M7 两幕，周卡片见 <a href="#act-m6">M6 幕</a>。</p>
  </section>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:22px;">交互实验室</h2>
  <p>课程的核心原理均配有可交互的动画与沙箱，点击卡片进入演示。各模块页还内嵌<b style="color:#0f172a">可直接在浏览器中运行的 Python 环境</b>（Pyodide，无需安装）。</p>
  <div class="pyv2-lab">
    <a class="pyv2-demo-card" href="demos/interpreter.html" data-anim>
      <span class="tag">GSAP · 步进动画</span>
      <b>编译 vs 解释：代码如何变成运行</b>
      <p>C 的编译四部曲与 Python 的字节码 / PVM 逐段对照，粒子流水线演示每一步产物。</p>
      <span class="go">进入演示 →</span>
    </a>
    <a class="pyv2-demo-card" href="demos/objects.html" data-anim>
      <span class="tag v">Three.js · 3D 交互</span>
      <b>一切皆对象：内存空间的直觉</b>
      <p>3D 内存空间中亲手执行 <code>a = "hello"</code>：对象如何诞生、名字如何绑定引用、is 与 == 的区别。</p>
      <span class="go">进入演示 →</span>
    </a>
    <a class="pyv2-demo-card" href="demos/base64.html" data-anim>
      <span class="tag v">Manim 风格 · 位运算</span>
      <b>Base64 编码原理可视化</b>
      <p>3 字节 → 24 比特 → 4 组 6 比特 → 查表输出。经典作业的每一步都可暂停、单步、回放。</p>
      <span class="go">进入演示 →</span>
    </a>
    <a class="pyv2-demo-card" href="demos/rag.html" data-anim>
      <span class="tag">流程模拟</span>
      <b>RAG：让 AI 读你的文档</b>
      <p>文档切分 → 向量化 → 语义检索 → 拼接 Prompt → 生成回答，完整呈现 M5 的核心架构。</p>
      <span class="go">进入演示 →</span>
    </a>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:22px;">作业线与考核</h2>
  <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:22px;" class="pyv2-two">
    <div>
      <div class="pyv2-tl">
        <div class="pyv2-tl-item" data-anim><b>① 数据处理脚本</b><span class="meta">W3 发布</span>
          <p>处理真实 JSON/CSV：提取、转换、统计。数据结构选型是关键。</p></div>
        <div class="pyv2-tl-item" data-anim><b>② API 调用项目</b><span class="meta">W6 发布</span>
          <p>调用公开 API 获取数据并结构化处理，处理超时与错误。</p></div>
        <div class="pyv2-tl-item" data-anim><b>③ 模块化重构</b><span class="meta">W8 发布</span>
          <p>把单文件脚本重构为模块化项目，.env 管密钥。</p></div>
        <div class="pyv2-tl-item v" data-anim><b>④ Prompt 工程实战</b><span class="meta">W9 发布</span>
          <p>设计结构化 Prompt 模板，鼓励大量 AI 实验。</p></div>
        <div class="pyv2-tl-item v" data-anim><b>⑤ RAG 迷你应用</b><span class="meta">W11 发布</span>
          <p>小型文档问答系统：向量化、检索、生成完整链路。</p></div>
        <div class="pyv2-tl-item v" data-anim><b>⑥ 期末大项目</b><span class="meta">W14 启动 · W16 答辩</span>
          <p>完整 AI 应用 + AI 协作日志 + 答辩。</p></div>
      </div>
    </div>
    <div data-anim>
      <h3 style="margin-bottom:6px;">期末项目池（五选一）</h3>
      <p>AI 知识库助手（RAG）· 智能学伴（Function Calling）· AI 创意工坊（多模态）· 智能数据分析师（NL2Code）· AI 客服机器人</p>
      <h3 style="margin:14px 0 6px;">AI 协作</h3>
      <p>全课程鼓励 AI 协作开发，同时坚持一条底线：<b>提交的每一行代码，你都要能解释「干什么、为什么」</b>。</p>
      <h3 style="margin:14px 0 6px;">课件与课堂</h3>
      <p>每周课件见上方「8 幕 × 16 周 · 课程时间线」板块；课程相关安排以课堂说明为准。</p>
    </div>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:22px;">资料库</h2>
  <div class="pyv2-lab">
    <a class="pyv2-demo-card" href="v2/notes-index/" data-anim>
      <span class="tag">深挖</span><b>经典课程笔记 · 88 篇</b>
      <p>旧版 15 章课程的逐节详解笔记，含时间戳可回查视频，概念深挖的最佳参考。</p><span class="go">进入笔记库 →</span>
    </a>
    <a class="pyv2-demo-card" href="introduction/" data-anim>
      <span class="tag v">存档</span><b>经典版课件</b>
      <p>旧版 15 章幻灯片课件（reveal.js），V2 课程中的语法细节可在此查阅。</p><span class="go">查看课件 →</span>
    </a>
    <a class="pyv2-demo-card" href="v2/slides-index/" data-anim>
      <span class="tag v">授课</span><b>16 周在线课件</b>
      <p>高交互授课课件：分步讲授、可运行练习、随堂小测，与全部模块互相链接。</p><span class="go">进入课件总览 →</span>
    </a>
  </div>
</div>

<div data-pyv2-ai hidden></div>

<style>
@media (max-width: 960px) { .pyv2-two { grid-template-columns: 1fr !important; } }
</style>
