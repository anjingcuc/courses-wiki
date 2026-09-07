# V024 requests 库与 API 调用实战

## 视频信息

| 项目 | 内容 |
|---|---|
| 编号 | V024 |
| 标题 | requests 库与 API 调用实战 |
| 目标时长 | 8 min |
| 对应课次 | L13 API 调用与数据获取实战 |
| 前置微课 | V022 HTTP 请求与响应模型、V023 JSON 格式与 F12 面板 |
| 一句话定位 | 三步调通任何 API：发请求 → 解析 JSON → 安全取值 |

---

## 逐字稿

### [0:00-0:40] 开场 hook（成果前置）

**【画面】** 终端中运行一段代码，输出格式化的天气信息——城市、温度、湿度、风向整齐排列。然后画面回退，展示这段代码只有十几行。字幕条："十几行代码，拿到全城实时天气。"

**【旁白】** 看这段输出——城市、温度、湿度、风向，全是从网上实时拉下来的天气数据。而且这段代码只有十几行。怎么做到的？就是调了一个公开的天气 API。

上节课你搞懂了 HTTP 请求响应模型和 JSON 格式，也学会了用 F12 面板观察网络请求。今天我们把理论和实战串起来——用 requests 库正式调用真实的公开 API。你会发现，从"理解原理"到"写出可用代码"中间只差三步。学会今天的内容，天下任何公开 API 你都能调。

### [0:40-2:40] requests.get 核心参数

**【画面】** VS Code 中逐行敲入 requests 调用代码，每敲一个参数旁白对应解释。

**【旁白】** 调 API 的核心就一个函数——`requests.get()`。先看一个最简单的调用：

```python
import requests

url = "https://jsonplaceholder.typicode.com/users/1"
response = requests.get(url, timeout=10)
```

`url` 是你要请求的地址，这是第一个参数，也是唯一必填的。`jsonplaceholder.typicode.com` 是一个提供免费假数据 API 的网站，不需要注册、不需要 API Key，特别适合学习和测试。

第二个参数是 **timeout**——超时时间，单位是秒。我强烈建议你每次请求都加上这个参数。为什么？如果不设 timeout，遇到网络卡住的情况，你的程序会无限期等待，永远卡在那里不动。加上 `timeout=10` 就是告诉 requests——十秒还没拿到响应就算了，直接报超时错误，程序可以继续处理。

有些 API 需要传**查询参数**——就是 URL 里问号后面的那些 `key=value`。比如你想查某个用户的所有帖子，URL 是 `posts?userId=1`。有两种写法。

第一种是手动拼字符串：

```python
url = "https://jsonplaceholder.typicode.com/posts?userId=1"
response = requests.get(url, timeout=10)
```

能跑，但参数一多就乱了——`?userId=1&status=published&sort=desc`，容易拼错。

第二种是用 **params** 参数，传一个字典：

```python
url = "https://jsonplaceholder.typicode.com/posts"
params = {"userId": 1}
response = requests.get(url, params=params, timeout=10)
print(response.url)   # requests 自动帮你拼好：.../posts?userId=1
```

requests 帮你把字典自动拼成 URL 查询字符串，干净又不容易出错。参数越多，这个写法优势越明显。日常开发中基本都用 params。

如果 API 需要 **API Key 认证**，一般有两种传法。简单的 API 放在 params 里——就是查询参数加一个 `key=你的Key`。安全要求高的 API 放在 headers 请求头里。调大模型 API 就是放在请求头里的：

```python
headers = {"Authorization": "Bearer sk-xxx"}
response = requests.get(url, headers=headers, timeout=10)
```

具体放哪，看 API 文档说明。大部分 API 的文档会明确告诉你"Key 放在 header 里还是 query 参数里"。如果不确定，两个都试试——反正传错了服务器会返回 401 未授权，你就知道了。

### [2:40-4:10] 响应处理与安全取值

**【画面】** 屏幕展示从 response 中取状态码、解析 JSON、逐层取值的完整代码。重点用高亮标出 `.get()` 用法。

**【旁白】** 请求发出去了，拿到 response 对象，接下来三步走。

第一步——**看状态码**，确认请求成功了没：

```python
if response.status_code == 200:
    print("请求成功")
```

上节课讲的——200 代表成功。如果不是 200，说明出问题了，你要根据状态码判断是自己的问题还是服务器的问题。

