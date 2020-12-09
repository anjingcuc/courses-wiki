---
title: 作业
---

## 第一次作业-初探 HTML

该作业[课程简介](introduction.md) 一节中出现，要求编写一个 HTML 形式的个人简历。

请参考以下模板，根据课程中讲到的 HTML 元素进行修改。

```html
<html>
  <head>
    <title>简历</title>
  </head>
  <body>
    <h1>anjingcuc</h1>
    <h2>教育经历</h2>
    <p>20XX年毕业于CUC。</p>
    <h2>自我介绍</h2>
    <p>学！习！能！力！强！</p>
  </body>
</html>
```

可以修改为自己或虚拟人物的简历，也可以增加一些简单样式。

## 第二次作业要求-CSS 样式运用

该作业在 [CSS 文本样式](css-text.md) 一节中出现，要求帮助一个网站进行样式的修改。

请下载压缩包 [作业模板](css-text/css-text-homework.zip) 并完成以下任务：

你有一个虚构的社区大学主页的未处理 HTML 文件和一些 CSS 文件。这些 CSS 文件把网页分成两栏布局，提供了一些简单的样式化。你将在 CSS 文件底部的注释下面写你的 CSS，这样可以方便地标出你的工作。

### 字体

选择一些自己喜欢的字体来改进页面。

### 文本样式化基础

- 设置全站网页 font-size 为 10px。
- 使用相对单位（relative unit）为标题和其他元素的 font-sizes 设置合适的值。
- 为 body 文本设置合适的 line-height。
- 居中页面顶级标题。
- 为标题设置 letter-spacing 避免字间太过拥挤。
- 为 body 文本设置合适的 letter-spacing 和 word-spacing。

### 链接

- 设置 link, visited, focus, 和 hover 状态设置颜色，与页面顶部和底部的水平线颜色相匹配。
- 设置链接默认带下划线，但 hover 和 focus 时下划线消失。
- 取消页面中所有链接 focus 时默认的外边线。
- 设置 active 时有显著不同的样式，使其又突出又与整体页面设计和谐。

### 列表

- 确保列表和列表项与页面整体样式和谐。每个列表项应该有同样的与段落行相同的 line-height 。每个列表上下间距应该与段落间距相同。
- 使用与页面设计匹配的列表项符号。你可以选择自定义的图像或者其他的喜欢的符号。

### 导航栏菜单

- 样式化你的导航栏菜单，使它拥有与页面整体相匹配的外观。

完成后，同样压缩成为 `作业-学号-名字.zip` 并发送到 anjingcuc@vip.qq.com，截止日期为 2020-10-11。

### 作业参考

如果实在无法完成，请参考 [作业参考](css-text/homeword_finished.zip)

## 第三次作业要求

该作业在 [JavaScript API](javascript-API.md) 一节中出现，要求实现一个 Tab 页面形式的图库。

请下载压缩包 [作业模板](javascript-API/tab_gallery.zip) 并完成以下任务：

修改模板中的 CSS 和 JavaScript 实现一个图库功能。

### 样式

- 补全 `.column` 的样式，使其变为浮动布局，宽度大致为父元素宽度的 1/4 ，且有 `padding` 。
- 补全 `.column` 中的 `img` 的样式，使其默认透明度为 `80%` 或你喜欢的透明度。
- 当鼠标悬浮在 `img` 元素上时，使其透明度变为 `100%` 。
- 清除 `.row:after` 的浮动。
- 将 `.container` 的定位改为相对定位。
- 为 `id` 是 `imgtext` 的元素增加 `bottom` 和 `left` 规则来使其显示在展示区域左下角。
- 为 `class` 是 `.closebtn` 的关闭按钮增加 `top` 和 `right` 规则来使其显示在展示区域右上角。

### 脚本

补全 `show_picture(imgs)` 函数实现以下操作：

- 调用 `document.getElementById()` 方法来获取页面中 `id` 为 `expandedImg` 的元素。
- 调用 `document.getElementById()` 方法来获取页面中 `id` 为 `imgtext` 的元素。
- 将 `expandedImg` 元素的 `src` 属性赋值为 `imgs` 的 `src` 属性。
- 将 `imgText` 元素的 `innerHTML` 属性赋值为 `imgtext` 的 `alt` 属性。
- 修改 `expandImg` 的父元素的样式中的 `display` 属性为 `block` 。

### 提示

遇到困难时，可下载 [提示](javascript-API/tab_gallery_tips.zip) 中的注释。

### 提交方式

完成后，同样压缩成为 `作业-学号-名字.zip` 并发送到 anjingcuc@vip.qq.com，截止日期下周上课前。

### 作业参考

如果实在无法完成，请参考 [作业参考](javascript-API/tab_gallery_finished.zip)

## 第四次作业要求

该作业在 [Bootstrap](bootstrap.md) 一节中出现，要求完善一个更加完整简历。

下载 [简历](bootstrap/resume.zip) ，了解该简历的结构，在这个简历的基础上，修改出自己的简历。

**完成上述作业，然后压缩成为 `作业-学号-名字.zip` 并发送到 anjingcuc@vip.qq.com 。**
