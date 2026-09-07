# V026 爬虫伦理与 robots.txt

## 视频信息

| 项目 | 内容 |
|---|---|
| 编号 | V026 |
| 标题 | 爬虫伦理与 robots.txt |
| 目标时长 | 7 min |
| 对应课次 | L14 网页爬取精要 |
| 前置微课 | V025 BeautifulSoup 与 CSS 选择器 |
| 一句话定位 | 代码会写了不等于该爬——爬虫伦理四问帮你判断该不该出手 |

---

## 逐字稿

### [0:00-0:35] 开场 hook（真实痛点）

**【画面】** 新闻截图滚动——"某程序员爬取某网站数据被判刑""某公司因爬虫被网站起诉索赔"。然后切到一个终端画面，一个没有 sleep 的循环疯狂发送请求。字幕条："技术能做 ≠ 应该做"。

**【旁白】** 上集你学会了爬取网页数据——三步走，requests 拿 HTML，BeautifulSoup 解析，CSS 选择器提取，代码写得行云流水。但先别急着动手去爬真实网站——你知道有人因为写爬虫被判刑吗？也有人因为请求频率太高，把人家的服务器搞崩了，被网站起诉索赔。爬虫代码本身不难写，难的是判断"该不该爬"。今天给你一套判断框架，四道题问完自己再出手。这个问题比写代码重要一百倍，我们认真讲。

### [0:35-2:15] robots.txt：网站的"门禁规则"

**【画面】** 浏览器中打开 `https://quotes.toscrape.com/robots.txt`，展示文件内容。高亮 User-agent、Disallow 等关键字。

**【旁白】** 先来认识一个文件——robots.txt。几乎每个正规网站的根目录下都有一个，里面写着这个网站欢迎哪些爬虫、禁止爬取哪些路径。你可以把它理解为网站主动发布的"门禁规则"——它在告诉你哪些区域可以进，哪些区域不让碰。

访问方式特别简单——域名后面加 `/robots.txt`。比如你想爬 `https://quotes.toscrape.com` 的数据，先去访问 `https://quotes.toscrape.com/robots.txt` 看一眼。

看内容——大概长这样：

```
User-agent: *
Disallow: /
```

`User-agent: *` 表示这条规则对所有爬虫生效——星号是通配符，代表任何爬虫程序。`Disallow: /` 表示禁止爬取根目录下的所有路径，也就是整个网站都不让爬。如果你在 robots.txt 里看到这个，就别爬了——人家明确说了不欢迎。

再看另一种情况：

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/
```

`Allow: /` 表示允许爬取所有页面。但 `/admin/` 和 `/private/` 这两个路径 Disallow——这是后台管理和私密数据，明确不让碰。你只要乖乖地只爬 Allow 的路径就行。

用 Python 检查也很简单，其实就是用 requests 去请求这个 URL：

```python
import requests

robots_url = "https://quotes.toscrape.com/robots.txt"
response = requests.get(robots_url, timeout=10)

if response.status_code == 200:
    print(response.text)
else:
    print(f"未找到 robots.txt（状态码 {response.status_code}）")
```

状态码 200 表示找到了文件，直接打印内容看规则。如果返回 404，说明这个网站没有 robots.txt——但注意，没有 robots.txt 不代表你可以随便爬。它只是没有设置规则，你仍然要遵守法律和道德的底线。robots.txt 是最低门槛，不是通行证。

### [2:15-3:45] 爬虫伦理四问

**【画面】** PPT 展示"爬虫伦理四问"框架，逐条弹出。

**【旁白】** 来看今天最重要的东西——爬虫伦理四问。每次动手写爬虫之前，问自己这四个问题，一个都不能少。

**第一问：有没有 API？** 这是最该先问的。如果对方提供了 API 接口，就老老实实用 API——API 是网站主动给你准备的数据通道，稳定、合规、结构清晰，还有文档。爬网页是退而求其次的选择，只有在网站没有 API、或者 API 不提供你需要的数据时，才考虑爬。上几节课学的 requests 调 API，永远优先于爬 HTML。

**第二问：robots.txt 允许吗？** 刚才讲了，花十秒钟去看一下。Disallow 的路径绝对不碰，这是最起码的尊重。就像别人家门上挂着"谢绝参观"，你不能硬闯。

**第三问：请求频率合理吗？** 这是最容易被忽略、也最容易出事的一个问题。你写一个 for 循环爬 100 页，一秒钟发出去 100 个请求——对你来说只是一行代码，但对人家的服务器来说，这就是一次小规模的流量冲击。如果每个人都这么做，服务器扛不住就会崩溃。正确的做法是每次请求之间加一个 `time.sleep`，把频率控制到和正常用户手动浏览差不多：

```python
import time

