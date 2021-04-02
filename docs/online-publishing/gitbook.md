---
title: Gitbook
---

**下方课件区域方向键控制翻页，`f` 键全屏。**

<iframe src="./slideshow.html" frameborder=0 width=800 height=450></iframe>

## Gitbook 安装

### 安装依赖

与 Hexo 一样，Gitbook 需要安装 Nodejs 以及 Git：

- Nodejs, 运行基础环境，并提供 npm 实现安装；
- Git, Nodejs 的包管理工具依赖 Git 实现包下载。

其中 Nodejs 建议下载历史版本 `v12.21.0 LTS` 最新版本在运行 gitbook 时存在一些为解决的 Bug 。

### 安装 Gitbook

使用 Nodejs 自带的包管理器 npm 来自动下载 Gitbook 的命令行工具 gitbook-cli，打开 Windows 命令行运行以下代码：

```shell
npm install -g gitbook-cli@2.1.2
```

其中 npm 是 Nodejs 的包管理工具，`install` 是执行安装命令；`-g` 参数说明是全局安装，也就是安装完成后会自动将 gitbook 加入环境变量直接使用；`gitbook-cli@2.1.2` 是安装目标及其版本号，也就是安装了 2.1.2 版本的 gitbook 命令行工具的名字，因为最新版本有一些 Bug 没有修复会影响我们的使用。

安装完成后在命令行输入：

```shell
gitbook current
```

会自动开始获取最新的 gitbook ，本文档撰写是默认获取的版本时 `3.2.3`：

```shell
gitbook current
```

安装成功输出如下：

```shell
Installing GitBook 3.2.3
gitbook@3.2.3 AppData\Local\Temp\tmp-13460cfMFZAY9GyvH\node_modules\gitbook
├── escape-string-regexp@1.0.5
├── escape-html@1.0.3
├── destroy@1.0.4
├── ignore@3.1.2
├── bash-color@0.0.4
├── gitbook-plugin-livereload@0.0.1
├── cp@0.2.0
├── graceful-fs@4.1.4
├── nunjucks-do@1.0.0
├── github-slugid@1.0.1
├── q@1.4.1
├── spawn-cmd@0.0.2
├── gitbook-plugin-fontsettings@2.0.0
├── direction@0.1.5
├── is@3.3.0
├── open@0.0.5
├── object-path@0.9.2
├── extend@3.0.2
├── json-schema-defaults@0.1.1
├── gitbook-plugin-search@2.2.1
├── jsonschema@1.1.0
├── crc@3.4.0
├── urijs@1.18.0
├── semver@5.1.0
├── front-matter@2.3.0
├── immutable@3.8.2
├── dom-serializer@0.1.0 (domelementtype@1.1.3, entities@1.1.2)
├── npmi@2.0.1 (semver@4.3.6)
├── error@7.0.2 (xtend@4.0.2, string-template@0.2.1)
├── omit-keys@0.1.0 (isobject@0.2.0, array-difference@0.0.1)
├── tmp@0.0.28 (os-tmpdir@1.0.2)
├── mkdirp@0.5.1 (minimist@0.0.8)
├── send@0.13.2 (fresh@0.3.0, etag@1.7.0, range-parser@1.0.3, statuses@1.2.1, ms@0.7.1, depd@1.1.2, debug@2.2.0, mime@1.3.4, http-errors@1.3.1, on-finished@2.3.0)
├── resolve@1.1.7
├── rmdir@1.2.0 (node.flow@1.2.3)
├── fresh-require@1.0.3 (is-require@0.0.1, shallow-copy@0.0.1, sleuth@0.1.1, astw@1.3.0, through2@0.6.5, acorn@0.9.0, escodegen@1.14.3)
├── gitbook-plugin-theme-default@1.0.7
├── js-yaml@3.14.1 (esprima@4.0.1, argparse@1.0.10)
├── cpr@1.1.1 (rimraf@2.4.5)
├── tiny-lr@0.2.1 (parseurl@1.3.3, livereload-js@2.4.0, qs@5.1.0, debug@2.2.0, body-parser@1.14.2, faye-websocket@0.10.0)
├── gitbook-plugin-lunr@1.2.0 (html-entities@1.2.0, lunr@0.5.12)
├── chokidar@1.5.0 (async-each@1.0.3, path-is-absolute@1.0.1, inherits@2.0.4, glob-parent@2.0.0, is-binary-path@1.0.1, is-glob@2.0.1, anymatch@1.3.2, readdirp@2.2.1)
├── nunjucks@2.5.2 (asap@2.0.6, yargs@3.32.0, chokidar@1.7.0)
├── gitbook-plugin-highlight@2.0.2 (highlight.js@9.2.0)
├── moment@2.13.0
├── gitbook-plugin-sharing@1.0.2 (lodash@3.10.1)
├── read-installed@4.0.3 (debuglog@1.0.1, util-extend@1.0.3, slide@1.1.6, readdir-scoped-modules@1.1.0, read-package-json@2.1.2)
├── i18n-t@1.0.1 (lodash@4.17.21)
├── cheerio@0.20.0 (entities@1.1.2, css-select@1.2.0, htmlparser2@3.8.3, jsdom@7.2.2, lodash@4.17.21)
├── gitbook-asciidoc@1.2.2 (gitbook-html@1.3.3, asciidoctor.js@1.5.5-1, lodash@4.17.21)
├── gitbook-markdown@1.3.2 (kramed-text-renderer@0.2.1, gitbook-html@1.3.3, kramed@0.5.6, lodash@4.17.21)
├── request@2.72.0 (aws-sign2@0.6.0, tunnel-agent@0.4.3, oauth-sign@0.8.2, forever-agent@0.6.1, is-typedarray@1.0.0, caseless@0.11.0, stringstream@0.0.6, aws4@1.11.0, isstream@0.1.2, json-stringify-safe@5.0.1, tough-cookie@2.2.2, qs@6.1.2, node-uuid@1.4.8, combined-stream@1.0.8, mime-types@2.1.29, bl@1.1.2, hawk@3.1.3, har-validator@2.0.6, http-signature@1.1.1, form-data@1.0.1)
├── juice@2.0.0 (deep-extend@0.4.2, slick@1.12.2, batch@0.5.3, cssom@0.3.1, commander@2.9.0, cross-spawn-async@2.2.5, web-resource-inliner@2.0.0)
└── npm@3.9.2
GitBook version is 3.2.3
```

