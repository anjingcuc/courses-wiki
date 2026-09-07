# V022 HTTP 请求与响应模型

## 视频信息

| 项目 | 内容 |
|---|---|
| 编号 | V022 |
| 标题 | HTTP 请求与响应模型 |
| 目标时长 | 8 min |
| 对应课次 | L12 HTTP 与 Web 基础 |
| 前置微课 | V020 类与 \_\_init\_\_ 和 self、V021 面向对象思维与实战 |
| 一句话定位 | 你调的每个 API、刷的每个网页，底层都是一次 HTTP 请求和响应 |

---

## 逐字稿

### [0:00-0:40] 开场 hook（成果前置）

**【画面】** 屏幕左边是一段熟悉的代码——`client.chat.completions.create(...)`，右边是一个浏览器输入网址打开网页的录屏。两条画面中间打出一个问号。字幕条："它们是同一件事吗？"

**【旁白】** 从第四节课开始，你就一直在写这行代码——调用大模型 API，拿到 AI 的回复。你写了十几遍了，已经很熟练。但你有没有停下来想过：这行代码底层到底发生了什么？你按下运行键的那一瞬间，你的电脑和 DeepSeek 的服务器之间，到底交换了什么信息？

再想一个场景——你打开浏览器输入一个网址，网页就显示出来了。这件事，和你用 Python 调 API，是不是同一回事？

答案是——**底层一模一样**。它们用的都是同一个通信规则，叫 HTTP。前面十一节课你学会了 Python 的语法、数据结构、函数、类。从今天开始，我们正式进入模块三——数据获取与处理。这一站，先搞懂 HTTP 请求和响应模型。理解了它，你就理解了整个互联网通信的底层逻辑。

### [0:40-2:30] 请求-响应模型：客户端说话，服务器回答

**【画面】** PPT 动画——左边一个"客户端"图标（电脑/手机），右边一个"服务器"图标。客户端发出一个箭头飞向服务器（标注"请求 Request"），服务器回一个箭头飞回来（标注"响应 Response"）。

**【旁白】** HTTP 的核心模型简单到一句话——**客户端发请求，服务器回响应**。就这么简单，没有别的。

打个比方。你去餐厅吃饭——你跟服务员说"来一碗牛肉面"，这就是请求。后厨做好了端上来，这就是响应。你是客户端，餐厅是服务器。

在互联网世界里，你在浏览器输入 `www.baidu.com`，你的浏览器就是客户端。它向百度的服务器发了一个请求，意思是"给我首页的数据"。服务器收到后回一个响应，里面装着网页的 HTML 内容。浏览器把内容渲染出来，你就看到了搜索页面。

调 API 也是完全一样的流程。你用 Python 写 `client.chat.completions.create()`，你的 Python 程序作为客户端，向 DeepSeek 的服务器发了一个请求——"帮我回复这条消息"。服务器处理完后回一个响应，里面装着 AI 生成的回复。你从响应里取出文本，打印出来。

所以不管是刷网页还是调 API，底层跑的都是 HTTP 这一套规则。理解了 HTTP，你就拿到了理解一切网络通信的钥匙。

那一个 HTTP 请求里到底装了什么？我给你拆成**请求四要素**。

第一步，**方法**。最常用的就两个：GET 和 POST。GET 的意思是"我要拿数据"，就像你去图书馆借书——只是读，不改服务器的东西。POST 的意思是"我要提交数据"，就像你填表交给办事员——你在往服务器送新数据。打开网页一般用 GET，调大模型 API 用 POST，因为你在提交一段消息让服务器处理。除了这两个，还有 PUT、DELETE 等方法，但初学阶段 GET 和 POST 够你用了——PUT 一般用来更新数据，DELETE 用来删除。等你做期末项目用到完整 RESTful API 时才会碰到它们。

第二，**URL**，就是网址。它告诉服务器"你要访问哪个资源"。就像餐厅菜单上的编号——"来一份3号餐"，URL 就是那个编号。

第三，**请求头**，英文叫 headers。它是附带的元信息，比如你的身份认证、你能接受的数据格式。调 API 时 API Key 就放在请求头里——相当于你进餐厅时出示的会员卡。

第四，**请求体**，英文叫 body。GET 请求一般没有请求体，因为你只是"拿"数据。但 POST 请求有——你提交的数据就放在这里。调 API 时你的消息列表就是请求体的内容。

### [2:30-4:10] 响应三要素与状态码

**【画面】** PPT 继续动画——服务器返回的"响应"箭头被拆解成三层：最上面"状态码"，中间"响应头"，最下面"响应体"。

**【旁白】** 服务器回的响应里也有三样东西。

