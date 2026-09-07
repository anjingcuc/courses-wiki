# V003 Python 与 VSCode 安装速通

## 视频信息

| 项目 | 内容 |
|---|---|
| 编号 | V003 |
| 标题 | Python 与 VSCode 安装速通 |
| 目标时长 | 7 min |
| 对应课次 | L2 AI辅助学习法与环境初配 |
| 前置微课 | V002 用大模型学编程的正确姿势 |
| 一句话定位 | 7 分钟带你装好 Python + VSCode，跨过编程学习第一道劝退坎 |

---

## 逐字稿

### [0:00–0:30] 开场 Hook

**【画面】** 屏幕上弹出一行弹幕风格的文字：`装环境 = 编程学习第一道劝退坎`。随后快速快进播放一段安装过程的预览（3 秒），最后画面定格在 `python --version` 输出 `Python 3.12.x` 的终端画面。

**【旁白】**
学编程最大的拦路虎不是语法有多难，而是——环境装不上。很多人在装 Python 这一步就放弃了。今天我用 7 分钟，带你把 Python 和 VSCode 一次装好，让你在课程结束前就能写出第一行代码。跟着做，不难。

---

### [0:30–2:30] Python 安装（Windows 为例）

**【画面】** 录屏：打开浏览器，访问 `python.org/downloads`，点击下载按钮。双击安装包。画面放大聚焦到 "Add Python to PATH" 勾选框，旁边打上红色星号标注 ★★★。点击 Install Now，等待完成。

**【旁白】**
第一步，装 Python。打开浏览器，访问 python.org，点 Downloads，页面会自动推荐适合你系统的版本，点下载就行。下载完双击运行安装包，这时候注意——屏幕最关键的一步来了。

看到这个 "Add Python to PATH" 的勾选框没有？一定要勾上！一定要勾上！一定要勾上！不勾的话，你后面在命令行输入 python，系统会告诉你"找不到这个命令"。这是初学者踩得最多的坑，没有之一。勾上之后，点 Install Now，等它跑完，点 Close。

Mac 用户说一下：去 python.org 下载 macOS 安装包，双击安装就行。或者如果你装了 Homebrew，终端里直接 `brew install python` 更方便。装完之后，Mac 上验证用的是 `python3` 而不是 `python`，记住这个区别。

---

### [2:30–3:30] 验证 Python 安装

**【画面】** 录屏：打开命令提示符（Win+R → cmd）。输入 `python --version`，画面定格在输出 `Python 3.12.x`。再输入 `pip --version`，画面定格在版本输出。

**【旁白】**
装完了，怎么确认装好了？打开命令行——Windows 按 Win+R，输入 cmd，回车。然后输入 `python --version`。如果看到 `Python 3.12` 或者更高的版本号，恭喜，Python 装好了。再输入 `pip --version`。pip 是 Python 的包管理工具，后面装第三方库全靠它。如果两个命令都有正常输出，Python 这关就算过了。

如果你看到的是"不是内部或外部命令"，说明刚才那个 PATH 没勾——重新运行安装包，勾上 Add to PATH，再装一遍就行。

---

### [3:30–5:00] VSCode 安装

**【画面】** 录屏：打开浏览器，访问 `code.visualstudio.com`，点击 Download。选择系统版本，下载。双击安装，一路 Next。打开 VSCode。

**【旁白】**
第二步，装编辑器。我们用 VSCode，全称 Visual Studio Code，微软出的，免费，轻量，全世界用的人最多。打开浏览器，访问 code.visualstudio.com，点 Download，选你对应的系统版本。下载完双击安装，基本就是一路 Next，不用改什么设置。

装完打开 VSCode，你会看到这个界面。左边是侧边栏，中间是编辑区，下面有终端面板。这就是接下来几个月你写代码的"驾驶舱"。

---

### [5:00–6:00] 安装 Python 扩展 + 写第一行代码

**【画面】** 录屏：VSCode 左侧栏点击 Extensions 图标（或 Ctrl+Shift+X）。搜索框输入 "Python"。找到 Microsoft 出品的 Python 扩展，点 Install。等待安装完成。然后 File → New File，输入 `print("Hello, AI Era!")`，保存为 `hello.py`，点右上角运行按钮，终端输出 `Hello, AI Era!`。

**【旁白】**
VSCode 本身只是个编辑器，要写 Python 还得装一个扩展。左边栏点这个四个方块的图标，或者按 Ctrl+Shift+X 打开扩展商店。搜索框输入 Python，找到第一个——注意要是 Microsoft 出品的那个——点 Install。等几秒钟装完。

