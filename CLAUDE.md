# CLAUDE.md

本文档为 Claude Code 提供项目上下文，帮助理解和操作此课程网站项目。

## 项目概述

这是一个教学课件网站项目，使用以下技术栈：

- **MkDocs**: 静态网站生成框架
- **reveal.js**: 幻灯片展示框架
- **ECharts Tree**: 思维导图展示（通过 CDN 引入）
- **GitHub Pages**: 托管部署

## 目录结构

```
courses-wiki/
├── docs/                      # 课程内容源文件
│   ├── img/                   # 共享图片资源
│   ├── javascripts/           # 自定义 JavaScript
│   ├── stylesheets/           # 自定义 CSS
│   ├── aissop/                # 智能系统安全运维与实践
│   ├── python/                # Python 程序设计
│   ├── web/                   # 网页设计与制作
│   ├── online-publishing/     # 在线出版
│   ├── apdms/                 # 数字媒体安全应用与实践
│   ├── wps/                   # AI-WPS 辅助办公
│   └── substitute/            # 临时代课内容
├── material/                  # 自定义 MkDocs 主题
│   ├── assets/                # 静态资源
│   │   ├── reveal/            # reveal.js 框架文件
│   │   ├── fonts/
│   │   └── images/
│   ├── partials/              # 模板片段
│   ├── base.html              # 基础布局模板
│   ├── slideshow.html         # 幻灯片模板
│   └── mkdocs_theme.yml       # 主题配置
├── charts/                    # Visio 图表源文件
├── mkdocs.yml                 # MkDocs 主配置
├── pyproject.toml             # Python 依赖（uv 包管理）
└── .github/workflows/         # CI/CD 配置
```

## 课程清单

| 课程代码 | 课程名称 | 章节数 |
|---------|---------|-------|
| aissop | 智能系统安全运维与实践 | 11 |
| python | Python 程序设计 | 15 |
| web | 网页设计与制作 | 13 |
| online-publishing | 在线出版 | 7 |
| apdms | 数字媒体安全应用与实践 | 4 |
| wps | AI-WPS 辅助办公 | 1 |
| substitute | 临时代课 | 2 |

## 课件结构

每个课件目录包含：

- `slide.txt` - 幻灯片内容（Markdown 格式，供 reveal.js 渲染）
- 对应的 `.md` 文件 - 课程说明页面（MkDocs 渲染，可选）

### slide.txt 格式规范

```markdown
<style type="text/css">
  .reveal p { text-align: left; font-size: 0.8em; }
  .reveal ul { display: block; }
</style>

# 标题幻灯片

---

## 第一节标题

--

### 子节内容

内容详情...

---

## Q & A
```

**分隔符说明：**

- `---` - 水平分隔（主要幻灯片）
- `--` - 垂直分隔（子幻灯片）

**常用样式注释：**

```markdown
<!-- .element style="font-size:70%"-->
<!-- .element: style="width:60%;" -->
<!-- .element style="text-align:center"-->
```

**图片引用：**

```markdown
![描述](/img/filename.jpg)
![描述](/img/filename.jpg)<!-- .element: style="width:70%;" -->
```

**视频嵌入：**

```markdown
<video src="filename.mp4" controls="controls">
  你的浏览器不支持 video 标签。
</video>
```

**代码块：**

```markdown
\`\`\`python
import os
print("Hello, World!")
\`\`\`
```

**链接与PDF引用：**

```markdown
[链接文字](https://example.com)
[PDF文档](./document.pdf)
```

## 构建与部署

### 本地开发

```bash
# 安装依赖（使用 uv）
uv sync

# 或使用 pip
pip install mkdocs pygments pyyaml

# 本地预览
mkdocs serve

# 构建静态文件
mkdocs build
```

### 创建幻灯片符号链接（Windows）

```powershell
# 在所有课件目录创建 slideshow.html 符号链接
.\mklinks.ps1
```

这使每个课件目录可以直接通过 `slideshow.html` 访问幻灯片模板。

### CI/CD 流程

推送到 master/main 分支后，GitHub Actions 自动执行：

1. 安装 MkDocs 和 Pygments（Python 3.12）
2. 替换图片路径（适配 GitHub Pages 子目录）
   - `docs/` 下所有 `.txt` 和 `.md` 文件中的 `/img/` → `/courses-wiki/img/`
   - `material/slideshow.html` 中的 `/assets/` → `/courses-wiki/assets/`
3. 执行 `mkdocs gh-deploy --force` 部署

缓存策略：使用基于周数的缓存 key (`mkdocs-material-{周数}`)

### 部署目标

- **GitHub Pages**: <https://anjingcuc.github.io/courses-wiki/>

## 关键配置文件

### mkdocs.yml

```yaml
site_name: 课程资料
theme:
  name: null
  custom_dir: "material"      # 使用自定义主题
  language: "zh"
markdown_extensions:
  - codehilite:
      linenums: true
extra_css:
  - stylesheets/custom.css
extra_javascript:
  - javascripts/custom.js
```

### slideshow.html 核心配置

- 主题: `simple.css`
- 代码高亮: `solarized-light`
- 插件: markdown, highlight, notes, zoom
- 数据源: `slide.txt`

**reveal.js 配置项：**

```javascript
{
  controls: true,        // 显示控制箭头
  progress: true,        // 显示进度条
  slideNumber: "c/t",    // 显示幻灯片编号
  history: true,         // 添加到浏览器历史
  center: true,          // 垂直居中
  transition: "default"  // 过渡效果
}
```

## 常见任务

### 新增课件

1. 在 `docs/<课程代码>/` 下创建新目录
2. 创建 `slide.txt` 文件
3. 如需要，创建对应的 `.md` 说明文件
4. 更新 `mkdocs.yml` 导航（如需要）

### 修改主题样式

- 主题模板: `material/base.html`, `material/slideshow.html`
- 幻灯片主题: `material/assets/reveal/css/theme/simple.css`
- 自定义样式: `docs/stylesheets/custom.css`

### 更新 reveal.js

替换 `material/assets/reveal/` 目录下的文件。

## 注意事项

1. **图片路径**: 本地使用 `/img/`，CI 会自动替换为 `/courses-wiki/img/`
2. **中文支持**: 确保文件编码为 UTF-8
3. **代码高亮**: 使用 Pygments，支持行号显示
4. **思维导图**: 使用 ECharts Tree，通过 CDN 引入，在课程页面中嵌入
5. **幻灯片导航**:
   - 方向键 / 空格：切换幻灯片
   - ESC：概览模式
   - S：演讲者模式
   - ?：帮助
6. **大文件管理**: 使用 Git LFS 管理大型二进制文件

## 技术演进历史

项目经历以下技术栈演进：

- **思维导图**: jsMind → AntV G6 → simple-mind-map → ECharts Tree
- **包管理**: pipenv → uv

## 课件统计数据

- 课件总数：53 个 slide.txt 文件
- 课程数量：7 门
- 图片资源：183 个文件（docs/img/ 目录）
