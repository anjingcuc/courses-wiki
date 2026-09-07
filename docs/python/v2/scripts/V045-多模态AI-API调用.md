# V045 多模态 AI API 调用

## 视频信息

| 项目 | 内容 |
|---|---|
| 编号 | V045 |
| 标题 | 多模态 AI API 调用 |
| 目标时长 | 8 min |
| 对应课次 | L24 多模态 AI 应用 |
| 前置微课 | V044 RAG 完整链路搭建 |
| 一句话定位 | 让 AI 看懂图片、把文字变成语音——用 Vision API 和 TTS 搭建"图片→描述→朗读"多模态链路 |

---

## 逐字稿

### [0:00-0:35] 开场 hook：一张图片变成一段语音

**【画面】** 终端中运行 `python multimodal_demo.py`，传入一张课程大纲截图。程序打印"步骤1：分析图片..."，AI 返回"这是一份包含7个模块的 Python 课程大纲，涵盖从环境搭建到 AI 应用开发..."。接着打印"步骤2：生成语音..."，终端显示音频文件已保存。播放生成的 mp3——AI 用中文朗读了图片描述。画面定格，字幕条："图片 → AI 理解 → 文字描述 → AI 朗读"。

**【旁白】** 看这个。给它一张课程大纲的截图——AI 准确描述了图片内容。然后把描述的文字转成语音，播放出来。从图片到文字再到语音，一条链路串起了三种模态。这就是多模态 AI——让大模型不只处理文字，还能看图、能说话。今天就来搭这条链路。

### [0:35-2:00] 什么是多模态与模态链路

**【画面】** PPT 展示"模态"概念。四种模态用图标表示：📝 文本、🖼️ 图片、🔊 音频、🎥 视频。下方展示"模态链路"——一个箭头串联三个图标：图片 →（Vision API）→ 文本 →（TTS API）→ 音频。标注："一个 API 的输出是另一个 API 的输入"。再放一个例子：音频 →（STT API）→ 文本 →（LLM）→ 文本 →（TTS）→ 音频。

**【旁白】** 先理清概念。模态就是数据的类型——文字是一种模态，图片是另一种，音频又是一种。多模态 AI 就是让大模型能处理多种类型的数据。

多模态应用的核心设计模式叫"模态链路"——一个 API 的输出是另一个 API 的输入。比如今天的链路：先调 Vision API 让 AI 看图片，输出文字描述；再把文字传给 TTS API 做语音合成，输出音频。两步串联，输入图片、输出语音。

设计多模态应用时，第一步不是写代码，是画链路图——输入是什么模态？中间需要哪些转换？输出是什么模态？画清楚链路，代码自然就有了。

### [2:00-3:30] Vision API：让 AI 看懂图片

**【画面】** VS Code 中展示 `describe_image` 函数。重点高亮消息结构中 `content` 是一个列表——包含 `text` 类型和一个 `image_url` 类型。用标注解释：本地图片要先 base64 编码再放进 URL。终端运行，传入一张包含表格的图片，AI 返回详细描述。

**【旁白】** 来看第一步——Vision API，让 AI 看懂图片。

图片在 API 请求中怎么传？如果图片在本地文件里，先用 base64 编码成字符串，然后拼进消息的 `image_url` 字段。如果图片在网上有 URL，直接传 URL 就行。

消息结构和普通聊天有点不同——`content` 不是字符串，而是一个列表，包含两部分：一部分是 `type: "text"` 的文本指令，另一部分是 `type: "image_url"` 的图片数据。

```python
base64_image = encode_image("test.jpg")

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "请描述这张图片的内容。"},
            {"type": "image_url", "image_url": {
                "url": f"data:image/jpeg;base64,{base64_image}"
            }}
        ]
    }]
)
```

Vision API 最典型的用法有两个。第一个是图片描述——给它一张照片，让 AI 说"图里有什么"。第二个是 OCR——给它一张包含文字的图片，让 AI 把文字提取出来。区别全在 prompt——同一个 API、同一张图片，prompt 不同，输出完全不同。

> **注意**：DeepSeek API 的 Vision 支持情况以官方文档为准。如当前版本不支持图片输入，可改用 Kimi Vision 或智谱 GLM-4V，接口格式完全一致，只是 `base_url` 和 `model` 不同。

### [3:30-4:45] TTS：让 AI 说话

**【画面】** VS Code 中展示 `text_to_speech` 函数。调用 `client.audio.speech.create`，传入 model、voice 和 input 文本，返回结果用 `stream_to_file` 保存为 mp3。终端运行，输入一段文字，生成并播放音频文件。旁边标注备选方案 edge-tts（免费）。

**【旁白】** 第二步——TTS，文字转语音。

