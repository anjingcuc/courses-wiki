# V023 JSON 格式与 F12 面板

## 视频信息

| 项目 | 内容 |
|---|---|
| 编号 | V023 |
| 标题 | JSON 格式与 F12 面板 |
| 目标时长 | 7 min |
| 对应课次 | L12 HTTP 与 Web 基础 |
| 前置微课 | V022 HTTP 请求与响应模型 |
| 一句话定位 | JSON 是互联网数据交换的通用语言，F12 面板让你亲眼看到网页背后的数据流 |

---

## 逐字稿

### [0:00-0:40] 开场 hook（原来你早就认识它）

**【画面】** 屏幕上展示第六节课调 API 返回的那段 JSON 数据——`{"id": "chatcmpl-xxx", "choices": [{"message": {"role": "assistant", "content": "你好！"}}]}`。然后画面回到 L6 课堂笔记，高亮标注 `response.json()` 和 `data["choices"][0]["message"]["content"]`。字幕条："你从第六课就在读 JSON 了。"

**【旁白】** 你可能觉得 JSON 是个新概念，听起来很技术。但其实——从第六节课开始，你每一次调大模型 API 拿到的返回值，都是 JSON。你用 `response.json()` 把它变成字典，再从里面取 `data["choices"][0]["message"]["content"]`。这段代码你已经写过无数遍了。你早就在用 JSON 了，只是今天我们正式给它一个名字，系统地认识它。

而且不夸张地说——整个互联网上 99% 的 API 都用 JSON 传递数据。它是数据交换的通用语言。今天花七分钟把它彻底搞懂。

### [0:40-2:30] JSON 六种类型与 Python 的映射

**【画面】** PPT 左右对照——左边是 JSON 的六种类型，右边是对应的 Python 类型，中间用箭头连起来。每种类型配一个示例。

**【旁白】** JSON 全名叫 JavaScript Object Notation——JavaScript 对象标记。名字里虽然带着 JavaScript，但它跟编程语言完全无关，就是一种纯文本的数据格式。任何语言都能读写 JSON——Python、Java、Go、JavaScript 全都支持。

它一共只有六种类型。不需要死记，我直接对应到你已经学过的 Python 类型：

**对象**——就是 Python 的字典。用花括号包起来，里面是键值对。比如 `{"name": "张三", "age": 20}`。你从第七课就在操作字典了。

**数组**——就是 Python 的列表。用方括号包起来，元素用逗号分隔。比如 `[1, 2, 3]` 或者 `["Python", "AI"]`。

**字符串**——和 Python 字符串一样，用双引号包起来。注意 JSON 里只能用双引号，不能用单引号。

**数字**——对应 Python 的整数和浮点数。`42` 是整数，`3.14` 是浮点数，和 Python 没区别。

**布尔**——JSON 里是小写的 `true` 和 `false`，对应 Python 的大写 `True` 和 `False`。大小写不同，但 `json.loads()` 会自动帮你转换，不用手动管。

**空值**——JSON 里是 `null`，对应 Python 的 `None`。也是自动转换的。

就这六种。你之前学过的字典、列表、字符串、数字、布尔值、None——JSON 里全有对应。所以读 JSON 对你来说**没有任何新知识**，只是换了个名字和写法。

补充一个概念——JSON 是纯文本。你打开一个 JSON 文件，里面就是普通文本，没有任何二进制的东西。这意味着你用记事本都能打开它、编辑它。而 Python 提供了 `json` 模块帮你做两种转换：`json.loads()` 把 JSON 文本变成 Python 对象，`json.dumps()` 反过来把 Python 对象变成 JSON 文本。loads 和 dumps，一个加载一个转储，名字很形象。

### [2:30-3:40] 嵌套结构怎么逐层拆解

**【画面】** 屏幕上一段嵌套 JSON，用缩进展示层级。鼠标逐层展开，第一层、第二层、第三层分别用不同颜色高亮。

**【旁白】** 真实的 API 响应不会那么简单——往往是嵌套的，字典套列表，列表套字典，好几层。刚看到可能觉得吓人，但拆法就一个——**一层一层往下剥**。

看这段 JSON：

```json
{
  "status": "success",
  "data": {
    "user": {
      "name": "张三",
      "skills": ["Python", "AI"]
    }
  }
}
```

怎么读它？从外往里，一层一层走。

第一层——最外面是一个字典，有两个 key：`status` 和 `data`。`status` 的值是字符串 `"success"`。

第二层——`data` 的值又是一个字典，里面有 `user`。

第三层——`user` 的值还是一个字典，里面有 `name` 和 `skills`。`name` 是字符串 `"张三"`，`skills` 是一个列表。

在 Python 里逐层取值，就是一路用方括号或 `.get()` 往下点：

