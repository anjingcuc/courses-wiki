# W07 爬虫数据可视化：可运行 UV 案例

这是 **W07-B 虚拟环境与综合作业**使用的教学合成案例，模拟爬虫结果的字段结构，不是真实抓取的知乎数据。W07-A 使用另一组 9 行天气微样例讲解数据处理机制。正式作业优先使用你在 W06 合规取得且允许使用的数据。

**[下载完整 UV 案例包（含锁文件与 data 目录）](../w07-case.zip)**。解压后保留目录结构即可运行，无需逐个下载或移动文件。

## 文件

- `data/answers.csv`：10 行合成回答数据，包含匿名合集与缺失点赞。根目录的 `answers.csv` 是同一文件的便捷下载别名；项目脚本读取 `data/answers.csv`。
- `visualize.py`：清洗、按作者汇总、保存横向柱状图，并打印环境证据。
- `numpy_probe.py`：比较 NumPy 历史版本中的 `np.float_` API。
- `conflict-requirements.txt`：两个互斥的 NumPy 精确约束，仅用于解析实验。
- `pyproject.toml`、`.python-version`、`uv.lock`：UV 项目声明、默认 Python 请求与锁定结果。
- `.gitignore`：排除 `.venv/`、缓存与输出目录。

下载时请保留目录结构。`.venv/` 与 `output/` 在本地生成，不需要下载或提交。

## 在 UV 中运行

在本目录执行：

```powershell
uv sync --locked
uv run --locked python visualize.py
```

脚本使用 `Path(__file__)` 定位数据，使用 Matplotlib `Agg` 后端保存 `output/top_authors.png`，不会弹窗。请实际打开 PNG 检查中文和布局。

确认解释器与 NumPy 来自本项目：

```powershell
uv run --locked python -c "import sys, numpy; print(sys.executable); print(sys.prefix != sys.base_prefix); print(numpy.__version__); print(numpy.__file__)"
```

## 两个安全的 NumPy 实验

约束解析只会输出求解结果，不向全局 Python 安装包。以下命令返回退出码 1 是预期的“约束无解”：

```powershell
uv pip compile --python 3.12 conflict-requirements.txt
```

比较两个历史版本的 API 差异：

```powershell
uv run --no-project --python 3.12 --with numpy==1.26.4 python numpy_probe.py
uv run --no-project --python 3.12 --with numpy==2.0.2 python numpy_probe.py
```

这些命令会使用 UV 的缓存和受管 Python，可能下载运行时或 wheel，但不向系统 Python / Miniconda 安装包。1.26.4 与 2.0.2 只用于复现历史差异，不是新项目的版本建议。

## 在 DeepSeek Harness 中协作

先把本目录选为工作区，再让 Agent 审查项目声明、运行命令和实际输出。推荐每次使用 `uv run --locked`，不要假设上一次工具调用里的 `Activate.ps1` 会延续到下一次 fresh shell。

本案例不需要全局 `pip install`，不绕过审批，不访问真实第三方网站。
