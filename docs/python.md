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
          <span class="badge">V2 · AI 原生重构版</span>
          <span class="badge v">48 课时 · 8 模块</span>
          <span class="badge">2026 秋季</span>
        </div>
        <h1>Python 程序设计<br><span class="grad">AI 原生驱动版</span></h1>
        <p class="sub">当 AI 能写代码，编程课教什么？这门课的答案：<b style="color:#0f172a">读代码、调试、系统设计</b>。
        48 课时从第一行代码走到独立交付一个有前端、有后端、有 AI 核心的完整应用——全程 AI 结对开发，
        并在答辩中说清每一行代码的作用。</p>
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
              {"t": "dim",  "x": "// 这就是你学期末要自己做出来的东西"}
            ]
          }
          </script>
          <div class="bar">
            <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
            <span class="title">vibe coding — 第 1 节课现场</span>
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
    <div class="pyv2-stat" data-anim><div class="n" data-count="60" data-suffix="+">0</div><div class="l">精讲微课</div></div>
    <div class="pyv2-stat" data-anim><div class="n" data-count="6">0</div><div class="l">项目化作业</div></div>
  </div>

  <h3 style="margin:22px 0 6px;font-size:17px;">三个锚点 · AI 会写代码，你学什么</h3>
  <div class="pyv2-lab">
    <div class="pyv2-demo-card" data-anim>
      <span class="tag g">能力一</span>
      <b>读代码</b>
      <p>AI 生成的代码，你能看懂、能审查、能发现坑（命名混乱、超纲语法、边界缺失）。这是全课程反复训练的第一能力。</p>
    </div>
    <div class="pyv2-demo-card" data-anim>
      <span class="tag g">能力二</span>
      <b>调试</b>
      <p>报错是常态。读 traceback、print 定位、二分注释、最小复现——L37 专门设有「AI-free 调试日」锤炼无 AI 时的排错肌肉。</p>
    </div>
    <div class="pyv2-demo-card" data-anim>
      <span class="tag g">能力三</span>
      <b>系统设计</b>
      <p>把模糊需求拆成模块、接口与数据流；知道何时该用 RAG、何时用 Agent、何时一个 if 就够了。期末项目见真章。</p>
    </div>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 id="_2" style="font-size:22px;">学习路径 · 八大模块</h2>
  <p>主线：从「零环境」到「独立交付 AI 应用」。每张卡片可点击进入模块页，含课件、可运行代码、随堂测验。</p>
  <div class="pyv2-path">
    <a class="pyv2-mod-card" href="v2/m0/" data-anim><div class="glow"></div>
      <span class="mid">M0 · L1–L2</span><b>导论</b>
      <span>AI 时代为什么学编程；第一节课现场 vibe coding 出一个 AI 聊天网页</span>
      <span class="lessons">2 课时 · V001–V003</span>
    </a>
    <a class="pyv2-mod-card" href="v2/m1/" data-anim><div class="glow"></div>
      <span class="mid">M1 · L3–L5</span><b>环境与工具链</b>
      <span>命令行运行、Kimi Code / Trae 工具全家桶、第 4 课调通大模型 API、Git 分支工作流</span>
      <span class="lessons">3 课时 · V004–V008</span>
    </a>
    <a class="pyv2-mod-card" href="v2/m2/" data-anim><div class="glow"></div>
      <span class="mid">M2 · L6–L11</span><b>语言核心速通</b>
      <span>类型、数据结构选型、控制流、函数契约、IO 与异常、类——建思维模型而非背方法清单</span>
      <span class="lessons">6 课时 · V009–V021</span>
    </a>
    <a class="pyv2-mod-card" href="v2/m3/" data-anim><div class="glow"></div>
      <span class="mid">M3 · L12–L15</span><b>数据获取与处理</b>
      <span>HTTP 与 F12 实测、requests 调 API、爬虫精要与伦理、Pandas + Matplotlib 全链路</span>
      <span class="lessons">4 课时 · V022–V028</span>
    </a>
    <a class="pyv2-mod-card" href="v2/m4/" data-anim><div class="glow"></div>
      <span class="mid">M4 · L16–L18</span><b>工程化</b>
      <span>虚拟环境与依赖、AI 生成代码的审查重构、模块化项目结构与配置管理</span>
      <span class="lessons">3 课时 · V029–V033</span>
    </a>
    <a class="pyv2-mod-card" href="v2/m5/" data-anim><div class="glow"></div>
      <span class="mid">M5 · L19–L30</span><b>AI 应用开发</b>
      <span>课程核心增量：Prompt 工程、Function Calling、RAG、Agent、FastAPI 前后端、对话记忆</span>
      <span class="lessons">12 课时 · V034–V053</span>
    </a>
    <a class="pyv2-mod-card" href="v2/m6/" data-anim><div class="glow"></div>
      <span class="mid">M6 · L31–L44</span><b>综合项目实战</b>
      <span>14 课时完整项目周期：选题→架构→冲刺→AI-free 调试日→Bug Bash→答辩</span>
      <span class="lessons">14 课时 · 期末 50%</span>
    </a>
    <a class="pyv2-mod-card" href="v2/m7/" data-anim><div class="glow"></div>
      <span class="mid">M7 · L45–L48</span><b>总结与展望</b>
      <span>AI 技术版图、数据库 / Docker / 云概念、职业路线与持续学习</span>
      <span class="lessons">4 课时 · V056–V059</span>
    </a>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:22px;">课程知识图谱</h2>
  <p>拖拽节点、悬停查看说明、点击模块节点直达模块页。虚线为跨模块能力依赖。</p>
  <div class="pyv2-graph-wrap">
    <canvas id="pyv2-kgraph" height="560"></canvas>
    <div class="pyv2-graph-tip"></div>
    <span class="hint">拖拽 / 悬停 / 点击模块节点跳转</span>
    <script type="application/json" id="pyv2-kgraph-data">
    {
      "modules": [
        {"id": "m0", "label": "M0 导论", "color": "#38bdf8", "r": 26, "href": "v2/m0/", "desc": "AI 时代为什么学编程；现场做出第一个 AI 应用"},
        {"id": "m1", "label": "M1 环境工具", "color": "#22d3ee", "r": 24, "href": "v2/m1/", "desc": "命令行 · AI 工具全家桶 · 大模型 API 初体验 · Git"},
        {"id": "m2", "label": "M2 语言核心", "color": "#34d399", "r": 26, "href": "v2/m2/", "desc": "类型 · 数据结构 · 控制流 · 函数 · IO 异常 · 类"},
        {"id": "m3", "label": "M3 数据获取", "color": "#fbbf24", "r": 24, "href": "v2/m3/", "desc": "HTTP · requests · 爬虫精要 · Pandas 可视化"},
        {"id": "m4", "label": "M4 工程化", "color": "#f472b6", "r": 22, "href": "v2/m4/", "desc": "虚拟环境 · 代码审查 · 模块化结构"},
        {"id": "m5", "label": "M5 AI开发", "color": "#a78bfa", "r": 30, "href": "v2/m5/", "desc": "Prompt · Function Calling · RAG · Agent · FastAPI"},
        {"id": "m6", "label": "M6 综合项目", "color": "#f87171", "r": 27, "href": "v2/m6/", "desc": "14 课时：选题 → 冲刺 → 答辩"},
        {"id": "m7", "label": "M7 展望", "color": "#94a3b8", "r": 20, "href": "v2/m7/", "desc": "技术版图 · 进阶路线 · 职业发展"}
      ],
      "lessons": [
        {"id": "l1", "m": "m0", "label": "L1 第一课", "big": true, "desc": "10 分钟 vibe coding 出 AI 聊天网页"},
        {"id": "l2", "m": "m0", "label": "L2 学习法"},
        {"id": "l4", "m": "m1", "label": "L4 API初体验", "big": true, "desc": "第 4 课亲手调通大模型 API"},
        {"id": "l5", "m": "m1", "label": "L5 Git 工作流"},
        {"id": "l7", "m": "m2", "label": "L7 数据结构选型", "big": true, "desc": "四种结构一句话定位：什么时候用什么"},
        {"id": "l9", "m": "m2", "label": "L9 函数契约", "desc": "好的函数契约 = 好的 prompt"},
        {"id": "l11", "m": "m2", "label": "L11 类与对象"},
        {"id": "l13", "m": "m3", "label": "L13 API 实战", "big": true, "desc": "requests 调 3 个公开 API"},
        {"id": "l15", "m": "m3", "label": "L15 Pandas 可视化"},
        {"id": "l17", "m": "m4", "label": "L17 代码审查", "desc": "现场重构一段 AI 生成的烂代码"},
        {"id": "l20", "m": "m5", "label": "L20 Prompt 工程", "big": true},
        {"id": "l22", "m": "m5", "label": "L22 RAG 基础", "big": true, "desc": "向量 · 语义检索 · 切分策略"},
        {"id": "l25", "m": "m5", "label": "L25 Agent 基础", "desc": "ReAct：推理 + 行动循环"},
        {"id": "l27", "m": "m5", "label": "L27 FastAPI", "big": true},
        {"id": "l37", "m": "m6", "label": "L37 AI-free 调试日", "big": true, "desc": "禁用一切 AI，只靠 print/日志/读报错修 bug"},
        {"id": "l42", "m": "m6", "label": "L42 项目答辩"},
        {"id": "l45", "m": "m7", "label": "L45 技术版图"},
        {"id": "l47", "m": "m7", "label": "L47 职业路线"}
      ],
      "links": [
        ["m0", "m1"], ["m1", "m2"], ["m2", "m3"], ["m3", "m4"], ["m4", "m5"], ["m5", "m6"], ["m6", "m7"]
      ],
      "crosslinks": [
        ["m2", "m5"], ["m3", "m6"], ["m5", "m6"], ["m1", "m3"], ["m4", "m5"], ["m3", "m5"], ["m2", "m7"]
      ]
    }
    </script>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:22px;">交互实验室</h2>
  <p>概念不再是静态文字——每个核心原理都做成可操作的动画与沙箱，点击卡片全屏体验。各模块页还内嵌<b style="color:#0f172a">浏览器内直接运行的 Python 运行场</b>（Pyodide，无需安装）。</p>
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
      <p>文档切分 → 向量化 → 语义检索 → 拼接 Prompt → 生成回答，M5 核心架构一屏看懂。</p>
      <span class="go">进入演示 →</span>
    </a>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:22px;">作业线与考核</h2>
  <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:22px;" class="pyv2-two">
    <div>
      <div class="pyv2-tl">
        <div class="pyv2-tl-item" data-anim><b>① 数据处理脚本</b><span class="meta">L6 发布 · 10%</span>
          <p>处理真实 JSON/CSV：提取、转换、统计。数据结构选型是评分点。</p></div>
        <div class="pyv2-tl-item" data-anim><b>② API 调用项目</b><span class="meta">L13 发布 · 10%</span>
          <p>调用公开 API 获取数据并结构化处理，处理超时与错误。</p></div>
        <div class="pyv2-tl-item" data-anim><b>③ 模块化重构</b><span class="meta">L18 发布 · 10%</span>
          <p>把单文件脚本重构为模块化项目，.env 管密钥。</p></div>
        <div class="pyv2-tl-item v" data-anim><b>④ Prompt 工程实战</b><span class="meta">L20 发布 · 10%</span>
          <p>设计结构化 Prompt 模板，鼓励大量 AI 实验。</p></div>
        <div class="pyv2-tl-item v" data-anim><b>⑤ RAG 迷你应用</b><span class="meta">L23 发布 · 10%</span>
          <p>小型文档问答系统：向量化、检索、生成完整链路。</p></div>
        <div class="pyv2-tl-item v" data-anim><b>⑥ 期末大项目</b><span class="meta">L31 发布 · 50%</span>
          <p>完整 AI 应用 + AI 协作日志 + 答辩「灵魂三问」。</p></div>
      </div>
    </div>
    <div data-anim>
      <h3 style="margin-bottom:6px;">成绩构成</h3>
      <p>平时作业 <b style="color:#0f172a">50%</b>（4 次小作业各 10% + 课堂参与 10%）<br>
      期末大项目 <b style="color:#0f172a">50%</b> · 无上机考试</p>
      <h3 style="margin:14px 0 6px;">AI 政策</h3>
      <p>全课程允许 AI 协作，但有三道防线：<br>
      ① M2/M3 每课末 5 分钟<b style="color:#0f172a">无 AI 纸面小测</b><br>
      ② 作业随机 20% <b style="color:#0f172a">「指行讲思路」抽查</b><br>
      ③ 答辩随机指一行代码问「这是干什么的」</p>
      <h3 style="margin:14px 0 6px;">期末项目池（五选一）</h3>
      <p>AI 知识库助手（RAG）· 智能学伴（Function Calling）· AI 创意工坊（多模态）· 智能数据分析师（NL2Code）· AI 客服机器人</p>
    </div>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:22px;">资料库</h2>
  <div class="pyv2-lab">
    <a class="pyv2-demo-card" href="v2/scripts-index/" data-anim>
      <span class="tag">讲义</span><b>微课视频讲义</b>
      <p>V001 起全部微课的完整口播稿与教学设计，配合视频食用。</p><span class="go">浏览讲义 →</span>
    </a>
    <a class="pyv2-demo-card" href="v2/notes-index/" data-anim>
      <span class="tag">深挖</span><b>经典课程笔记 · 88 篇</b>
      <p>旧版 15 章课程的逐节详解笔记，含时间戳可回查视频，概念深挖的最佳参考。</p><span class="go">进入笔记库 →</span>
    </a>
    <a class="pyv2-demo-card" href="introduction/" data-anim>
      <span class="tag v">存档</span><b>经典版课件</b>
      <p>旧版 15 章幻灯片课件（reveal.js），V2 课程的语法细节仍可在此深挖。</p><span class="go">查看课件 →</span>
    </a>
    <a class="pyv2-demo-card" href="v2/assessments/" data-anim>
      <span class="tag v">考核</span><b>作业与考核细则</b>
      <p>六次作业的完整要求、提交方式、评分标准与 AI 协作规范。</p><span class="go">查看细则 →</span>
    </a>
  </div>
</div>

<div data-pyv2-ai hidden></div>

<style>
@media (max-width: 960px) { .pyv2-two { grid-template-columns: 1fr !important; } }
</style>
