# V007 - 申请 API Key 与第一次调用

## 视频信息

| 项目 | 内容 |
|---|---|
| 编号 | V007 |
| 标题 | 申请 API Key 与第一次调用 |
| 目标时长 | 8min |
| 对应课次 | L4 |
| 前置微课 | V006 大模型 API 是什么 |
| 一句话定位 | 从零到一——安装 SDK、申请 Key、写出 5 行核心代码，亲眼看到自己的代码让 AI 开口回答 |

## 逐字稿

### [0:00-0:30] 开场 Hook：成果前置

【画面】终端中输入 `python chat.py`，回车后屏幕逐字打印出 AI 回复：「1. 理解变量和数据类型 2. 掌握控制流 3. 学会写函数组织代码」。画面定格，放大回复文本。

【旁白】看，屏幕上这段话，不是我在网页聊天框里一个字一个字打出来的——是我的 Python 代码，自动向大模型发了一条请求，把回答打印到了终端。今天这集，我带你从零开始，五步搞定：装工具、拿密钥、写代码、跑起来。上集讲了 API 是什么，现在，轮到你亲手写代码了。

### [0:30-2:00] 第一步：安装 SDK + 第二步：申请 API Key

【画面】分屏左侧：终端执行 `pip install openai`，等待安装完成的进度条。分屏右侧：浏览器打开 DeepSeek 开放平台，演示创建 API Key 的操作流程——点击「API Keys」→「创建 API Key」→ 复制以 `sk-` 开头的密钥字符串。字幕标注关键步骤。

【旁白】第一步，装工具。打开终端，输入 `pip install openai`，回车。这里你可能会问：我们不是用 DeepSeek 吗，为什么装的是 openai 这个包？因为 DeepSeek 的接口和 OpenAI 完全兼容，用同一个 SDK 就能调用，省得学两套。装完之后你就有了一个现成的工具包。

第二步，去拿你的 API Key。浏览器打开 DeepSeek 开放平台，地址是 platform.deepseek.com。注册、完成实名认证之后，在左侧菜单找到「API Keys」，点「创建 API Key」，给它随便起个名字，比如就叫 my-first-key。创建完之后你会看到一串以 `sk-` 开头的字符串——这就是你的密钥。注意，这串 Key 只会显示一次，一定要马上复制保存到安全的地方。如果忘了复制，没关系，删掉重新创建一个就行。

上集说过，API Key 就是你的身份证加钱包，它既证明你是谁，又关联了你的账户余额。新用户有免费额度，今天我们调几十次都花不到一分钱，放心用。

### [2:00-3:30] 第三步：代码骨架——import 与创建 client

【画面】VSCode 中新建文件 `chat.py`，逐行输入代码。先输入 import 行和创建 client 的代码块，输入到 `api_key=` 时暂停，弹出字幕提醒「换成你自己的 Key」。

【旁白】第三步，写代码。打开 VSCode，新建一个文件，名字叫 `chat.py`。接下来就五段代码，跟着敲就行。

第一行，`from openai import OpenAI`。这句话的意思是：从 openai 这个工具包里，把 OpenAI 这个工具拿出来。就像你从工具箱里拿出一把螺丝刀，拿到手就能用了。import 这个关键字以后会专门讲，现在你只要知道，它是「引入别人写好的工具」就行了。

接下来，创建一个客户端对象 client。注意看这段代码：

```python
client = OpenAI(
    api_key="sk-你的API Key填这里",
    base_url="https://api.deepseek.com"
)
```

两个参数。第一个 `api_key`，把刚才你复制的密钥粘贴进去，替换掉这行占位文字。第二个 `base_url`，这个告诉程序：不要去找 OpenAI 的服务器，去找 DeepSeek 的服务器。地址就是 `https://api.deepseek.com`。上集打的比方还记得吧——这一步相当于告诉总机，你要接通的是哪家公司。

### [3:30-5:00] 第四步：构造 messages——三种消息角色

【画面】代码继续输入 messages 列表。输入到每一行时，画面右侧弹出标注框，分别标注 system / user / assistant 三个角色，用不同颜色区分。输入完 messages 后画面暂停，展示完整的 messages 列表。

【旁白】第四步是最关键的——构造你要发给 AI 的消息。来看这段代码：

```python
messages = [
    {"role": "system", "content": "你是一个友善的Python编程导师，回答简洁，适合初学者理解。"},
    {"role": "user", "content": "用一句话告诉我：学Python最重要的三件事是什么？"}
]
```

