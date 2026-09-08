---
title: 第 02 章 · 系统维护
---

<div class="pyv2-mod-hero" data-pyv2-page>
  <div class="l">
    <span class="mid-tag">第 02 章</span>
    <b>系统维护</b>
  </div>
  <div class="r">
    <span>文件系统 · 数据恢复 · 网络</span>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:20px;">本章要点</h2>
  <div class="pyv2-lessons">
    <div class="pyv2-lesson" data-anim>
      <div class="l-head"><span class="l-no">01</span><b>路径与文件</b></div>
      <div class="l-body">绝对路径与相对路径的区别、路径切换的操作习惯。路径概念是命令行操作与后续脚本章节的直接基础。</div>
    </div>
    <div class="pyv2-lesson" data-anim>
      <div class="l-head"><span class="l-no">02</span><b>磁盘管理与文件系统</b></div>
      <div class="l-body">驱动器、分区大小调整与格式化；二进制视角看文件；NTFS 文件系统的元文件（$MFT 等）与文件记录结构——这是理解「删除的文件为什么能恢复」的钥匙。</div>
    </div>
    <div class="pyv2-lesson" data-anim>
      <div class="l-head"><span class="l-no">03</span><b>数据恢复与网络维护</b></div>
      <div class="l-body">文件恢复的原理与边界（标记删除 ≠ 数据清除）；网络连接的诊断与维护。配合<a href="../demos/file-signatures.html">文件签名识别演示</a>动手查看文件头。</div>
    </div>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:20px;">课件</h2>
  <div class="aissop-slides"><iframe src="./slideshow.html" title="系统维护课件" loading="lazy"></iframe></div>
  <div class="aissop-slide-tools">
    <a href="./slideshow.html" target="_blank">新窗口打开课件 ↗</a>
    <span>方向键翻页 · <b>F</b> 键全屏</span>
  </div>
</div>

<div class="pyv2" data-pyv2-page markdown="1">
  <h2 style="font-size:20px;">延伸：NTFS 文件记录结构详解</h2>
  <p>以下内容是课件中「文件记录」一节的展开，供完成数据恢复相关实验时查阅。</p>

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
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:20px;">随堂小测</h2>
  <div class="pyv2-quiz">
    <script type="application/json" class="quiz-data">
    {
      "title": "第 02 章 · 概念检查",
      "questions": [
        {
          "q": "NTFS 中集中记录文件元数据（大小、时间、位置等）的结构是？",
          "opts": ["桌面回收站", "$MFT 主文件表", "注册表", "页面文件 pagefile.sys"],
          "a": 1,
          "explain": "$MFT（Master File Table）是 NTFS 的核心元数据结构，每个文件（包括 $MFT 自身）都有一条文件记录。"
        },
        {
          "q": "已删除的文件之所以可能被恢复，是因为？",
          "opts": ["Windows 会自动云端备份所有文件", "删除通常只是标记，对应磁盘扇区的数据并未立即被清除", "回收站永久保存文件", "文件删除后转入注册表"],
          "a": 1,
          "explain": "文件记录头的标记位被改为「已删除」，数据扇区被标记为可复用；只要未被新数据覆盖，原内容就仍然存在——这也是安全删除工具反复覆写的原因。"
        },
        {
          "q": "格式化磁盘分区意味着？",
          "opts": ["建立文件系统结构，原数据通常仍可能被恢复", "物理销毁磁盘", "把磁盘分成两半", "给磁盘加密"],
          "a": 1,
          "explain": "格式化是初始化文件系统元数据（如 $MFT、引导记录），普通快速格式化并不擦除全部数据扇区。"
        }
      ]
    }
    </script>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:20px;">章节导航</h2>
  <p style="margin-top:14px;">
    <a class="pyv2-btn primary" href="../shell/">下一章：第 03 章 Shell 与脚本 →</a>
    <a class="pyv2-btn ghost" href="../windows-intro/">← 第 01 章 Windows 基础</a>
  </p>
</div>
