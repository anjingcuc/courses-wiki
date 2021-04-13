---
title: 样式
---

**下方课件区域方向键控制翻页，`f` 键全屏。**

<iframe src="./slideshow.html" frameborder=0 width=800 height=450></iframe>

## 在 Typora 中应用样式

Typora 的主题实际上就是一组样式的组合，我们可以在内置主题的基础上局部对样式进行修改，来满足我们的特定需求。参考 <https://support.typora.io/Add-Custom-CSS/> 。

Typora 自定义样式需要存放在 `theme` 即主题文件夹中，在 `文件` -> `偏好设置` 菜单中，选择 `外观` 标签页，并在设置页面下方找到 `打开主题文件夹` 按钮，点击该按钮打开主题文件夹。

主题文件夹中存放了 Typora 内置主题的相关样式文件和字体文件。Typora 加载样式文件的优先级顺序为：

1. Typora 内置基本设置
2. 当前主题对应的 CSS 文件
3. 主题文件夹中的 `base.user.css` 文件
4. 主题文件夹中的 `<current-theme>.user.css` 文件

如果需要同时修改所有主题中的样式，则我们可以新建一个 `base.user.css` 文件，然后对齐进行修改；如果仅需要修改某一个主题下的样式，比如修改 `github` 主题的部分样式，则我们可以新建一个 `github.user.css` 来实现修改。

Typora 的样式可以用 `视图` -> `开发者工具` 来进行查看和测试。

## 在 Hexo 主题中使用样式

之前的章节中提到 Hexo 中我们可以为自己的博客设置不同的主题，这一节来尝试在主题的基础上局部修改样式。

Hexo 中主题的启用主要包括两个步骤：

1. 将目标主题比如 `next` 文件夹放在博客目录下面的 `themes` 文件夹中
2. 在 `_config.yml` 文件默认情况下 100 行的 `theme: landscape` 改为 `theme: next`

正确设置好主题后，需要根据主题对应的结构来设置自定义样式。

本节以 `next` 主题为例，经过文档查询可知需要首先在主题的配置文件即 `themes/next/_config.yml` 中的 `custom_file_path:` 字段设置好自动的样式文件，比如 `style: themes/next/source/data/styles.styl` 。

这样 Hexo 在构建网站时，会自动将 `themes/next/source/data/styles.styl` 加载成为自定义样式。这里需要注意：

1. styl 文件是一种新型的样式文件，它可以包含 css 样式的内容
2. 在每次设置了自定义样式后需要重新 `hexo g` 来生成一下

接下来就可以在 `styles.styl` 中编写我们需要的自定义样式了。