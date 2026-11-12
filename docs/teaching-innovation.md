---
title: 教学创新设计汇报
description: 《Python 程序设计》整门课程的教学创新设计、过程性证据与交互式汇报入口
---

<style>
.ti-hero {
  margin: 0.25rem 0 1.5rem;
  padding: 1.4rem 1.5rem 1.35rem;
  border: 1px solid #cfd8d3;
  border-left: 7px solid #087a75;
  background: linear-gradient(135deg, #f7f4ec 0%, #eef3ee 100%);
}
.ti-kicker {
  display: inline-block;
  margin-bottom: 0.55rem;
  color: #075e5b;
  font: 600 0.76rem/1.4 "JetBrains Mono", monospace;
  letter-spacing: 0.06em;
}
.ti-hero h1 { margin: 0 0 0.55rem; font-size: 1.7rem; line-height: 1.35; }
.ti-hero p { margin: 0.4rem 0; color: #334b4c; }
.ti-actions { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-top: 1rem; }
.ti-primary {
  display: inline-block;
  padding: 0.62rem 1rem;
  border: 1px solid #10272e;
  background: #10272e;
  color: #fff !important;
  font-weight: 700;
  text-decoration: none;
}
.ti-secondary {
  display: inline-block;
  padding: 0.62rem 1rem;
  border: 1px solid #087a75;
  color: #075e5b !important;
  font-weight: 700;
  text-decoration: none;
}
.ti-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.8rem;
  margin: 0.9rem 0 1.2rem;
}
.ti-card {
  padding: 0.9rem 1rem;
  border: 1px solid #cfd8d3;
  background: #faf8f2;
}
.ti-card b { display: block; margin-bottom: 0.35rem; color: #10272e; font-size: 1rem; }
.ti-card span { color: #4f6564; font-size: 0.86rem; line-height: 1.55; }
.ti-index { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.8rem; }
.ti-index > div { padding: 0.85rem 1rem; border-top: 4px solid #087a75; background: #f1f4ee; }
.ti-index > div:nth-child(2n) { border-color: #bd503e; background: #f4efe6; }
.ti-index b { color: #10272e; }
.ti-evidence { border-left: 5px solid #9a6d2d; background: #f4efe3; padding: 0.9rem 1.1rem; }
.ti-note { color: #5b6e6c; font-size: 0.86rem; }
@media (max-width: 760px) {
  .ti-grid, .ti-index { grid-template-columns: 1fr; }
  .ti-hero h1 { font-size: 1.35rem; }
}
</style>

<div class="ti-hero">
  <span class="ti-kicker">第七届中国传媒大学教师教学创新大赛 · 新工科</span>
  <h1>从「会写代码」<br>到「会定义、会发现、会设计」</h1>
  <p>《Python 程序设计》48 学时整门课程重构：把课堂价值从代码生成，推向需求定义、问题发现与设计判断。</p>
  <div class="ti-actions">
    <a class="ti-primary" href="/courses-wiki/innovation-report/">打开交互式汇报 ↗</a>
    <a class="ti-secondary" href="/courses-wiki/python/">进入 Python 课程主页</a>
  </div>
</div>

![教学创新设计汇报封面](assets/images/teaching-innovation-cover.png)

## 汇报依据

> 现场汇报以教学创新设计汇报为主。参赛教师结合教学大纲和教学实践，全面说明整门课程的设计思路，
> 突出教学改革与创新，展示相关过程性支撑资料。汇报时间不超过 10 分钟。
>
> —— 本科生院〔2026〕63号

在线汇报为 **14 页主线 + 3 页答问备查**，主讲约 **9 分 30 秒**。主线沿着“为什么改 — 改成什么 — 怎么实施 —
证据到哪一步”展开，备查页提供三项能力测量设计、材料来源与评分维度覆盖关系。

## 三项能力

<div class="ti-grid">
  <div class="ti-card"><b>提出需求</b><span>把模糊任务变成可执行、可验证的规格：用户与场景、输入输出、边界、失败路径、验收标准与关键取舍。</span></div>
  <div class="ti-card"><b>发现问题</b><span>面对 AI 生成结果，定位缺陷、识别需求遗漏与安全风险，说明后果、判断优先级并完成修复。</span></div>
  <div class="ti-card"><b>设计品味</b><span>在多个“能跑”的方案之间比较结构、接口、可维护性、安全与成本，做出与场景匹配、理由清楚的取舍。</span></div>
</div>

三项能力落到整门课程的目标、内容、五步循环与过程性评价中，详见
[M0 课程导论](/courses-wiki/python/v2/m0/)。它们仍是本轮课程要持续观测的目标，不把设计写成已完成的学习成效。

## 整门课程设计

<div class="ti-index">
  <div><b>48 学时 · 8 个模块</b><br>对照课程教学大纲重排 M0–M7：工具性内容做减法，AI 应用开发与综合项目做加法，总学时不变。</div>
  <div><b>一门课的整体设计</b><br>目标、内容、教学法、环境、评价与课程思政同向调整，而不是在旧课上追加一个 AI 工具演示。</div>
  <div><b>AI 结对开发</b><br>提出需求 → AI 生成 → 发现问题 → 运行验证 → 设计迭代；AI 承担“写”，人保留定义、判断与设计权。</div>
  <div><b>过程性评价</b><br>分支提交、逐份批注、协作日志、课堂小测与随机抽行答辩，让“如何形成判断”留下可核验的痕迹。</div>
</div>

模块索引：
[M0 导论](/courses-wiki/python/v2/m0/) ·
[M1 环境与工具链](/courses-wiki/python/v2/m1/) ·
[M2 语言核心](/courses-wiki/python/v2/m2/) ·
[M3 数据获取与处理](/courses-wiki/python/v2/m3/) ·
[M4 工程化](/courses-wiki/python/v2/m4/) ·
[M5 AI 应用开发](/courses-wiki/python/v2/m5/) ·
[M6 综合项目实战](/courses-wiki/python/v2/m6/) ·
[M7 总结与展望](/courses-wiki/python/v2/m7/)

## 课程网站本身即过程性支撑

课程网站不是汇报附件或展示橱窗，而是本次课程改革的组成部分：每周课件、模块页、运行场、测验、
互动演示与任务说明都在同一套课程结构中持续迭代、公开留痕。

<div class="ti-index">
  <div><b>16 周交互课件</b><br><a href="/courses-wiki/python/v2/slides/w01.html">查看 W01 示例</a>，每周课件与模块页、课堂活动相互对应。</div>
  <div><b>88 篇课程笔记</b><br><a href="/courses-wiki/python/v2/notes-index/">按主题索引</a>，保留课程迭代过程中的讲解、示例与答疑。</div>
  <div><b>4 个交互演示</b><br><a href="/courses-wiki/python/demos/interpreter.html">解释器</a> ·
     <a href="/courses-wiki/python/demos/objects.html">对象</a> ·
     <a href="/courses-wiki/python/demos/base64.html">Base64</a> ·
     <a href="/courses-wiki/python/demos/rag.html">RAG</a>，把抽象概念变成可操作对象。</div>
  <div><b>可核验的课程结构</b><br><a href="https://github.com/anjingcuc/courses-wiki">GitHub 仓库</a>保留内容演进，
     课程网站与汇报材料使用同一批课程事实。</div>
</div>

<div class="ti-evidence">
<b>证据边界：</b>课程网站、两学时教案、阶段作业提交与批注、小测反馈，能够支撑“课程设计与教学实施已经发生”；
但它们不能单独证明三项能力提升、终结性项目表现或外部采用效果。三项能力的三次等值测量仍是后续评价设计，
不是既有成效数据。
</div>

## 现场材料与可复现构建

- 汇报课件源码：`teaching-innovation-deck/`
- 构建入口：`python scripts/build_teaching_deck.py`
- 发布流程：push 到 `master` → GitHub Actions 构建课件到 `docs/innovation-report/` → MkDocs 发布到 GitHub Pages
- 交互式汇报直达：[https://anjingcuc.github.io/courses-wiki/innovation-report/](https://anjingcuc.github.io/courses-wiki/innovation-report/)

<p class="ti-note">课件中的 API 请求与代码审查为离线教学模拟，不调用真实服务，也不伪装成学生真实作答数据。</p>
