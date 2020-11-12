---
title: 系统维护
---

**下方课件区域方向键控制翻页，`f` 键全屏。**

<iframe src="./slideshow.html" frameborder=0 width=800 height=450></iframe>

## 文件记录详细介绍

### 文件记录头

| 偏移 | 字段长度 | 含义                        |
| ---- | -------- | --------------------------- |
| 0x00 | 4        | MFT 记录标志-FILE           |
| 0x04 | 2        | 更新序列号偏移              |
| 0x06 | 2        | 更新序列号的大小            |
| 0x08 | 8        | 日志文件序列号对应\$LogFile |
| 0x10 | 2        | 序列号                      |
| 0x12 | 2        | 硬链接数量                  |
| 0x14 | 2        | 第一个属性的偏移            |
| 0x16 | 2        | 标记                        |
| 0x18 | 4        | 文件记录实际长度            |
| 0x1C | 4        | 文件记录分配长度            |
| 0x20 | 8        | 基本文件记录中的文件索引号  |
| 0x28 | 2        | 下一属性 ID                 |
| 0x2A | 2        | 边界                        |
| 0x2C | 4        | 文件记录参考号              |
| 0x30 | 2        | 更新序列号                  |
| 0x32 | 4        | 更新数组                    |

注：0x16 的标记，0x00 表示文件被删除，0x01 表示文件未删除，0x03 表示目录被删除，0x04 表示目录未删除。

source: https://docs.microsoft.com/en-us/windows/desktop/devnotes/file-record-segment-header

### 属性头

| 偏移 | 字段长度 | 含义                     |
| ---- | -------- | ------------------------ |
| 0x00 | 4        | 属性类型                 |
| 0x04 | 4        | 包括属性头在内的属性长度 |
| 0x08 | 1        | 是否是常驻属性           |
| 0x09 | 1        | 属性名的长度             |
| 0x0A | 2        | 属性名的偏移             |
| 0x0C | 2        | 压缩、加密、稀疏标志     |
| 0x0E | 2        | 属性 ID                  |
| 0x10 | 4        | 属性体的长度 L           |
| 0x14 | 2        | 属性体的开始偏移         |
| 0x16 | 1        | 索引标志                 |
| 0x17 | 1        | 无意义                   |
| 0x18 | L        | 属性体                   |

### 常见属性-标准信息-0x10

属性保存在 \$MFT 的文件记录中，称为常驻属性，保存在别的位置称为非常驻属性。

| 偏移 | 字段长度 | 含义         |
| ---- | -------- | ------------ |
| 0x00 | 8        | 文件创建时间 |
| 0x08 | 8        | 文件修改时间 |
| 0x10 | 8        | MFT 修改时间 |
| 0x18 | 8        | 文件访问时间 |
| 0x20 | 4        | 传统文件属性 |
| 0x24 | 4        | 最大版本数   |
| 0x28 | 4        | 版本数       |
| 0x2C | 4        | 分类 ID      |
| 0x30 | 4        | 所有者 ID    |
| 0x34 | 4        | 安全 ID      |
| 0x38 | 8        | 配额使用情况 |
| 0x40 | 8        | 更新序列号   |

注：0x20 的属性，0x0001 表示只读文件，0x0002 表示隐藏文件，0x0004 表示系统文件，还有其他属性。

### 常见属性-文件名-0x30

| 偏移 | 字段长度 | 含义                     |
| ---- | -------- | ------------------------ |
| 0x00 | 8        | 父目录文件参考号         |
| 0x08 | 8        | 文件创建时间             |
| 0x10 | 8        | 文件修改时间             |
| 0x18 | 8        | MFT 修改时间             |
| 0x20 | 8        | 文件访问时间             |
| 0x28 | 8        | 文件分配大小             |
| 0x30 | 8        | 文件实际大小             |
| 0x38 | 4        | 标志，目录、压缩、隐藏等 |
| 0x3C | 4        | 扩展属性                 |
| 0x40 | 1        | 文件名长度 L             |
| 0x41 | 1        | 文件命名空间             |
| 0x42 | 2L       | Unicode 文件名           |

注：0x41 的文件命名空间，0x01 是 NTFS 命名，0x02 是 DOS 命名。

### 常见属性-数据-0x80

文件大小较小时，数据是常驻属性，属性头后面就是文件数据。文件较大时，数据是非常驻属性。非常驻属性头的 0x20 偏移开始 2 字节是属性的开始偏移。属性对应 `Data Run List` 其含义如下：

![dataRunList](/img/data_run_list.jpg)