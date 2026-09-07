# V029 虚拟环境与 pipenv 工作流

## 视频信息

| 项目 | 内容 |
|---|---|
| 编号 | V029 |
| 标题 | 虚拟环境与 pipenv 工作流 |
| 目标时长 | 8 min |
| 对应课次 | L16 虚拟环境与依赖管理 |
| 前置微课 | V019 import 机制与模块基础 |
| 一句话定位 | 每个项目一间独立实验室——venv 创建、激活、装库、导出 requirements.txt 的完整工作流 |

---

## 逐字稿

### [0:00-0:35] 开场 hook（痛点共鸣 + 成果前置）

**【画面】** 终端里直接展示一个红色报错：`ERROR: requests 2.20.0 requires urllib3<1.24, but you have urllib3 2.0.7 which is incompatible.` 然后画面切换到两个并列的虚拟环境终端，一个装了 requests 2.20，一个装了 requests 2.31，各自运行正常。字幕条："装个库把别的搞坏了？"

**【旁白】** 你有没有遇到过这种情况——明明之前好好的项目，今天装了个新库，突然另一个项目就跑不了了。报错说"版本不兼容"。这就是没有用虚拟环境的后果。所有项目共用一个全局环境，牵一发而动全身。今天八分钟，我带你走完一个完整闭环：从创建虚拟环境、装库、导出依赖清单，到删掉环境再一键还原。学会这个，你就再也不会被依赖冲突折磨了。

### [0:35-2:15] 为什么需要虚拟环境

**【画面】** PPT 动画——左边画一个"共用厨房"，好几个厨师挤在一起，调料瓶混在一起互相打架；右边画一排"独立小厨房"，每个厨师用自己的调料，互不干扰。字幕条："全局环境 = 共用厨房 · 虚拟环境 = 独立小厨房"。

**【旁白】** 先搞清楚为什么需要虚拟环境。

你电脑上装好 Python 之后，默认有一个"全局环境"。你在终端里敲 `pip install requests`，库就装到全局环境里。所有项目共用这一份库。

问题来了——假设项目 A 需要 requests 2.20，项目 B 需要 requests 2.31。全局环境只能装一个版本。你给 B 装了 2.31，A 就崩了。这就是"共用厨房"的麻烦：大家共用一套调料，做川菜的要花椒，做粤菜的不要花椒，互相打架。

虚拟环境的解法很简单——给每个项目一间"独立小厨房"。项目 A 用自己的虚拟环境，装 requests 2.20；项目 B 用另一个虚拟环境，装 requests 2.31。互不干扰，各用各的。

我们来看一个直观的对比。现在终端里执行 `pip list`：

```bash
pip list
```

全局环境里可能装了几十个包。现在我们创建一个虚拟环境，进去之后再执行 `pip list`——你会发现里面干干净净，只有 pip 和 setuptools 两个。这就是"隔离"的物理含义。

### [2:15-3:45] venv 创建、激活、退出

**【画面】** VS Code 终端中操作。先创建项目目录，然后创建虚拟环境，激活后提示符从 `$` 变成 `(venv) $`。Windows 命令用字幕条补充显示。

**【旁白】** 创建虚拟环境只需要一条命令。先建一个项目目录：

```bash
mkdir -p ~/workspace/demo_project
cd ~/workspace/demo_project
```

然后创建虚拟环境——用 Python 自带的 `venv` 模块：

```bash
python -m venv venv
```

`python -m venv` 意思是用 Python 的 venv 模块来创建虚拟环境。后面的 `venv` 是虚拟环境文件夹的名字——习惯上都叫 venv。

创建完之后，当前目录下会多一个 `venv` 文件夹。接下来要"激活"它：

```bash
# Mac/Linux
source venv/bin/activate

# Windows PowerShell
# venv\Scripts\Activate.ps1

# Windows CMD
# venv\Scripts\activate.bat
```

激活成功后，终端提示符前面会多一个 `(venv)` 标记。看到这个标记，就说明你现在在虚拟环境里了。

来验证一下——在虚拟环境里执行：

```bash
which python
```

你会看到 python 指向的是 `demo_project/venv/bin/python`，而不是系统的 python。这说明现在的所有操作都在虚拟环境内部。

退出虚拟环境很简单——敲一个 `deactivate`：

```bash
deactivate
```

提示符的 `(venv)` 标记消失，回到全局环境了。

### [3:45-5:00] 在虚拟环境中安装依赖

**【画面】** 终端中重新激活虚拟环境，执行 `pip install requests openai pandas`。展示安装过程中终端的下载进度条。安装后执行 `pip list` 对比激活前后的差异。

