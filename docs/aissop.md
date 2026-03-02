---
title: 智能系统安全运维与实践
---

## 课程简介

课程旨在帮助学生在专业使用 Windows 操作系统的基础上，进一步掌握现代智能系统的运维机制与安全防护手段。课程核心内容涵盖四个维度：1. 智能运维环境：包含 Windows 的安装配置、虚拟机使用及 AI 开发环境的自动化部署。2. 安全威胁分析：深入讲解 Windows 恶意代码工作机制，并引入 AI 辅助恶意代码分析与生成式安全威胁识别。3. 自动化与 AI 实践：利用自动化脚本（Python/Batch）及大模型（LLM）工具提升系统维护效率。4. 数据安全与恢复：探讨智能系统下的数据保护、恢复技术及个人信息安全防护。本课程特色在于结合了信息安全专业的基本知识与人工智能前沿技术，帮助学生在复杂的信息环境下做到“知己知彼”，打下坚实的专业基础。

<div id="mind_map_container" style="width: 100%; height: 500px;"></div>

<link rel="stylesheet" href="https://unpkg.com/simple-mind-map@0.12.2/dist/simple-mind-map.css">
<script src="https://unpkg.com/simple-mind-map@0.12.2/dist/simple-mind-map.umd.min.js"></script>
<script>
document.addEventListener("DOMContentLoaded", function() {
  const { MindMap } = window.simpleMindMap;

  const data = {
    "data": {
      "text": "智能系统安全运维与实践",
      "children": [
        {
          "text": "课程概述",
          "children": [
            {
              "text": "课程主要内容",
              "children": [
                { "text": "专业地使用计算机" },
                { "text": "安全入门" }
              ]
            }
          ]
        },
        {
          "text": "Windows基础",
          "children": [
            { "text": "计算机组成与操作系统" },
            { "text": "Windows操作系统历史" },
            { "text": "Windows 10常见组件" },
            { "text": "日常及专业软件" }
          ]
        },
        {
          "text": "系统维护",
          "children": [
            {
              "text": "路径与文件",
              "children": [
                { "text": "磁盘管理" },
                { "text": "文件系统" }
              ]
            },
            { "text": "计算机网络基础" }
          ]
        },
        {
          "text": "自动化与脚本",
          "children": [
            { "text": "终端概述" },
            { "text": "环境变量" },
            { "text": "脚本编写" }
          ]
        },
        {
          "text": "虚拟机",
          "children": [
            {
              "text": "虚拟机简介",
              "children": [
                { "text": "虚拟机相关概念" },
                { "text": "安装及配置" },
                { "text": "操作系统安装" }
              ]
            }
          ]
        },
        {
          "text": "Windows组件进阶",
          "children": [
            { "text": "用户账户" },
            { "text": "进程线程" },
            { "text": "注册表" }
          ]
        },
        {
          "text": "恶意代码介绍",
          "children": [
            { "text": "恶意代码概念" },
            { "text": "恶意代码历史" },
            { "text": "恶意代码分类" },
            { "text": "恶意代码原理" }
          ]
        },
        {
          "text": "恶意代码分析",
          "children": [
            { "text": "检测与分析" },
            { "text": "分析工具介绍" },
            { "text": "恶意代码分析实践" }
          ]
        },
        {
          "text": "安全漫谈",
          "children": [
            { "text": "实例讲解" },
            { "text": "内容分析" }
          ]
        }
      ]
    }
  };

  const mindMap = new MindMap({
    el: document.getElementById('mind_map_container'),
    data: data,
    layout: 'mindMap',
    theme: 'earth',
    readonly: true,
    fit: true,
    view: true,
    nodeTextEditZIndex: 1000,
    scaleRatio: 1,
    enableFreeDrag: false,
    mousewheelAction: 'zoom',
    mousewheelZoomActionReverse: true,
    customHandleMousewheel: null,
    mouseScaleCenterUseMousePosition: true,
    defaultNodeBackgroundColor: 'transparent',
    defaultNodeColor: '#333',
    defaultLineColor: '#A3B1BF',
    lineWidth: 2,
    exportPadding: 20,
    nodeUseLineStyle: false,
    enableNodeCache: true,
    expandBtnSize: 20,
    showExpandBtn: true,
    enableAutoEnterEditModeWhenNodeClick: false,
  });

  // 自适应容器大小
  const resizeHandler = () => {
    mindMap.resize();
  };
  window.addEventListener('resize', resizeHandler);

  // 初始自适应
  setTimeout(() => {
    mindMap.fit();
  }, 100);
});
</script>

### [试讲-从 CLI 到 Agent](aissop/cli-to-agent.md)

### [00-课程概述](aissop/introduction.md)

### [01-Windows 基础](aissop/windows-intro.md)

### [02-系统维护](aissop/maintain.md)

### [03-Shell 与脚本初探](aissop/shell.md)

### [04-虚拟机](aissop/virtualbox.md)

### [05-系统安装](aissop/windows-install.md)

### [06-Windows 组件进阶](aissop/windows-components.md)

### [07-恶意代码介绍](aissop/malware-introduction.md)

### [08-恶意代码分析](aissop/malware-analysis.md)
