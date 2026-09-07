---
title: 作业与考核
---

<div class="pyv2-mod-hero" data-pyv2-page>
  <div class="l">
    <span class="mid-tag">ASSESSMENT</span>
    <b>作业与考核细则</b>
  </div>
  <div class="r">
    <span>平时 <b>50%</b></span><span>期末 <b>50%</b></span><span style="color:#6ee7b7">无上机考试</span>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:20px;">成绩构成</h2>
  <div class="pyv2-stats">
    <div class="pyv2-stat"><div class="n" data-count="4">0</div><div class="l">小作业 × 10%</div></div>
    <div class="pyv2-stat"><div class="n" data-count="10">0</div><div class="l">课堂参与%</div></div>
    <div class="pyv2-stat v"><div class="n" data-count="50">0</div><div class="l">期末大项目%</div></div>
    <div class="pyv2-stat"><div class="n" data-count="0">0</div><div class="l">上机考试</div></div>
  </div>
  <p>「作业打分制」的立意：把考核嵌入真实产出，而不是一次性闭卷。代价是必须配上「真实性保障」——见下方三道防线。</p>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:20px;">六次作业</h2>
  <div class="pyv2-tl">
    <div class="pyv2-tl-item" data-anim><b>① 数据处理脚本</b><span class="meta">L6 发布 · 1 周 · 10%</span>
      <p>用 Python 处理一份真实数据（JSON/CSV），提取/转换/统计。评分点：数据结构选型与控制流。AI 政策：允许辅助，抽查口头说明思路。</p></div>
    <div class="pyv2-tl-item" data-anim><b>② API 调用项目</b><span class="meta">L13 发布 · 1 周 · 10%</span>
      <p>调用一个公开 API 获取数据并结构化处理。评分点：HTTP 请求、JSON 解析、错误处理（超时/限流）。</p></div>
    <div class="pyv2-tl-item" data-anim><b>③ 模块化重构</b><span class="meta">L18 发布 · 1 周 · 10%</span>
      <p>把单文件脚本重构为模块化项目：包结构、.env 配置管理、README。</p></div>
    <div class="pyv2-tl-item v" data-anim><b>④ Prompt 工程实战</b><span class="meta">L20 发布 · 1 周 · 10%</span>
      <p>设计一个结构化 Prompt 模板解决特定任务（五件套齐全、含 few-shot 与输出格式约定）。鼓励大量 AI 实验，附 A/B 对比记录。</p></div>
    <div class="pyv2-tl-item v" data-anim><b>⑤ RAG 迷你应用</b><span class="meta">L23 发布 · 2 周 · 10%</span>
      <p>小型文档问答系统：切分 → 向量化 → 检索 → 生成完整链路，numpy 手搓即可。检索质量与「拒答幻觉」表现是加分点。</p></div>
    <div class="pyv2-tl-item v" data-anim><b>⑥ 期末大项目</b><span class="meta">L31 发布 · 至 L43 答辩 · 50%</span>
      <p>完整 AI 应用（<a href="../m6/">五选一项目池</a>）+ README + AI 协作日志 + 答辩。评分维度：功能完整性 / 技术深度 / 用户体验 / 代码质量 / AI 协作意识。</p></div>
  </div>
  <h3 style="margin:14px 0 8px;">提交方式</h3>
  <p>Git 分支工作流：每人在课程 GitLab 仓库建 <code style="font-family:var(--pyv2-font-mono)">0xNN-学号</code> 分支提交，
  PR 标题注明作业编号。虚拟环境隔离、.gitignore 规范（.env 不进库）是 L16 以后的必查项。</p>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:20px;">真实性保障：三道防线</h2>
  <div class="pyv2-lab">
    <div class="pyv2-demo-card" data-anim>
      <span class="tag g">防线 ①</span><b>无 AI 纸面小测</b>
      <p>M2/M3 每课最后 5 分钟（L6–L15 共 10 次）：手写 10 行以内小函数或「读代码写输出」，当堂交，计入课堂参与分。不是考试，是基础能力的唯一独立观测点。</p>
    </div>
    <div class="pyv2-demo-card" data-anim>
      <span class="tag g">防线 ②</span><b>指行讲思路抽查</b>
      <p>每次作业随机抽 20% 学生做 3 分钟口头抽查：指着任意一行代码问「这行是干什么的」。讲不出自己代码的学生当次作业降级。</p>
    </div>
    <div class="pyv2-demo-card" data-anim>
      <span class="tag g">防线 ③</span><b>答辩灵魂三问</b>
      <p>期末答辩随机指行提问 + 「去掉 AI 你能独立写出哪部分」+「最自豪的功能如何实现」。详见 <a href="../m6/">M6 模块页</a>。</p>
    </div>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:20px;">AI 协作规范（适用于全部作业）</h2>
  <div class="pyv2-tl">
    <div class="pyv2-tl-item" data-anim><b>允许且鼓励</b><span class="meta">AI 辅助一切作业</span><p>用 AI 讨论、生成、优化都行——这正是课程要教的工作方式。</p></div>
    <div class="pyv2-tl-item" data-anim><b>必须做到</b><span class="meta">能讲清自己的代码</span><p>提交的每一行你都要能解释「干什么、为什么」。抽查与答辩按此标准执行。</p></div>
    <div class="pyv2-tl-item" data-anim><b>建议养成</b><span class="meta">协作日志习惯</span><p>记录关键 prompt 与人工修改原因。期末项目为强制提交项，平时作业不强制但强烈建议。</p></div>
    <div class="pyv2-tl-item v" data-anim><b>明确禁止</b><span class="meta">代人写作业 / 买卖代码</span><p>AI 是你的副驾驶，不是替考者；让「别人（或别的 AI）替你完成并署你的名」一律按学术不端处理。</p></div>
  </div>
  <p style="margin-top:14px;">
    <a class="pyv2-btn primary" href="../../">返回课程主页</a>
  </p>
</div>

<div data-pyv2-ai hidden></div>
