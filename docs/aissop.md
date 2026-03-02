---
title: 智能系统安全运维与实践
---

## 课程简介

课程旨在帮助学生在专业使用 Windows 操作系统的基础上，进一步掌握现代智能系统的运维机制与安全防护手段。课程核心内容涵盖四个维度：1. 智能运维环境：包含 Windows 的安装配置、虚拟机使用及 AI 开发环境的自动化部署。2. 安全威胁分析：深入讲解 Windows 恶意代码工作机制，并引入 AI 辅助恶意代码分析与生成式安全威胁识别。3. 自动化与 AI 实践：利用自动化脚本（Python/Batch）及大模型（LLM）工具提升系统维护效率。4. 数据安全与恢复：探讨智能系统下的数据保护、恢复技术及个人信息安全防护。本课程特色在于结合了信息安全专业的基本知识与人工智能前沿技术，帮助学生在复杂的信息环境下做到“知己知彼”，打下坚实的专业基础。

<div id="jsmind_container"></div>

<script>
document.addEventListener("DOMContentLoaded", function() {
  var mind = {
    "meta": { "name": "智能系统安全运维与实践", "version": "1.0" },
    "format": "node_tree",
    "data": {
      "id": "root",
      "topic": "智能系统安全运维与实践",
      "children": [
        {
          "id": "overview",
          "topic": "课程概述",
          "direction": "right",
          "children": [
            {
              "id": "overview_content",
              "topic": "课程主要内容",
              "children": [
                { "id": "professional", "topic": "专业地使用计算机" },
                { "id": "security_intro", "topic": "安全入门" }
              ]
            }
          ]
        },
        {
          "id": "windows_basics",
          "topic": "Windows基础",
          "direction": "right",
          "children": [
            { "id": "hw_os", "topic": "计算机组成与操作系统" },
            { "id": "win_history", "topic": "Windows操作系统历史" },
            { "id": "win10_components", "topic": "Windows 10常见组件" },
            { "id": "software", "topic": "日常及专业软件" }
          ]
        },
        {
          "id": "maintenance",
          "topic": "系统维护",
          "direction": "right",
          "children": [
            {
              "id": "path_file",
              "topic": "路径与文件",
              "children": [
                { "id": "disk", "topic": "磁盘管理" },
                { "id": "filesystem", "topic": "文件系统" }
              ]
            },
            { "id": "network", "topic": "计算机网络基础" }
          ]
        },
        {
          "id": "automation",
          "topic": "自动化与脚本",
          "direction": "right",
          "children": [
            { "id": "terminal", "topic": "终端概述" },
            { "id": "env_var", "topic": "环境变量" },
            { "id": "scripting", "topic": "脚本编写" }
          ]
        },
        {
          "id": "vm",
          "topic": "虚拟机",
          "direction": "left",
          "children": [
            {
              "id": "vm_intro",
              "topic": "虚拟机简介",
              "children": [
                { "id": "vm_concepts", "topic": "虚拟机相关概念" },
                { "id": "vm_install", "topic": "安装及配置" },
                { "id": "os_install", "topic": "操作系统安装" }
              ]
            }
          ]
        },
        {
          "id": "win_advanced",
          "topic": "Windows组件进阶",
          "direction": "left",
          "children": [
            { "id": "user_account", "topic": "用户账户" },
            { "id": "process_thread", "topic": "进程线程" },
            { "id": "registry", "topic": "注册表" }
          ]
        },
        {
          "id": "malware_intro",
          "topic": "恶意代码介绍",
          "direction": "left",
          "children": [
            { "id": "malware_concept", "topic": "恶意代码概念" },
            { "id": "malware_history", "topic": "恶意代码历史" },
            { "id": "malware_class", "topic": "恶意代码分类" },
            { "id": "malware_principle", "topic": "恶意代码原理" }
          ]
        },
        {
          "id": "malware_analysis",
          "topic": "恶意代码分析",
          "direction": "left",
          "children": [
            { "id": "detect_analysis", "topic": "检测与分析" },
            { "id": "analysis_tools", "topic": "分析工具介绍" },
            { "id": "analysis_practice", "topic": "恶意代码分析实践" }
          ]
        },
        {
          "id": "security_talk",
          "topic": "安全漫谈",
          "direction": "left",
          "children": [
            { "id": "security_examples", "topic": "实例讲解" },
            { "id": "content_analysis", "topic": "内容分析" }
          ]
        }
      ]
    }
  };

  var options = {
    container: "jsmind_container",
    theme: "primary",
    editable: false,
    view: {
      hmargin: 100,
      vmargin: 50,
      line_width: 2,
      line_color: "#ccc"
    }
  };

  var jm = new jsMind(options);
  jm.show(mind);
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