第二步——**解析 JSON**，把响应体变成 Python 字典：

```python
data = response.json()
```

`response.json()` 做的事就是读取响应体的文本，然后用 `json.loads()` 解析成 Python 字典。现在你理解了这背后的完整链路。

第三步——**逐层取值**。这里有个重要技巧。从 JSON 字典里取字段，有两种写法。对比一下：

```python
# 危险写法——字段不存在直接崩
name = data["name"]              # 如果没有 name → KeyError 程序崩溃

# 安全写法——字段不存在返回 None
name = data.get("name")          # 没有 name → 返回 None，程序继续
```

`data["name"]` 用中括号取值——如果 key 不存在，直接抛 `KeyError`，程序崩。而 `data.get("name")` 用 get 方法——key 不存在时返回 None，程序不受影响。

嵌套结构更要用链式 `.get()`：

```python
# 嵌套取值——给每层默认值
company = data.get("company", {})          # 没有 company → 返回空字典 {}
company_name = company.get("name", "未知")  # 再从空字典取 → 返回 "未知"
```

看这个链——如果 `data` 里没有 `company`，`data.get("company", {})` 返回一个空字典。然后对空字典调 `.get("name", "未知")`，又返回默认值 `"未知"`。整条链永远不会断，程序不会崩。这是处理 API 响应的标准姿势——因为真实 API 的字段有时候有、有时候没有，你必须防一手。

### [4:10-6:30] 可运行闭环：调三个不同结构的 API

**【画面】** VS Code 中依次运行三段代码，终端分别输出用户信息、天气数据、名人名言。每段代码的输出用不同背景色区分。

**【旁白】** 来做今天的完整闭环——调三个结构不同的公开 API，把刚学的流程完整走一遍。三个 API 的响应结构各不相同，但处理套路完全一样。

**第一个——JSONPlaceholder，无需 Key 的假数据 API，返回一个用户信息**：

```python
import requests

url = "https://jsonplaceholder.typicode.com/users/1"
response = requests.get(url, timeout=10)

if response.status_code == 200:
    data = response.json()
    print(f"姓名: {data.get('name')}")
    print(f"邮箱: {data.get('email')}")

    # 嵌套结构取值
    company = data.get("company", {})
    print(f"公司: {company.get('name')}")

    address = data.get("address", {})
    print(f"城市: {address.get('city')}")
else:
    print(f"请求失败: {response.status_code}")
```

运行——姓名、邮箱、公司、城市全拿到了。这个响应是扁平的字典结构，`data.get("name")` 直接取第一层。嵌套部分 `data.get("company", {}).get("name")`——先取 company 字典，再从里面取 name。

**第二个——高德天气 API，需要 Key，返回真实天气数据**：

```python
import requests
import os

url = "https://restapi.amap.com/v3/weather/weatherInfo"
params = {
    "city": "110000",           # 北京 adcode
    "key": os.environ.get("AMAP_API_KEY", "课堂演示用Key"),
    "extensions": "base"        # 实时天气
}

try:
    response = requests.get(url, params=params, timeout=10)
    data = response.json()

    if data.get("status") == "1":
        lives = data.get("lives", [])
        if lives:
            weather = lives[0]
            print(f"天气: {weather.get('weather')}")
            print(f"温度: {weather.get('temperature')}°C")
            print(f"湿度: {weather.get('humidity')}%")
            print(f"风向: {weather.get('winddirection')}")
    else:
        print(f"API错误: {data.get('info')}")
except requests.exceptions.Timeout:
    print("请求超时")
except requests.exceptions.ConnectionError:
    print("无法连接服务器")
```

注意这里有几个重点。第一，API Key 通过 `os.environ.get("AMAP_API_KEY")` 从环境变量读取——绝不硬编码在代码里。第二，`data["lives"]` 是一个列表，取第一个元素 `[0]` 才是天气数据。列表和字典嵌套交替出现，这在 API 响应里非常常见。第三，整个调用包在 try/except 里——网络请求随时可能出问题。

**第三个——随机名人名言 API，返回一条随机名言**：

```python
import requests

url = "https://api.quotable.io/random"
response = requests.get(url, timeout=10)

if response.status_code == 200:
    quote = response.json()
    print(f"「{quote.get('content')}」")
    print(f"  —— {quote.get('author')}")
```