这是一个列表，里面放了几个字典。每个字典有两个键：`role` 是角色，`content` 是内容。

大模型对话里有三种角色，你一定要记住。第一种，`system`——这是你给 AI 设定的人设。这里我写了「你是一个友善的 Python 编程导师」，AI 之后所有的回答都会符合这个人设。你把它改成「你是一个海盗船长」，AI 就会用海盗的口吻回答你，但技术内容照样准确。所以 system 是控制 AI 行为的开关。

第二种，`user`——这是你问的问题。比如这里我问「学 Python 最重要的三件事是什么」。

第三种，`assistant`——这是 AI 的回复。做单轮对话的时候你不用写它，AI 会自动返回。但做多轮对话的时候，你需要把之前的对话历史都放进 messages 里，包括 assistant 的回复，AI 才能记住上下文。多轮对话以后会专门讲，今天我们先把单轮跑通。

所以这个 messages 列表，本质就是一段结构化的对话剧本：你告诉 AI「你是谁」「我问你什么」，AI 据此给你回复。

### [5:00-6:15] 第五步：发送请求与提取回复

【画面】继续输入 `chat.completions.create()` 调用代码。然后输入提取回复的两行代码。输入完毕后展示完整的 chat.py 全貌，用高亮标注五个步骤对应的代码段，并标注序号 ①~⑤。

【旁白】第五步，发送请求，拿到结果。看这两行：

```python
response = client.chat.completions.create(
    model="deepseek-chat",
    messages=messages
)
```

`client.chat.completions.create()`，这一长串就是发起调用的方法。两个参数：`model` 指定用哪个模型，这里填 `deepseek-chat`；`messages` 就是我们上一步构造好的消息列表。这一行执行完，请求就发出去了，AI 会处理你的消息然后返回结果，存在 `response` 这个变量里。

最后，从返回结果里把文字提取出来：

```python
reply = response.choices[0].message.content
print(reply)
```

`response.choices[0].message.content`，这一长串看起来吓人，但逻辑很简单：返回结果里有一个 choices 列表，第 0 个元素的 message 的 content，就是 AI 说的话。你不需要记住这个完整路径，需要的时候回来抄就行。拿到文字之后，`print` 打印出来。

整个流程就五步：import 引入工具、创建 client 连接服务器、构造 messages 写剧本、create 发请求、取 content 拿回复。这个骨架你以后会反复用。

### [6:15-7:30] 运行演示 + 安全提醒

【画面】终端中执行 `python chat.py`，等待约 2 秒后打印出 AI 回复。放大展示回复内容。然后画面切到 VSCode，演示修改 system prompt 为「海盗船长」版本，重新运行，展示风格截然不同的回复。接着画面切到一张红色警告卡片，展示「API Key 安全三原则」。

【旁白】好，代码写完了，来跑一下。终端输入 `python chat.py`，回车。稍等一两秒——看到了吗？AI 回复了：「理解变量和数据类型、掌握控制流、学会写函数组织代码」。这就是你写的代码在和 AI 对话，不是网页聊天框。

现在试试改一下。把 system 改成「你是一个海盗船长，用海盗的口吻回答编程问题，但技术内容必须准确」，再跑一次。看，AI 这次会说「啊哈，水手，听好了」这种风格。同样的问题，换个 system，回答完全不同——这就是 prompt 工程的魅力。

最后，一件非常重要的事情。你的 API Key 就像银行卡密码，有三条红线绝对不能碰。第一，绝不提交到 Git 仓库——下节课学 Git 会专门讲怎么避免。第二，绝不在截图、录屏、聊天记录里暴露完整的 Key。第三，如果怀疑泄露了，马上去平台重新生成，旧 Key 会自动失效。养成习惯，从第一天开始。

### [7:30-8:25] 小结、提问彩蛋与引出下集

【画面】画面展示五步代码骨架的总结卡片（import → client → messages → create → content），每一步配一句话注释。

【旁白】来回顾一下今天的五步：import 引入工具，创建 client 连上服务器，构造 messages 写好对话剧本，调用 create 发送请求，取 content 打印回复。你的代码现在能让 AI 开口说话了。

【画面】字幕条逐条弹出三个可直接照抄的 prompt（每条停留供暂停截图）：
① `我刚用 openai SDK 调通了 DeepSeek。请就 messages 里 system、user、assistant 三种角色各出一道题考我，我答完你再讲解。`
② `这是我的 chat.py 代码：（粘贴你的代码）。请不要改代码，而是连续问我 3 个问题，确认我真的理解每一行，比如 base_url 是干什么的。`
③ `帮我设计 3 个改造 chat.py 的进阶小任务，由易到难，只给任务描述不给代码，让我自己实现。`

