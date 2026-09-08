---
title: 智能系统安全运维与实践
hide:
  - navigation
  - toc
---

<div class="pyv2-hero" data-pyv2-page>
  <div class="inner">
    <div class="cols">
      <div>
        <div class="badge-row">
          <span class="badge">2026 修订版</span>
          <span class="badge v">混合式教学 · 考查课</span>
          <span class="badge">9 章 + 1 讲座</span>
        </div>
        <h1>智能系统安全运维与实践<br><span class="grad">系统运维 × 安全分析</span></h1>
        <p class="sub">在专业使用 Windows 操作系统的基础上，掌握现代智能系统的运维机制与安全防护手段。
        课程围绕<b style="color:#0f172a">智能运维环境、安全威胁分析、自动化与 AI 实践、数据安全与恢复</b>四个维度展开，
        在真机与虚拟机中完成脚本自动化、进程行为观察、恶意代码分析等实践，做到「知己知彼」。</p>
        <div class="cta-row">
          <a class="pyv2-btn primary" href="introduction/">从课程概述开始 →</a>
          <a class="pyv2-btn ghost" href="#_2">查看课程知识图谱</a>
        </div>
      </div>
      <div>
        <div class="pyv2-terminal" data-terminal>
          <script type="application/json" class="term-data">
          {
            "loop": true,
            "lines": [
              {"t": "dim", "x": "# 查看占用 CPU 最高的 5 个进程"},
              {"t": "in",   "x": "PS> Get-Process | Sort CPU -Desc | Select -First 5"},
              {"t": "out",  "x": "Handles  NPM(K)  PM(K)   WS(K)  CPU(s)    Id  ProcessName"},
              {"t": "out",  "x": "--------  -----  ------  ------  ------  ----  -----------"},
              {"t": "out",  "x": "    1520     982   98200  185300  312.44  4012  firefox"},
              {"t": "out",  "x": "     890     412    62100   98400  120.11  5896  svchost"},
              {"t": "dim",  "x": "# 进程、账户、注册表——命令行是运维的听诊器"}
            ]
          }
          </script>
          <div class="bar">
            <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
            <span class="title">运维现场 · PowerShell</span>
          </div>
          <div class="body"></div>
        </div>
      </div>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 id="_1" style="font-size:22px;">课程概览</h2>
  <div class="pyv2-stats">
    <div class="pyv2-stat" data-anim><div class="n" data-count="10">0</div><div class="l">教学单元</div></div>
    <div class="pyv2-stat" data-anim><div class="n" data-count="4">0</div><div class="l">知识维度</div></div>
    <div class="pyv2-stat v" data-anim><div class="n" data-count="3">0</div><div class="l">实操作业</div></div>
    <div class="pyv2-stat v" data-anim><div class="n" data-count="1">0</div><div class="l">综合恶意代码实验</div></div>
    <div class="pyv2-stat" data-anim><div class="n" data-count="11">0</div><div class="l">套在线课件</div></div>
    <div class="pyv2-stat" data-anim><div class="n" data-count="1">0</div><div class="l">交互演示</div></div>
  </div>

  <h3 style="margin:22px 0 6px;font-size:17px;">四个知识维度</h3>
  <div class="pyv2-lab">
    <div class="pyv2-demo-card" data-anim>
      <span class="tag g">维度一</span>
      <b>智能运维环境</b>
      <p>Windows 安装配置、启动过程与磁盘分区、虚拟机隔离环境，以及 AI 开发环境的自动化部署。</p>
    </div>
    <div class="pyv2-demo-card" data-anim>
      <span class="tag g">维度二</span>
      <b>安全威胁分析</b>
      <p>理解 Windows 恶意代码的工作机制与自启动手段，借助 AI 辅助恶意代码分析，识别生成式安全威胁。</p>
    </div>
    <div class="pyv2-demo-card" data-anim>
      <span class="tag g">维度三</span>
      <b>自动化与 AI 实践</b>
      <p>用命令行、PowerShell 与批处理脚本完成系统维护任务，结合大模型工具提升运维效率。</p>
    </div>
    <div class="pyv2-demo-card" data-anim>
      <span class="tag g">维度四</span>
      <b>数据安全与恢复</b>
      <p>从 NTFS 文件系统与 $MFT 结构理解数据存储与删除的底层机制，掌握数据恢复思路与个人信息防护。</p>
    </div>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 id="_3" style="font-size:22px;">学习路径 · 课程章节</h2>
  <p>从认识操作系统到分析恶意代码。每章页面内嵌全套课件（方向键翻页、f 键全屏），并配有要点梳理与随堂小测。</p>
  <div class="pyv2-path">
    <a class="pyv2-mod-card" href="cli-to-agent/" data-anim><div class="glow"></div>
      <span class="mid">讲座 · 试讲</span><b>从 CLI 到 Agent</b>
      <span>命令行到 AI Agent 的演进：终端与 Shell、PowerShell 基本用法、环境变量</span>
      <span class="lessons">专题讲座</span>
    </a>
    <a class="pyv2-mod-card" href="introduction/" data-anim><div class="glow"></div>
      <span class="mid">第 00 章</span><b>课程概述</b>
      <span>课程定位与考核、什么是信息安全、黑客与程序员、CTF 与网络空间守护</span>
      <span class="lessons">混合式教学 · 考查课</span>
    </a>
    <a class="pyv2-mod-card" href="windows-intro/" data-anim><div class="glow"></div>
      <span class="mid">第 01 章</span><b>Windows 基础</b>
      <span>计算机组成与操作系统、Windows 发展史、Windows 10 常见组件与专业硬件参数</span>
      <span class="lessons">系统使用的地基</span>
    </a>
    <a class="pyv2-mod-card" href="maintain/" data-anim><div class="glow"></div>
      <span class="mid">第 02 章</span><b>系统维护</b>
      <span>路径与文件、磁盘管理、NTFS 文件系统与 $MFT 文件记录、数据恢复、网络维护</span>
      <span class="lessons">含 NTFS 结构详解</span>
    </a>
    <a class="pyv2-mod-card" href="shell/" data-anim><div class="glow"></div>
      <span class="mid">第 03 章</span><b>Shell 与脚本</b>
      <span>GUI 与 CLI、终端控制台与 Shell、标准流、PowerShell 命令与帮助系统</span>
      <span class="lessons">含定时截屏脚本实例</span>
    </a>
    <a class="pyv2-mod-card" href="cmd-scripts/" data-anim><div class="glow"></div>
      <span class="mid">第 03 章实践</span><b>自动化与脚本</b>
      <span>批处理命令行、命令结构与帮助文档、机房管理与自动化运维场景</span>
      <span class="lessons">作业① 截屏邮件批处理</span>
    </a>
    <a class="pyv2-mod-card" href="virtualbox/" data-anim><div class="glow"></div>
      <span class="mid">第 04 章</span><b>虚拟机</b>
      <span>虚拟机概念与三大用途、VirtualBox 配置、共享文件夹、快照与迁移</span>
      <span class="lessons">后续实验的基础设施</span>
    </a>
    <a class="pyv2-mod-card" href="windows-install/" data-anim><div class="glow"></div>
      <span class="mid">第 05 章</span><b>系统安装</b>
      <span>BIOS 与 UEFI 启动过程、MBR 与 GPT 分区、安装 U 盘制作与系统重装</span>
      <span class="lessons">动手重装一台电脑</span>
    </a>
    <a class="pyv2-mod-card" href="windows-components/" data-anim><div class="glow"></div>
      <span class="mid">第 06 章</span><b>Windows 组件</b>
      <span>用户与用户组、net user 账户管理、进程与线程、任务管理器与 Process Explorer</span>
      <span class="lessons">作业② ProcMon 找隐藏图片</span>
    </a>
    <a class="pyv2-mod-card" href="malware-introduction/" data-anim><div class="glow"></div>
      <span class="mid">第 07 章</span><b>恶意代码介绍</b>
      <span>恶意代码概念与发展阶段（原始病毒到 APT）、分类方式、宏病毒等常见类型</span>
      <span class="lessons">知己知彼</span>
    </a>
    <a class="pyv2-mod-card" href="malware-analysis/" data-anim><div class="glow"></div>
      <span class="mid">第 08 章</span><b>恶意代码分析</b>
      <span>注册表结构与自启动方式、Process Monitor / PC Hunter / 火绒剑分析工具与检测实践</span>
      <span class="lessons">综合大实验 · 虚拟机中进行</span>
    </a>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 id="_2" style="font-size:22px;">课程知识图谱</h2>
  <p>拖拽节点、悬停查看说明、点击章节节点直达章节页。虚线为跨章节能力依赖。</p>
  <div class="pyv2-graph-wrap">
    <canvas class="pyv2-kgraph" height="560"></canvas>
    <div class="pyv2-graph-tip"></div>
    <span class="hint">拖拽 / 悬停 / 点击章节节点跳转</span>
    <script type="application/json" class="pyv2-kgraph-data">
    {
      "modules": [
        {"id": "c0", "label": "00 概述", "color": "#38bdf8", "r": 24, "href": "introduction/", "desc": "课程定位 · 信息安全 · 黑客与 CTF"},
        {"id": "c1", "label": "01 基础", "color": "#22d3ee", "r": 24, "href": "windows-intro/", "desc": "计算机组成 · Windows 历史 · 常见组件"},
        {"id": "c2", "label": "02 维护", "color": "#34d399", "r": 26, "href": "maintain/", "desc": "路径 · 磁盘 · NTFS 与数据恢复 · 网络"},
        {"id": "c3", "label": "03 脚本", "color": "#fbbf24", "r": 26, "href": "shell/", "desc": "Shell · 标准流 · PowerShell · 批处理自动化"},
        {"id": "c4", "label": "04 虚拟机", "color": "#94a3b8", "r": 22, "href": "virtualbox/", "desc": "VirtualBox · 快照 · 隔离实验环境"},
        {"id": "c5", "label": "05 安装", "color": "#f472b6", "r": 22, "href": "windows-install/", "desc": "BIOS/UEFI · MBR/GPT · 安装 U 盘"},
        {"id": "c6", "label": "06 组件", "color": "#a78bfa", "r": 26, "href": "windows-components/", "desc": "账户 · 进程线程 · 注册表 · 进阶工具"},
        {"id": "c7", "label": "07 恶意代码", "color": "#f87171", "r": 26, "href": "malware-introduction/", "desc": "发展阶段 · 分类 · 常见类型"},
        {"id": "c8", "label": "08 分析", "color": "#dc2626", "r": 27, "href": "malware-analysis/", "desc": "自启动分析 · ProcMon · 火绒剑 · 清除"}
      ],
      "lessons": [
        {"id": "a1", "m": "c0", "label": "CTF 与信息安全", "big": true, "desc": "黑客、程序员与网络空间守护"},
        {"id": "a2", "m": "c1", "label": "任务管理器"},
        {"id": "a3", "m": "c2", "label": "NTFS $MFT", "big": true, "desc": "文件记录结构，数据恢复的原理"},
        {"id": "a4", "m": "c2", "label": "数据恢复"},
        {"id": "a5", "m": "c3", "label": "标准流", "desc": "stdin / stdout / stderr"},
        {"id": "a6", "m": "c3", "label": "批处理作业①", "big": true, "desc": "自动截屏并发邮件"},
        {"id": "a7", "m": "c4", "label": "快照", "big": true, "desc": "保存与恢复虚拟机状态"},
        {"id": "a8", "m": "c5", "label": "UEFI + GPT"},
        {"id": "a9", "m": "c6", "label": "net user 账户管理"},
        {"id": "a10", "m": "c6", "label": "进程与线程"},
        {"id": "a11", "m": "c6", "label": "ProcMon 作业②", "big": true, "desc": "观察进程文件操作，找到隐藏的图片"},
        {"id": "a12", "m": "c7", "label": "APT"},
        {"id": "a13", "m": "c8", "label": "注册表自启动", "big": true, "desc": "Run 键 · IFEO · 系统路径"},
        {"id": "a14", "m": "c8", "label": "病毒分析大实验", "big": true, "desc": "虚拟机中观察、记录并清除"}
      ],
      "links": [
        ["c0", "c1"], ["c1", "c2"], ["c2", "c3"], ["c3", "c4"], ["c4", "c5"], ["c5", "c6"], ["c6", "c7"], ["c7", "c8"]
      ],
      "crosslinks": [
        ["c3", "c6"], ["c4", "c8"], ["c2", "c8"], ["c6", "c8"], ["c1", "c2"]
      ]
    }
    </script>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:22px;">交互演示</h2>
  <div class="pyv2-lab">
    <a class="pyv2-demo-card" href="demos/file-signatures.html" data-anim>
      <span class="tag">静态分析 · 无依赖</span>
      <b>文件签名识别：看穿伪装文件</b>
      <p>文件头部的魔数（Magic Number）不会说谎。逐字节查看常见格式的文件头，动手识别被篡改扩展名的伪装文件——恶意代码分析的第一课。</p>
      <span class="go">进入演示 →</span>
    </a>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:22px;">作业线</h2>
  <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:22px;" class="pyv2-two">
    <div>
      <div class="pyv2-tl">
        <div class="pyv2-tl-item" data-anim><b>① 自动化脚本</b><span class="meta">自动化与脚本章节</span>
          <p>编写自动截屏并发送邮件的批处理 / PowerShell 脚本，连同实验心得提交到作业仓库。</p></div>
        <div class="pyv2-tl-item" data-anim><b>② 进程行为观察</b><span class="meta">Windows 组件章节</span>
          <p>使用 Process Monitor 观察 homework.exe 的文件操作，找到其隐藏的 jpg 图片并撰写实验报告。</p></div>
        <div class="pyv2-tl-item v" data-anim><b>③ 恶意代码分析</b><span class="meta">恶意代码分析章节 · 综合实验</span>
          <p>在虚拟机中解包病毒样本，用 Process Monitor 记录非管理员与管理员权限下的行为差异，对比进程、注册表、文件操作，并用火绒剑尝试清除。</p></div>
      </div>
    </div>
    <div data-anim>
      <h3 style="margin-bottom:6px;">实验环境</h3>
      <p>所有病毒分析实验<b style="color:#dc2626">必须在虚拟机中进行</b>。
      第 04 章将完成 VirtualBox 与客机增强件的安装配置，快照功能可随时还原被感染的环境。</p>
      <h3 style="margin:14px 0 6px;">考核方式</h3>
      <p>混合式教学，考查课。成绩以平时作业与实验报告为主，无传统闭卷考试。</p>
      <h3 style="margin:14px 0 6px;">提交方式</h3>
      <p>作业通过 GitHub Classroom 仓库提交，报告中使用 Markdown 记录实验过程与截图。</p>
    </div>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:22px;">资料库</h2>
  <div class="pyv2-lab">
    <a class="pyv2-demo-card" href="ppt/" data-anim>
      <span class="tag">分享</span><b>慕课分享课件</b>
      <p>课程相关的慕课学习资源与平台介绍。</p><span class="go">查看课件 →</span>
    </a>
    <a class="pyv2-demo-card" href="cli-to-agent/" data-anim>
      <span class="tag v">讲座</span><b>试讲 · 从 CLI 到 Agent</b>
      <p>面向 AI 时代的命令行专题讲座：终端、Shell、PowerShell 到 AI Agent 的工作方式。</p><span class="go">进入讲座 →</span>
    </a>
    <a class="pyv2-demo-card" href="../python/" data-anim>
      <span class="tag v">姊妹课程</span><b>Python 程序设计（V2）</b>
      <p>自动化脚本实践可延伸到 Python 课程：从语言核心到 AI 应用开发。</p><span class="go">前往课程 →</span>
    </a>
    <a class="pyv2-demo-card" href="../" data-anim>
      <span class="tag">返回</span><b>课程资料站主页</b>
      <p>本站其他课程与资料入口。</p><span class="go">返回主页 →</span>
    </a>
  </div>
</div>

<style>
@media (max-width: 960px) { .pyv2-two { grid-template-columns: 1fr !important; } }
</style>
