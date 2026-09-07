# V025 BeautifulSoup 与 CSS 选择器

## 视频信息

| 项目 | 内容 |
|---|---|
| 编号 | V025 |
| 标题 | BeautifulSoup 与 CSS 选择器 |
| 目标时长 | 8 min |
| 对应课次 | L14 网页爬取精要 |
| 前置微课 | V024 requests 库与 API 调用实战 |
| 一句话定位 | 三步走——requests 拿 HTML、BeautifulSoup 解析、CSS 选择器提取目标数据 |

---

## 逐字稿

### [0:00-0:35] 开场 hook（成果前置）

**【画面】** 屏幕左边是一个打开的网页——quotes.toscrape.com 名言页，上面有多条名言、作者、标签。右边终端里运行 Python 脚本，自动打印出同样的名言和作者，格式整齐。字幕条："网页上的数据 → 你的程序里"。

**【旁白】** 你打开一个网页，看到上面有很多名言、作者名、标签——你想把这些数据全部存下来做分析。一条一条复制粘贴？几十条还勉强，几千条呢？上节课我们学的 requests 和 API 调用，前提是对方给你准备好了数据接口。但如果网站没有 API，数据全嵌在网页的 HTML 里呢？今天教你用 Python 三步搞定——拿到网页 HTML、用 BeautifulSoup 解析它、然后用 CSS 选择器把你想要的数据精准提取出来。不到二十行代码就能完成，我们开始。

### [0:35-2:15] 网页长什么样：HTML 结构速览

**【画面】** 浏览器中打开 quotes.toscrape.com，右键 → 检查，F12 面板展示 HTML 结构。高亮一条名言对应的 HTML 代码。

**【旁白】** 先看一眼网页在程序眼里长什么样。你在浏览器里看到的是排版好的漂亮页面——有字体、有颜色、有布局。但程序拿到的是什么？是一坨纯文本的 HTML 标签。我们右键检查，打开 F12 面板来看——你看，每条名言都被包在一个 div 标签里，这个 div 有个属性 class 等于 quote。名言文本在一个 span 里，class 等于 text。作者名在一个 small 标签里，class 等于 author。

HTML 就是这种层层嵌套的标签结构——像俄罗斯套娃一样，大标签套小标签，一层包一层。网页上的每一段文字、每一张图片、每一个链接，都住在某个标签里。你要提取数据，本质上就是告诉程序："去哪个标签里，找什么东西。"换句话说，你得给程序一个精确的"地址"，告诉它数据住在哪。

怎么描述这个地址？靠 CSS 选择器。它是前端开发用来定位页面元素的语法，我们借来用。三种最基本的，你记住了就能搞定绝大多数场景：

第一种——标签选择器。直接写标签名，比如 span，就会选中页面上所有的 span 标签。简单粗暴，但不够精确，因为一个页面可能有几十个 span。

第二种——class 选择器。前面加一个点，比如 `.text`，选中所有 class 等于 text 的标签。这是爬虫里最常用的——因为网页上的数据通常用 class 来标记用途。比如名言文本的 class 是 text，作者的 class 是 author，你用 class 选择器就能精准定位。

第三种——id 选择器。前面加一个井号，比如 `#header`，选中 id 等于 header 的标签。一个页面里 id 通常是唯一的，所以它最精确，但实际爬取中用得不多——因为数据通常不在 id 标签里。

记住这三种就够了。后面真正写爬虫时，你会发现自己 90% 的时间都在用 class 选择器。

### [2:15-3:30] BeautifulSoup：HTML 解析利器

**【画面】** VS Code 中展示安装命令和导入代码。终端运行 `pip install beautifulsoup4`。

**【旁白】** 知道了 HTML 结构和 CSS 选择器，还需要一个工具帮我们把 HTML 文本变成可以查询的对象。Python 里最常用的这个工具叫 BeautifulSoup——翻译过来叫"美丽的汤"，名字很奇怪，但它干的事非常实在：把一坨 HTML 文本变成一棵可以查询的树形结构。

先装一下：`pip install beautifulsoup4`。注意一个新手常犯的错误——包名叫 `beautifulsoup4`，结尾有个数字 4，不是 `beautifulsoup`。装错了版本会出问题。

导入的时候这样写：

```python
import requests
from bs4 import BeautifulSoup
```

`from bs4 import BeautifulSoup`——从 bs4 这个包里导入 BeautifulSoup 这个类。上节课学的 import 机制，这里就用上了。bs4 是包名，BeautifulSoup 是里面的核心类。

核心用法就一行——把 HTML 文本喂给它：

```python
soup = BeautifulSoup(response.text, "html.parser")
```

第一个参数是 HTML 文本字符串——就是 requests 拿到的 `response.text`。第二个参数固定写 `"html.parser"`，这是告诉 BeautifulSoup 用 Python 内置的解析器来解析 HTML。你不用纠结这个参数，每次照抄就行。解析完之后，`soup` 就是一个可以查询的对象了，后面所有的提取操作都基于这个 soup。

