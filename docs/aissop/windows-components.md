---
title: 第 06 章 · Windows 组件
---

<div class="pyv2-mod-hero" data-pyv2-page>
  <div class="l">
    <span class="mid-tag">第 06 章</span>
    <b>Windows 组件</b>
  </div>
  <div class="r">
    <span>账户 · 进程线程 · 进阶工具</span><span style="color:#047857">作业②</span>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:20px;">本章要点</h2>
  <div class="pyv2-lessons">
    <div class="pyv2-lesson" data-anim>
      <div class="l-head"><span class="l-no">01</span><b>用户与账户</b></div>
      <div class="l-body">Windows 内置账户与用户组的概念、权限划分；用命令行（net user / net localgroup）完成账户与用户组的增删改——账户管理是系统安全的第一道门。</div>
    </div>
    <div class="pyv2-lesson" data-anim>
      <div class="l-head"><span class="l-no">02</span><b>进程与线程</b></div>
      <div class="l-body">任务管理器查看当前状态；tasklist 命令行查看进程；进程与线程的概念辨析；常见系统进程简介——后续恶意代码分析中「辨认异常进程」的基础。</div>
    </div>
    <div class="pyv2-lesson" data-anim>
      <div class="l-head"><span class="l-no">03</span><b>进阶查看工具</b></div>
      <div class="l-body">Process Explorer 等 Sysinternals 工具的树状进程视图与详细信息；配合<a href="../demos/file-signatures.html">文件签名识别演示</a>理解文件类型鉴定，为作业②做准备。</div>
    </div>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:20px;">课件</h2>
  <div class="aissop-slides"><iframe src="./slideshow.html" title="Windows 组件课件" loading="lazy"></iframe></div>
  <div class="aissop-slide-tools">
    <a href="./slideshow.html" target="_blank">新窗口打开课件 ↗</a>
    <span>方向键翻页 · <b>F</b> 键全屏</span>
  </div>
</div>

<div class="pyv2" data-pyv2-page markdown="1">
  <h2 style="font-size:20px;">作业② 进程行为观察</h2>

  学习使用 Process Monitor 来观察进程的行为，主要是文件相关操作。

  ### 文件下载

  Process Monitor 下载:

  - 校园网访问: [校内 FTP 下载](http://202.205.24.235/ftp/softwares/ProcessMonitor.zip)

  - 非校园网点击: [官网下载](https://download.sysinternals.com/files/ProcessMonitor.zip)

  ### 作业要求

  使用 Process Monitor 观察 homework.exe 的文件操作过程，找到对应的 jpg 文件。

  将找到的图片上传到作业仓库，并使用 Markdown 撰写实验报告。

  homework.exe 下载:

  - 校园网访问: [校内 FTP 下载](http://202.205.24.235/ftp/homework/homework.exe)

  - 非校园网点击: [当前站点下载](homework.exe)
</div>

<div class="pyv2" data-pyv2-page">
  <h2 style="font-size:20px;">随堂小测</h2>
  <div class="pyv2-quiz">
    <script type="application/json" class="quiz-data">
    {
      "title": "第 06 章 · 概念检查",
      "questions": [
        {
          "q": "命令行中新建一个用户的命令是？",
          "opts": ["new-user", "net user 用户名 密码 /add", "mkuser", "useradd（Windows cmd 中）"],
          "a": 1,
          "explain": "net user 用户名 密码 /add 创建账户，net localgroup 管理 用户组。useradd 是 Linux 命令。"
        },
        {
          "q": "命令行查看当前进程列表的命令是？",
          "opts": ["tasklist", "ls -ps", "Get-ProcessList（不存在）", "dir /p"],
          "a": 0,
          "explain": "tasklist 列出进程（可用 /FI 过滤）；PowerShell 中对应 Get-Process。第 08 章用 ProcMon 按进程名过滤观察行为。"
        },
        {
          "q": "Process Explorer 相比任务管理器的优势主要在于？",
          "opts": ["界面更好看", "以进程树展示父子关系，并提供句柄、DLL、命令行等更深入的信息", "不需要管理员权限", "能直接杀毒"],
          "a": 1,
          "explain": "Sysinternals 系列工具面向专业排障：进程树、线程栈、加载模块、句柄信息——判断「这个进程是谁启动的、干了什么」时远比任务管理器有力。"
        }
      ]
    }
    </script>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:20px;">章节导航</h2>
  <p style="margin-top:14px;">
    <a class="pyv2-btn primary" href="../malware-introduction/">下一章：第 07 章 恶意代码介绍 →</a>
    <a class="pyv2-btn ghost" href="../windows-install/">← 第 05 章 系统安装</a>
  </p>
</div>
