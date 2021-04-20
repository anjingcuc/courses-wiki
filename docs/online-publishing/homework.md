---
title: 结课作业
---

## 使用 Hexo 生成博客并发布

### 依赖软件安装

Hexo 安装和运行依赖以下软件:

- Nodejs, Hexo 运行基础环境，并提供 npm 实现安装；
- Git, Nodejs 的包管理工具依赖 Git 实现包下载。

请根据电脑所用系统下载依赖的软件，Windows 系统请下载:

- [Nodejs v12.22.1](https://nodejs.org/dist/latest-v12.x/node-v12.22.1-x64.msi)
- [Git for Windows](https://git-scm.com/download/win)

苹果电脑默认的 macOS 请下载:

- [Nodejs v12.22.1](https://nodejs.org/dist/latest-v12.x/node-v12.22.1.pkg)

### Hexo 安装与博客生成

使用 Nodejs 自带的包管理器 npm 来自动下载 Hexo 的命令行工具 hexo-cli，打开 Windows 命令行或 macOS 下的终端运行以下代码：

```bash
npm install -g hexo-cli
```

其中 npm 是 Nodejs 的包管理工具，`install` 是执行安装命令；`-g` 参数说明是全局安装，也就是安装完成后会自动将 hexo 加入环境变量直接使用；`hexo-cli` 是安装目标，也就是 hexo 命令行工具的名字。

安装完成后进行验证，在命令行输入：

```bash
hexo -v
```

可以看到类似以下输出，说明安装完成。

```bash
os: Windows_NT 10.0.19042 win32 x64
node: 12.22.1
v8: 8.4.371.19-node.18
uv: 1.40.0
zlib: 1.2.11
brotli: 1.0.9
ares: 1.16.1
modules: 83
nghttp2: 1.41.0
napi: 7
llhttp: 2.1.3
openssl: 1.1.1j
cldr: 37.0
icu: 67.1
tz: 2020a
unicode: 13.0
```

### 博客编辑与美化

使用 VSCode 或者 Typora 编写博客文章，也可以修改、定制 Hexo 的主题。

Hexo 相关社区的热心群众提供了众多主题让用户选择，通过应用不同的主题，可以对站点的布局、字体乃至整体风格进行定制，达到用户预期的效果。本节以著名的 NexT 为例来修改站点的主题。

#### 安装主题

主题的安装非常简单，就是直接将主题相关的文件整个放进站点的 `themes` 目录即可，一般主题都提供压缩包、git 等多种安装途径。我们采用下载稳定版压缩包的方式进行安装。访问 <https://github.com/theme-next/hexo-theme-next/archive/refs/tags/v7.8.0.zip> 下载 7.8.0 版本 NexT 主题的压缩包，将该压缩包解压到 `themes` 目录，并将文件夹改名为 next 即可。`themes` 下面的目录结构如下：

```
.
└── next
    ├── LICENSE.md
    ├── README.md
    ├── _config.yml
    ├── crowdin.yml
    ├── docs
    ├── gulpfile.js
    ├── languages
    ├── layout
    ├── package.json
    ├── scripts
    └── source
```

也就是 `themes` 文件夹中包含一个 `next` 文件夹，`next` 中包含了多个主题相关文件、文件夹。

#### 启用主题

启用主题的方法非常简单，打开站点配置文件，也就是 `blog` 文件夹中的 `_config.yml` 找到 `theme` 字段，默认情况下应该在 100 行的位置，将原来的 `theme: landscape` 改为 `theme: next` 即可。

启动本地服务器可以预览主题应用之后的效果。

### 发布

配置好 Github 或 Gitee 的 Pages 仓库后，采用 `hexo-deployer-git` 进行发布。

### 作业要求

请按照视频教程完成作业，将博客链接发送到 `anjingcuc@vip.qq.com`，截止日期 2021-05-20。
