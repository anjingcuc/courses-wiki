---
title: 智能系统安全运维与实践
---

## 课程简介

课程旨在帮助学生在专业使用 Windows 操作系统的基础上，进一步掌握现代智能系统的运维机制与安全防护手段。课程核心内容涵盖四个维度：1. 智能运维环境：包含 Windows 的安装配置、虚拟机使用及 AI 开发环境的自动化部署。2. 安全威胁分析：深入讲解 Windows 恶意代码工作机制，并引入 AI 辅助恶意代码分析与生成式安全威胁识别。3. 自动化与 AI 实践：利用自动化脚本（Python/Batch）及大模型（LLM）工具提升系统维护效率。4. 数据安全与恢复：探讨智能系统下的数据保护、恢复技术及个人信息安全防护。本课程特色在于结合了信息安全专业的基本知识与人工智能前沿技术，帮助学生在复杂的信息环境下做到“知己知彼”，打下坚实的专业基础。

<div id="g6_container" style="width: 100%; height: 500px;"></div>

<script src="https://unpkg.com/@antv/g6@5/dist/g6.min.js"></script>
<script>
document.addEventListener("DOMContentLoaded", function() {
  const { Graph, treeToGraphData } = G6;

  const data = {
    id: "root",
    value: "智能系统安全运维与实践",
    children: [
      {
        id: "overview",
        value: "课程概述",
        children: [
          {
            id: "overview_content",
            value: "课程主要内容",
            children: [
              { id: "professional", value: "专业地使用计算机" },
              { id: "security_intro", value: "安全入门" }
            ]
          }
        ]
      },
      {
        id: "windows_basics",
        value: "Windows基础",
        children: [
          { id: "hw_os", value: "计算机组成与操作系统" },
          { id: "win_history", value: "Windows操作系统历史" },
          { id: "win10_components", value: "Windows 10常见组件" },
          { id: "software", value: "日常及专业软件" }
        ]
      },
      {
        id: "maintenance",
        value: "系统维护",
        children: [
          {
            id: "path_file",
            value: "路径与文件",
            children: [
              { id: "disk", value: "磁盘管理" },
              { id: "filesystem", value: "文件系统" }
            ]
          },
          { id: "network", value: "计算机网络基础" }
        ]
      },
      {
        id: "automation",
        value: "自动化与脚本",
        children: [
          { id: "terminal", value: "终端概述" },
          { id: "env_var", value: "环境变量" },
          { id: "scripting", value: "脚本编写" }
        ]
      },
      {
        id: "vm",
        value: "虚拟机",
        children: [
          {
            id: "vm_intro",
            value: "虚拟机简介",
            children: [
              { id: "vm_concepts", value: "虚拟机相关概念" },
              { id: "vm_install", value: "安装及配置" },
              { id: "os_install", value: "操作系统安装" }
            ]
          }
        ]
      },
      {
        id: "win_advanced",
        value: "Windows组件进阶",
        children: [
          { id: "user_account", value: "用户账户" },
          { id: "process_thread", value: "进程线程" },
          { id: "registry", value: "注册表" }
        ]
      },
      {
        id: "malware_intro",
        value: "恶意代码介绍",
        children: [
          { id: "malware_concept", value: "恶意代码概念" },
          { id: "malware_history", value: "恶意代码历史" },
          { id: "malware_class", value: "恶意代码分类" },
          { id: "malware_principle", value: "恶意代码原理" }
        ]
      },
      {
        id: "malware_analysis",
        value: "恶意代码分析",
        children: [
          { id: "detect_analysis", value: "检测与分析" },
          { id: "analysis_tools", value: "分析工具介绍" },
          { id: "analysis_practice", value: "恶意代码分析实践" }
        ]
      },
      {
        id: "security_talk",
        value: "安全漫谈",
        children: [
          { id: "security_examples", value: "实例讲解" },
          { id: "content_analysis", value: "内容分析" }
        ]
      }
    ]
  };

  const getNodeSide = (graph, datum) => {
    const parentData = graph.getParentData(datum.id, 'tree');
    if (!parentData) return 'center';
    return datum.style.x > parentData.style.x ? 'right' : 'left';
  };

  const graph = new Graph({
    container: 'g6_container',
    autoFit: 'view',
    padding: 20,
    data: treeToGraphData(data),
    node: {
      style: {
        labelText: (d) => d.data.value,
        labelFontSize: (d) => d.depth === 0 ? 16 : 12,
        labelFontWeight: (d) => d.depth === 0 ? 'bold' : 'normal',
        labelFill: '#333',
        labelBackground: true,
        labelBackgroundFill: '#fff',
        labelBackgroundRadius: 4,
        labelPlacement: function (d) {
          const side = getNodeSide(this, d);
          return side === 'center' ? 'right' : side;
        },
        size: (d) => d.depth === 0 ? 40 : 24,
        fill: (d) => {
          const colors = ['#5B8FF9', '#5AD8A6', '#5D7092', '#F6BD16', '#E86452', '#6DC8EC', '#945FB9', '#FF9D4D', '#FF99C3'];
          return colors[d.depth % colors.length];
        },
        stroke: '#fff',
        lineWidth: 2,
        radius: 4,
        cursor: 'pointer',
      },
      animation: { enter: false },
    },
    edge: {
      type: 'cubic-horizontal',
      style: {
        stroke: '#A3B1BF',
        lineWidth: 2,
      },
      animation: { enter: false },
    },
    layout: {
      type: 'mindmap',
      direction: 'H',
      getHeight: () => 24,
      getWidth: () => 100,
      getVGap: () => 12,
      getHGap: () => 60,
    },
    behaviors: ['drag-canvas', 'zoom-canvas'],
  });

  graph.render();
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