第一，**状态码**——一个三位数字，一眼告诉你请求成功了没有。你不需要背几十个状态码，记住一个规律就够了：

- **2 开头代表成功**，最常见的是 200。看到 200 就放心了——请求成功，数据在响应体里。
- **4 开头代表你的问题**。404 最经典——"你请求的东西不存在"，说明 URL 写错了。401 是"你没权限"——API Key 没传或者不对。403 是"禁止访问"——你有身份但服务器不让你看这个资源。
- **5 开头代表服务器的问题**。500 是服务器内部出错了，跟你没关系，是服务器背锅。503 是"服务暂时不可用"，服务器可能过载了。遇到 5 开头的错误，你能做的只有等——等服务器恢复了再试。

口诀帮你记——2 开头你开心，4 开头你找自己的问题，5 开头是服务器背锅。实际开发中你遇到最多的是 200、404 和 500 这三个，其他状态码碰到了再查也不迟。

第二，**响应头**。和请求头类似，这是服务器返回的附带信息。比如 Content-Type 告诉你响应体里装的是什么格式——JSON、HTML 还是图片。

第三，**响应体**——你真正要的数据。调 API 时响应体通常是一段 JSON 文本；打开网页时响应体是 HTML 页面源码。你之前用的 `response.json()` 做的事就是读取响应体，然后把 JSON 文本解析成 Python 字典。

### [4:10-5:40] 用 Python 发一个 HTTP 请求

**【画面】** VS Code 中展示 requests 库发 GET 请求的代码，终端运行后打印状态码、响应头、响应体。

**【旁白】** 光讲概念太虚，我们用 Python 真的发一个 HTTP 请求。用到的库叫 `requests`，它是 Python 里最流行的 HTTP 库——几乎所有 Python 项目里的网络请求都是用它发的。

```python
import requests

# 发一个 GET 请求
response = requests.get("https://httpbin.org/json")
```

就这么一行，一个 HTTP GET 请求就发出去了。`httpbin.org/json` 是一个专门给开发者测试用的网址，它会返回一段 JSON 数据。requests 把服务器的响应打包成一个 response 对象给你。

响应三要素全都能从这个对象上拿到：

```python
print("状态码:", response.status_code)       # 200
print("内容类型:", response.headers.get("Content-Type"))
print("响应体:", response.text)
```

运行看结果——状态码是 200，说明请求成功了。响应头里 Content-Type 是 `application/json`，告诉我们返回的是 JSON 数据。响应体是一段 JSON 文本。

再用 `.json()` 把它解析成 Python 字典：

```python
data = response.json()
print("标题:", data.get("slideshow", {}).get("title"))
```

注意这个调用链——`response.json()` 把 JSON 文本变成字典，然后 `.get()` 取值。这套流程你从第六节课就在用了，现在你终于知道它背后的完整图景了。

### [5:40-7:35] 可运行闭环：还原大模型 API 的 HTTP 本质

**【画面】** VS Code 中左右对比——左边是 openai SDK 的调用代码，右边是用 requests 直接发 POST 请求的等价代码。运行右边，展示拿到了同样的 AI 回复。

**【旁白】** 最后看今天的完整闭环——**用 requests 直接发 HTTP 请求调大模型 API**，亲手揭开 SDK 背后那层窗帘。

回忆一下你一直在写的 SDK 代码：

```python
from openai import OpenAI

client = OpenAI(api_key="sk-xxx", base_url="https://api.deepseek.com")
resp = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{"role": "user", "content": "1+1=?"}]
)
print(resp.choices[0].message.content)
```

这段代码你写过很多次了。现在用 requests 还原它底层做的事：

```python
import requests

# 请求的 URL
url = "https://api.deepseek.com/chat/completions"

# 请求头——放认证信息
headers = {
    "Authorization": "Bearer sk-xxx",
    "Content-Type": "application/json"
}

# 请求体——你要提交的数据
data = {
    "model": "deepseek-chat",
    "messages": [{"role": "user", "content": "1+1=?"}]
}

# 发 POST 请求
response = requests.post(url, json=data, headers=headers, timeout=30)

# 看响应
print("状态码:", response.status_code)
result = response.json()
print("AI回复:", result["choices"][0]["message"]["content"])
```

看明白了吗？对照一下——URL 就是 `base_url` 加上 `/chat/completions`。请求头里的 Authorization 放的就是你的 API Key，前面加 `Bearer ` 是认证规范。请求体就是你的 model 和 messages 参数。`requests.post` 把这些组装成一个 HTTP POST 请求发出去。

SDK 帮你做了三件事——拼 URL、加请求头做认证、把参数序列化成 JSON 发出去。**本质上就是一个 HTTP POST 请求**。`client.chat.completions.create()` 是它穿了件漂亮的外衣。

