---
title: Hexo
---

Hexo 是一个快速、简洁且高效的博客框架。Hexo 使用 Markdown（或其他渲染引擎）解析文章，在几秒内，即可利用靓丽的主题生成静态网页。

本节我们将按照官方文档的步骤来介绍 Hexo 的使用。

<https://hexo.io/zh-cn/docs/>

## Hexo 基本用法

### 安装依赖

下载安装以下工具：

- Nodejs, Hexo 运行基础环境，并提供 npm 实现安装；
- Git, Nodejs 的包管理工具依赖 Git 实现包下载。

### 安装 Hexo

使用 Nodejs 自带的包管理器 npm 来自动下载 Hexo 的命令行工具 hexo-cli，打开 Windows 命令行运行以下代码：

```cmd
npm install -g hexo-cli
```

其中 npm 是 Nodejs 的包管理工具，`install` 是执行安装命令；`-g` 参数说明是全局安装，也就是安装完成后会自动将 hexo 加入环境变量直接使用；`hexo-cli` 是安装目标，也就是 hexo 命令行工具的名字。

安装完成后进行验证，在命令行输入：

```cmd
hexo -v
```

可以看到类似以下输出，说明安装完成。

```cmd
os: Windows_NT 10.0.19042 win32 x64
node: 14.16.0
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

### 创建博客

Hexo 命令行工具提供一系列的命令来对博客实现操作，创建博客需要使用 `init` 命令。

```cmd
hexo init <folder>
```

将上面的 `<folder>` 替换为你希望的文件夹名称，比如你想把博客的相关文件放在一个叫 `blog` 的文件夹里面，则命令应该是：

```cmd
hexo init blog
```

就会自动创建一个 `blog` 文件夹，里面的目录结构如下，`#` 后面是文件夹相关说明：

```cmd
.
├── _config.yml             # 站点配置文件
├── _config.landscape.yml   # landscape 主题配置文件，不用管
├── package.json            # Nodejs 包配置，不用管
├── package-lock.json       # Nodejs 包配置详情，不用管
├── .gitignore              # git 的忽略文件，不用管
├── node_modules            # hexo 所用到的 Nodejs 包，不用管
├── scaffolds               # 站点主要分区模板
├── source                  # 站点内容主要文件夹
|   ├── _drafts             # 未发布的内容，即草稿
|   └── _posts              # 已发布文章
└── themes                  # 站点主题
```

所以总结下来普通用户只用对 `_config.yml` / `scaffolds` / `source` / `themes` 等目录进行编辑或修改。

### 修改内容

浏览上述 `source` 目录下面的 `_posts` 可以看到默认情况下，hexo 自动创建了一个 `hello-world.md` 文件，该文件用 Markdown 语法进行编写，对应网站上的一篇文章，俗称是一篇 `post`。

使用 `Typora` 或 `VSCode` 或其他你熟悉的编辑器打开即可进行内容的修改。

### 预览站点

修改完成后，可以在本地电脑上预览网站。在命令行中使用 `cd` 命令进入 `blog` 文件夹并启动本地网站服务器来实现预览。

```cmd
cd blog         # 进入文件夹
hexo server     # 启动本地服务器
```

即可看到以下输出：

```
INFO  Validating config
INFO  Start processing
Deprecated as of 10.7.0. highlight(lang, code, ...args) has been deprecated.
Deprecated as of 10.7.0. Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277
Deprecated as of 10.7.0. highlight(lang, code, ...args) has been deprecated.
Deprecated as of 10.7.0. Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277
Deprecated as of 10.7.0. highlight(lang, code, ...args) has been deprecated.
Deprecated as of 10.7.0. Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277
Deprecated as of 10.7.0. highlight(lang, code, ...args) has been deprecated.
Deprecated as of 10.7.0. Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277
INFO  Hexo is running at http://localhost:4000 . Press Ctrl+C to stop.
```

此时可以打开浏览器（推荐 Chrome 或者 Edge）访问 `http://localhost:4000` 即可看到博客页面。

### 基本配置

`_config.yml` 是一个配置文件，能够对网站进行各个维度的配置。详见 <https://hexo.io/zh-cn/docs/configuration> 。

| 参数        | 描述                                                                                                                                                         |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| title       | 网站标题                                                                                                                                                     |
| subtitle    | 网站副标题                                                                                                                                                   |
| description | 网站描述                                                                                                                                                     |
| keywords    | 网站的关键词。支援多个关键词。                                                                                                                               |
| author      | 作者的名字                                                                                                                                                   |
| language    | 网站使用的语言。对于简体中文用户来说，使用不同的主题可能需要设置成不同的值，请参考你的主题的文档自行设置，常见的有 zh-Hans 和 zh-CN。                        |
| timezone    | 网站时区。Hexo 默认使用您电脑的时区。请参考 时区列表 进行设置，如 America/New_York, Japan, 和 UTC 。一般的，对于中国大陆地区可以使用 Asia/Shanghai，即上海。 |

## 静态页面生成

在使用 `hexo` 加 `server` 命令启动本地的服务器进行站点预览时，并不会在 `blog` 目录生成 HTML 文件；但 Hexo 提供了 `generate` 命令来生成对应的 HTML 文件方便用户部署或者查看效果。

```cmd
cd blog
hexo generate
```

Hexo 会在 `blog` 文件夹自动创建一个 `public` 目录并将用户编写的 Markdown 文章、`scaffolds` 模板以及主题相关必须文件转化成 HTML 等文件集中存放在 `public` 中。

## 主题修改

Hexo 相关社区的热心群众提供了众多主题让用户选择，通过应用不同的主题，可以对站点的布局、字体乃至整体风格进行定制，达到用户预期的效果。本节以著名的 NexT 为例来修改站点的主题。

### 安装主题

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

### 启用主题

启用主题的方法非常简单，打开站点配置文件，也就是 `blog` 文件夹中的 `_config.yml` 找到 `theme` 字段，默认情况下应该在 100 行的位置，将原来的 `theme: landscape` 改为 `theme: next` 即可。

启动本地服务器可以预览主题应用之后的效果。