三个 API 结构各不相同——一个是嵌套字典，一个是列表套字典，一个是简单对象。但你看代码，处理流程完全一样——`requests.get()` 拿响应，`.json()` 解析，`.get()` 安全取值。这就是 API 调用的通用套路。换一个 API，无非是 URL 不同、取值路径不同，框架一模一样。

在实际开发中还有个常见场景——你拿到一个完全陌生的 API，没有文档。怎么办？两步走。第一步，在 F12 面板里或者用 requests 把完整响应打印出来，肉眼看一下结构。第二步，如果结构复杂看不懂，把 JSON 复制粘贴给 AI，让它帮你分析层级、标注字段类型、生成取值代码。然后你自己跑一遍验证。这套工作流你以后会反复用到。

### [6:30-7:35] 异常处理——让 API 调用不崩

**【画面】** PPT 展示 API 调用的三个常见错误场景——超时、连接失败、状态码异常，每个配对应的 except 分支。

**【旁白】** 最后强调一件事——**调 API 必须加异常处理**。为什么？因为网络是不可控的。你本地代码写得多好都没用，网线被踢了一下、服务器突然宕机、API 限流了——这些都会让请求失败。如果不加 try/except，程序直接崩溃。

记住 requests 三个常见异常：

`requests.exceptions.Timeout`——请求超时。服务器十秒内没响应，你就该放弃并告诉用户"网络太慢了"。

`requests.exceptions.ConnectionError`——连接失败。可能是 URL 写错了、DNS 解析不了、或者你断网了。

`requests.exceptions.RequestException`——这是 requests 所有异常的父类，兜底用。不想区分具体异常的话就 catch 这个。

把请求代码包在 try 里，except 里给用户一个友好提示。让程序在出错时告诉用户"出什么事了、该怎么办"，而不是直接崩溃。上节课讲异常处理时说过——try 里放可能出错的代码，except 精准捕获具体异常，先具体后通用。网络请求正是异常处理最有价值的应用场景。这个习惯从今天就要养好，这是写健壮程序的基本功。

还有一个提醒——别像某些人那样写 `except Exception` 然后什么都不做，把错误悄悄吞掉。至少要 `print` 一条错误信息出来，否则程序出了问题你都不知道哪行代码报的错，调试起来会非常痛苦。好的异常处理是——捕获你预期的错误，给用户友好提示，同时把错误信息记录下来方便你排查。

### [7:35-8:20] 小结 + 提问彩蛋 + 引出下集

**【画面】** 字幕条："requests.get(url, params, timeout) → .json() → .get() 取值 · 加 try/except · API Key 用环境变量"

**【旁白】** 今天你学会了一个完整的能力链——`requests.get()` 发请求，`.json()` 解析响应，`.get()` 安全取值，`try/except` 兜底异常。这套流程你能用来调全世界任何一个公开 API。

**【画面】** 提问彩蛋——字幕条逐条列出三个可直接照抄去问 Kimi / DeepSeek 的 prompt：

1. "我在学 requests 库。请用 jsonplaceholder.typicode.com 这类免费 API 给我出 3 道从易到难的调用练习，只给题目和 API 地址，别给代码。"
2. "请讲清 data['name'] 和 data.get('name') 的区别，演示链式 .get() 取嵌套字段如何防止崩溃，最后出 2 道判断题考我。"
3. "请扮演后端面试官问我：完整调一次 API 要注意哪些环节？对我回答里的 timeout、状态码判断和异常处理逐条追问。"

**【旁白】** 这三个 prompt 现在就可以照抄去用。记住一个原则——别让它替你写调用代码，让它出题让你写、让它追问你为什么。代码你敲，坑它帮你指，这才是用 AI 学 API 的姿势。

但今天调的 API 都是别人给你准备好的接口——返回的是结构化的 JSON。如果网站没有 API，数据只嵌在网页 HTML 里呢？下节课我们学网页爬取，用 BeautifulSoup 把网页里的数据抠出来。

---

## 演示操作清单

### 演示1：JSONPlaceholder——无需 Key 的假数据 API

```python
# v024_demo1.py
import requests

url = "https://jsonplaceholder.typicode.com/users/1"
response = requests.get(url, timeout=10)

if response.status_code == 200:
    data = response.json()
    print(f"姓名: {data.get('name')}")
    print(f"用户名: {data.get('username')}")
    print(f"邮箱: {data.get('email')}")
    print(f"电话: {data.get('phone')}")

    # 嵌套结构取值
    company = data.get("company", {})
    print(f"公司: {company.get('name')}")

    address = data.get("address", {})
    print(f"城市: {address.get('city')}")
    print(f"街道: {address.get('street')}")
else:
    print(f"请求失败: {response.status_code}")
```

