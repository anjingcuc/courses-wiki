(function () {
  "use strict";
  window.__timelines = window.__timelines || {};
  if (new URLSearchParams(window.location.search).get("shell") === "standalone") document.documentElement.classList.add("hf-embedded");

  var TOTAL_SECONDS = 34;
  var scenes = [
    { id: "scene-cover", start: 0, end: 2 },
    { id: "scene-hook", start: 2, end: 4 },
    { id: "scene-problem", start: 4, end: 6 },
    { id: "scene-goals", start: 6, end: 8 },
    { id: "scene-content", start: 8, end: 10 },
    { id: "scene-method", start: 10, end: 12 },
    { id: "scene-lesson", start: 12, end: 14 },
    { id: "scene-review", start: 14, end: 16 },
    { id: "scene-environment", start: 16, end: 18 },
    { id: "scene-assessment", start: 18, end: 20 },
    { id: "scene-ethics", start: 20, end: 22 },
    { id: "scene-evidence", start: 22, end: 24 },
    { id: "scene-transfer", start: 24, end: 26 },
    { id: "scene-close", start: 26, end: 28 },
    { id: "scene-measure", start: 28, end: 30 },
    { id: "scene-sources", start: 30, end: 32 },
    { id: "scene-rubric", start: 32, end: 34 }
  ];
  var fragmentDefs = [
    { time: 4.2, id: "p1" },
    { time: 4.4, id: "p2" },
    { time: 4.6, id: "p3" }
  ];
  var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function byId(id) { return document.getElementById(id); }
  function all(selector, root) { return Array.from((root || document).querySelectorAll(selector)); }
  function activate(buttons, current) {
    buttons.forEach(function (button) {
      var selected = button === current;
      button.classList.toggle("active", selected);
      if (button.hasAttribute("aria-selected")) button.setAttribute("aria-selected", String(selected));
    });
  }

  function paintVisibility(t) {
    scenes.forEach(function (scene) {
      var el = byId(scene.id);
      if (!el) return;
      var active = t >= scene.start && t < scene.end;
      el.style.opacity = active ? "1" : "0";
      el.style.visibility = active ? "visible" : "hidden";
      el.style.pointerEvents = active ? "auto" : "none";
    });
    fragmentDefs.forEach(function (fragment) {
      var el = byId(fragment.id);
      if (!el) return;
      var visible = t >= fragment.time && t < 6;
      el.style.opacity = visible ? "1" : "0";
      el.style.visibility = visible ? "visible" : "hidden";
      el.style.pointerEvents = visible ? "auto" : "none";
    });
  }

  var rootTimeline = window.__timelines.root;
  rootTimeline.to({}, { duration: TOTAL_SECONDS });
  scenes.forEach(function (scene) {
    var el = byId(scene.id);
    if (!el) return;
    rootTimeline.set(el, { opacity: 0, visibility: "hidden", pointerEvents: "none" }, 0);
    rootTimeline.set(el, { opacity: 1, visibility: "visible", pointerEvents: "auto" }, scene.start);
    rootTimeline.set(el, { opacity: 0, visibility: "hidden", pointerEvents: "none" }, scene.end);
    var animEls = all("[data-anim]", el);
    if (!animEls.length) return;
    if (reducedMotion) rootTimeline.set(animEls, { opacity: 1, y: 0 }, scene.start);
    else rootTimeline.fromTo(animEls, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.38, stagger: 0.045, ease: "power2.out", immediateRender: false }, scene.start);
  });
  fragmentDefs.forEach(function (fragment) {
    var el = byId(fragment.id);
    if (!el) return;
    rootTimeline.set(el, { opacity: 0, x: 0, visibility: "hidden", pointerEvents: "none" }, 0);
    // Reveal at the fragment boundary. A paused timeline at exactly this time must
    // already be fully visible, otherwise the third card can be skipped while its
    // fade-in is still at opacity 0.
    rootTimeline.set(el, { opacity: 1, x: 0, visibility: "visible", pointerEvents: "auto" }, fragment.time);
    rootTimeline.set(el, { opacity: 0, visibility: "hidden", pointerEvents: "none" }, 6);
  });
  window.__hfSetTime = function (t) {
    rootTimeline.seek(t);
    paintVisibility(t);
  };
  paintVisibility(0);

  function postTimeline() {
    if (window.parent === window) return;
    window.parent.postMessage({
      source: "hf-preview",
      type: "timeline",
      durationInFrames: TOTAL_SECONDS * 30,
      scenes: scenes.map(function (scene) {
        return { id: scene.id.replace(/^scene-/, ""), start: scene.start, duration: scene.end - scene.start };
      })
    }, "*");
  }
  if (document.readyState === "complete") window.setTimeout(postTimeline, 300);
  else window.addEventListener("load", function () { window.setTimeout(postTimeline, 300); });

  // Large in-scene branch links delegate to the slideshow component's native hotspots.
  all("[data-branch-target]").forEach(function (button) {
    button.addEventListener("click", function () {
      try {
        var hotspot = window.parent.document.querySelector('[data-hotspot-target="' + button.dataset.branchTarget + '"]');
        if (hotspot) hotspot.click();
      } catch (error) {
        // Cross-origin file embedding may block parent access; the native hotspot remains available.
      }
    });
  });

  // Opening question
  var hookSwitch = byId("hook-switch");
  if (hookSwitch) hookSwitch.addEventListener("click", function () {
    var after = hookSwitch.classList.toggle("is-after");
    hookSwitch.setAttribute("aria-pressed", String(after));
    byId("hook-answer").classList.toggle("visible", after);
  });

  // Problem diagnosis
  var problemResponses = {
    content: "重构内容地图：压缩可检索知识，新增 AI 应用开发",
    ability: "重写能力模型：提出需求、发现问题、设计品味，训练生成之后的判断",
    task: "提高交付规格：用完整应用、项目周期与答辩核验替代单文件脚本"
  };
  var problemButtons = all("[data-problem]");
  problemButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activate(problemButtons, button);
      byId("problem-response").querySelector("strong").textContent = problemResponses[button.dataset.problem];
    });
  });

  // Core capabilities
  var goalData = {
    frame: {
      kicker: "能力 01 · 提出需求",
      title: "先把问题说清楚，再让 AI 开始写",
      desc: "能把模糊任务改写成可执行的需求规格：明确用户与场景、输入输出、边界、失败路径与验收标准，并说明关键取舍。",
      task: "<b>给定</b>一个网安场景中的模糊任务，<b>在课堂内</b>产出需求规格：用户与场景、输入输出、边界与失败路径、验收标准，并说明一条关键取舍。",
      criterion: "<strong>4 维</strong><span>规格完整</span><i></i><strong>必过</strong><span>验收可验证</span>"
    },
    find: {
      kicker: "能力 02 · 发现问题",
      title: "不把“能跑”当作“没问题”",
      desc: "面对 AI 生成的代码与方案，能定位缺陷、识别需求遗漏和安全风险，说明后果、判断优先级并完成修复。",
      task: "<b>给定</b>含 5 处缺陷的 AI 代码，<b>在课堂限时条件下</b>指出位置、说明后果、完成修复，并区分阻断性问题与改进项。",
      criterion: "<strong>≥ 3 / 5</strong><span>缺陷检出</span><i></i><strong>必过</strong><span>密钥硬编码</span>"
    },
    taste: {
      kicker: "能力 03 · 设计品味",
      title: "在多个“能跑”的方案里，做出有理由的选择",
      desc: "能比较结构、接口、可维护性、安全与成本，选择与场景匹配的设计并说明理由；不把局部脚本拼成黑箱。",
      task: "<b>给定</b>同一需求的两种实现，完成方案比较与接口设计，说明模块边界、数据流、异常与权限取舍，并指出何时应推翻自己的方案。",
      criterion: "<strong>2 案</strong><span>比较论证</span><i></i><strong>4 维</strong><span>统一量规</span>"
    }
  };
  var goalButtons = all("[data-goal]");
  goalButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activate(goalButtons, button);
      var data = goalData[button.dataset.goal];
      byId("goal-kicker").textContent = data.kicker;
      byId("goal-title").textContent = data.title;
      byId("goal-desc").textContent = data.desc;
      byId("goal-task").innerHTML = data.task;
      byId("goal-criterion").innerHTML = data.criterion;
    });
  });

  // 48-hour module map
  var moduleData = {
    M0: ["M0 · 2 学时", "先回答“AI 时代为什么还学编程”", "三项核心能力、提问方法与环境初配，建立课程的共同底线。", "改写导论：从语法入门转为能力地图与人机分工。"],
    M1: ["M1 · 3 学时", "把工具链变成可迁移的工作方式", "命令行、AI 编程工具、第一次大模型 API 调用与 Git 分支工作流。", "API 与 Git 为新内容；学生从第一次提交开始留下过程。"],
    M2: ["M2 · 6 学时", "语法仍然重要，但示例换成真实 API 场景", "类型与数据结构、控制流、函数契约、IO 与异常、类。", "以人为主：核心语法手写，AI 只用于解释报错与查询方法。"],
    M3: ["M3 · 4 学时", "压缩工具记忆，保留数据获取与处理的核心判断", "HTTP 与请求响应、API、爬虫精要、Pandas 与可视化。", "爬虫由 6 节并为 1 节精要课；增加当堂训练而非简单删除。"],
    M4: ["M4 · 3 学时", "从单文件脚本迈向可审查的模块项目", "虚拟环境、AI 生成代码审查与测试、模块化项目结构。", "强化代码审查，为综合项目建立工程与质量底线。"],
    M5: ["M5 · 12 学时", "把每节课的成果，做成下一节课的“零件”", "API 深入 → Prompt 工程 → 结构化输出 → RAG → 多模态 → Agent → FastAPI 联调 → 对话记忆 → 结对开发。", "零件串联，最终在 M6 拼合为含前端、后端与 AI 能力的完整应用。"],
    M6: ["M6 · 14 学时", "把学习放进完整的安全应用项目周期", "安全场景选题、架构设计、冲刺、限时排查、交叉测试与答辩。", "第 14 周启动项目；任务从“能跑”升级为可运行、可复现、可说明。"],
    M7: ["M7 · 4 学时", "把课程终点变成继续学习的路线", "技术版图、进阶路线、能力模型与课程总结。", "新增总结与展望，帮助学生识别自身能力证据与下一步方向。"]
  };
  var moduleButtons = all("[data-module]");
  moduleButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activate(moduleButtons, button);
      var data = moduleData[button.dataset.module];
      byId("module-code").textContent = data[0];
      byId("module-title").textContent = data[1];
      byId("module-desc").textContent = data[2];
      byId("module-logic").textContent = data[3];
    });
  });

  // Pair-programming loop
  var stepData = [
    ["STEP 01 / 人主导", "把“做什么、为什么、做到什么标准”说清楚；需求规格本身就是学习成果。"],
    ["STEP 02 / AI 协作", "让 AI 提供候选实现，而不是把候选直接当答案；学生要说明提示与约束。"],
    ["STEP 03 / 人主导", "先判断哪里不对，再决定改不改：检查需求遗漏、缺陷、安全与边界，并说明修复优先级。"],
    ["STEP 04 / 证据验证", "运行测试、构造边界、观察报错，用证据决定接受、退回或修改。"],
    ["STEP 05 / 迭代留痕", "不只改到能跑：在结构、接口、可维护性与成本之间做取舍，把理由留在分支与日志中。"]
  ];
  var stepButtons = all("[data-step]");
  stepButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activate(stepButtons, button);
      var data = stepData[Number(button.dataset.step)];
      byId("step-count").textContent = data[0];
      byId("step-text").textContent = data[1];
    });
  });
  var modeButtons = all("[data-mode]");
  modeButtons.forEach(function (button) { button.addEventListener("click", function () { activate(modeButtons, button); }); });

  // API workbench
  var apiData = {
    client: {
      status: "200 OK",
      explain: "<b>client</b><span>客户端只是发请求的入口；真正决定数据去向、模型能力与对话边界的是后续参数。</span>",
      response: '<span>{</span><br/>&nbsp; "choices": [{ "message": {<br/>&nbsp;&nbsp;&nbsp; "role": "assistant", "content": "你好，Python！"<br/>&nbsp; }}],<br/>&nbsp; "usage": { "total_tokens": <b id="token-inline">342</b> }<br/><span>}</span>'
    },
    base: {
      status: "数据去向",
      explain: "<b>base_url</b><span>去哪家“店”：请求发到哪里，数据就到哪里。课堂由此进入数据流向与责任归属。</span>",
      response: '<span>{</span><br/>&nbsp; "request": {<br/>&nbsp;&nbsp;&nbsp; "base_url": "https://api.example.edu/v1",<br/>&nbsp;&nbsp;&nbsp; "data_flow": "local → model service"<br/>&nbsp; }<br/><span>}</span>'
    },
    model: {
      status: "模型选择",
      explain: "<b>model</b><span>点哪道“菜”：不同模型对应不同能力、速度与价格，选择必须服务任务而不是追逐参数。</span>",
      response: '<span>{</span><br/>&nbsp; "model": "course-demo-model",<br/>&nbsp; "task": "security-log-classification",<br/>&nbsp; "selection_reason": "fit_for_task"<br/><span>}</span>'
    },
    messages: {
      status: "角色边界",
      explain: "<b>messages</b><span>system 设定边界，user 提出任务，assistant 返回回答；比较写与不写 system 的两次输出。</span>",
      response: '<span>[</span><br/>&nbsp; { "role": "system", "content": "只依据资料；无依据说不知道" },<br/>&nbsp; { "role": "user", "content": "解释这条安全告警" },<br/>&nbsp; { "role": "assistant", "content": "……" }<br/><span>]</span>'
    }
  };
  var currentTokens = 342;
  var apiButtons = all("[data-api]");
  function updateTokens(value) {
    currentTokens = Number(value);
    byId("token-value").textContent = String(currentTokens);
    var inline = byId("token-inline");
    if (inline) inline.textContent = String(currentTokens);
  }
  apiButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activate(apiButtons, button);
      var data = apiData[button.dataset.api];
      byId("api-status").textContent = data.status;
      byId("api-explain").innerHTML = data.explain;
      byId("api-response").innerHTML = data.response;
      updateTokens(currentTokens);
    });
  });
  var tokenRange = byId("token-range");
  if (tokenRange) tokenRange.addEventListener("input", function (event) { updateTokens(event.target.value); });

  var lessonNotes = [
    "导入：AI 是怎么把话说出来的？先收起答案，课末再回看并修正。",
    "实测：观察真实请求的方法、状态码与响应体，先见实物再讲概念。",
    "改一处、跑一次：把“和 AI 说话”翻译成“程序发出 HTTP 请求”。",
    "对比写与不写 system 的回答，理解角色如何改变语气与边界。",
    "读取 usage，按服务商当期单价计算一次调用成本，建立 Token 意识。",
    "回看开课答案：哪些理解需要修正？课后完成第一次 API 观察记录。"
  ];
  var lessonButtons = all("[data-lesson]");
  lessonButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activate(lessonButtons, button);
      byId("lesson-note").textContent = lessonNotes[Number(button.dataset.lesson)];
    });
  });

  // Code-review equivalent task
  var bugData = {
    key: "密钥硬编码：应移入环境变量；泄露后需吊销、更换并核查账单。",
    timeout: "缺少超时：网络异常时请求可能无限等待，应设置合理超时。",
    name: "命名不自解释：f 与 x 无法表达函数契约，应使用有意义的名称。",
    boundary: "输入边界缺失：空输入、超长输入与非法类型都未被明确处理。",
    exception: "缺少异常处理：401、404、429 与网络错误需要分类定位与记录。"
  };
  var foundBugs = new Set();
  function renderReview(lastMessage) {
    byId("review-count").textContent = foundBugs.size + " / 5";
    var records = Array.from(foundBugs).map(function (key, index) {
      return "<p><b>" + (index + 1) + ".</b> " + bugData[key] + "</p>";
    });
    byId("review-found").innerHTML = "<span>审查记录" + (records.length ? " · " + records.length + " 条，滚动查看" : "") + "</span>" + (records.length ? records.join("") : "<p>尚未提交审查意见。</p>");
    if (foundBugs.size >= 3 && foundBugs.has("key")) {
      byId("code-verdict").innerHTML = "<span>量规提示</span>检出数量已达到等值任务要求；还须说清后果并完成修改。";
    } else if (foundBugs.size >= 3) {
      byId("code-verdict").innerHTML = "<span>量规提示</span>数量达到，但“密钥硬编码”必过项尚未通过。";
    } else if (lastMessage) {
      byId("code-verdict").innerHTML = "<span>审查反馈</span>" + lastMessage;
    }
  }
  all("[data-bug]").forEach(function (button) {
    button.addEventListener("click", function () {
      all(".code-line.missed").forEach(function (line) { line.classList.remove("missed"); });
      button.classList.add("found");
      foundBugs.add(button.dataset.bug);
      renderReview(bugData[button.dataset.bug]);
    });
  });
  all("[data-clean]").forEach(function (button) {
    button.addEventListener("click", function () {
      all(".code-line.missed").forEach(function (line) { line.classList.remove("missed"); });
      button.classList.add("missed");
      byId("code-verdict").innerHTML = "<span>再想想</span>这一行不是本任务的预设缺陷；请沿发现问题三步法继续排查。";
    });
  });
  var reviewHint = byId("review-hint");
  if (reviewHint) reviewHint.addEventListener("click", function () {
    byId("code-verdict").innerHTML = "<span>提示</span>先查密钥，再查网络等待、函数命名、非法输入与异常处理。";
  });
  var reviewReset = byId("review-reset");
  if (reviewReset) reviewReset.addEventListener("click", function () {
    foundBugs.clear();
    all(".code-line").forEach(function (line) { line.classList.remove("found", "missed"); });
    byId("code-verdict").innerHTML = "<span>发现问题三步法</span>安全与敏感信息 · 输入与异常边界 · 可读性与维护风险";
    renderReview();
  });

  // Learning environments
  var envData = {
    pyodide: ["运行场的教学价值", "代码在 Web Worker 中运行，死循环可终止，移动端可用；它承担“即时验证”，不替代完整工程训练。"],
    companion: ["AI 学伴的隐私边界", "服务端代理接入兼容 OpenAI 接口的模型；只传当前页面题面与代码片段，不上传学生身份信息。"],
    local: ["真实工程环境不可替代", "涉及 FastAPI、多文件组织、接口联调与部署演示的内容仍在本地完成，避免把浏览器练习等同于工程能力。"]
  };
  var envButtons = all("[data-env]");
  envButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activate(envButtons, button);
      var data = envData[button.dataset.env];
      byId("env-label").textContent = data[0];
      byId("env-text").textContent = data[1];
    });
  });

  // Process evidence and rubric
  var logData = [
    "呈现人机分工，让“生成”与“理解”成为可以对话、可以核对的过程。",
    "记录本人修改的具体位置，配合分支历史观察迭代，而非只看最终文件。",
    "要求写出修改理由，把“我觉得能跑”转化为可解释的技术判断。",
    "保留尚未理解之处，为教师反馈与后续答辩提供真实问题入口。"
  ];
  var logButtons = all("[data-log]");
  logButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activate(logButtons, button);
      byId("log-detail").textContent = logData[Number(button.dataset.log)];
    });
  });
  var rubricButtons = all("[data-rubric]");
  rubricButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activate(rubricButtons, button);
      byId("rubric-text").textContent = button.dataset.rubric;
    });
  });

  // Ethics cards
  all("[data-ethic]").forEach(function (button) {
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", function () {
      var flipped = button.classList.toggle("flipped");
      button.setAttribute("aria-pressed", String(flipped));
    });
  });

  // Evidence and transfer selections
  var evidenceButtons = all("[data-evidence]");
  evidenceButtons.forEach(function (button) { button.addEventListener("click", function () { activate(evidenceButtons, button); }); });
  var transferData = {
    content: "可尝试迁移至 Java、SQL 等课程；适用性仍需外部教学实践检验。",
    method: "与具体语言无关的五步循环与发现问题三步法，可形成跨课程共同口径；效果仍待外部采用验证。",
    runtime: "静态页面配合 Pyodide，无需自建后端即可提供即时验证；复杂工程内容仍需本地环境。",
    assessment: "分支提交、逐份批注、协作日志与随机抽行答辩可复用；留痕不等于作者身份认证。"
  };
  var transferButtons = all("[data-transfer]");
  transferButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activate(transferButtons, button);
      byId("transfer-note").querySelector("p").textContent = transferData[button.dataset.transfer];
    });
  });
})();
