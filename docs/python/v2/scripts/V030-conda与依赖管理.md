# V030 conda 与依赖管理

## 视频信息

| 项目 | 内容 |
|---|---|
| 编号 | V030 |
| 标题 | conda 与依赖管理 |
| 目标时长 | 7 min |
| 对应课次 | L16 虚拟环境与依赖管理 |
| 前置微课 | V029 虚拟环境与 pipenv 工作流 |
| 一句话定位 | conda 速览 + pip 镜像源配置 + 依赖冲突的诊断方法 |

---

## 逐字稿

### [0:00-0:30] 开场 hook（成果前置）

**【画面】** 终端里 `pip install` 卡在下载进度条上，十几秒不动。然后画面一切，配置镜像源后同样的安装秒下完。字幕条："为什么你的 pip 装库这么慢？" 紧接着展示一个依赖冲突报错丢给 AI，AI 给出解决方案。

**【旁白】** 上集学了 venv 虚拟环境，你已经能做项目隔离了。但实际开发中还有两个常见痛点：装库太慢，以及依赖冲突报错看不懂。这集七分钟，解决三个问题——pip 镜像源加速、conda 和 pipenv 到底该不该用、遇到依赖冲突怎么办。

### [0:30-2:00] pip 镜像源配置

**【画面】** 终端中先执行 `pip install requests`，展示下载速度很慢或超时。然后执行 `pip config set global.index-url`，再安装一个包，速度明显变快。展示临时指定和永久配置两种方式。

**【旁白】** 先解决最实际的问题——装库慢。

你在国内用 pip install 的时候，默认从 PyPI 官方服务器下载，服务器在国外，速度经常很慢甚至超时。解决办法是换国内镜像源——相当于从国内的服务器下载同一个文件，速度快十倍。

两种方式。第一种，临时指定——在安装命令后面加 `-i` 参数：

```bash
pip install requests -i https://pypi.tuna.tsinghua.edu.cn/simple
```

`-i` 后面跟的是清华大学的镜像地址。每次装库都要带这个参数，有点麻烦。

第二种，永久配置——一劳永逸：

```bash
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```

这会把镜像源写到 pip 的配置文件里。之后所有的 `pip install` 默认走清华源，不用再手动加参数了。来验证一下：

```bash
pip install rich
```

速度明显变快了。常用的国内镜像源还有几个，比如阿里源、豆瓣源，地址不同但效果一样，选一个离你近的就行。这些地址我放在演示清单里，你不用背。

### [2:00-3:20] conda 速览

**【画面】** PPT 对比表格——左边 venv（纯 Python，轻量），右边 conda（自带科学计算库，适合数据科学/AI）。然后终端演示 conda create 基本命令。字幕条："conda = venv + 科学计算库全家桶"。

**【旁白】** 上集我们统一用 venv。你可能听说过另一个工具叫 conda，它有什么不同？

conda 是 Anaconda 发行版里的环境管理工具。和 venv 最大的区别是——venv 只管 Python 包，conda 还能管底层的非 Python 依赖，比如 C 库。所以做数据科学和 AI 方向的同学很多人喜欢用它，因为它自带了 numpy、pandas、scipy 这些科学计算库，装好 Anaconda 就全有了。

基本命令长这样：

```bash
# 创建 conda 环境
conda create -n myenv python=3.11

# 激活
conda activate myenv

# 装库
conda install numpy pandas

# 退出
conda deactivate
```

你看，和 venv 的流程几乎一样——创建、激活、装库、退出，只是命令名不同。但 conda 比较重，安装包就有好几个 G。如果你不做重度数据科学，venv 完全够用。

### [3:20-4:20] pipenv 简述

**【画面】** 对比展示三种工具的核心差异。左边 venv + requirements.txt，中间 pipenv（Pipfile + Pipfile.lock），右边 conda。用高亮标注每种工具的"自动"特性。

**【旁白】** 再提一个工具——pipenv。它把虚拟环境和依赖管理合二为一了。

用 venv 的时候，你得手动创建环境、手动激活、手动 pip freeze 导出。pipenv 把这些全自动化了。在项目目录里敲一句 `pipenv install requests`，它会自动创建虚拟环境、自动装库、自动生成 Pipfile 和 Pipfile.lock 两个文件——前者记录依赖，后者锁定精确版本，保证不同机器环境一致。

