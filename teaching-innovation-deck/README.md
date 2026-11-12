# 教学创新设计汇报（课件源码）

《Python 程序设计》教学创新设计汇报的可维护源码。它不是独立发布的页面：仓库根目录的
`scripts/build_teaching_deck.py` 会把运行时复制到 `docs/innovation-report/`，随后由
MkDocs + GitHub Actions 发布到：

<https://anjingcuc.github.io/courses-wiki/innovation-report/>

课程说明页：<https://anjingcuc.github.io/courses-wiki/teaching-innovation/>

## 本地预览

```powershell
npx --yes hyperframes@0.8.200 present composition
```

打开 <http://localhost:3004>。翻页使用方向键、空格或右下角按钮；`P` 打开演讲者视图；
备查页使用 Previous 返回。

## 构建进站点

在仓库根目录执行：

```bash
python scripts/build_teaching_deck.py
uv run mkdocs build
```

`docs/innovation-report/` 是生成目录，不应手工修改；只改本目录后在仓库根目录重新构建。

## 内容边界

- 14 页主线 + 3 页答问备查，主讲约 9 分 30 秒。
- 三项能力：提出需求、发现问题、设计品味。
- 课程网站既是学习环境，也是课程改革的过程性证据；资源公开不等于学习成效。
- API 与代码审查页面是离线教学模拟，不调用真实服务，也不伪装成学生真实数据。
- 三项能力提升、终结性项目表现与外部采用效果仍待验证。

## 文件

```text
index.html                 静态演讲者外壳
composition/index.html     17 个场景与同一份幻灯片清单
composition/assets/        CSS、GSAP 时间线、交互脚本、本地字体
composition/sfx/           官方 present 外壳使用的本地静音导航音效
vendor/                    本地播放器与幻灯片组件
```

站点构建只复制运行所需的 16 个文件，不包含 QA 截图、验收报告或 HyperFrames 缓存。
