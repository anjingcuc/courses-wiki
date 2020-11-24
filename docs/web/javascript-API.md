---
title: JavaScript API
---

**下方课件区域方向键控制翻页，`f` 键全屏。**

<iframe src="./slideshow.html" frameborder=0 width=800 height=450></iframe>

## 作业

请下载压缩包 [作业模板](tab_gallery.zip) 并完成以下任务：

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

遇到困难时，可下载 [提示](tab_gallery_tips.zip) 中的注释。

### 提交方式

完成后，同样压缩成为 `作业-学号-名字.zip` 并发送到 anjingcuc@vip.qq.com，截止日期下周上课前。

## 作业参考

如果实在无法完成，请参考 [作业参考](tab_gallery_finished.zip)
