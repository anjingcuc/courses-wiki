---
title: 第 03 章实践 · 自动化与脚本
---

<div class="pyv2-mod-hero" data-pyv2-page>
  <div class="l">
    <span class="mid-tag">第 03 章实践</span>
    <b>自动化与脚本</b>
  </div>
  <div class="r">
    <span>批处理 · 自动化运维</span><span style="color:#047857">作业①</span>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:20px;">本节要点</h2>
  <div class="pyv2-lessons">
    <div class="pyv2-lesson" data-anim>
      <div class="l-head"><span class="l-no">01</span><b>从手工到自动化</b></div>
      <div class="l-body">计算机维护的「进阶」体现在哪里？以上课机房的管理为例：批量安装、统一配置、定期清理——重复性工作交给脚本完成。Windows 10 安装初始化也是自动化运维的典型场景。</div>
    </div>
    <div class="pyv2-lesson" data-anim>
      <div class="l-head"><span class="l-no">02</span><b>命令行与批处理</b></div>
      <div class="l-body">命令行的结构（命令 + 参数）、内部命令与外部命令的区别、用 <b>/?</b> 查看帮助文档；管理员与非管理员权限对命令执行的影响；命令行中的路径写法与快捷键。</div>
    </div>
    <div class="pyv2-lesson" data-anim>
      <div class="l-head"><span class="l-no">03</span><b>批处理脚本</b></div>
      <div class="l-body">把多条命令按顺序写入 .bat 文件即成批处理脚本。结合第 03 章的 PowerShell 截屏与发邮件函数，完成本节作业。</div>
    </div>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:20px;">课件</h2>
  <div class="aissop-slides"><iframe src="./slideshow.html" title="自动化与脚本课件" loading="lazy"></iframe></div>
  <div class="aissop-slide-tools">
    <a href="./slideshow.html" target="_blank">新窗口打开课件 ↗</a>
    <span>方向键翻页 · <b>F</b> 键全屏</span>
  </div>
</div>

<div class="pyv2" data-pyv2-page markdown="1">
  <h2 style="font-size:20px;">作业① 自动化脚本</h2>

  <b style='font-size:1.6em;'>请点击[作业链接](https://classroom.github.com/a/FIfjs91z)</b>

  参考作业仓库中的提示，编写一个自动截屏并发邮件的批处理脚本，将该批处理脚本和自己的实验心得提交到作业仓库中。

  提示：截屏与发邮件的 PowerShell 函数见<a href="../shell/">第 03 章 Shell 与脚本</a>的脚本实例一节；注意用参数传递账号信息，不要把密码写进脚本。
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:20px;">随堂小测</h2>
  <div class="pyv2-quiz">
    <script type="application/json" class="quiz-data">
    {
      "title": "自动化与脚本 · 概念检查",
      "questions": [
        {
          "q": "批处理脚本的文件扩展名是？",
          "opts": [".exe", ".bat", ".doc", ".sys"],
          "a": 1,
          "explain": ".bat（batch）文件由命令解释器逐行执行，是最传统的 Windows 自动化方式；PowerShell 对应 .ps1。"
        },
        {
          "q": "命令行中输入 dir /? 的作用是？",
          "opts": ["执行隐藏功能", "查看 dir 命令的帮助文档", "格式化目录", "没有任何效果"],
          "a": 1,
          "explain": "「命令 /?」是查看内部命令帮助的标准方式；PowerShell 中对应 Get-Help。养成先看帮助再动手的习惯。"
        },
        {
          "q": "「内部命令」与「外部命令」的区别是？",
          "opts": ["内部命令更高级", "内部命令由命令解释器自身内置，外部命令是独立的可执行文件", "内部命令只能在 C 盘用", "没有区别"],
          "a": 1,
          "explain": "dir、cd 等由 cmd.exe 自带（内部命令）；ping、notepad 等是磁盘上的独立程序（外部命令），需要按 PATH 查找。"
        }
      ]
    }
    </script>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:20px;">章节导航</h2>
  <p style="margin-top:14px;">
    <a class="pyv2-btn primary" href="../virtualbox/">下一章：第 04 章 虚拟机 →</a>
    <a class="pyv2-btn ghost" href="../shell/">← 第 03 章 Shell 与脚本</a>
  </p>
</div>
