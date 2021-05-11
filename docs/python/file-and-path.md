---
title: 文件与目录
---

**下方课件区域方向键控制翻页，`f` 键全屏。**

<iframe src="./slideshow.html" frameborder=0 width=800 height=450></iframe>

## 示例 1

用标准库 struct 解包一个 24 bits 无调色板的 BMP 文件头。

```python
import struct

# 使用 r 读取 b 二进制 模式打开文件
with open('test.bmp', 'rb') as f:
    # 读取 14 字节的文件头
    bmp_file_header = f.read(14)

    # BMP 文件头
    # bm 对应 2 字节的标志'BM'
    # size 对应 4 字节无符号整型表示文件大小
    # r1 r2 对应 2 个宽度为 2 字节的保留位置
    # offset 对应 4 字节无符号整型表示图像数据的起始偏移
    bm, size, r1, r2, offset = struct.unpack('<2sIHHI', bmp_file_header)

    print(bm, size, offset)

    # 读取 40 字节的文件头
    bmp_info_header = f.read(40)

    # 不定长的信息头，一般为 40 字节
    # info_size 对应 4 字节无符号整型表示信息头大小
    # width 对应 4 字节有符号整型表示图像宽度
    # height 对应 4 字节有符号整型表示图像高度
    # planes 对应 2 字节无符号整型表示色彩层数，一般值为 1
    # bits 对应 2 字节无符号整型表示位深度，即用多少比特表示颜色
    # compression 对应 4 字节无符号整型表示压缩方式
    # data_size 对应 4 字节无符号整型表示图像数据大小 = width * height * bits
    # x_res 对应 4 字节有符号整型表示横向（x轴）分辨率（多少像素每米）
    # y_res 对应 4 字节有符号整型表示纵向（y轴）分辨率（多少像素每米）
    # clr_used 对应 4 字节无符号整型表示调色板颜色数量
    # clr_important 对应 4 字节无符号整型表示调色板重要颜色数量
    info_size, width, height, planes, bits, compression, data_size, x_res, y_res, clr_used, clr_important = struct.unpack(
        '<IiiHHIIiiII', bmp_info_header)

    print(compression, info_size, width, height, bits, data_size, clr_used)
```

## 示例 2

将某个目录中的文件（包括子目录下的文件）按照由大到小的顺序移动到一个新的目录，并且加上数字前缀。

```python
import os


# 通过递归调用 os.listdir() 来实现目录遍历，得到一个包含所有文件的列表
def walk_dir(path):
    result = []

    for filename in os.listdir(path):
        file_path = os.path.join(path, filename)

        if os.path.isdir(file_path):
            result += walk_dir(file_path)

        if os.path.isfile(file_path):
            result.append(file_path)

    return result


root = input('请输入你要遍历的目录: ')

# 遍历用户指定的目录
files = walk_dir(root)

# 按文件大小由大到小命名的新目录
output_dir = input('请输入你要新建的目录: ')

# 新目录不存在时自动创建这个目录
if not os.path.exists(output_dir):
    os.mkdir(output_dir)

# 使用 os.stat() 获取文件大小
file_dict = {}
for file in files:
    st = os.stat(file)
    file_dict[file] = st.st_size

# 用 数据类型进阶 一节学过的方法排序
sorted_files = {
    k: v
    for k, v in sorted(file_dict.items(), key=lambda x: x[1], reverse=True)
}

# 按照由大到小的顺序，给文件名前面加上数字前缀并移动到新的目录
filename = 1
for file in sorted_files.keys():
    # 获取文件名的部分（不包括前面的路径）
    basename = os.path.basename(file)
    # 将文件名拆分成名字和后缀
    name, ext = os.path.splitext(basename)

    # 组合新的目录和新文件名
    new_basename = str(filename) + '_' + name + ext
    newfilename = os.path.join(output_dir, new_basename)

    # 调用 os.rename() 实现移动文件的效果
    os.rename(file, newfilename)

    filename += 1
```

另一种遍历目录的方法。

```python
def walk_dir(path):
    result = []

    for root, dirs, files in os.walk(path):
        for file in files:
            filename = os.path.join(root, file)
            result.append(filename)

    return result
```

## 示例 3

上面的例子如果使用 pathlib 来实现，则为：

```python
from pathlib import Path

root = input('请输入你要遍历的目录: ')

# 遍历用户指定的目录，如果想偷懒，可以用 Path.rglob('*')
# Path.rglob('*') 相当于自动给参数加上 '**/' 的 glob
files = Path(root).glob('**/*')

# 按文件大小由大到小命名的新目录
output_dir = input('请输入你要新建的目录: ')

Path(output_dir).mkdir(exist_ok=True)

# 使用 Path.stat() 获取文件大小
file_dict = {}
for file in files:
    if Path(file).is_file():
        st = Path(file).stat()
        file_dict[file] = st.st_size

# 用 数据类型进阶 一节学过的方法排序
sorted_files = {
    k: v
    for k, v in sorted(file_dict.items(), key=lambda x: x[1], reverse=True)
}

# 按照由大到小的顺序，给文件名前面加上数字前缀并移动到新的目录
filename = 1
for file in sorted_files.keys():
    old_file = Path(file)

    # 组合新的目录和新文件名
    new_basename = str(filename) + '_' + old_file.stem + old_file.suffix
    newfilename = Path(output_dir) / Path(new_basename)

    # 调用 Path.rename() 实现移动文件的效果
    old_file.rename(newfilename)

    filename += 1
```

## 作业-猫鼠游戏

作业链接: <https://classroom.github.com/a/7hEM9lgU>

详细要求参考作业仓库的 README.md 。