但 pipenv 偶尔有兼容性和速度问题。所以本课程的结论是——**统一用 venv + requirements.txt**。它够用、标准、被所有团队接受。conda 和 pipenv 是进阶选项，等你做复杂项目了再考虑。

### [4:20-5:50] 依赖冲突诊断（AI 辅助）

**【画面】** 终端中制造一个依赖冲突报错——红色大段报错信息。然后把完整报错复制粘贴到 AI 对话窗口（DeepSeek），AI 返回分析和解决方案。再回到终端按方案操作。字幕条："冲突了？丢给 AI，但它的方案要审查"。

**【旁白】** 最后讲一个实战技能——遇到依赖冲突怎么办。

依赖冲突是什么意思？比如你装了 A 库，A 依赖 requests 2.20。你又装了 B 库，B 依赖 requests 2.31。两个要求的版本打架了，pip 不知道该装哪个，就报错。

来看一个真实的报错：

```text
ERROR: pip's dependency resolver:
requests 2.20.0 requires urllib3<1.24, but you have urllib3 2.0.7
which is incompatible.
```

新手看到这种报错很容易懵——urllib3 是什么？1.24 又是什么意思？

别慌。把完整报错信息复制，粘贴给 AI。我用 DeepSeek 来演示。给它发这段报错，配一句话提示：

```text
我在安装库时遇到这个报错，请解释原因并给出解决方案：
ERROR: pip's dependency resolver:
requests 2.20.0 requires urllib3<1.24, but you have urllib3 2.0.7
which is incompatible.
```

AI 会告诉你——requests 2.20 这个老版本依赖 urllib3 的旧版本，但你系统上已经装了新版的 urllib3 2.0.7，两者不兼容。然后它会给方案。

但注意——AI 给的方案一定要审查。如果 AI 说"卸载 urllib3 然后装旧版"，你要警惕：这可能破坏其他依赖！正确做法通常是创建一个新的虚拟环境，在里面干净地安装。

所以核心原则是——一个项目一个虚拟环境，不要在全局环境里乱装。大部分依赖冲突的根源就是全局环境太乱了。冲突了？丢给 AI 看，理解它说的原因，但执行方案前要想一想是否安全。

### [5:50-6:45] 完整闭环：镜像源 + 冲突诊断

**【画面】** 快速回放终端操作：配置镜像源 → 安装包（快速） → 制造冲突报错 → 丢给 AI → 在新 venv 中解决。字幕条："配镜像 → 装库 → 冲突？问 AI → 新环境隔离"。

**【旁白】** 回顾一下这集的完整闭环。第一步，永久配置 pip 镜像源，一行命令搞定，之后装库速度翻十倍。第二步，了解 conda 和 pipenv 的定位——conda 适合数据科学全家桶，pipenv 自动化程度高，但课程统一推荐 venv。第三步，遇到依赖冲突，把报错丢给 AI，理解原因，但方案要自己审查。核心原则始终是——一个项目一个虚拟环境。

### [6:45-7:20] 小结 + 提问彩蛋 + 引出下集

**【画面】** 字幕条："镜像源加速 · conda/pipenv 了解即可 · 冲突丢给 AI 但要审查 · 统一用 venv + requirements.txt"。

**【旁白】** 三句话总结：镜像源让装库变快，conda 和 pipenv 了解即可，依赖冲突丢给 AI 但要审查。

**【画面】** 提问彩蛋——字幕条逐条列出三个可直接照抄去问 Kimi / DeepSeek 的 prompt：

1. "请解释 pip 镜像源的原理：为什么换清华源下载就变快了？永久配置和临时加 -i 参数各适合什么场景？"
2. "请对比 venv、conda、pipenv 三个工具的定位差异，各举一个最适合的使用场景，然后出 3 道场景选择题考我，我答完再点评。"
3. "我稍后贴一段 pip 依赖冲突报错给你。请先带我逐句读懂报错的每一行，引导我自己提出解决方案，最后你再点评我的方案靠不靠谱。"

**【旁白】** 最后这条尤其推荐——以后遇到报错别只丢给 AI 要方案。先让它带你逐句读懂报错，再让你自己开方子、它来点评。方案它会给，判断力得你自己长。