理解了这层，以后调任何 API 你都不怕了。SDK 不支持的功能，你用 requests 直接发请求就行。很多高级 API 功能——比如自定义请求头、代理设置、请求重试——SDK 可能没封装，但 requests 都能做。

### [7:35-8:00] 小结

**【画面】** 字幕条："请求 = 方法 + URL + 请求头 + 请求体 · 响应 = 状态码 + 响应头 + 响应体 · 2成功 4你错 5服务器错"

**【旁白】** 记住今天的核心：客户端发请求、服务器回响应；请求包含方法、URL、请求头、请求体；状态码 2 开头成功、4 开头你错了、5 开头服务器背锅。

### [8:00-8:20] 提问彩蛋 + 引出下集

**【画面】** 字幕条逐行列出三个 prompt：
1. “我在学 HTTP 请求与响应模型，请出 3 道题考我请求四要素和状态码口诀，比如‘调大模型 API 该用 GET 还是 POST’，我答完再讲解。”
2. “请给我讲清楚 401、403、404 三个状态码的区别，各举一个调 API 时会遇到的真实场景。”
3. “你扮演面试官，围绕‘SDK 调用底层就是一次 HTTP 请求’追问我 3 个问题，检验我是不是真懂了。”

**【旁白】** 今天的彩蛋——屏幕上这三个 prompt，暂停抄下来直接问。概念学到似懂非懂的时候，让 AI 反过来追问你几个问题，比自己闷头看十遍笔记管用。下集我们来讲响应体里最常见的 JSON 数据格式，再用浏览器 F12 面板亲眼看看网页背后的数据流。

---

## 演示操作清单

### 演示1：用 requests 发 GET 请求——看到 HTTP 全貌

```python
# v022_demo1.py
import requests

# httpbin.org 提供免费的 HTTP 测试接口
response = requests.get("https://httpbin.org/json", timeout=10)

# --- 响应三要素 ---

# 1. 状态码
print("状态码:", response.status_code)

# 2. 响应头
print("内容类型:", response.headers.get("Content-Type"))

# 3. 响应体（原始文本）
print("响应体（文本）:")
print(response.text)

# --- 解析 JSON ---
data = response.json()
print("\n解析后类型:", type(data))
print("标题:", data.get("slideshow", {}).get("title"))
```

### 演示2：用 requests 发 POST 请求调大模型 API

```python
# v022_demo2.py
import requests

url = "https://api.deepseek.com/chat/completions"

headers = {
    "Authorization": "Bearer sk-xxx",       # 替换为你的 API Key
    "Content-Type": "application/json"
}

data = {
    "model": "deepseek-chat",
    "messages": [{"role": "user", "content": "1+1=?"}]
}

response = requests.post(url, json=data, headers=headers, timeout=30)

print("状态码:", response.status_code)
if response.status_code == 200:
    result = response.json()
    reply = result["choices"][0]["message"]["content"]
    print("AI回复:", reply)
else:
    print("请求失败，响应体:", response.text)
```

### 演示3：状态码体验（404 演示）

```python
# v022_demo3.py
import requests

# 故意请求一个不存在的路径
response = requests.get("https://httpbin.org/no-such-page", timeout=10)
print("状态码:", response.status_code)   # 404
```

### 运行命令

```bash
cd ~/workspace/python-course

# 安装 requests（如果尚未安装）
pip install requests

# 运行演示
python v022_demo1.py
python v022_demo2.py    # 需替换 sk-xxx 为真实 API Key
python v022_demo3.py
```

---

## 录制注意

1. **requests 库需提前安装**：录制前确认环境中已 `pip install requests`。如果录制时不装，在演示1前快速口播一句"先 pip install requests 安装这个库"即可，不要在录制中等待安装过程。
2. **API Key 打码**：演示2中的 `sk-xxx` 在录屏画面中要用假 Key 或打码处理。建议录制时用 `os.environ.get("DEEPSEEK_API_KEY", "sk-xxx")` 的写法，口播提醒观众"不要把 Key 硬编码到代码里"。
3. **字幕条重点**：请求四要素和响应三要素各出一条字幕条；状态码口诀出一条——"2 成功 / 4 你错 / 5 服务器错"。这三条字幕条是观众截图收藏的核心信息。
4. **SDK 对比是本集高光**：演示2（5:40-7:35）的 SDK vs requests 对比是本集最有价值的部分，也是 M3 开篇与 M2 的衔接点。务必在画面上左右对比展示两段代码，让观众一眼看出等价关系。
5. **提问彩蛋后期**：提问彩蛋段的 prompt 字幕条需在后期加上，确保观众能暂停照抄。
