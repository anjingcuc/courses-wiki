---
title: 第 03 章 · Shell 与脚本初探
---

<div class="pyv2-mod-hero" data-pyv2-page>
  <div class="l">
    <span class="mid-tag">第 03 章</span>
    <b>Shell 与脚本初探</b>
  </div>
  <div class="r">
    <span>终端 · Shell · PowerShell</span>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:20px;">本章要点</h2>
  <div class="pyv2-lessons">
    <div class="pyv2-lesson" data-anim>
      <div class="l-head"><span class="l-no">01</span><b>GUI 与 CLI</b></div>
      <div class="l-body">图形界面与命令行界面各自的适用场景；为什么运维与安全工作以命令行为主：可精确控制、可脚本化、可远程执行。</div>
    </div>
    <div class="pyv2-lesson" data-anim>
      <div class="l-head"><span class="l-no">02</span><b>终端、控制台与 Shell</b></div>
      <div class="l-body">终端与控制台的概念辨析、常见终端模拟器；Shell 的定义与常见实现（cmd / PowerShell / bash）；标准流——stdin、stdout、stderr，理解管道与重定向的基础。</div>
    </div>
    <div class="pyv2-lesson" data-anim>
      <div class="l-head"><span class="l-no">03</span><b>PowerShell 基本用法</b></div>
      <div class="l-body">运行方式与默认终端布局、常用快捷键；管理员与非管理员会话的权限差异；用 Get-Help 查看命令帮助，养成「先查帮助再动手」的习惯。</div>
    </div>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:20px;">课件</h2>
  <div class="aissop-slides"><iframe src="./slideshow.html" title="Shell 与脚本课件" loading="lazy"></iframe></div>
  <div class="aissop-slide-tools">
    <a href="./slideshow.html" target="_blank">新窗口打开课件 ↗</a>
    <span>方向键翻页 · <b>F</b> 键全屏</span>
  </div>
</div>

<div class="pyv2" data-pyv2-page markdown="1">
  <h2 style="font-size:20px;">脚本实例：定时截屏并发送邮件</h2>

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

  ### 练习

  请尝试参考以上代码写出完整的脚本。批处理版本的作业要求见<a href="../cmd-scripts/">自动化与脚本</a>一章。
</div>

<div class="pyv2" data-pyv2-page markdown="1">
  <h2 style="font-size:20px;">Git 与 Gitee</h2>

  ### 配置与使用

  1. 软件配置

  <iframe src="//player.bilibili.com/player.html?aid=71899338&cid=124583059&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" width=100% height=450px> </iframe>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:20px;">随堂小测</h2>
  <div class="pyv2-quiz">
    <script type="application/json" class="quiz-data">
    {
      "title": "第 03 章 · 概念检查",
      "questions": [
        {
          "q": "标准输入、标准输出、标准错误对应的缩写是？",
          "opts": ["stdin / stdout / stderr", "input / output / error", "sin / sout / serr", "stdin / stdout / stdlog"],
          "a": 0,
          "explain": "三个标准流由操作系统为进程提供：stdin（通常为键盘）、stdout 与 stderr（通常为屏幕）。管道与重定向操作的对象就是它们。"
        },
        {
          "q": "在 PowerShell 中查看命令详细帮助的正确做法是？",
          "opts": ["按 F1 键", "Get-Help 命令名", "右键命令名", "帮助只在官网有"],
          "a": 1,
          "explain": "Get-Help 是 PowerShell 内置的帮助系统（如 Get-Help Get-Process -Examples），配合官网文档使用。"
        },
        {
          "q": "「管理员 PowerShell」与普通会话的区别在于？",
          "opts": ["界面颜色不同", "会话拥有系统级权限，能执行影响整机的操作", "只能给管理员使用", "速度更快"],
          "a": 1,
          "explain": "以管理员身份运行的会话可执行系统级更改（写系统目录、改服务、改注册表全局键）。恶意代码分析实验中「管理员与非管理员权限对比」观察的正是权限对行为的影响。"
        }
      ]
    }
    </script>
  </div>
</div>

<div class="pyv2" data-pyv2-page>
  <h2 style="font-size:20px;">章节导航</h2>
  <p style="margin-top:14px;">
    <a class="pyv2-btn primary" href="../cmd-scripts/">下一节：自动化与脚本（实践）→</a>
    <a class="pyv2-btn ghost" href="../maintain/">← 第 02 章 系统维护</a>
  </p>
</div>