### [3:30-5:45] 爬取三步走：完整流程演示

**【画面】** VS Code 中逐步敲入完整代码。先展示 requests 拿到 HTML，再 print 出原始 HTML 片段，再解析、提取、输出。

**【旁白】** 来走一遍完整流程。我们的目标——爬取 quotes.toscrape.com 首页的所有名言、作者和标签。这个网站是专门为学习爬虫设计的靶场，可以放心练手。

第一步，拿 HTML——用上节课学的 requests：

```python
import requests
from bs4 import BeautifulSoup

url = "https://quotes.toscrape.com/"
response = requests.get(url, timeout=10)
```

`timeout=10` 表示最多等 10 秒，超时就不等了——这个参数一定要加，上节课讲过，不加的话网络卡住程序会无限等待。

拿到 HTML 之后，强烈建议你先看一眼原始内容长什么样：

```python
print(response.text[:300])
```

`[:300]` 是只取前 300 个字符——全部打印出来会刷屏。你看终端输出的内容——满屏的尖括号、标签名、属性，乱七八糟的。这就是程序拿到手的原始数据，和你在浏览器里看到的排版好的页面完全不一样。人眼能直接看到标题，是因为浏览器帮你渲染了。程序要自己从这堆标签里提取出有用的信息。

第二步，解析 HTML：

```python
soup = BeautifulSoup(response.text, "html.parser")
```

就这一行。之前讲过了，把 HTML 文本传进去，拿到一个 soup 对象。

第三步，用 CSS 选择器提取数据。这里有个技巧——先定位"容器"，再在容器里提取字段。什么意思？你看这个页面，每条名言都住在一个 class 为 quote 的 div 里。我们先把这些容器全部找出来：

```python
quotes = soup.select(".quote")
print(f"共找到 {len(quotes)} 条名言")
```

`soup.select()` 接收一个 CSS 选择器字符串，返回一个列表，包含所有匹配的元素。`.quote` 就是 class 选择器，选中所有 class 为 quote 的标签。这个页面有 10 条名言，所以列表长度是 10。

然后遍历每条名言容器，在容器内部提取文本、作者和标签：

```python
for quote in quotes:
    text = quote.select_one(".text").get_text()
    author = quote.select_one(".author").get_text()
    tags = [tag.get_text() for tag in quote.select(".tag")]
    print(f"{author}: 「{text}」")
    print(f"  标签: {', '.join(tags)}")
    print()
```

注意两个方法——`select_one()` 返回第一个匹配的元素，`select()` 返回所有匹配的元素，组成一个列表。一条名言只有一个文本和一个作者，所以用 `select_one`；但一条名言可能有多个标签，所以用 `select` 拿到全部。

提取文本用 `.get_text()`——它会去掉所有 HTML 标签，只保留纯文字内容。提取标签用的是列表推导式——对每条名言里所有 class 为 tag 的标签，取出文字，组成一个列表。

运行——10 条名言，每条带着作者和标签，整整齐齐地打印出来。从一坨 HTML 到结构化数据，核心代码就这十几行。你把这段代码保存下来，以后爬别的网站只需要改选择器就行。

### [5:45-7:00] 提取属性值：链接和图片

**【画面】** 在已有代码基础上，演示提取 a 标签的 href 属性。对比 `.get_text()` 取文本和 `["href"]` 取属性。

**【旁白】** 刚才我们提取的都是标签里的文字内容。但有时候你要的不是文字，而是标签的属性值——比如链接地址、图片地址。来看一个真实需求：每条名言的作者名旁边，通常有一个链接指向作者的详情页。这个链接长这样：`<a href="/author/Albert-Einstein">`，你想拿到 href 属性的值，也就是这个链接地址。

写法和取文本完全不一样——取文本用 `.get_text()`，取属性用中括号：

```python
link = quote.select_one("a")
href = link["href"]
print(f"作者页面: https://quotes.toscrape.com{href}")
```

`link["href"]` 就像从字典里取值一样——属性名当 key，返回属性值。href 拿到的是相对路径 `/author/Albert-Einstein`，前面拼上域名就变成了完整的 URL。同样的写法也适用于图片——`img["src"]` 拿到图片地址，`img["alt"]` 拿到替代文本。

这个区别一定要记住——**取文本用 `get_text()`，取属性用中括号加属性名**。初学者经常混淆这两个，导致拿到的是一堆标签而不是纯文字，或者反过来。

### [7:00-8:05] 小结 + 提问彩蛋 + 引出下集

**【画面】** 字幕条："requests 拿 HTML → BeautifulSoup 解析 → select 提取 · select() 选所有 / select_one() 选一个 · get_text() 取文本 / [属性名] 取属性"

