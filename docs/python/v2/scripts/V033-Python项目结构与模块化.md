# V033 Python 项目结构与模块化

## 视频信息

| 项目 | 内容 |
|---|---|
| 编号 | V033 |
| 标题 | Python 项目结构与模块化 |
| 目标时长 | 8 min |
| 对应课次 | L18 模块化项目结构 |
| 前置微课 | V031 AI 生成代码的审查方法、V032 代码规范与基础测试 |
| 一句话定位 | 把300行巨石脚本拆成积木——按职责分文件、配置分离、标准化项目结构 |

---

## 逐字稿

### [0:00-0:30] 开场 hook（巨石脚本痛点）

**【画面】** VS Code 中打开一个 `monster.py`，缓慢往下滚动——150 行，API 调用、数据处理、文件保存全堆在一起。字幕条弹出："你愿意接手维护这个文件吗？"然后画面一转，同样的项目被拆成 5 个文件，每个只有 20-40 行。

**【旁白】** 看看这个文件——150 行，API 调用、数据处理、文件保存全塞在一个 `.py` 里。往下滚半天，找到一个函数要翻好几屏。问你一句：你愿意接手维护这个文件吗？如果要在里面加一个新功能，你有信心不搞坏别的部分吗？今天我们把这坨巨石拆成积木——按职责分文件、配置分离，每拆一步运行验证功能不变。八分钟，你就能掌握 Python 项目模块化的全套基本功。

### [0:30-1:45] 单文件的三大问题 + 模块化原则

**【画面】** 左边展示 monster.py 的代码，右侧用三个红色标注框圈出三类代码（API 调用、数据分析、文件保存）。然后弹出"厨房"类比示意图——左边一张桌子堆满食材工具，右边分成储物间、切配区、烹饪区、摆盘区。

**【旁白】** 先说清楚单文件到底有啥问题。三个痛点。

第一，找代码难。150 行里找一个函数，你得从头往下翻，眼睛扫来扫去，还不一定找得到。调试的时候报了个错指向第 87 行，你跳过去一看，上下文混在一起，根本不知道这一行依赖了上面哪些变量。

第二，改一处怕崩别处。函数之间互相依赖，你动了 `call_llm` 的返回值格式，`main` 里的调用方可能就崩了。最可怕的是——你甚至不知道哪些地方在依赖它，因为没有清晰的边界。

第三，没法复用。这个文件里的 `analyze_data` 写得挺好，想在另一个项目里用？你总不能把整个 150 行的文件都拷过去吧——它还 import 了 API 调用的代码，还带了硬编码的密钥。

解法就一句话：**按职责拆分，一个文件一个主题**。

打个比方。单文件就像一个厨房，所有食材、刀具、锅碗瓢盆全堆在一张桌上——做一顿饭手忙脚乱，找一个锅铲要翻半天。模块化就是把厨房分区——储物间放食材和调料，切配区处理数据，烹饪区负责调用 API，摆盘区负责输出展示。每个区域只干自己的事，互不干扰。你在切配区切菜，不用担心碰翻了旁边的汤锅。

对应到代码上——配置放 config.py，API 调用放 api_client.py，数据分析放 data_processor.py，工具函数放 utils.py，主逻辑放 main.py。每个文件就是厨房的一个区域。

### [1:45-3:15] 配置管理：.env + config.py

**【画面】** 代码中 `API_KEY = "sk-1234567890"` 这一行被红色高亮。然后展示一个 `.env` 文件，以及 `config.py` 用 `python-dotenv` 读取环境变量的代码。字幕条："密钥进 .env，配置进 config.py，代码只读不存"。

**【旁白】** 拆文件之前，先解决一个更要命的问题。看这一行——`API_KEY = "sk-1234567890"`，密钥直接硬编码在代码里。这有两个严重后果。第一，安全隐患——你一提交到 Git，所有人都能翻历史记录看到你的密钥，哪怕后来删了也没用，Git 记着呢。第二，切换环境很痛苦——开发用一套密钥，测试用另一套，上线又是另一套，每次换环境都要改代码，改完还担心忘了改回来。

标准做法是三步走。第一步，创建 `.env` 文件，把密钥放进去：

```
DEEPSEEK_API_KEY=sk-1234567890
DEEPSEEK_BASE_URL=https://api.deepseek.com
WEATHER_API_URL=https://api.weather.example.com
```