**【旁白】** 退出之后我们再重新进去。激活虚拟环境后，所有 pip 操作都只影响这个虚拟环境，不会碰全局。我们来装几个实际项目要用的库：

```bash
source venv/bin/activate
pip install requests openai pandas
```

注意，在虚拟环境里装库和在全局装完全一样——命令没区别。区别在于装到哪里。虚拟环境里的安装是独立的，全局环境不受影响。

装完后看一下：

```bash
pip list
```

只有少量几个包——requests、openai、pandas 以及它们的依赖。跟全局环境里几十个包完全不同。这就是隔离的效果。

### [5:00-6:15] 导出与还原 requirements.txt

**【画面】** 终端执行 `pip freeze > requirements.txt`，然后用 `cat` 展示文件内容。接着模拟"换电脑"场景——deactivate、删除 venv、重建、从 requirements.txt 恢复。

**【旁白】** 装完依赖之后，最重要的一步——把依赖清单导出来。

```bash
pip freeze > requirements.txt
```

`pip freeze` 会列出当前环境里所有已安装的包和精确版本号，重定向到 requirements.txt 文件里。看一下内容：

```bash
cat requirements.txt
```

你会看到类似 `requests==2.31.0`、`openai==1.12.0`、`pandas==2.2.0` 这样的内容，每个包后面都锁定了版本号。

为什么这很重要？想象一个场景：你把代码传到 GitHub，同学 clone 下来想运行。他的电脑上没有这些库。怎么跑起来？只需要两条命令——创建虚拟环境，然后从 requirements.txt 一键安装：

```bash
pip install -r requirements.txt
```

`-r` 表示从文件读取。pip 会逐行读取 requirements.txt，按指定版本把所有库装好。我们来完整演示一次"换电脑重建"的过程。

先退出，删掉虚拟环境：

```bash
deactivate
rm -rf venv
```

现在什么都没了。重建：

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

一条 `pip install -r` 就把所有依赖恢复了。验证一下：

```bash
python -c "import requests, openai, pandas; print('所有依赖就绪')"
```

输出"所有依赖就绪"——从零到可运行，这就是标准流程。

### [6:15-7:15] .gitignore 与项目结构

**【画面】** 展示完整的项目目录树。然后用编辑器打开 `.gitignore`，高亮 `venv/` 这一行。对比展示——如果把 venv 提交到 Git 会膨胀几百 MB。

**【旁白】** 最后说一个关键细节——虚拟环境文件夹本身永远不要提交到 Git。

为什么？两个原因。第一，venv 文件夹通常有几十到几百 MB，全是二进制文件，提交上去仓库会变得非常大。第二，虚拟环境里的路径是绑死本机的——别人电脑上路径不同，拿来根本用不了。

正确的做法是在 `.gitignore` 里忽略它。项目目录结构应该是这样的：

```
demo_project/
├── venv/               # 虚拟环境（不进 Git）
├── .gitignore          # 忽略 venv/、.env、__pycache__/
├── requirements.txt    # 依赖清单（进 Git）
├── main.py             # 主程序
└── utils.py            # 工具模块
```

`.gitignore` 文件内容：

```gitignore
# 虚拟环境
venv/
.venv/

# Python 缓存
__pycache__/
*.pyc

# 环境变量（含 API Key，绝不提交）
.env

# IDE
.vscode/
.idea/
```

Git 里只放 requirements.txt 和代码，不放假大的 venv 文件夹。别人拿到代码后，自己创建虚拟环境、`pip install -r requirements.txt` 就能跑起来。这才是规范的项目交付方式。

### [7:15-7:45] 完整闭环回顾

**【画面】** 快速回放（快进）整个流程的终端操作：创建项目 → venv 创建 → 激活 → pip install → pip freeze → .gitignore。字幕条："建项目 → 建环境 → 装依赖 → 导清单 → 交接"。

**【旁白】** 回顾一下完整闭环：第一步，建项目目录。第二步，`python -m venv venv` 创建虚拟环境。第三步，激活后 `pip install` 装依赖。第四步，`pip freeze > requirements.txt` 导出清单。第五步，写 `.gitignore` 忽略 venv 文件夹。换电脑时，只需要建好环境然后 `pip install -r requirements.txt` 就能一键还原。记住这个流程，以后每个 Python 项目都这么做。

### [7:45-8:20] 小结 + 提问彩蛋 + 引出下集

**【画面】** 字幕条："venv 创建 · 激活/退出 · pip install · pip freeze → requirements.txt · .gitignore 忽略 venv/"。

