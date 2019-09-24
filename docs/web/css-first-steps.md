---
title: CSS 样式表
---

**下方课件区域方向键控制翻页，`f` 键全屏。**

<iframe src="./slideshow.html" frameborder=0 width=800 height=450></iframe>

---

### 外部样式 - HTML 文件

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>简历</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <h1>美化简历</h1>
    <p>我要变美我的朋友。</p>
  </body>
</html>
```

### 外部样式 - style.css 文件

```CSS
h1 {
  color: blue;
  background-color: yellow;
  border: 1px solid black;
}

p {
  color: red;
}
```

### 内部样式

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>简历</title>
    <style>
      h1 {
        color: blue;
        background-color: yellow;
        border: 1px solid black;
      }

      p {
        color: red;
      }
    </style>
  </head>
  <body>
    <h1>美化简历</h1>
    <p>我要变美我的朋友。</p>
  </body>
</html>
```

### 内联样式

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>简历</title>
  </head>
  <body>
    <h1 style="color: blue;background-color: yellow;border: 1px solid black;">
      美化简历
    </h1>
    <p style="color:red;">我要变美我的朋友。</p>
  </body>
</html>
```