TTS 的输入是一段文字，输出是一个音频文件。调用方式很简单——指定语音模型、声音类型和要读的文字，API 返回音频数据，保存成 mp3 文件就行。

```python
response = client.audio.speech.create(
    model="deepseek-tts",
    voice="alloy",
    input="你好，这是多模态AI的语音合成测试。"
)
response.stream_to_file("output.mp3")
```

课堂演示如果 API 的 TTS 接口不可用，可以用 edge-tts 替代——免费、不消耗 API 额度、中文语音质量好。代码更简单，几行就能把文字变语音。核心是理解"文本 → 音频"这个模态转换，具体用哪个服务不重要。

### [4:45-6:30] 可运行闭环：图片 → 描述 → 语音

**【画面】** VS Code 中展示 `image_to_speech` 函数。用流程标注三个步骤：①base64 编码图片 → 调 Vision API 获取描述；②把描述文本 → 调 TTS API 生成语音；③返回描述文本和音频路径。终端运行完整链路，展示中间结果和最终输出。

**【旁白】** 现在把两步串起来。写一个 `image_to_speech` 函数——输入图片路径，输出描述文本和语音文件。

第一步，调 `describe_image` 把图片交给 Vision API，prompt 要求"用简洁的中文描述图片内容，不超过 100 字"。为什么限制字数？TTS 对超长文本处理慢、效果也差。100 字以内刚好适合一段语音。

第二步，把描述文本交给 `text_to_speech` 生成语音文件。

第三步，返回一个字典，包含描述文本和音频文件路径——调用者既能看到文字也能播放语音。

运行看效果。传入一张课程截图——AI 描述"这是一份 Python 课程大纲，包含7个模块，从环境搭建到 AI 应用开发"。然后 TTS 把这段文字变成语音，保存到 mp3 文件。播放——AI 用自然的中文朗读了这段描述。

这就是完整的多模态链路：图片进去，语音出来，中间经过 Vision 和 TTS 两个 API。每个 API 只做一件事——Vision 负责理解图片输出文字，TTS 负责把文字变语音。组合起来就是强大的多模态应用。

### [6:30-7:30] Prompt 调优：通用描述 vs OCR 模式

**【画面】** 终端分屏对比。左半"通用描述"：prompt 是"请描述这张图片"，AI 回答"这是一张代码编辑器的截图，深色主题..."。右半"OCR 模式"：prompt 是"请提取图片中所有文字，保持原始格式"，AI 直接输出代码文本。字幕条："同一个 API · 同一张图片 · prompt 不同效果完全不同"。

**【旁白】** 来看一个重要对比。同一张图片——一段代码的截图——用两种不同 prompt 调 Vision API。

第一种，通用描述。prompt 就一句"请描述这张图片"。AI 回答"这是一张代码编辑器截图，深色主题背景，内容是 Python 函数定义"。

第二种，OCR 模式。prompt 换成"请提取图片中所有文字内容，保持原始格式和换行，只输出文字不要描述"。AI 直接输出了图片中的代码文本——`def hello(): print("world")`。

同一个 API，同一张图片，prompt 不同，效果天壤之别。这就是 V038 Prompt 工程的延伸——多模态场景下 prompt 同样关键。你要图片描述就用描述型 prompt，你要提取文字就用 OCR 型 prompt。明确告诉 AI "你要什么"，它才能给你想要的。

### [7:30-7:50] 小结

**【画面】** 字幕条："多模态 = 多种数据类型 · 模态链路：输出变输入 · Vision 看 + TTS 说 · prompt 决定输出模式"。

**【旁白】** 核心记住几件事：多模态就是让 AI 处理文字以外的数据类型——图片、音频等；模态链路是多模态应用的核心模式——一个 API 的输出喂给下一个 API；Vision API 让 AI 看图片，TTS 让 AI 说话；同一个 Vision API，prompt 不同输出完全不同。

### [7:50-8:15] 提问彩蛋：三个 prompt 抄下来直接问

**【画面】** 字幕条逐条列出三个 prompt（编号 1/2/3，可暂停照抄）：
1. "请讲清楚多模态 API 的消息里，为什么 content 要从字符串改成列表？text 和 image_url 两种类型分别装什么？本地图片为什么要先 base64 编码？"
2. "我刚学会用 Vision API + TTS 搭'图片→描述→语音'链路。请给我出 3 个模态链路设计题，比如'语音→文字→翻译→语音'，让我画链路图并说明每步用什么 API——先别给答案。"
3. "同一个 Vision API，'描述图片'和'OCR 提取文字'两种 prompt 为什么输出完全不同？请再各给我 2 个不同用途的 prompt 示例并解释差别。"