第二步，创建 `config.py`，用 `python-dotenv` 库读取这些环境变量。先 `pip install python-dotenv`，然后：

```python
from dotenv import load_dotenv
import os

load_dotenv()

API_KEY = os.environ.get("DEEPSEEK_API_KEY", "")
BASE_URL = os.environ.get("DEEPSEEK_BASE_URL", "")
MODEL = "deepseek-chat"
```

`load_dotenv()` 一调用，它会自动找到当前目录下的 `.env` 文件，把里面的键值对加载到环境变量里。然后你用 `os.environ.get("DEEPSEEK_API_KEY")` 就能读到密钥了。注意第二个参数是默认值——如果没找到这个环境变量就返回空字符串，不会报错。

第三步——也是新手最容易忘的——把 `.env` 加进 `.gitignore`，别让密钥跟着代码进了版本库。这一步千万不能漏，漏了等于密钥裸奔。

记住这句话：**密钥进 .env，配置进 config.py，代码只读不存**。

那队友 clone 了你的项目，怎么知道要配哪些环境变量？提交一个 `.env.example` 模板，只有字段名没有真实密钥：

```
DEEPSEEK_API_KEY=你的API密钥
DEEPSEEK_BASE_URL=https://api.deepseek.com
WEATHER_API_URL=https://api.weather.example.com
```

队友照着这个填就行。这是业界标准实践。

### [3:15-5:30] 重构演示 Part 1：config.py + api_client.py

**【画面】** VS Code 中展示目标项目结构（5 个文件），然后依次创建 `config.py` 和 `api_client.py`。每创建一个文件，切到终端运行 `python main.py` 验证。

**【旁白】** 现在开始真正的重构。我们的目标结构长这样——5 个文件各管一摊：

```
weather_analyzer/
├── .env
├── .env.example
├── .gitignore
├── requirements.txt
├── config.py           # 配置管理
├── api_client.py       # API 调用
├── data_processor.py   # 数据分析
├── utils.py            # 工具函数
└── main.py             # 主入口
```

第一个文件 `config.py`，刚才已经写好了。它就是整个项目的"配置中心"——所有常量和密钥都从这里出。别的模块需要配置，就来 config 这里 import，不直接碰 `.env` 文件。

第二个文件 `api_client.py`，把所有跟外部 API 打交道的代码搬过来。这个项目有两类外部调用：大模型调用用 openai SDK 连 DeepSeek，天气数据用 requests 库获取。把它们放在同一个文件里，因为它们的共同职责就是"跟外部世界通信"：

```python
from openai import OpenAI
import requests
from config import API_KEY, BASE_URL, MODEL, SYSTEM_PROMPT, WEATHER_API_URL

llm_client = OpenAI(api_key=API_KEY, base_url=BASE_URL)

def call_llm(prompt):
    response = llm_client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content

def fetch_weather(city):
    resp = requests.get(f"{WEATHER_API_URL}/{city}", timeout=10)
    return resp.json()
```

注意看顶部——`from config import API_KEY, BASE_URL`，api_client 不再直接碰密钥，它从 config 模块拿配置。这样改了密钥，只需要改 `.env` 文件，业务代码一行都不用动。你看，这就是配置和代码分离的好处——改配置不动代码，改代码不碰配置。

而且这两个函数还加了 try-except 异常处理。API 调用随时可能失败——网络断了、密钥过期了、服务挂了。有了异常处理，一个调用失败不会让整个程序崩溃，而是返回一个友好的错误信息。这是 V031 审查代码时讲过的点。

### [5:30-6:45] 重构演示 Part 2：data_processor.py + utils.py + main.py

**【画面】** 快速创建三个文件——`data_processor.py`、`utils.py`、`main.py`。重点展示 `main.py` 瘦身后的样子：只有调度逻辑，没有具体实现。

**【旁白】** 接下来三个文件快步走，思路跟前面一样——把同一类职责的代码放到一起。

`data_processor.py`——纯数据分析逻辑，不涉及任何外部调用。算平均温度、找最高温度，这些计算只依赖传入的数据，不需要联网，不需要密钥：

```python
def analyze_data(data):
    if not data:
        return {"avg": 0, "max": 0}
    temps = [d["temperature"] for d in data]
    return {"avg": sum(temps) / len(temps), "max": max(temps)}
```

