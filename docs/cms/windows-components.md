---
title: Windows 组件
---

## 概述

本节主要分为三个阶段：作业回顾、视频难点分析、实验。

## 作业回顾

上次作业的主要难点在于提交需要使用 git 并学会配置 Github 账号。

参考视频：

1. Github 配置部分

<iframe src="//player.bilibili.com/player.html?aid=71899338&cid=124583059&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" width=100% height=450px> </iframe>

2. 编辑提交部分

<iframe src="//player.bilibili.com/player.html?aid=71903458&cid=124590342&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" width=100% height=450px> </iframe>

### Markdown Cheet Sheet

鉴于部分同学还是对 Markdown 不太熟悉，这里给大家推荐 [Markdown Guide](https://www.markdownguide.org/) 。这个网站是一个 Markdown 学习站点，大家可以上去学习一下语法。下面一小节就是参考他们的 [Markdown Cheet Sheet](https://www.markdownguide.org/cheat-sheet/) 翻译的。当然还有很多中文教程，大家可以自行补习。

#### 基本语法

| 元素       | 语法                                                   |
| ---------- | ------------------------------------------------------ |
| 标题       | `# H1`<br/>`## H2`<br>`### H3`                         |
| 粗体       | `**bold text**`                                        |
| 斜体       | `_italicized text_`                                    |
| 引用       | `> blockquote`                                         |
| 有序列表   | `1. First item`<br>`2. Second item`<br>`3. Third item` |
| 无序列表   | `- First item`<br>`- Second item`<br>`- Third item`    |
| 代码       | `code`                                                 |
| 横向分割线 | `---`                                                  |
| 超链接     | `[title](https://www.example.com)`                     |
| 图片       | `![alt text](image.jpg)`                               |

#### 扩展语法

| 元素              | 语法                                                                                                           |
| ----------------- | -------------------------------------------------------------------------------------------------------------- |
| 表格              | `| Syntax | Description |`<br>`| ----------- | ----------- |`<br>`| Header | Title |`<br>`|Paragraph | Text |` |
| Fenced Code Block | \`\`\`<br>`{`<br>`" firstName": "John",`<br>`"lastName": "Smith",`<br>`"age": 25`<br>`}`<br>\`\`\`             |
| 脚注              | `Here's a sentence with a footnote. [^1]`<br>`[^1]: This is the footnote.`                                     |
| 标题 id           | `### My Great Heading {#custom-id}`                                                                            |
| 定义列表          | `term`<br>`: definition`                                                                                       |
| 划掉              | `~~The world is flat.~~`                                                                                       |
| 任务列表          | `- [x] Write the press release`<br>`- [ ] Update the website`<br>`- [ ] Contact the media`                     |

## 视频难点分析

### Windows 进程线程

部分同学反应第二个视频，即实验部分看不懂，这部分需要补充理论知识，那么我们跟着视频看看，给大家补充讲解一些理论知识。

### Windows 服务

Windows 服务也是一个有同学提出来的难点，同样我们解释一下服务出现的原因和原理。

## 实验

1. 用户账户：界面管理用户，命令行管理用户，绕过用户登录。
2. 进程线程：主要是使用两个工具查看进程，尤其是 Process Monitor。
3. 注册表自启动：利用注册表实现开机自动启动记事本或者自己想要启动的程序。

## 作业

<b style="color:red;">请点击[作业链接](https://classroom.github.com/a/ApKvSHAu)</b>

使用 Process Monitor 观察 homework.exe 的文件操作过程，找到对应的 jpg 文件。

将找到的图片上传到作业仓库，并使用 Markdown 撰写实验报告。

## 附件

[点击下载 ProcessExplorer](ProcessExplorer.zip)

[点击下载 ProcessMonitor](ProcessMonitor.zip)

[点击下载 homework](homework.zip)