### 演示2：高德天气 API——需要 Key 的真实数据

```python
# v024_demo2.py
import requests
import os

url = "https://restapi.amap.com/v3/weather/weatherInfo"

# 从环境变量读取 API Key（不要硬编码）
api_key = os.environ.get("AMAP_API_KEY", "课堂演示用Key")

params = {
    "city": "110000",           # 北京 adcode
    "key": api_key,
    "extensions": "base"        # 实时天气
}

try:
    response = requests.get(url, params=params, timeout=10)
    data = response.json()

    if data.get("status") == "1":
        lives = data.get("lives", [])
        if lives:
            weather = lives[0]
            print(f"城市: {weather.get('province')}{weather.get('city')}")
            print(f"天气: {weather.get('weather')}")
            print(f"温度: {weather.get('temperature')}°C")
            print(f"湿度: {weather.get('humidity')}%")
            print(f"风向: {weather.get('winddirection')} {weather.get('windpower')}级")
            print(f"更新时间: {weather.get('reporttime')}")
        else:
            print("未返回天气数据")
    else:
        print(f"API 返回错误: {data.get('info')}")
except requests.exceptions.Timeout:
    print("请求超时，请检查网络连接")
except requests.exceptions.ConnectionError:
    print("无法连接服务器")
except Exception as e:
    print(f"发生错误: {e}")
```

### 演示3：随机名人名言 API——简单结构

```python
# v024_demo3.py
import requests

url = "https://api.quotable.io/random"

try:
    response = requests.get(url, timeout=10)

    if response.status_code == 200:
        quote = response.json()
        content = quote.get("content", "（无内容）")
        author = quote.get("author", "佚名")
        print(f"「{content}」")
        print(f"  —— {author}")
    else:
        print(f"请求失败: {response.status_code}")
except requests.exceptions.RequestException as e:
    print(f"网络错误: {e}")
```

### params 传参演示（补充）

```python
# v024_demo_params.py
import requests

# 对比：手动拼 URL vs params 参数
# 手动拼（不推荐）
url1 = "https://jsonplaceholder.typicode.com/posts?userId=1"
r1 = requests.get(url1, timeout=10)

# params 参数（推荐）
url2 = "https://jsonplaceholder.typicode.com/posts"
params = {"userId": 1}
r2 = requests.get(url2, params=params, timeout=10)

print(r1.url)   # .../posts?userId=1
print(r2.url)   # .../posts?userId=1  （完全一样）
```

### 运行命令

```bash
cd ~/workspace/python-course

# 安装 requests（如果尚未安装）
pip install requests

# 运行三个演示
python v024_demo1.py
python v024_demo2.py    # 需先设置 AMAP_API_KEY 环境变量
python v024_demo3.py

# 设置高德 API Key 环境变量
export AMAP_API_KEY=你的高德Key
```

---

## 录制注意

1. **演示1和演示3不需要 Key，优先保证它们跑通**：JSONPlaceholder 和 Quotable API 都无需认证，录制前务必本地跑通确认输出。演示2（高德天气）如果网络或 Key 有问题，可以用预存的 JSON 响应截图代替，不影响讲解核心代码逻辑。
2. **.get() vs [] 的对比是本集重点**：在 2:40-4:10 的"安全取值"段落，一定要在画面上对比展示两种写法——`data["name"]` 崩溃 vs `data.get("name")` 返回 None。这是学生在作业里最容易犯的错，也是最值得记住的点。
3. **API Key 安全要口播强调**：演示2中 `os.environ.get("AMAP_API_KEY")` 的写法要口播解释——API Key 是个人凭证，不能硬编码在代码里，更不能推到 Git 仓库。这是作业②的硬性要求。
4. **时长控制点**：如果三个 API 演示跑完时间紧张，演示3（名言 API）可压缩为快速跑一次展示输出即可，不逐行讲解。核心时间留给演示1（完整流程示范）和演示2（嵌套结构 + 异常处理）。异常处理段落（6:30-7:35）不可省略，是本课教学目标之一。
5. **提问彩蛋字幕条**：提问彩蛋段的 prompt 字幕条需在后期加上，确保观众能暂停照抄。
