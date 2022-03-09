---
title: 程序结构
---

**下方课件区域方向键控制翻页，`f` 键全屏。**

<iframe src="./slideshow.html" frameborder=0 width=800 height=450></iframe>

# 示例

执着于表白的 Python。

```python
import tkinter as tk
import random


# 按钮被点击后执行这个函数
def hit_me():
    print('不喜欢')


# 每当鼠标 Enter 按钮时，执行这个函数
# 按钮就逃跑了
def escape(event):
    b = event.widget

    # 获取按钮宽度和高度以及鼠标的x,y坐标
    width = b.winfo_width()
    height = b.winfo_height()
    mouse_x = b.winfo_x() + event.x
    mouse_y = b.winfo_y() + event.y

    while True:
        # 随机新的按钮位置
        x = random.randint(0, 800)
        y = random.randint(0, 600)

        # 新的位置没有在鼠标上，就跳出循环
        if (x < mouse_x or x > mouse_x + width and x + width < 800) and (
                y < mouse_y or y > mouse_y + height and y + height < 600):
            break

    # 将按钮移动到新位置
    b.place(x=x, y=y)


# 创建一个窗体
window = tk.Tk()

window.title('执着于表白的 Python') # 修改标题
window.geometry('800x600')        # 设定窗口分辨率 800x600

# 创建一个按钮
button = tk.Button(
    window,          # 父控件，即这个button属于window
    text='不喜欢',    # 显示在按钮上的文字
    command=hit_me)  # 点击按钮时执行的命令

# 监听按钮的消息，消息 <Enter> ，即鼠标进入时，调用escape函数
button.bind('<Enter>', escape)

# 把button打包到窗口上，默认情况居中显示在最上面
button.pack()  # 按钮位置

# 显示窗口，开始处理各种窗口消息，这个循环不会退出，除非关闭窗口
window.mainloop()
```