此时运行 `gitbook -V` 可以查看版本，注意 `-V` 中的 `V` 字母大写，输出结果如下（版本号可能有差异）：

```shell
CLI version: 2.3.2
GitBook version: 3.2.3
```

### 异常

如果你的 Nodejs 或者 gitbook-cli 版本不是上述的版本而是最新版本，可能会出现以下报错：

```shell
Installing GitBook 3.2.3
C:\Users\anjing\AppData\Roaming\npm\node_modules\gitbook-cli\node_modules\npm\node_modules\graceful-fs\polyfills.js:287
      if (cb) cb.apply(this, arguments)
                 ^

TypeError: cb.apply is not a function
    at C:\Users\anjing\AppData\Roaming\npm\node_modules\gitbook-cli\node_modules\npm\node_modules\graceful-fs\polyfills.    at FSReqCallback.oncomplete (fs.js:184:5)
```

这个报错是因为 gitbook 自动安装过程中使用了一个叫做 `graceful-fs` 的第三方包，这个包存在的 bug 引起了这个报错，只要将 `graceful-fs` 升级到最新版本就可以解决，我们进入到报错里面提到的 `C:\Users\anjing\AppData\Roaming\npm\node_modules\gitbook-cli\node_modules\npm\node_modules\` 目录进行升级：

```shell
cd C:\Users\anjing\AppData\Roaming\npm\node_modules\gitbook-cli\node_modules\npm\node_modules\

npm install graceful-fs@latest --save
```

完成升级后，再次运行获取当前稳定版本即可。

## 创建一本书

类似在 Hexo 创建博客时一样，如果你要创建一本电子书或者在线书籍，那么首先你需要创建一个存在该书的文件夹，并使用 gitbook 对应的命令来初始化相应的文件。比如我们在桌面上创建一个 `book` 目录，这个目录的完整路径是 `C:\Users\anjing\Desktop\book` 那么我们执行以下命令来完成初始化：

```shell
cd C:\Users\anjing\Desktop\book

gitbook init
```

此时 gitbook 会自动在 `book` 文件夹中创建两个文件，目录文件 `SUMMARY.md` 以及第一章引言 `README.md` 。初始化后，`SUMMARY.md` 内默认内容为：

```markdown
# Summary

- [Introduction](README.md)
```

即目录标题为 `Summary` 然后书籍的第一章叫做 `Introduction` 对应的文件是 `README.md` 。

### 修改目录结构

通过对 `SUMMARY.md` 文件进行修改，我们可以改变本书的章节编排，并使用 `gitbook init` 命令来自动创建对应的文件。

比如我们将 `SUMMARY.md` 的内容改为以下状态：

```markdown
# Summary

- [引言](README.md)
- [第一章](chapter01/README.md)
  - [第一节](chapter01/1-1.md)
  - [第二节](chapter01/1-2.md)
- [第二章](chapter02/README.md)
  - [第一节](chapter02/2-1.md)
  - [第二节](chapter02/2-2.md)
- [第三章](chapter03/README.md)
  - [第一节](chapter03/3-1.md)
  - [第二节](chapter03/3-2.md)
```

然后在这个目录中执行 `gitbook init` 命令，此时 gitbook 会自动创建一系列的文件夹和文件来对应目录文件中的内容：

```
.
├─ README.md
├─ SUMMARY.md
│
├─ chapter01
│   ├─ 1-1.md
│   ├─ 1-2.md
│   └─ README.md
│
├─ chapter02
│   ├─ 2-1.md
│   ├─ 2-2.md
│   └─ README.md
│
└─ chapter03
    ├─ 3-1.md
    ├─ 3-2.md
    └─ README.md
```

## 输出

Gitbook 支持多种输出，包括静态网站、PDF 以及其他电子书格式。

### 静态网站

### PDF

## 发布