**【旁白】** 这三个 prompt 抄下来直接问 Kimi 或 DeepSeek。注意第二个——让 AI 出题、你画链路、它来批改，这比让它替你写代码学得多。把 AI 当教练，别当代写。

### [8:15-8:25] 引出下集

**【画面】** 下集预告卡片："V046 AI Agent 原理与 ReAct 框架——多模态 AI 还是'你问它答'，Agent 让 AI 主动思考、自主行动"。

**【旁白】** 今天 AI 能看图、能说话了。但它还是被动的——你问它才答，你给它图片它才看。能不能让 AI 自己决定什么时候看图、什么时候说话、什么时候算数学？这就是下一站——Agent。我们下集见。

---

## 演示操作清单

### 文件结构

```
v043_demo/
├── .env
├── test_image.jpg      （测试图片）
└── multimodal_demo.py  （多模态链路代码）
```

### 完整代码：multimodal_demo.py

```python
# multimodal_demo.py —— 多模态链路：图片 → 描述 → 语音
import base64
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.environ.get("DEEPSEEK_API_KEY", ""),
    base_url="https://api.deepseek.com"
)


# ---- 工具函数 ----

def encode_image(image_path):
    """将本地图片编码为 base64 字符串"""
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def describe_image(image_path, prompt="请详细描述这张图片的内容。"):
    """调用 Vision API 描述图片"""
    base64_image = encode_image(image_path)

    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[{
            "role": "user",
            "content": [
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": {
                    "url": f"data:image/jpeg;base64,{base64_image}"
                }}
            ]
        }]
    )
    return response.choices[0].message.content


def text_to_speech(text, output_file="output.mp3"):
    """调用 TTS API 将文字转为语音"""
    response = client.audio.speech.create(
        model="deepseek-tts",
        voice="alloy",
        input=text
    )
    response.stream_to_file(output_file)
    return output_file


# ---- 完整链路 ----

def image_to_speech(image_path, output_audio="description.mp3"):
    """图片 → AI描述 → 语音朗读"""
    print(f"步骤1: 分析图片 {image_path}...")
    description = describe_image(
        image_path,
        prompt="用简洁的中文描述这张图片的主要内容，不超过100字。"
    )
    print(f"  描述: {description}")

    print(f"步骤2: 生成语音...")
    audio_file = text_to_speech(description, output_audio)
    print(f"  音频已保存: {audio_file}")

    return {"description": description, "audio_file": audio_file}


# ---- 运行 ----

if __name__ == "__main__":
    result = image_to_speech("test_image.jpg", "description.mp3")
    print(f"\n完成! 描述: {result['description']}")
    print(f"音频文件: {result['audio_file']}")
```

> **注意**：
> - **Vision API**：DeepSeek 的 Vision 支持以官方文档为准。如不支持图片输入，改用 Kimi Vision（`base_url="https://api.moonshot.cn/v1"`，`model="moonshot-v1-8k-vision-preview"`）或智谱 GLM-4V（`base_url="https://open.bigmodel.cn/api/paas/v4"`，`model="glm-4v"`）。接口格式一致，只改 base_url 和 model。
> - **TTS API**：如 DeepSeek 不提供 TTS，备选 edge-tts（`pip install edge-tts`，免费）：`import edge_tts; import asyncio; communicate = edge_tts.Communicate(text, voice="zh-CN-XiaoxiaoNeural"); await communicate.save(output_file)`。

### 运行命令

```bash
cd ~/workspace/python-course/v043_demo
pip install openai python-dotenv
python multimodal_demo.py
```

---

## 录制注意

1. **开场链路必须完整运行**：开场展示的"图片→描述→语音"链路必须真实跑通——包括最终播放生成的音频文件。让用户看到、听到最终效果，才有"我也要做出来"的冲动。如果 TTS API 不可用，务必用 edge-tts 备选方案确保音频能生成。
2. **Vision 消息结构要逐字段拆解**：`content` 是列表而非字符串——这个差异是初学者最容易卡住的地方。用高亮标注 `text` 部分和 `image_url` 部分，让观众理解"一条消息同时包含文字和图片"。
3. **Prompt 对比实验是教学亮点**：通用描述 vs OCR 模式的对比要放在同一画面，让观众清楚看到"prompt 改变如何影响输出"。呼应 V038 Prompt 工程，强化"prompt 是多模态应用的核心调控手段"。
4. **语速控制**：整体旁白约 1850 字，按 235 字/分钟控制在 8 分钟以内。Vision API 的消息结构讲解适当放慢，TTS 和完整链路可以稍快。
5. 提问彩蛋段的 prompt 字幕条需在后期加上，确保观众能暂停照抄。
