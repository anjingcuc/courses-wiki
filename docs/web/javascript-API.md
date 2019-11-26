---
title: JavaScript API
---

**下方课件区域方向键控制翻页，`f` 键全屏。**

<iframe src="./slideshow.html" frameborder=0 width=800 height=450></iframe>

## 练习

### DOM 操作练习

#### 修改页面元素的文本或属性值

1. 右键另存[dom-example.html](dom-example.html)到本地。
2. 在`</body>`前添加`<script></script>`标签。
3. 在`script`元素中选中 `a` 元素：

    ```
    const link = document.querySelector("a");
    ```

4. 现在我们可以通过 `link` 这个变量来访问这个元素了，它对应 `HTMLAnchorElement` 接口，我们可以通过这个接口的父对象 `HTMLElement` 和 `Node` 来对它进行操作，首先通过 `Node.textContent` 属性来改变它显示的内容：

    ```
    link.textContent = '教学 Wiki';
    ```

5. 然后我们可以通过修改其 `href` 属性来改变它指向的链接：

    ```
    link.href = 'https://anjingcuc.github.io/courses-wiki/web/';
    ```

经过以上操作，现在这个链接指向了我们的教学 wiki 。我们有很多方法可以选择一个元素并在一个变量或常量中。`Document.querySelector()` 是推荐的主流方法，它允许你使用 `CSS` 选择器选择元素，使用很方便。上面的 `querySelector()` 调用会匹配它在文档中遇到的**第一个** `<a>` 元素。如果想对**多个元素**进行匹配和操作，你可以使用 `Document.querySelectorAll()` ，这个方法匹配文档中每个匹配选择器的元素，并把它们的引用存储在一个 `array` 中。除此之外，还有以下方法可以使用：

- `Document.getElementById()` ，选择一个 `id` 属性值已知的元素，例如 `<p id="myId">My paragraph</p>` 。`id` 作为参数传递给函数，即 `var elementRef = document.getElementById('myId')`。
- `Document.getElementsByTagName()`，返回页面中包含的所有已知类型元素的数组。如 `<p>`, `<a>`。元素类型作为参数传递给函数，即 `var elementRefArray = document.getElementsByTagName('p')` ，等价于 `Document.querySelectorAll()` 。

#### 创建并添加新节点

除了对现有元素修改意外，我们还可以添加一些新的元素，比如我们可以在上面的内容基础上添加一段说明，介绍一下我们的教学 Wiki 的内容。

1. 在已有 `script` 元素中添加下列代码，获取到 `body` 元素的保存起来：

    ```
    const body = document.querySelector('body');
    ```

2. 使用 API `Document.createElement()` 创建一个新的段落，用与之前相同的方法赋予相同的文本：

    ```
    const para = document.createElement('p');
    para.textContent = '教学 Wiki中保存了课程相关资料，方便同学们温故知新。';
    ```

3. 虽然已经创建了这个元素，但是它还不知道自己应该放在什么位置，所以我们用 `Node.appendChild()` 方法在 `body` 的最后追加新的段落：

    ```
    body.appendChild(para);
    ```

4. 还可以在段落元素后面补充新的文本，使用 `Document.createTextNode()` 创建一个文本节点：

    ```
    const text = document.createTextNode('课件可以在线直接查看，无需下载，欢迎大家访问。');
    ```

5. 同样我们需要把这个新的文本节点追加到我们的刚才创建的段落后面：

    ```
    para.appendChild(text);
    ```

#### 删除元素

我们还可以使用 `Node.removeChild()` 来删除某个元素，比如你觉得之前补充的文本太罗嗦了就可以：

```js
para.removeChild(text);
```

#### 操作样式

我们还可以通过 JavaScript 来动态的改变页面元素的样式，我们可以通过 `HTMLElement.style` 属性来改变元素的样式，这个属性的值实际上是一个 `CSSStyleDeclaration` 对象，这个对象包含多个属性来表示元素的样式。

1. 我们可以通过对 `CSSStyleDeclaration` 对象的不同属性进行赋值来实现样式的修改。

    ```
    para.style.color = 'white';
    para.style.backgroundColor = 'black';
    para.style.padding = '10px';
    para.style.width = '250px';
    para.style.textAlign = 'center';
    ```

2.  刷新页面，可以看到 `p` 元素被加入了相应的内联样式。

还可以通过改变元素的 `class` 属性值来修改元素样式，比如：

1. 删掉上面修改样式的五行代码，并在示例 HTML 文件 `head` 元素中加入：

    ```
    <style>
    .highlight {
      color: white;
      background-color: black;
      padding: 10px;
      width: 250px;
      text-align: center;
    }
    </style>
    ```

2. 然后我们使用修改 HTML 元素属性的操作的常用方法 `Element.setAttribute()`，该方法需要两个参数，第一个参数是属性的名字比如 `class`，第二个参数是你要为它设置的值比如 `highlight`。代码如下：

    ```
    para.setAttribute('class', 'highlight');
    ```

第二种方式更加正统，没有 CSS 和 JavaScript 的混合，没有内联样式。

### 动态购物单

这里有个小小的挑战，右键另存[shopping-cart.html](shopping-cart.html)，请你做一个简单的购物车的例子，使用表单的输入框和按钮动态的向购物单中添加购物项。在输入中添加项，然后按下添加按钮：

- 购物项应该出现在清单中。
- 每个物品都关联一个删除按钮，可以从清单中删除该物品。
- 输入框应该是空白的，等待你输入另一个物品。

看起来这个购物车大概长这样：

![购物车](/img/shoppingcart.jpg)

要完成实验，要按照下面的步骤，确保购物单的行为如上所述。

1. 首先，下载 shopping-list.html 文件，并存入本地。你会看到它有一些极小的 CSS，一个带有 label、input 和 button 的 list 和一个空的 list 以及 script 元素。要添加的所有程序都在 script 里面。
2. 创建三个变量来保存 `<ul>`、`<input>`和`<button>`元素的引用。
3. 创建一个函数响应点击按钮。
4. 在函数体内，开始要在一个变量中存储输入框的当前值。
5. 然后，为输入框元素设置空字符 - ''使其为空
6. 创建三个新元素 — 一个 list 项 `<li>`，`<span>` 和 `<button>`，并把它们存入变量之中。
7. 把 span 和 button 作为 list 项的子节点。
8. 把之前保存的输入框元素的值设置为 span 的文本内容，按钮的文本内容设置为'Delete'
9. 把 list 项设置为 list 的子节点。
10. 为删除按钮绑定事件处理程序。当点击按钮时，删除它所在的整个 list 项。
11. 最后，使用 focus()方法聚焦输入框准备输入下一个购物项。

如果卡住了实在做不出来，请参考[shopping-cart-finished.html](shopping-cart-finished.html)。