这个模块以后想复用到别的项目？直接拷一个文件就行，零依赖。这就是模块化的第三个好处——复用变得自然而然。而且你给这个模块写单元测试也很简单——传入一个列表，检查返回的统计值对不对，不依赖任何外部服务。

`utils.py`——报告的保存和打印，通用的工具函数。它不关心数据从哪来，只管把传进来的字典存成文件、打印到终端：

```python
import json

def save_report(report, filename="report.json"):
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

def print_report(report):
    analysis = report["analysis"]
    print(f"平均温度: {analysis['avg']:.1f}°C")
    print(f"最高温度: {analysis['max']:.1f}°C")
```

最后是 `main.py`——瘦身后的主入口，只做调度，不写具体逻辑：

```python
from api_client import call_llm, fetch_weather
from data_processor import analyze_data
from utils import save_report, print_report

def main():
    weather = fetch_weather("beijing")
    analysis = analyze_data(weather.get("data", []))
    prompt = f"分析这组天气数据：平均{analysis['avg']:.1f}度"
    ai_summary = call_llm(prompt)
    report = {"analysis": analysis, "ai_summary": ai_summary}
    save_report(report)
    print_report(report)

if __name__ == "__main__":
    main()
```

看——main 里只有四步：获取数据、分析、AI 解读、保存输出。每一步调谁、传什么参数，一目了然。以前那 150 行巨石，现在 main 只有十几行，它像一个项目经理在发号施令，把任务分派给各个模块，自己不亲力亲为。这就是"主入口只做调度"的核心思想——main.py 负责"做什么"和"按什么顺序做"，具体"怎么做"交给各个模块。

### [6:45-7:30] 运行验证 + 成果对比

**【画面】** 终端中运行 `python main.py`，输出与重构前完全一致——报告生成、打印正常。然后画面并排对比：左边 150 行单文件，右边 5 个文件各 20-40 行。最后快速展示 `.gitignore` 和 `requirements.txt`。

**【旁白】** 运行 `python main.py`——功能跟重构前完全一样，报告正常生成，数据正确打印。注意，拆文件不改变业务逻辑，只是重新组织了代码的位置。好，拆完了功能没坏，这才叫成功的重构。

再补两个工程文件。`.gitignore` 要忽略 `.env`、`venv/`、`__pycache__/`——这些是密钥、虚拟环境和缓存，都不该进版本库。`requirements.txt` 用 `pip freeze > requirements.txt` 一键生成，记录所有依赖及其精确版本号。队友拿到你的项目，`pip install -r requirements.txt` 就能装好一模一样的环境。

现在对比一下成果。左边 150 行一个文件，找代码像大海捞针，改一处怕影响全局。右边 5 个文件各 20 到 40 行，每个文件职责清晰——改 API 调用只动 `api_client.py`，改分析逻辑只动 `data_processor.py`。而且当你找 AI 帮忙时，只需喂它相关的那一个文件——上下文短了，AI 的生成质量明显更高，不容易搞混。还记得 V019 讲的 import 机制吗？今天就是它的实战应用。

### [7:30-7:50] 小结

**【画面】** 字幕条："按职责拆文件 · 密钥进.env · config.py 管配置 · .env.example 告诉队友 · main.py 只做调度"。

**【旁白】** 三句话收束：按职责拆文件，一个文件一个主题；密钥进 .env、配置进 config.py、代码只读不存；main.py 只做调度，不写具体逻辑。M4 工程化三节课收官了——虚拟环境、代码质量、项目结构，你的工程化基本功到位了。

### [7:50-8:10] 提问彩蛋：方案 AI 给，判断自己练

**【画面】** 弹出"提问彩蛋"卡片，字幕条逐条列出三个 prompt，停留足够时长供暂停照抄：
1. "我有一个 100 多行的单文件 Python 脚本（贴代码）。请不要直接重写，先帮我分析每段代码的职责，给出应该拆成哪几个文件的方案和理由，我自己照着拆。"
2. "为什么 .env 文件必须加进 .gitignore？就算后来删掉了密钥，Git 历史记录里还能翻到吗？用我听得懂的话解释清楚。"
3. "你扮演技术面试官问我：项目里的密钥和配置应该怎么管理？.env 和 .env.example 各管什么？我回答后，指出我理解错或漏掉的地方。"

**【旁白】** 最后留个提问彩蛋——三条 prompt 直接照抄：把你的单文件脚本贴给 AI，让它只出拆分方案、不动手写，你自己照着拆；让它讲透 .env 为什么要进 .gitignore；让它扮演面试官考你配置管理。多问"为什么这么分"，少问"帮我分一下"——方案 AI 能给，判断力得自己练。