```python
import json

json_str = '{"status": "success", "data": {"user": {"name": "张三", "skills": ["Python", "AI"]}}}'

data = json.loads(json_str)
name = data["data"]["user"]["name"]           # 张三
skills = data["data"]["user"]["skills"]       # ["Python", "AI"]
print(f"姓名: {name}")
print(f"技能: {'、'.join(skills)}")
```

`json.loads()` 把 JSON 文本变成 Python 字典。然后 `data["data"]["user"]["name"]`——一层一层往下取，跟你在树上摘果子一样，顺着枝干走到末梢。最后 `skills` 是个列表，用 `.join()` 拼成一句话输出。

这里有个实用技巧。遇到不熟悉的嵌套 JSON，不要肉眼盯着看——把 JSON 文本复制粘贴给 AI，让它帮你画出层级结构树。比如你可以说"帮我分析这段 JSON 的层级结构，标注每个字段的类型"。AI 返回的结构说明，比你肉眼数括号快多了。但记住——AI 分析完之后，你自己要写代码验证一下，确认它说的对。

### [3:40-5:40] 可运行闭环：F12 面板看到网页背后的 JSON

**【画面】** 浏览器打开 httpbin.org/json 网页 → 按 F12 打开开发者工具 → 切到 Network 面板 → 刷新页面 → 点击请求 → 展示 Headers 标签（方法、URL、状态码）和 Response 标签（JSON 数据）。然后切到 VS Code，用 Python 解析同样的数据。

**【旁白】** 现在做一件特别爽的事——用浏览器 F12 开发者工具，亲眼看看网页背后的数据流。这个技能以后你会反复用到。

打开 Chrome 浏览器，地址栏输入 `httpbin.org/json`。页面上显示了一段 JSON 文本。这只是浏览器帮你把原始数据展示出来了。现在按键盘上的 **F12** 键——开发者工具弹出来了。如果找不到，右键点页面选"检查"也能打开。

切换到 **Network** 面板——这个面板记录了浏览器发出的所有网络请求。现在它是空的。刷新页面（按 F5），你会看到一条请求出现了——就是浏览器去 `httpbin.org/json` 拿数据的那条。

如果你觉得请求太多看不过来，可以点上面的 **Fetch/XHR** 过滤器——它只显示数据请求，把图片、CSS、JS 这些杂项过滤掉。以后你做爬虫调 API 时，这个过滤器特别有用，帮你快速定位"哪条请求返回了我要的数据"。

点击这条请求，右边弹出详情面板。**Headers** 标签——你能看到请求方法是 GET，状态码是 200，请求 URL 也在这。这不就是上节课讲的请求四要素和响应三要素吗？完全对上了。再点 **Response** 标签——服务器返回的完整 JSON 数据就在这里，和你在 Python 里 `response.json()` 拿到的东西一模一样。

F12 Network 面板就像一扇窗户——让你看到浏览器和服务器之间到底在聊什么。以后做爬虫、调 API、调试前后端，这个面板你会天天用。

现在回到 VS Code，用 Python 取同样的 JSON 里的数据：

```python
import requests

response = requests.get("https://httpbin.org/json", timeout=10)

if response.status_code == 200:
    data = response.json()
    slideshow = data.get("slideshow", {})
    print(f"标题: {slideshow.get('title')}")
    print(f"作者: {slideshow.get('author')}")
    print(f"幻灯片数: {len(slideshow.get('slides', []))}")

    # 遍历列表结构
    for slide in slideshow.get("slides", []):
        print(f"  - {slide.get('title')}")
else:
    print(f"请求失败: {response.status_code}")
```

运行——标题、作者、幻灯片数量全拿到了，每张幻灯片的标题也遍历输出了。

注意取值时我用的是 `.get()` 而不是中括号。`data.get("slideshow", {})`——如果 `slideshow` 这个 key 不存在，返回空字典而不是直接崩。`slideshow.get("slides", [])`——如果 `slides` 不存在，返回空列表。这是处理 API 响应的标准安全姿势，因为真实 API 有时候某些字段会有、有时候没有，你必须防一手。

还有一个实用建议——读 JSON 的时候，如果你不确定结构，先 `print(response.json())` 把整个字典打印出来看一眼。Python 打印字典会保留缩进和引号，你能直接看到层级关系。如果内容太多看不过来，用上一节课学的办法——把 JSON 复制给 AI，让它帮你分析结构。但不管 AI 怎么说，最终取值代码你自己写一遍跑一遍，确认能拿到数据才算数。

### [5:40-6:50] 小结 + 提问彩蛋 + 引出下集

**【画面】** 字幕条："JSON 六类型 = dict/list/str/int·float/bool/None · 嵌套逐层剥 · F12 Network 看数据流 · 取值用 .get()"

**【旁白】** 三句话总结今天：JSON 只有六种类型，和你学过的 Python 类型一一对应，没有任何新东西；嵌套结构一层一层往下剥，取值用 `.get()` 更安全；F12 Network 面板是你观察网页数据流的窗户，以后天天用。