**【旁白】** 三句话记住：虚拟环境给每个项目独立空间，requirements.txt 让依赖可复现，.gitignore 让仓库保持干净。

**【画面】** 提问彩蛋——字幕条逐条列出三个可直接照抄去问 Kimi / DeepSeek 的 prompt：

1. "我在学 Python 虚拟环境。请扮演面试官连续追问：为什么全局环境会发生版本冲突？激活 venv 后终端里到底发生了什么变化？"
2. "请给我设计一个动手实验：从建目录、python -m venv、激活、装库、pip freeze 导出到删除重建一键还原——只列任务步骤，不写具体命令，让我凭记忆做，做完再对答案。"
3. "请用「换电脑」的场景解释：为什么 venv 文件夹不能提交到 Git？为什么 requirements.txt 必须提交？"

**【旁白】** 这三条直接拿去问。命令忘了查一下就有，不用背；但"为什么要隔离、为什么清单能还原环境"这些为什么，要让它讲到你真能复述为止。懂了原理，命令才记得牢。

venv 够用了吗？对大多数项目来说够了。但数据科学和 AI 方向还有两个常用工具——conda 和 pipenv，它们有什么不同？下集我们快速对比，再讲讲 pip 镜像源配置和依赖冲突的诊断方法。

---

## 演示操作清单

### 项目结构

```
demo_project/
├── venv/               # 虚拟环境（不进 Git）
├── .gitignore
├── requirements.txt
└── main.py
```

### 完整操作流程

```bash
# === 1. 创建项目目录 ===
mkdir -p ~/workspace/demo_project
cd ~/workspace/demo_project

# === 2. 创建虚拟环境 ===
python -m venv venv

# === 3. 激活虚拟环境 ===
# Mac/Linux:
source venv/bin/activate
# Windows PowerShell:
# venv\Scripts\Activate.ps1
# Windows CMD:
# venv\Scripts\activate.bat

# === 4. 验证激活成功 ===
# Mac/Linux:
which python
# 应显示 .../demo_project/venv/bin/python
# Windows:
# where python

# === 5. 安装依赖 ===
pip install requests openai pandas

# === 6. 查看已安装的包 ===
pip list

# === 7. 导出依赖清单 ===
pip freeze > requirements.txt

# === 8. 查看清单内容 ===
cat requirements.txt

# === 9. 模拟换电脑：删除环境后还原 ===
deactivate
rm -rf venv

python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# === 10. 验证还原成功 ===
python -c "import requests, openai, pandas; print('所有依赖就绪')"

# === 11. 退出 ===
deactivate
```

### .gitignore 文件

```gitignore
# 虚拟环境
venv/
.venv/

# Python 缓存
__pycache__/
*.pyc

# 环境变量（含 API Key，绝不提交）
.env

# IDE
.vscode/
.idea/
```

### requirements.txt 示例内容

```text
certifi==2024.2.2
charset-normalizer==3.3.2
idna==3.6
numpy==1.26.4
openai==1.12.0
pandas==2.2.0
python-dateutil==2.8.2
pytz==2024.1
requests==2.31.0
six==1.16.0
tqdm==4.66.2
urllib3==2.0.7
```

### main.py 示例（验证依赖可用）

```python
import requests
import openai
import pandas as pd

print(f"requests 版本: {requests.__version__}")
print(f"openai 版本: {openai.__version__}")
print(f"pandas 版本: {pd.__version__}")
print("所有依赖就绪")
```

---

## 录制注意

1. **提前准备干净的演示目录**：录制前确保 `demo_project` 目录不存在或已清空，避免终端里出现旧残留干扰观众理解。可以提前在一个干净终端里走一遍全流程，确认 `python -m venv venv` 和 `pip install` 在当前环境下正常工作。
2. **Windows 命令用字幕条补充**：激活命令的 Windows 版本不需要切换系统演示，用字幕条或画中画展示即可。但一定要让 Mac 和 Windows 学生都知道激活命令不同。
3. **pip freeze 输出可能有版本差异**：录制时 `pip freeze` 的实际输出取决于当前 PyPI 版本，和脚本里的示例可能不完全一致——这是正常的，录制时以实际输出为准即可，不需要刻意对齐。
4. **时长控制**：核心闭环在第 5-7 分钟（导出还原 + .gitignore）。如果时间紧张，[6:15-7:15] 的项目结构部分可压缩为 30 秒——只展示目录树和 `.gitignore` 里的 `venv/` 一行即可。重点是让观众记住"venv 文件夹不进 Git"这一条。
5. **提问彩蛋字幕条**：提问彩蛋段的 prompt 字幕条需在后期加上，确保观众能暂停照抄。