for page in range(1, 6):
    url = f"https://quotes.toscrape.com/page/{page}/"
    response = requests.get(url, timeout=10)
    # 解析处理...
    time.sleep(1)  # 每次请求后等 1 秒
```

这一行 `time.sleep(1)` 看起来不起眼，但它可能就是"正常爬取"和"攻击服务器"之间的分界线。宁可慢一点，也不要把人家的服务搞垮。

**第四问：数据涉及隐私或版权吗？** 爬到的数据如果包含用户个人信息——姓名、手机号、地址——停下来，个人信息保护法不是开玩笑的。如果数据有版权——比如别人的文章、图片、视频——也不能随便抓取后商用。涉及隐私和版权的数据，不管 robots.txt 怎么说，都不碰。

四问记住了：查 API、查 robots、控频率、判隐私。

### [3:45-5:30] 四个场景实战判断

**【画面】** PPT 逐个展示四个场景，每个场景配判断结果和理由。

**【旁白】** 光说规则太抽象了，来看四个真实场景，练习判断。技术方案几乎都一样，但"该不该爬"的结论完全不同。

**场景一**：你想爬取学校官网的公开课程表，做一个课表查询小工具，方便同学们查课。判断——学校公开信息，一般风险较低，而且对大家有用。但你要查一下 robots.txt，而且别在选课高峰期疯狂请求——那时候学校服务器本来就忙，你再去凑热闹就是添乱。加 sleep 控制频率。结论：可以爬，但要小心。

**场景二**：你想爬取某电商平台的全部商品价格，写了每秒 100 次请求的循环。判断——每秒 100 次请求，这不是在爬数据，这是在对服务器施加压力。就算商品价格是公开信息，这个频率也绝对不行。如果你真需要电商数据，去找它们有没有开放 API 或合作接口。结论：不该这样爬。

**场景三**：你想爬取一个需要登录才能看到的论坛帖子内容。判断——需要登录意味着这些数据有访问控制，只对注册用户开放。你绕过登录认证去爬取，可能违反网站的服务条款，严重的甚至触犯法律。结论：不该爬。

**场景四**：你想爬取某政府公开数据网站的数据，查了 robots.txt 发现明确 Allow，数据也是公开的政府信息。判断——这是最理想的爬取场景：公开数据加 robots 允许。但仍然要控制请求频率。结论：可以爬。

你发现没有——这四个场景的技术方案几乎完全一样，都是 requests 加 BeautifulSoup。区别在哪？在于你出手之前的判断。AI 能帮你三十秒写好爬虫代码，但"该不该爬"这个问题，只有人能回答。因为只有人知道你的行为会对别人造成什么影响。

### [5:30-6:30] AI 时代爬虫的正确姿势

**【画面】** 展示一段 AI 生成的爬虫代码，用红框标出需要人工审查和补充的部分（timeout、try/except、sleep）。

**【旁白】** 最后说一个 AI 时代的现实。以后你写爬虫，大概率是描述需求让 AI 生成代码——它几十秒就能写好，而且通常能跑通。但 AI 生成的爬虫代码经常漏掉三个关键东西，你必须自己补上：

第一，`timeout` 参数。AI 经常忘记加 `timeout=10`，网络卡住时程序会无限等待，卡死在那里。你审查时一定要补上。

第二，`try/except` 异常处理。网络请求随时可能失败——断网、服务器超时、返回错误页面。AI 有时会省略异常处理，你需要加上，让程序在网络出错时优雅降级。

第三，`time.sleep()` 控制频率。这是 AI 最容易漏的——因为从代码逻辑上来说，不加 sleep 程序也能跑，AI 不会主动加。但从伦理角度来说，必须加。你得自己想清楚：我这个爬虫会不会给对方服务器造成压力？

这三样东西就是"AI 写代码，人把关"的最佳体现。AI 负责"能跑"，你负责"跑得安全、跑得有道德"。审查能力，才是这个时代真正值钱的能力。

### [6:30-7:20] 小结 + 提问彩蛋 + 引出下集

**【画面】** 字幕条："有 API 就别爬 · robots.txt 必须查 · time.sleep() 控频率 · 隐私版权碰不得"

**【旁白】** 爬虫伦理四问记住：查 API、查 robots、控频率、判隐私。代码能写不代表应该写——技术能力越大，责任越大。爬虫如此，以后做 AI 应用也一样。

**【画面】** 提问彩蛋——字幕条逐条列出三个可直接照抄去问 Kimi / DeepSeek 的 prompt：

1. "我在学爬虫伦理。请给我 3 个贴近真实的爬取场景，让我用「查 API、查 robots、控频率、判隐私」四问逐个判断，我判断完你再逐条点评。"
2. "请逐行讲解 robots.txt 里 User-agent、Allow、Disallow 的含义，再给一份示例文件让我分析哪些路径能爬、哪些不能，先别公布答案。"
3. "请生成一段故意缺少 timeout、try/except 和 time.sleep 的爬虫代码，让我自己找出这三个问题并说明后果，最后你来打分。"

**【旁白】** 这集没有代码要背，但有判断要练。把这三个 prompt 发出去，让 AI 给你出场景、挑你方案里的毛病——该不该爬这种题，答案必须你自己给。AI 能写代码，守边界的是你。

M3 数据获取与处理模块还剩最后一个话题——数据处理。你用 API 和爬虫搞来了成百上千条数据，怎么从中发现规律？下集学 Pandas，让你像操作 Excel 一样处理成千上万条数据。

---

## 演示操作清单

### 演示1：检查 robots.txt

```python
# === V026 演示：检查目标网站的 robots.txt ===
import requests