### [8:10-8:25] 引出下集

**【画面】** 过渡到 M5 模块预告。

**【旁白】** 接下来进入课程核心——M5 AI 应用开发，12 节课。下集从大模型 API 核心参数开始，你们要做真正的 AI 应用了。

---

## 演示操作清单

### 项目最终结构

```
weather_analyzer/
├── .env                # 真实密钥（不进 Git）
├── .env.example        # 模板（进 Git）
├── .gitignore
├── requirements.txt
├── config.py           # 配置管理
├── api_client.py       # API 调用（大模型 + 天气）
├── data_processor.py   # 数据分析
├── utils.py            # 工具函数（保存/打印）
└── main.py             # 主入口
```

### 重构前：monster.py（巨石脚本）

```python
# monster.py —— 一个"巨石脚本"，所有逻辑堆在一个文件里
import json
import requests
from openai import OpenAI

API_KEY = "sk-1234567890"
BASE_URL = "https://api.deepseek.com"
MODEL = "deepseek-chat"
SYSTEM_PROMPT = "你是一个数据分析助手"

client = OpenAI(api_key=API_KEY, base_url=BASE_URL)


def call_llm(prompt):
    """调用大模型API"""
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content


def fetch_weather(city):
    """调用天气API获取数据"""
    resp = requests.get(f"https://api.weather.example.com/{city}")
    return resp.json()


def analyze_data(data):
    """分析天气数据，返回结论"""
    temps = [d["temperature"] for d in data]
    avg_temp = sum(temps) / len(temps)
    max_temp = max(temps)
    return {"avg": avg_temp, "max": max_temp}


def save_report(report, filename="report.json"):
    """保存报告到文件"""
    with open(filename, "w") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)


def print_report(report):
    """打印报告"""
    print(f"平均温度: {report['analysis']['avg']:.1f}°C")
    print(f"最高温度: {report['analysis']['max']:.1f}°C")
    print(f"AI 解读: {report['ai_summary']}")


def main():
    weather = fetch_weather("beijing")
    analysis = analyze_data(weather["data"])
    prompt = f"分析这组天气数据：平均{analysis['avg']:.1f}度，最高{analysis['max']:.1f}度"
    ai_summary = call_llm(prompt)
    report = {"analysis": analysis, "ai_summary": ai_summary}
    save_report(report)
    print_report(report)


if __name__ == "__main__":
    main()
```

### 重构后文件 1：.env

```bash
DEEPSEEK_API_KEY=sk-1234567890
DEEPSEEK_BASE_URL=https://api.deepseek.com
WEATHER_API_URL=https://api.weather.example.com
```

### 重构后文件 2：.env.example

```bash
# 提交到 Git，告诉队友需要哪些环境变量
DEEPSEEK_API_KEY=你的API密钥
DEEPSEEK_BASE_URL=https://api.deepseek.com
WEATHER_API_URL=https://api.weather.example.com
```

### 重构后文件 3：config.py

```python
# 文件：config.py
"""项目配置——从环境变量读取敏感信息"""
import os

from dotenv import load_dotenv

load_dotenv()

# 大模型配置
API_KEY = os.environ.get("DEEPSEEK_API_KEY", "")
BASE_URL = os.environ.get("DEEPSEEK_BASE_URL", "https://api.deepseek.com")
MODEL = "deepseek-chat"
SYSTEM_PROMPT = "你是一个数据分析助手"

# 天气 API 配置
WEATHER_API_URL = os.environ.get("WEATHER_API_URL", "https://api.weather.example.com")
```

### 重构后文件 4：api_client.py

```python
# 文件：api_client.py
"""API 调用模块——大模型调用 + 天气数据获取"""
from openai import OpenAI
import requests

from config import API_KEY, BASE_URL, MODEL, SYSTEM_PROMPT, WEATHER_API_URL

# 创建大模型客户端（模块级别只创建一次）
llm_client = OpenAI(api_key=API_KEY, base_url=BASE_URL)


def call_llm(prompt):
    """调用大模型，返回文本回复

    参数:
        prompt: 用户输入
    返回:
        str: AI 回复文本
    """
    try:
        response = llm_client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"大模型调用失败: {e}"


def fetch_weather(city):
    """获取指定城市的天气数据

    参数:
        city: 城市名称
    返回:
        dict: 天气数据，失败时返回空字典
    """
    try:
        resp = requests.get(f"{WEATHER_API_URL}/{city}", timeout=10)
        resp.raise_for_status()
        return resp.json()
    except requests.exceptions.RequestException as e:
        print(f"天气数据获取失败: {e}")
        return {}
```

