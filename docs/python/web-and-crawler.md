---
title: Web 开发
---

**下方课件区域方向键控制翻页，`f` 键全屏。**

<iframe src="slideshow.html" frameborder=0 width=800 height=450></iframe>

## CSS 选择器

| 选择器               | 例子              | 例子描述                                          |
| -------------------- | ----------------- | ------------------------------------------------- |
| `.class`             | `.intro`          | 选择 `class="intro"` 的所有元素。                 |
| `#id`                | `#firstname`      | 选择 `id="firstname"` 的所有元素。                |
| `*`                  | `*`               | 选择所有元素。                                    |
| `element`            | `p`               | 选择所有 `<p>` 元素。                             |
| `element,element`    | `div,p`           | 选择所有 `<div>` 元素和所有 `<p>` 元素。          |
| `element element`    | `div p`           | 选择 `<div>` 元素内部的所有 `<p>` 元素。          |
| `element>element`    | `div>p`           | 选择父元素为 `<div>` 元素的所有 `<p>` 元素。      |
| `element+element`    | `div+p`           | 选择紧接在 `<div>` 元素之后的所有 `<p>` 元素。    |
| `[attribute]`        | `[target]`        | 选择带有 `target` 属性所有元素。                  |
| `[attribute=value]`  | `[target=_blank]` | 选择 `target="\_blank"` 的所有元素。              |
| `[attribute~=value]` | `[title~=flower]` | 选择 `title` 属性包含单词 `"flower"` 的所有元素。 |
| `[attribute|=value]` | `[lang|=en]`      | 选择 `lang` 属性值以 `"en"` 开头的所有元素。      |

_注：参考 https://www.w3school.com.cn/cssref/css_selectors.asp_