robots_url = "https://quotes.toscrape.com/robots.txt"

try:
    response = requests.get(robots_url, timeout=10)
    if response.status_code == 200:
        print("=== robots.txt 内容 ===")
        print(response.text)
    else:
        print(f"未找到 robots.txt（状态码 {response.status_code}）")
        print("没有 robots.txt 不意味着可以随意爬——仍需遵守法律和道德底线")
except requests.exceptions.RequestException as e:
    print(f"请求失败: {e}")
```

### 演示2：带频率控制的多页爬取

```python
# === V026 演示：合规爬取（含 timeout、异常处理、频率控制）===
import requests
from bs4 import BeautifulSoup
import time

base_url = "https://quotes.toscrape.com/page/{}/"

all_quotes = []

for page in range(1, 4):  # 爬取前 3 页
    url = base_url.format(page)

    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"第 {page} 页请求失败: {e}")
        continue

    soup = BeautifulSoup(response.text, "html.parser")
    quotes = soup.select(".quote")

    for quote in quotes:
        text = quote.select_one(".text").get_text()
        author = quote.select_one(".author").get_text()
        all_quotes.append({"text": text, "author": author})

    print(f"第 {page} 页：提取了 {len(quotes)} 条名言")

    time.sleep(1)  # 关键：每次请求后等 1 秒

print(f"\n共获取 {len(all_quotes)} 条名言")
for i, q in enumerate(all_quotes[:5], 1):
    print(f"{i}. {q['author']}: 「{q['text'][:30]}...」")
print("...")
```

### 运行命令

```bash
cd ~/workspace/python-course

# 检查 robots.txt
python v026_demo1.py

# 合规爬取演示
python v026_demo2.py

# 检查你常用网站的 robots.txt（课后练习）
# python -c "import requests; print(requests.get('https://www.zhihu.com/robots.txt', timeout=10).text[:500])"
```

---

## 录制注意

1. **开场新闻要真实可查**：开场提到的爬虫法律风险案例是真实存在的（如爬取个人信息被追责的案例）。不需要展示具体判决文书，但新闻截图要有真实感。目的不是吓唬学生，是建立"爬虫有边界"的意识。
2. **time.sleep 要强调**：录制时重点讲 `time.sleep(1)` 这一行——它是整集的"灵魂"。可以对比演示"不加 sleep 快速循环"和"加了 sleep 的温和请求"，让观众直观感受频率差异。
3. **四问用字幕条固化**：爬虫伦理四问出一条字幕条——"查 API · 查 robots · 控频率 · 判隐私"。这是本集唯一需要学生记住的东西。
4. **场景判断环节节奏要快**：四个场景每个不超过 30 秒，不要展开讨论细节——重点是让学生建立"出手前先想"的习惯，而不是记住每个场景的答案。
5. **提问彩蛋字幕条**：提问彩蛋段的 prompt 字幕条需在后期加上，确保观众能暂停照抄。
