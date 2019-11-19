---
title: JavaScript 结构化代码
---

**下方课件区域方向键控制翻页，`f` 键全屏。**

<iframe src="./slideshow.html" frameborder=0 width=800 height=450></iframe>

## 分支实验

### if...else

在这个实验中，请完成一个简单的日历应用程序。在你的代码中：

- 一个 `<select>` 元素，允许用户在不同月份之间进行选择。
- `onchange` 检测 `<select>` 菜单中选择的值何时更改的事件处理程序。
- 一个函数叫做 `createCalendar()` 绘制日历并在 `<h1>` 元素中显示正确的月份。

在 onchange 处理函数中写一个条件语句，就在 `// ADD CONDITIONAL HERE` 的下面。功能包括：

- 查看所选月份（存储在 choice 变量中，这将是 `<select>` 值更改后的元素值，例如 "1 月"）。
- 设置一个被调用 days 为等于所选月份天数的变量，来实现查看一年中每个月的天数，可以忽略闰年。

提示：

- 建议使用逻辑或 `||` 将多个月组合成一个单一条件；他们中的许多人共享相同的天数。
- 考虑最常用的天数，并将其用作默认值。

可以随时使用 "Reset" 按钮重置该示例。 如果你真的卡住了，点 "Show solution" 来查看解决方案。

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="html,result" data-user="anjingcuc" data-slug-hash="NWWLKyK" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Calender for if..else">
  <span>See the Pen <a href="https://codepen.io/anjingcuc/pen/NWWLKyK">
  Calender for if..else</a> by anjing (<a href="https://codepen.io/anjingcuc">@anjingcuc</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### switch

在这个实验中，你需要练习使用 `switch` 语句，这将允许我们对简单的网站应用更多的选择。看看 `<select>` - 一共有五个主题选项。你需要在 `// ADD SWITCH STATEMENT` 注释下面添加一个 `switch` 语句：

- 它应该接受 choice 变量作为其输入表达式。
- 对于每种情况，选择应该等于可以选择的可能值之一，即白色，黑色，紫色，黄色或迷幻色。
- 对于每种情况，应运行 update()函数，并传递两个颜色值，第一个颜色值为背景颜色，第二个颜色值为文本颜色。请记住，颜色值是字符串，因此需要用引号括起来。

可以随时使用 "Reset" 按钮重置该示例。 如果你真的卡住了，点 "Show solution" 来查看解决方案。

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="js,result" data-user="anjingcuc" data-slug-hash="QWWVLqW" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="More Color for switch">
  <span>See the Pen <a href="https://codepen.io/anjingcuc/pen/QWWVLqW">
  More Color for switch</a> by anjing (<a href="https://codepen.io/anjingcuc">@anjingcuc</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### while

在这个练习中，你需要打印出一个简单的启动倒计时到输出框，从 10 到关闭。

具体来说，希望你：

- 从 10 下降到 0，这里提供了初始代码 - `var i = 10`;
- 对于每次迭代，创建一个新的段落并将其附加到输出 `<div>`，使用`var output = document.querySelector('.output');` 选中该 `<div>`，并在示例代码中已经写好了创建并附加段落的部分代码：
  - `var para = document.createElement('p');` — 新建一个段落。
  - `output.appendChild(para);` — 将段落附加到输出 `<div>` 中。
  - `para.textContent =` — `=` 号后面应该写上你需要输出的字符串或字符串变量并以分号结尾。
- 不同的迭代数字需要将不同的文本放在该迭代的段落中（你需要一个条件语句和多个 `para.textContent = lines`）：
  - 如果数字是 10，段落内容显示 "Countdown 10"。
  - 如果数字为 0，段落内容显示 "Blast off!"。
  - 对于任何其他数字，段落内容只显示数字本身。
- 记住要包括一个最终操作（或称为迭代器）！ 在这个例子中，程序的数字应该在每次迭代之后都减少，而不是增加，所以不能使用 `i++` - 应该用啥呢？

可以随时使用 "Reset" 按钮重置该示例。 如果你真的卡住了，点 "Show solution" 来查看解决方案。

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="html,result" data-user="anjingcuc" data-slug-hash="WNNgMpB" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Count down for while">
  <span>See the Pen <a href="https://codepen.io/anjingcuc/pen/WNNgMpB">
  Count down for while</a> by anjing (<a href="https://codepen.io/anjingcuc">@anjingcuc</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### while

在本练习中，你需要获取存储在数组中的名称列表，并将其放入来宾列表中。 但这不是那么容易 - 你需要排除菲尔和洛拉，因为他们是贪婪和粗鲁的，总是吃所有的食物！ 因此需要产生两个名单，一个是欢迎的客人名单，一个是拒绝的客人名单。

具体来说，希望你：

- 编写一个循环，它将从 0 迭代到 people 数组的长度。 你需要从一个初始化器 var i = 0 开始，但是你需要什么退出条件？
- 在每个循环迭代期间，使用条件语句检查当前数组项是否等于“Phil”或“Lola”：
- 如果是，则将数组项连接到拒绝段落的 textContent 的末尾，后跟逗号和空格。
- 如果不是，则将数组项连接到接收段落的 textContent 的末尾，后跟逗号和空格。

已提供的初始化代码包括：

- `var i = 0;` — 你的初始化程序
- `refused.textContent +=` - 将连接某些东西的行的开头，结束于 refused.textContent。
- `admitted.textContent +=` - 将连接某些内容到一行的结尾的行的开始。

额外要求 - 成功完成上述任务后，将留下两个名称列表，用逗号分隔，但它们将不整齐 - 每个结尾处都会有一个逗号。你需要思考并实现最后一个名字后面跟这一个句号。

可以随时使用 "Reset" 按钮重置该示例。 如果你真的卡住了，点 "Show solution" 来查看解决方案。

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="html,result" data-user="anjingcuc" data-slug-hash="wvvEydN" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Guest List for while">
  <span>See the Pen <a href="https://codepen.io/anjingcuc/pen/wvvEydN">
  Guest List for while</a> by anjing (<a href="https://codepen.io/anjingcuc">@anjingcuc</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## 提交

请完成上述四个小实验，并将代码和文档发送到 anjingcuc@vip.qq.com 文件名为 `学号-姓名.zip`。
