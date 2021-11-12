---
title: Shell 与脚本初探
---

**下方课件区域方向键控制翻页，`f` 键全屏。**

<iframe src="./slideshow.html" frameborder=0 width=800 height=450></iframe>

## 脚本实例

### 功能描述

下面将带着大家编写一个定时自动截屏并发送到指定邮箱的脚本。

### 关键函数

在 Powershell 脚本中定义一个函数，实现了屏幕截图的功能，如下：

```powershell
[Reflection.Assembly]::LoadWithPartialName("System.Drawing")
function screenshot([Drawing.Rectangle]$bounds, $path) {
    $bmp = New-Object Drawing.Bitmap $bounds.width, $bounds.height
    $graphics = [Drawing.Graphics]::FromImage($bmp)

    $graphics.CopyFromScreen($bounds.Location, [Drawing.Point]::Empty, $bounds.size)
    $bmp.Save($path)

    $graphics.Dispose()
    $bmp.Dispose()
}

$bounds = [Drawing.Rectangle]::FromLTRB(0, 0, 1920, 1080)
screenshot $bounds "C:\screenshot.png"
```

<small>来自[Jeremy@stackoverflow](https://stackoverflow.com/questions/2969321/how-can-i-do-a-screen-capture-in-windows-powershell)</small>

然后实现一个发邮件功能，能够发送邮件到指定邮箱。

```powershell
$username = "MyUserName";
$password = "MyPassword";
$path = "C:\screenshot.png";

function sendemail([String]$email, [String]$attachmentpath) {
    $message = New-Object Net.Mail.MailMessage
    $message.From = $email
    $message.To.Add($email)
    $message.Subject = "截图"
    $message.Body = "屏幕截图"
    $attachment = New-Object Net.Mail.Attachment($attachmentpath)
    $message.Attachments.Add($attachment)

    $smtp = New-Object Net.Mail.SmtpClient("smtp.qq.com", "587")
    $smtp.EnableSSL = $true
    $smtp.Credentials = New-Object System.Net.NetworkCredential($username, $password)
    $smtp.send($message)
    echo "邮件已发送"
    $attachment.Dispose()
 }
sendemail -email "demo@qq.com" -attachmentpath $path
```

<small>参考[IgrDi@stackoverflow](https://stackoverflow.com/questions/36355271/how-to-send-email-with-powershell)</small>

### 程序循环

Powershell 中也有循环语句，这里我们可以使用 `while` 来实现循环。

```powershell
while ($true) {
    $bounds = [Drawing.Rectangle]::FromLTRB(0, 0, 1920, 1080)

    screenshot $bounds "C:\screenshot.png"

    sendmail -email "demo@qq.com" -attachmentpath "C:\screenshot.png"

    # 等待一秒
    Start-Sleep -s 1
}
```

### 脚本的参数

在上面的函数示例中，发送邮件时我们直接将以及邮箱写在了脚本中，这样会导致信息泄露，所有我们改造一下脚本，通过参数将用户名、密码、邮箱地址传给脚本，这样脚本内就不会保存我们的个人信息了。在脚本最开始加入以下代码：

```powershell
param ($UserName, $Password, $Mail)
```

这里我们定义了三个有名字的参数，执行脚本时，通过指定参数名加上参数值的形式来使用：

```powershell
script.ps1 -UserName anjing -Password akldjfx8kq3jk24 -Mail admin@qq.com
```

### 作业

请尝试参考以上代码写出完整的脚本。

---

## Git 与 Gitee 

### 软件安装

在进行作业仓库的获取、提交等操作之前，需要先安装两个软件：

- [Git for Windows](https://git-scm.com/download/win)
- [TortoiseGit](https://tortoisegit.org/download/)

`Git for Windows` 是 `Windows` 下的命令行 `git` 工具，安装完成后，可以重启 `cmd` 并输入 `git`。如果正确输出命令帮助，则说明安装成功，且系统右键菜单会多出 `Git GUI Here` 以及 `Git Bash Here` 两个选项。

为了使用图形化界面来使用 `git` ，我们可以安装俗称的“小乌龟”，即 `TortoiseGit`。安装完成后可使用系统右键菜单来运行实现各种 `git` 操作。

以上两个软件的安装过程不在此赘述，需要注意的是，`TortoiseGit` 安装完成后，在其安装目录下的 `bin` 文件夹中有一个 `puttygen.exe` 可用于生成公私钥对，后面的步骤中会用到。

### 配置与使用

1. Github 配置部分

<iframe src="//player.bilibili.com/player.html?aid=71899338&cid=124583059&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" width=100% height=450px> </iframe>

2. 编辑提交部分

<iframe src="//player.bilibili.com/player.html?aid=71903458&cid=124590342&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" width=100% height=450px> </iframe>

### 附加资料

Git 官方视频中字 https://www.nowcoder.com/courses/2

---

## Markdown Cheet Sheet

鉴于部分同学对 Markdown 不太熟悉，这里给大家推荐 [Markdown Guide](https://www.markdownguide.org/) 。这个网站是一个 Markdown 学习站点，大家可以上去学习一下语法。下面一小节就是参考他们的 [Markdown Cheet Sheet](https://www.markdownguide.org/cheat-sheet/) 翻译的。当然还有很多中文教程，大家可以自行补习。

### 基本语法

| 元素       | 语法                                                   |
| ---------- | ------------------------------------------------------ |
| 标题       | `# H1`<br/>`## H2`<br>`### H3`                         |
| 粗体       | `**bold text**`                                        |
| 斜体       | `_italicized text_`                                    |
| 引用       | `> blockquote`                                         |
| 有序列表   | `1. First item`<br>`2. Second item`<br>`3. Third item` |
| 无序列表   | `- First item`<br>`- Second item`<br>`- Third item`    |
| 代码       | `code`                                                 |
| 横向分割线 | `---`                                                  |
| 超链接     | `[title](https://www.example.com)`                     |
| 图片       | `![alt text](image.jpg)`                               |

### 扩展语法

| 元素              | 语法                                                                                                           |
| ----------------- | -------------------------------------------------------------------------------------------------------------- |
| 表格            | `| Syntax | Description |`<br>`| ----------- | ----------- |`<br>`| Header | Title |`<br>`|Paragraph | Text |` |
| Fenced Code Block | \`\`\`<br>`{`<br>`" firstName": "John",`<br>`"lastName": "Smith",`<br>`"age": 25`<br>`}`<br>\`\`\`             |
| 脚注          | `Here's a sentence with a footnote. [^1]`<br>`[^1]: This is the footnote.`                                     |
| 标题 id        | `### My Great Heading {#custom-id}`                                                                            |
| 定义列表 | `term`<br>`: definition`                                                                                       |
| 划掉     | `~~The world is flat.~~`                                                                                       |
| 任务列表         | `- [x] Write the press release`<br>`- [ ] Update the website`<br>`- [ ] Contact the media`                     |