到这里，环境搭建就全讲完了——你能创建虚拟环境、装依赖、导出清单、换镜像源、诊断冲突。但环境搭好了，代码写得好不好？AI 生成的代码能直接用吗？下集我们学代码质量与测试。

---

## 演示操作清单

### 演示1：pip 镜像源配置

```bash
# === 临时指定镜像源（单次安装） ===
pip install requests -i https://pypi.tuna.tsinghua.edu.cn/simple

# === 永久配置镜像源（推荐） ===
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple

# === 验证配置生效 ===
pip install rich
python -c "import rich; print(f'rich 版本: {rich.__version__}')"

# === 查看当前 pip 配置 ===
pip config list
```

### 常用国内镜像源

```text
# 清华大学（推荐）
https://pypi.tuna.tsinghua.edu.cn/simple

# 阿里云
https://mirrors.aliyun.com/pypi/simple/

# 中国科技大学
https://pypi.mirrors.ustc.edu.cn/simple/

# 豆瓣
https://pypi.douban.com/simple/
```

### 演示2：conda 基本命令（如已安装 conda）

```bash
# === 创建 conda 环境 ===
conda create -n myenv python=3.11

# === 激活 ===
conda activate myenv

# === 装库 ===
conda install numpy pandas matplotlib

# === 查看已安装的包 ===
conda list

# === 退出 ===
conda deactivate

# === 删除环境 ===
conda env remove -n myenv

# === 列出所有 conda 环境 ===
conda env list
```

### 演示3：pipenv 基本命令（选做）

```bash
# === 安装 pipenv ===
pip install pipenv

# === 在项目目录中安装依赖（自动创建虚拟环境） ===
cd ~/workspace/demo_project
pipenv install requests

# === 进入虚拟环境 shell ===
pipenv shell

# === 运行 Python 脚本 ===
pipenv run python main.py

# === 查看依赖关系图 ===
pipenv graph
```

### 演示4：依赖冲突诊断（AI 辅助）

```bash
# === 模拟依赖冲突 ===
# 先装一个旧版本 requests
pip install requests==2.20

# 再装一个需要新版 urllib3 的库
pip install urllib3==2.0.7

# 此时 pip 可能报出冲突警告
```

将报错信息粘贴给 AI（DeepSeek），使用以下 Prompt：

```text
我在安装库时遇到这个报错，请解释原因并给出解决方案：

ERROR: pip's dependency resolver:
requests 2.20.0 requires urllib3<1.24, but you have urllib3 2.0.7
which is incompatible.
```

### 演示5：正确解决依赖冲突

```bash
# === 错误做法：在全局环境强行降级（可能破坏其他项目） ===
# pip uninstall urllib3 && pip install urllib3==1.23  ← 不要这样做！

# === 正确做法：在新虚拟环境中隔离 ===
cd ~/workspace/demo_project
python -m venv venv
source venv/bin/activate
# Windows: venv\Scripts\Activate.ps1

# 干净安装，让 pip 自己解决版本依赖
pip install -r requirements.txt

# 验证
python -c "import requests; print(f'requests 版本: {requests.__version__}')"
```

---

## 录制注意

1. **镜像源演示要真实对比**：录制前先在全局环境卸载一个包（如 `pip uninstall rich -y`），录制时先不配镜像源装一次（展示慢），再配镜像源装一次（展示快）。如果网络条件不允许对比，可以直接展示配置命令并口述效果，不要刻意制造超时画面。
2. **conda 和 pipenv 演示点到为止**：不需要完整演示 conda 和 pipenv 的全流程。展示 2-3 条核心命令即可，重点是让观众"有印象"，知道有这些工具。核心结论是"统一用 venv"，不要让观众纠结选型。
3. **依赖冲突报错可以用预设文本**：真实制造依赖冲突有时不稳定（pip 可能自动解决），可以提前准备好报错文本，用终端 `cat error.txt` 展示，再复制到 AI 对话窗口。AI 回复以实际为准，不需要提前写死。
4. **时长控制**：镜像源配置（Part 1）是最高频实用的内容，确保讲透。conda/pipenv（Part 2-3）如果时间紧可各压缩到 40 秒，只展示命令和一句话定位。依赖冲突诊断（Part 4）是 AI 协作线的重点，不要砍。
5. **提问彩蛋字幕条**：提问彩蛋段的 prompt 字幕条需在后期加上，确保观众能暂停照抄。