**【旁白】** 三步走记住：requests 拿 HTML，BeautifulSoup 解析，CSS 选择器提取。核心方法两个——`select()` 选所有匹配的元素，`select_one()` 选第一个。取值方式也有两个——`get_text()` 拿文字内容，中括号加属性名拿属性值。这套组合拳足够你爬取绝大多数静态网页了。复杂的 CSS 选择器写法不用死记——到时候打开 F12 面板，右键复制选择器就行。

**【画面】** 提问彩蛋——字幕条逐条列出三个可直接照抄去问 Kimi / DeepSeek 的 prompt：

1. "我在学 BeautifulSoup。请写一段含多条商品信息（名称、价格、链接）的 HTML 样例，出 5 道 CSS 选择器提取练习题，我先做，做完发你批改。"
2. "请用对比方式讲清 select() 和 select_one()、get_text() 和 [属性名] 的区别，每组各给一个新手常犯的错误示例。"
3. "请扮演爬虫面试官追问我：为什么提取数据前要先按 F12 看结构？为什么建议「先定位容器、再提字段」？"

**【旁白】** 三个 prompt 拿去直接问。别只让它帮你写选择器——选择器抄来容易，换个网页你又不会了。让 AI 把"为什么这么定位"讲明白、把题出给你做，下次你自己也会拆。

今天调的 API 和爬取的网页，都是别人准备好的数据源。如果网站没有 API，数据只在 HTML 里——这集教了你爬取的办法。代码会写了，但该不该爬呢？下集讲爬虫伦理——这是一个比技术更重要的问题。

---

## 演示操作清单

### 完整演示代码

```python
# === V025 演示：BeautifulSoup 与 CSS 选择器完整流程 ===
import requests
from bs4 import BeautifulSoup

# --- 第1步：拿 HTML ---
url = "https://quotes.toscrape.com/"

try:
    response = requests.get(url, timeout=10)
    response.raise_for_status()
except requests.exceptions.RequestException as e:
    print(f"请求失败: {e}")
    exit()

# 看一眼原始 HTML
print("=== HTML 原始片段（前 300 字符）===")
print(response.text[:300])
print()

# --- 第2步：解析 HTML ---
soup = BeautifulSoup(response.text, "html.parser")

# --- 第3步：CSS 选择器提取 ---
# 每条名言在 <div class="quote"> 里
quotes = soup.select(".quote")
print(f"共找到 {len(quotes)} 条名言\n")

for i, quote in enumerate(quotes, 1):
    # 文本在 <span class="text">
    text = quote.select_one(".text").get_text()

    # 作者在 <small class="author">
    author = quote.select_one(".author").get_text()

    # 标签在 <a class="tag">
    tags = [tag.get_text() for tag in quote.select(".tag")]

    print(f"{i}. {author}")
    print(f"   「{text}」")
    print(f"   标签: {', '.join(tags)}")
    print()

# --- 扩展：提取作者详情页链接（取属性值）---
print("=== 作者详情页链接 ===")
seen = set()
for quote in quotes:
    author = quote.select_one(".author")
    if author:
        name = author.get_text()
        link = author.find_next_sibling("a")
        if link and name not in seen:
            href = link.get("href")
            print(f"{name}: https://quotes.toscrape.com{href}")
            seen.add(name)
```

### 运行命令

```bash
# 安装依赖（如尚未安装）
pip install requests beautifulsoup4

# 运行
cd ~/workspace/python-course
python v025_demo.py
```

### 断网备用：预存 HTML 文件

```python
# 如果课堂网络不通，提前保存 HTML 文件备用
# with open("quotes_page.html", "w", encoding="utf-8") as f:
#     f.write(response.text)

# 断网时替换 response.text 为文件内容
# with open("quotes_page.html", "r", encoding="utf-8") as f:
#     html = f.read()
# soup = BeautifulSoup(html, "html.parser")
```

---

## 录制注意

1. **先展示原始 HTML**：在讲解 BeautifulSoup 之前，一定要 `print(response.text[:300])` 让观众看到一坨标签——这建立"程序看到的是标签不是渲染后的页面"的直觉。跳过这一步直接解析，观众会不理解为什么要解析。
2. **F12 对照演示**：讲 CSS 选择器时，配合浏览器 F12 面板——右键某条名言 → 检查，让观众看到 `<div class="quote">` 和里面的 `<span class="text">`。选择器和 HTML 结构的对应关系要眼见为实。
3. **quotes.toscrape.com 是靶场网站**：专为学习设计，可以放心爬。如果网站打不开，用预存的 HTML 文件演示，解析和提取部分不受影响。
4. **字幕条重点**：三步流程出一条字幕条，select vs select_one 出一条，get_text vs 中括号取属性出一条。
5. **提问彩蛋字幕条**：提问彩蛋段的 prompt 字幕条需在后期加上，确保观众能暂停照抄。
