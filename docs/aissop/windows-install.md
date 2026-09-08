---
title: 第 05 章 · 系统安装
---

<div class="pyv2-mod-hero" data-pyv2-page>
  <div class="l">
    <span class="mid-tag">第 05 章</span>
    <b>系统安装</b>
  </div>
  <div class="r">
    <span>启动过程 · 分区 · 重装</span>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:20px;">本章要点</h2>
  <div class="pyv2-lessons">
    <div class="pyv2-lesson" data-anim>
      <div class="l-head"><span class="l-no">01</span><b>启动过程</b></div>
      <div class="l-body">引导程序的角色；BIOS（Legacy）与 UEFI 两种启动流程的差别、UEFI 的优势（大磁盘支持、启动更快、Secure Boot）；如何在已有系统中判断机器的引导方式。</div>
    </div>
    <div class="pyv2-lesson" data-anim>
      <div class="l-head"><span class="l-no">02</span><b>磁盘分区</b></div>
      <div class="l-body">MBR 与 GPT 两种分区表：MBR 是硬盘首个扇区、存引导程序与分区表但限制多；GPT 最多支持 128 个分区、单分区容量更大。启动方式与分区类型的搭配关系及检查方法。</div>
    </div>
    <div class="pyv2-lesson" data-anim>
      <div class="l-head"><span class="l-no">03</span><b>动手重装</b></div>
      <div class="l-body">制作安装 U 盘（所需材料与操作步骤）、从 U 盘启动、完成 Windows 安装与初始化配置。本章要求在真机或虚拟机上完整操作一次。</div>
    </div>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:20px;">课件</h2>
  <div class="aissop-slides"><iframe src="./slideshow.html" title="系统安装课件" loading="lazy"></iframe></div>
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
      "title": "第 05 章 · 概念检查",
      "questions": [
        {
          "q": "GPT 相比 MBR 的优势不包括？",
          "opts": ["支持更多分区（最多 128 个）", "支持更大的单分区容量", "自动查杀引导区病毒", "与 UEFI 启动方式配合更好"],
          "a": 2,
          "explain": "GPT 的优势在于分区数量与容量上限，以及配套的可靠性设计；查杀病毒不是分区表的功能。"
        },
        {
          "q": "Legacy BIOS 启动通常搭配的分区表是？",
          "opts": ["GPT", "MBR", "NTFS", "exFAT"],
          "a": 1,
          "explain": "传统 BIOS 从硬盘首个扇区（MBR）读取引导程序；UEFI 则从 GPT 的 EFI 系统分区加载。注意 NTFS/exFAT 是文件系统，不是分区表。"
        },
        {
          "q": "想确认一台已装好系统的电脑用的是 UEFI 还是 Legacy，合适的做法是？",
          "opts": ["拆开机箱看主板", "在系统信息（msinfo32）中查看 BIOS 模式", "看显示器接口", "无法判断"],
          "a": 1,
          "explain": "msinfo32 的「BIOS 模式」一栏直接显示 UEFI 或传统（Legacy）；安装系统前确认引导方式可避免分区表与启动方式不匹配。"
        }
      ]
    }
    </script>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:20px;">章节导航</h2>
  <p style="margin-top:14px;">
    <a class="pyv2-btn primary" href="../windows-components/">下一章：第 06 章 Windows 组件 →</a>
    <a class="pyv2-btn ghost" href="../virtualbox/">← 第 04 章 虚拟机</a>
  </p>
</div>