**【画面】** 提问彩蛋——字幕条逐条列出三个可直接照抄去问 Kimi / DeepSeek 的 prompt：

1. "我在自学 JSON。请围绕「JSON 六种类型与 Python 类型的对应关系」扮演面试官，连续追问我 5 个问题，我答错了就当场纠正并讲清原因。"
2. "请生成一段三层嵌套的 JSON，出 5 道用 Python 逐层取值的练习题，先别给答案，我做完发你批改。"
3. "请解释 JSON 里的 true/false/null 和 Python 的 True/False/None 为什么写法不同，json.loads() 转换时到底发生了什么？"

**【旁白】** 课后别急着合电脑——把这三句 prompt 原样发给 Kimi 或 DeepSeek。重点不是让它替你分析 JSON，而是让它给你出题、向你追问。它考你，你动手跑代码验证，知识才真正是你的。

今天你理解了 HTTP 原理和 JSON 格式，也学会用 F12 看网络请求。下节课我们正式上手——用 requests 库调用真实的公开 API，从天气到名言，把数据真正拿下来。

---

## 演示操作清单

### 演示1：JSON 六种类型对照（快速演示）

```python
# v023_demo1.py
import json

# 一段包含所有六种类型的 JSON
json_str = '''
{
  "name": "张三",
  "age": 20,
  "gpa": 3.8,
  "is_active": true,
  "nickname": null,
  "skills": ["Python", "AI", "数据分析"]
}
'''

data = json.loads(json_str)

# 观察 JSON 类型到 Python 类型的映射
print(type(data))                  # <class 'dict'>
print(type(data["name"]))          # <class 'str'>
print(type(data["age"]))           # <class 'int'>
print(type(data["gpa"]))           # <class 'float'>
print(type(data["is_active"]))     # <class 'bool'>  (true → True)
print(data["nickname"])            # None (null → None)
print(type(data["skills"]))        # <class 'list'>
```

### 演示2：嵌套 JSON 逐层取值

```python
# v023_demo2.py
import json

json_str = '''
{
  "status": "success",
  "data": {
    "user": {
      "name": "张三",
      "skills": ["Python", "AI"]
    }
  }
}
'''

data = json.loads(json_str)

# 逐层取值
name = data["data"]["user"]["name"]
skills = data["data"]["user"]["skills"]

print(f"姓名: {name}")
print(f"技能: {'、'.join(skills)}")
```

### 演示3：requests 取 JSON + F12 联动

```python
# v023_demo3.py
import requests

response = requests.get("https://httpbin.org/json", timeout=10)

if response.status_code == 200:
    data = response.json()
    slideshow = data.get("slideshow", {})
    print(f"标题: {slideshow.get('title')}")
    print(f"作者: {slideshow.get('author')}")
    print(f"幻灯片数: {len(slideshow.get('slides', []))}")

    for slide in slideshow.get("slides", []):
        print(f"  - {slide.get('title')}")
else:
    print(f"请求失败: {response.status_code}")
```

### F12 操作步骤（录制参考）

```
1. 打开 Chrome / Edge 浏览器
2. 地址栏输入 https://httpbin.org/json 回车
3. 按 F12 打开开发者工具（或右键 → 检查）
4. 切换到 Network（网络）面板
5. 刷新页面（F5）
6. 在请求列表中点击 "json" 这条请求
7. 展示 Headers 标签：Request Method = GET, Status Code = 200
8. 展示 Response 标签：完整的 JSON 数据
9. （可选）点击 Fetch/XHR 过滤器，只看数据请求
```

### 运行命令

```bash
cd ~/workspace/python-course
pip install requests     # 如果尚未安装
python v023_demo1.py
python v023_demo2.py
python v023_demo3.py
```

---

## 录制注意

1. **F12 面板是本集核心**：F12 Network 面板的操作一定要录屏实拍，不要用 PPT 模拟。用 Chrome 演示，口播一句"Edge 也一样，快捷键都是 F12"。重点展示 Headers 标签（方法、状态码）和 Response 标签（JSON 数据），让观众直观看到"网页背后的数据流"。
2. **JSON 类型对照表用 PPT 静态画面**：六种类型的对照表适合做成 PPT 画面，左右对照、逐行高亮，比口播效果好。布尔值 `true/false` → `True/False` 和 `null` → `None` 的映射重点标注。
3. **.get() 安全取值要强调**：演示3中 `data.get("slideshow", {})` 和 `slideshow.get("slides", [])` 的写法要重点讲解——给默认值防止 KeyError。这是后面做 API 调用项目的基本功。
4. **时长控制点**：如果 F12 实拍占时较多，演示1（JSON 六类型）可压缩为口播带过，直接跳到演示2的嵌套取值。核心是让观众理解"JSON = Python 类型"的映射 + F12 面板的操作体验。
5. **提问彩蛋字幕条**：提问彩蛋段的 prompt 字幕条需在后期加上，确保观众能暂停照抄。
