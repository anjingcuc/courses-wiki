---
title: 脚本作业
---

## 概述

本节分为两个部分：作业回顾、实验。

## 作业回顾

### 实验步骤分析

1. 确认虚拟机处于关机状态（快照、挂起）都不可以；
2. 下载自己学号对应的 vdi 虚拟硬盘文件；
3. 在 `Oracle VM VirtualBox 管理器` 界面的管理菜单中注册该文件；
4. 在虚拟机设置中的 “存储” 页面挂载改磁盘；
5. 运行虚拟机，使用 winhex 观察除 C 盘外的新硬盘；
6. 如果存在已删除文件，尝试使用 winhex 恢复；
7. 否则请在虚拟机系统桌面新建一个大于 1kB 的文本文件（内容最好英文）；
8. 然后复制该文件到新的盘中，按快捷键 "SHIFT+DELETE" 删除该文件；
9. 尝试使用 winhex 恢复被删除的文件。

### 文本编码

非英文的文本内容在保存的时候会涉及文本编码的问题，即：字符集和字符编码。

### 二进制与文件格式

计算机只能保存二进制文件，所以不论何种格式的内容都是二进制保存在硬盘里。

比如 JPG 和 EXE 他们的格式为：

- [JPEG_File_Interchange_Format](https://en.wikipedia.org/wiki/JPEG_File_Interchange_Format)
- [Portable_Executable](https://en.wikipedia.org/wiki/Portable_Executable)

## 脚本实验

<b style="color:red;">请点击[作业链接](https://classroom.github.com/a/1X5wUpyw)</b>

参考作业仓库中的提示，编写一个自动截屏并发邮件的批处理脚本，将该批处理脚本和自己的实验心得提交到作业仓库中。