【旁白】彩蛋时间。代码能跑，不等于你真懂了。把 chat.py 发给 AI，让它反过来考你——答不上来的地方，就是你的知识漏洞。这三条 prompt 直接照抄，今晚就体验一次"被 AI 面试"。

【画面】切换到下集预告卡片：「V008 Git 基础与分支工作流」。

【旁白】但有个问题——这个 chat.py 现在只有你能跑，代码也没做版本管理。下集我们学 Git，学会怎么管理代码、怎么提交作业，更重要的是怎么在 AI 大改代码之前保住你的成果。记住一句话：AI 大改之前，先 commit。下集见。

## 演示操作清单

### 必敲命令

```bash
# 第一步：安装 OpenAI SDK（兼容 DeepSeek）
pip install openai

# 如果网络慢，用国内镜像源
pip install openai -i https://pypi.tuna.tsinghua.edu.cn/simple

# 运行脚本
python chat.py
```

### 完整代码（chat.py）

```python
# chat.py — 我的第一次大模型 API 调用
from openai import OpenAI

# 创建客户端，指向 DeepSeek 的 API 地址
client = OpenAI(
    api_key="sk-你的API Key填这里",  # ← 换成你自己的 Key
    base_url="https://api.deepseek.com"
)

# 构造消息列表
messages = [
    {"role": "system", "content": "你是一个友善的Python编程导师，回答简洁，适合初学者理解。"},
    {"role": "user", "content": "用一句话告诉我：学Python最重要的三件事是什么？"}
]

# 发送请求
response = client.chat.completions.create(
    model="deepseek-chat",
    messages=messages
)

# 提取并打印 AI 的回复
reply = response.choices[0].message.content
print(reply)
```

### 进阶演示代码（修改 system prompt）

```python
# chat_v2.py — 修改 system prompt，改变 AI 人设
from openai import OpenAI

client = OpenAI(
    api_key="sk-你的API Key填这里",
    base_url="https://api.deepseek.com"
)

messages = [
    {"role": "system", "content": "你是一个海盗船长，用海盗的口吻回答编程问题，但技术内容必须准确。"},
    {"role": "user", "content": "Python 的 print 函数怎么用？"}
]

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=messages
)

print(response.choices[0].message.content)
```

### API Key 安全三原则

```
⚠️ API Key 安全三原则：
1. 绝不把 API Key 提交到 Git 仓库（下节课学 Git 时会再强调）
2. 绝不在课堂截图/录屏中暴露完整 Key
3. 怀疑泄露立即在平台重新生成，旧 Key 自动失效
```

### DeepSeek 开放平台操作步骤

```
1. 浏览器打开 platform.deepseek.com
2. 注册账号并完成实名认证
3. 左侧菜单点击「API Keys」
4. 点击「创建 API Key」，命名（如 my-first-key）
5. 复制 sk- 开头的密钥字符串，安全保存
6. 新用户有免费额度，调几十次不到一分钱
```

## 录制注意

1. **开场成果前置**：开场 30 秒必须是终端运行 `python chat.py` 后 AI 回复出现的画面，让观众第一眼看到「这集做完我能得到什么」。不要用 PPT 标题页开场。
2. **录屏中 API Key 处理**：录制时使用专门创建的临时 Key，录完立即删除。画面中 Key 部分打码或用占位文字，绝不暴露完整密钥。
3. **代码逐行输入**：在 VSCode 中实际敲代码，不要直接粘贴。让观众看到从空白文件到完整代码的过程。每一步讲解时画面暂停在对应代码段。
4. **运行结果要真实**：必须实际运行 `python chat.py` 并展示真实返回，不要用截图或后期合成。如果 API 返回有延迟，保留 1-2 秒等待感，让观众知道这是真实的网络请求。
5. **进阶演示要有反差**：修改 system prompt 后的第二次运行，要选择风格反差大的人设（如海盗船长），让「system 控制 AI 行为」这个概念一目了然。
6. **安全提醒不可省略**：API Key 安全三原则必须在视频中口播加字幕双重呈现，这是课程底线。
7. **语速控制**：整体旁白约 1850 字，按 230 字/分钟控制在 8 分钟以内。讲解代码段时适当放慢，过渡段正常语速。
8. **提问彩蛋**：提问彩蛋段的 prompt 字幕条需在后期加上，确保观众能暂停照抄。