好了，来写你的第一行代码。File → New File，输入 `print("Hello, AI Era!")`。然后保存——File → Save As，文件名写 `hello.py`，后缀 .py 表示这是一个 Python 文件。保存好之后，点右上角这个三角形运行按钮。看，终端输出了 `Hello, AI Era!`。你的第一个 Python 程序，跑起来了。

---

### [6:00–7:25] 小结、提问彩蛋与下集预告

**【画面】** 环境检查清单字幕条依次弹出打勾：`✅ Python 已安装` `✅ pip 可用` `✅ VSCode 已安装` `✅ Python 扩展已安装` `✅ hello.py 运行成功`。

**【旁白】**
总结一下今天的成果清单：Python 装好了、pip 能用了、VSCode 装好了、Python 扩展装好了、第一行代码跑起来了。五项全部打勾，你的编程环境就算配齐了。如果哪一步卡住了，别慌——把错误信息发给 AI，用上一集学的提问方法，让它帮你排错。

**【画面】** 字幕条逐条弹出三个可直接照抄的 prompt（每条停留供暂停截图）：
① `我刚装完 Python，在命令行输入 python --version 的结果是：（粘贴你的输出）。帮我判断安装是否成功；如果不成功，一步步引导我排查，先别直接给完整方案。`
② `用初学者能听懂的话解释：环境变量 PATH 到底是什么？为什么勾了"Add Python to PATH"之后命令行就认识 python 了？`
③ `给我出 5 道选择题，考点覆盖 PATH、pip、Windows 的 python 与 Mac 的 python3 的区别，我答一题你讲评一题。`

**【旁白】**
送你一个提问彩蛋。装环境卡住时，AI 就是你 24 小时在线的助教——但别只要一个解决方案，让它讲清楚为什么，下次你就不会再踩同一个坑。这三条 prompt 暂停照抄，现在就能去试。

**【画面】** 弹出下集标题卡：`V004 交互模式与命令行运行`。

**【旁白】**
下一集，我们深入一点：搞懂 Python 代码到底是怎么在命令行里跑起来的。我们下集见。

---

## 演示操作清单

### Python 安装（Windows）

```
1. 浏览器 → python.org/downloads → 点击 "Download Python 3.12.x"
2. 双击运行安装包
3. ★★★ 勾选 "Add Python to PATH"
4. 点击 "Install Now"
5. 等待安装完成 → Close
```

### Python 安装（macOS）

```bash
# 方式1：官网安装包
# python.org/downloads → 下载 macOS 安装包 → 双击安装

# 方式2：Homebrew（推荐有基础的学生）
brew install python
```

### 验证安装

```bash
python --version       # Windows，预期输出 Python 3.12.x
python3 --version      # macOS
pip --version          # 预期输出 pip 24.x ...
```

### VSCode 安装

```
1. 浏览器 → code.visualstudio.com → 点击 Download
2. 选择对应系统版本下载
3. 双击安装（一路 Next）
4. 打开 VSCode
```

### VSCode Python 扩展

```
1. 打开 VSCode
2. 左侧栏点击 Extensions 图标（或按 Ctrl+Shift+X）
3. 搜索框输入 "Python"
4. 找到 Microsoft 出品的 "Python" 扩展 → 点击 Install
```

### 写第一行代码

```python
# hello.py
print("Hello, AI Era!")
```

```bash
# 运行方式1：VSCode 右上角 ▶ 运行按钮
# 运行方式2：终端中输入
python hello.py
```

---

## 录制注意

1. **Add to PATH 是本片最重要的画面**：安装界面弹出时必须放大聚焦到勾选框，配音反复强调。这是学生最高频踩的坑，录屏时不要一带而过。
2. **Windows / macOS 双轨**：如果课程有 Mac 学生，旁白中已补充 Mac 差异点（python3 命令、brew 安装）。录制时 Windows 为主画面，Mac 关键差异用字幕条补充即可。
3. **第一行代码要有仪式感**：`print("Hello, AI Era!")` 运行成功的瞬间，画面可以给终端输出一个特写——这是学生"第一次跑通代码"的里程碑时刻。
4. **时长控制**：Python 安装 + 验证（0:30–3:30）是弹性最大的段，如果安装过程太长可快进等待部分，只保留关键操作步骤。
5. **提问彩蛋**：提问彩蛋段的 prompt 字幕条需在后期加上，确保观众能暂停照抄。