### 重构后文件 5：data_processor.py

```python
# 文件：data_processor.py
"""数据处理模块——天气数据的分析与统计"""


def analyze_data(data):
    """分析天气数据，返回统计结论

    参数:
        data: 天气记录列表，每条含 temperature 字段
    返回:
        dict: 包含 avg（平均温度）和 max（最高温度）的字典
    """
    if not data:
        return {"avg": 0, "max": 0}

    temps = [d["temperature"] for d in data if "temperature" in d]
    if not temps:
        return {"avg": 0, "max": 0}

    return {
        "avg": sum(temps) / len(temps),
        "max": max(temps)
    }
```

### 重构后文件 6：utils.py

```python
# 文件：utils.py
"""工具函数——报告保存与打印"""
import json


def save_report(report, filename="report.json"):
    """保存报告到 JSON 文件

    参数:
        report: 报告数据（字典）
        filename: 目标文件名
    """
    try:
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        print(f"报告已保存到 {filename}")
    except OSError as e:
        print(f"保存失败: {e}")


def print_report(report):
    """在终端打印报告摘要

    参数:
        report: 报告数据（字典）
    """
    analysis = report.get("analysis", {})
    print(f"平均温度: {analysis.get('avg', 0):.1f}°C")
    print(f"最高温度: {analysis.get('max', 0):.1f}°C")
    print(f"AI 解读: {report.get('ai_summary', '无')}")
```

### 重构后文件 7：main.py

```python
# 文件：main.py
"""主程序入口——协调各模块完成天气数据分析"""
from api_client import call_llm, fetch_weather
from data_processor import analyze_data
from utils import save_report, print_report


def main():
    # 1. 获取数据
    weather = fetch_weather("beijing")
    if not weather:
        print("未获取到天气数据，退出")
        return

    # 2. 分析数据
    analysis = analyze_data(weather.get("data", []))

    # 3. AI 解读
    prompt = f"分析这组天气数据：平均{analysis['avg']:.1f}度，最高{analysis['max']:.1f}度"
    ai_summary = call_llm(prompt)

    # 4. 保存和输出
    report = {"analysis": analysis, "ai_summary": ai_summary}
    save_report(report)
    print_report(report)


if __name__ == "__main__":
    main()
```

### .gitignore

```gitignore
venv/
.env
__pycache__/
*.pyc
*.json
.vscode/
```

### requirements.txt 生成

```bash
pip install openai requests python-dotenv
pip freeze > requirements.txt
```

```
# requirements.txt（示例）
openai==1.12.0
requests==2.31.0
python-dotenv==1.0.1
```

### 完整运行流程

```bash
cd ~/workspace/weather_analyzer

# 创建虚拟环境
python -m venv venv
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 运行（始终在项目根目录运行）
python main.py

# 验证功能与重构前一致
cat report.json
```

---

## 录制注意

1. **先展示巨石文件再展示目标结构**：开场先打开 `monster.py` 慢慢滚，让观众感受到"找代码难"的痛点。再切到 5 个文件的目标结构，形成强烈视觉对比。这个对比是整集视频的叙事动力。
2. **每拆一个文件运行验证**：核心节奏是"拆 → 运行 → 功能不变"。录制时至少在拆完 config.py 和拆完全部文件后各运行一次 `python main.py`，展示输出一致。如果时间紧张，中间的运行可以快进跳过。
3. **.env 演示要点**：展示 `.env` 文件内容时，密钥用假值（`sk-1234567890`），不要暴露真实密钥。同时一定要展示 `.gitignore` 里有 `.env` 这一行——强调"这个文件绝对不能进 Git"。
4. **import 报错可故意触发**：如果在项目根目录之外的目录运行 `python main.py`，会报 `ModuleNotFoundError`。可以故意触发一次并讲解"始终在项目根目录运行"，这个知识点是新手最高频的踩坑点。时间紧可省略。
5. **提问彩蛋字幕后期添加**：提问彩蛋段的 prompt 字幕条需在后期加上，确保观众能暂停照抄。
