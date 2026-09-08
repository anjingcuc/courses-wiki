---
title: 试讲 · 从 CLI 到 Agent
---

<div class="pyv2-mod-hero" data-pyv2-page>
  <div class="l">
    <span class="mid-tag">专题讲座 · 试讲</span>
    <b>从 CLI 到 Agent</b>
  </div>
  <div class="r">
    <span>命令行 → AI Agent</span>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:20px;">讲座要点</h2>
  <div class="pyv2-lessons">
    <div class="pyv2-lesson" data-anim>
      <div class="l-head"><span class="l-no">01</span><b>图形界面与命令行</b></div>
      <div class="l-body">GUI 降低使用门槛，CLI 提供精确与可自动化的控制方式。运维、安全与开发工作中，命令行是无法绕开的基本功——这也是 AI 编程工具普遍以命令行界面为载体的原因。</div>
    </div>
    <div class="pyv2-lesson" data-anim>
      <div class="l-head"><span class="l-no">02</span><b>终端、控制台与 Shell</b></div>
      <div class="l-body">分清三组概念：终端（Terminal）是交互界面，Shell 是解释并执行命令的程序（cmd、PowerShell、bash 都是 Shell），常见终端模拟器（Windows Terminal 等）承载 Shell 运行。环境变量（尤其是 PATH）决定了命令的查找范围。</div>
    </div>
    <div class="pyv2-lesson" data-anim>
      <div class="l-head"><span class="l-no">03</span><b>从命令行到 AI Agent</b></div>
      <div class="l-body">同一个人机界面的演进路径：命令行要求人记住指令，图形界面要求人找到入口，AI Agent 接受自然语言描述并自主调用工具完成多步任务。理解命令行，才能理解 Agent 在替你执行什么。</div>
    </div>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:20px;">课件</h2>
  <div class="aissop-slides"><iframe src="./slideshow.html" title="从 CLI 到 Agent 课件" loading="lazy"></iframe></div>
  <div class="aissop-slide-tools">
    <a href="./slideshow.html" target="_blank">新窗口打开课件 ↗</a>
    <span>方向键翻页 · <b>F</b> 键全屏</span>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:20px;">随堂小测</h2>
  <div class="pyv2-quiz">
    <script type="application/json" class="quiz-data">
    {
      "title": "从 CLI 到 Agent · 概念检查",
      "questions": [
        {
          "q": "终端（Terminal）与 Shell 的关系是？",
          "opts": ["同一个东西的两种叫法", "终端是交互界面，Shell 是其中解释执行命令的程序", "Shell 是硬件，终端是软件", "终端只用于远程登录"],
          "a": 1,
          "explain": "终端是承载输入输出的界面，Shell 是运行在其中的命令解释器。cmd、PowerShell、bash 都是 Shell；Windows Terminal、conhost 是终端模拟器。"
        },
        {
          "q": "环境变量 PATH 的作用是？",
          "opts": ["存放系统密码", "决定命令行按什么顺序在哪些目录查找可执行程序", "记录最近使用的命令", "设置桌面背景"],
          "a": 1,
          "explain": "输入一个命令名时，系统按 PATH 中列出的目录顺序查找对应的可执行文件——这也是「python 不是内部或外部命令」报错的常见原因。"
        },
        {
          "q": "与命令行工具相比，AI Agent 的核心特征是？",
          "opts": ["界面更华丽", "能理解自然语言指令，并自主调用工具完成多步任务", "运行速度更快", "不需要操作系统"],
          "a": 1,
          "explain": "Agent = 理解需求 → 规划步骤 → 调用工具（其中就包括命令行工具）→ 根据结果迭代。命令行能力越扎实，越能判断 Agent 做得对不对。"
        }
      ]
    }
    </script>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:20px;">章节导航</h2>
  <p style="margin-top:14px;">
    <a class="pyv2-btn primary" href="../introduction/">进入课程：第 00 章 课程概述 →</a>
    <a class="pyv2-btn ghost" href="../">← 返回课程主页</a>
  </p>
</div>
