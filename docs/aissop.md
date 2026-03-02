---
title: 智能系统安全运维与实践
---

## 课程简介

课程旨在帮助学生在专业使用 Windows 操作系统的基础上，进一步掌握现代智能系统的运维机制与安全防护手段。课程核心内容涵盖四个维度：1. 智能运维环境：包含 Windows 的安装配置、虚拟机使用及 AI 开发环境的自动化部署。2. 安全威胁分析：深入讲解 Windows 恶意代码工作机制，并引入 AI 辅助恶意代码分析与生成式安全威胁识别。3. 自动化与 AI 实践：利用自动化脚本（Python/Batch）及大模型（LLM）工具提升系统维护效率。4. 数据安全与恢复：探讨智能系统下的数据保护、恢复技术及个人信息安全防护。本课程特色在于结合了信息安全专业的基本知识与人工智能前沿技术，帮助学生在复杂的信息环境下做到“知己知彼”，打下坚实的专业基础。

<div id="tree_chart" style="width: 100%; height: 600px;"></div>

<script src="https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"></script>
<script>
document.addEventListener("DOMContentLoaded", function() {
  const chartDom = document.getElementById('tree_chart');
  const myChart = echarts.init(chartDom);

  const data = {
    name: "智能系统安全运维与实践",
    children: [
      {
        name: "课程概述",
        children: [
          {
            name: "课程主要内容",
            children: [
              { name: "专业地使用计算机" },
              { name: "安全入门" }
            ]
          }
        ]
      },
      {
        name: "Windows基础",
        children: [
          { name: "计算机组成与操作系统" },
          { name: "Windows操作系统历史" },
          { name: "Windows 10常见组件" },
          { name: "日常及专业软件" }
        ]
      },
      {
        name: "系统维护",
        children: [
          {
            name: "路径与文件",
            children: [
              { name: "磁盘管理" },
              { name: "文件系统" }
            ]
          },
          { name: "计算机网络基础" }
        ]
      },
      {
        name: "自动化与脚本",
        children: [
          { name: "终端概述" },
          { name: "环境变量" },
          { name: "脚本编写" }
        ]
      },
      {
        name: "虚拟机",
        children: [
          {
            name: "虚拟机简介",
            children: [
              { name: "虚拟机相关概念" },
              { name: "安装及配置" },
              { name: "操作系统安装" }
            ]
          }
        ]
      },
      {
        name: "Windows组件进阶",
        children: [
          { name: "用户账户" },
          { name: "进程线程" },
          { name: "注册表" }
        ]
      },
      {
        name: "恶意代码介绍",
        children: [
          { name: "恶意代码概念" },
          { name: "恶意代码历史" },
          { name: "恶意代码分类" },
          { name: "恶意代码原理" }
        ]
      },
      {
        name: "恶意代码分析",
        children: [
          { name: "检测与分析" },
          { name: "分析工具介绍" },
          { name: "恶意代码分析实践" }
        ]
      },
      {
        name: "安全漫谈",
        children: [
          { name: "实例讲解" },
          { name: "内容分析" }
        ]
      }
    ]
  };

  const option = {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
      backgroundColor: 'rgba(50, 50, 50, 0.9)',
      borderColor: '#333',
      textStyle: {
        color: '#fff',
        fontSize: 13
      }
    },
    series: [
      {
        type: 'tree',
        data: [data],
        left: '10%',
        right: '20%',
        top: '10%',
        bottom: '10%',
        symbol: 'circle',
        symbolSize: 12,
        orient: 'LR',
        expandAndCollapse: true,
        initialTreeDepth: 2,
        label: {
          position: 'right',
          verticalAlign: 'middle',
          align: 'left',
          fontSize: 13,
          color: '#333'
        },
        lineStyle: {
          color: '#aaa',
          width: 1.5,
          curveness: 0.5
        },
        itemStyle: {
          color: '#5B8FF9',
          borderColor: '#5B8FF9'
        },
        emphasis: {
          focus: 'descendant',
          itemStyle: {
            color: '#1890ff',
            borderColor: '#1890ff',
            borderWidth: 3,
            shadowBlur: 10,
            shadowColor: 'rgba(24, 144, 255, 0.5)'
          },
          lineStyle: {
            width: 2.5
          },
          label: {
            fontSize: 15,
            fontWeight: 'bold'
          }
        },
        leaves: {
          label: {
            position: 'right',
            verticalAlign: 'middle',
            align: 'left'
          }
        },
        animationDuration: 550,
        animationDurationUpdate: 750
      }
    ]
  };

  myChart.setOption(option);

  // 自适应窗口大小
  window.addEventListener('resize', function() {
    myChart.resize();
  });
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
