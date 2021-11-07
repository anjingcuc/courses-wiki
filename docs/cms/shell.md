---
title: Shell 与脚本初探
---

**下方课件区域方向键控制翻页，`f` 键全屏。**

<iframe src="./slideshow.html" frameborder=0 width=800 height=450></iframe>

## 功能描述

下面将带着大家编写一个定时自动截屏并发送到指定邮箱的脚本。

## 关键函数

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
$Username = "MyUserName";
$Password = "MyPassword";
$path = "C:\screenshot.png";

function sendemail([string]$email, [string]$attachmentpath) {
    $message = new-object Net.Mail.MailMessage
    $message.From = $email
    $message.To.Add($email)
    $message.Subject = "截图"
    $message.Body = "屏幕截图"
    $attachment = New-Object Net.Mail.Attachment($attachmentpath)
    $message.Attachments.Add($attachment)

    $smtp = new-object Net.Mail.SmtpClient("smtp.qq.com", "587")
    $smtp.EnableSSL = $true
    $smtp.Credentials = New-Object System.Net.NetworkCredential($Username, $Password)
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
