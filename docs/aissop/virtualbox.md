---
title: 第 04 章 · 虚拟机
---

<div class="pyv2-mod-hero" data-pyv2-page>
  <div class="l">
    <span class="mid-tag">第 04 章</span>
    <b>虚拟机</b>
  </div>
  <div class="r">
    <span>VirtualBox · 快照 · 隔离环境</span>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:20px;">本章要点</h2>
  <div class="pyv2-lessons">
    <div class="pyv2-lesson" data-anim>
      <div class="l-head"><span class="l-no">01</span><b>什么是虚拟机</b></div>
      <div class="l-body">软件模拟的完整计算机系统。三大视角看它的用途：软件测试角度（多环境验证）、信息安全角度（隔离的实验环境，病毒分析必须在此进行）、云计算角度（资源弹性分配的基础）。</div>
    </div>
    <div class="pyv2-lesson" data-anim>
      <div class="l-head"><span class="l-no">02</span><b>核心概念与配置</b></div>
      <div class="l-body">主机/客机操作系统、客机增强件的作用；VirtualBox 的主要配置项：内存与 CPU 分配、虚拟硬盘、虚拟网络模式；文件传输方式（共享文件夹、双向拖放等）。</div>
    </div>
    <div class="pyv2-lesson" data-anim>
      <div class="l-head"><span class="l-no">03</span><b>快照与迁移</b></div>
      <div class="l-body">快照保存客机的系统、文件与运行状态，随时可恢复——对安全实验尤其重要：感染病毒后一键还原。虚拟机迁移后快照依然可用。</div>
    </div>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:20px;">课件</h2>
  <div class="aissop-slides"><iframe src="./slideshow.html" title="虚拟机课件" loading="lazy"></iframe></div>
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
      "title": "第 04 章 · 概念检查",
      "questions": [
        {
          "q": "关于虚拟机快照，正确的是？",
          "opts": ["只能关机时创建", "保存客机系统、文件与运行状态，可随时恢复；删除快照不影响当前状态", "创建快照会清空虚拟机", "快照就是复制粘贴虚拟机文件夹"],
          "a": 1,
          "explain": "快照可在任意状态创建并恢复到该时刻；即使虚拟机发生了迁移，快照仍然可用。手工复制虚拟机文件夹不是快照机制。"
        },
        {
          "q": "病毒分析实验必须在虚拟机中进行，主要原因是？",
          "opts": ["虚拟机运行更快", "隔离风险：恶意代码被限制在客机内，不威胁真实主机", "虚拟机没有注册表", "只有虚拟机能联网"],
          "a": 1,
          "explain": "虚拟机提供了沙箱边界，配合快照可以放心让恶意代码运行并随时还原环境。"
        },
        {
          "q": "「客机增强件」的主要作用是？",
          "opts": ["提高虚拟机的显示分辨率上限、启用共享文件夹与双向拖放等便利功能", "给虚拟机杀毒", "提升 CPU 主频", "必须安装才能开机"],
          "a": 1,
          "explain": "VirtualBox Guest Additions 改善宿主与客机的交互体验——病毒样本的传入正是依赖双向拖放与共享文件夹。"
        }
      ]
    }
    </script>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:20px;">章节导航</h2>
  <p style="margin-top:14px;">
    <a class="pyv2-btn primary" href="../windows-install/">下一章：第 05 章 系统安装 →</a>
    <a class="pyv2-btn ghost" href="../cmd-scripts/">← 自动化与脚本（实践）</a>
  </p>
</div>
