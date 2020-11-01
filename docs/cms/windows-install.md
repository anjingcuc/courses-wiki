---
title: 系统安装
---

**下方课件区域方向键控制翻页，`f` 键全屏。**

<iframe src="./slideshow.html" frameborder=0 width=800 height=450></iframe>

## Github 及 作业

### 软件安装

在进行作业仓库的获取、提交等操作之前，需要先安装两个软件：

- [Git for Windows](https://git-scm.com/download/win)
- [TortoiseGit](https://tortoisegit.org/download/)

`Git for Windows` 是 `Windows` 下的命令行 `git` 工具，安装完成后，可以重启 `cmd` 并输入 `git`。如果正确输出命令帮助，则说明安装成功，且系统右键菜单会多出 `Git GUI Here` 以及 `Git Bash Here` 两个选项。

为了使用图形化界面来使用 `git` ，我们可以安装俗称的“小乌龟”，即 `TortoiseGit`。安装完成后可使用系统右键菜单来运行实现各种 `git` 操作。

以上两个软件的安装过程不在此赘述，需要注意的是，`TortoiseGit` 安装完成后，在其安装目录下的 `bin` 文件夹中有一个 `puttygen.exe` 可用于生成公私钥对，后面的步骤中会用到。

### 访问作业仓库

首先大家需要注册一个 Github 账号，推荐使用学校邮箱注册，可以申请一些教育优惠和福利。注册完成后，请访问以下链接：

<b style='color:red;font-size:2em;'>[作业链接](https://classroom.github.com/a/ZHkaMd_U)</b>

点击以上连接，登录 Github 账号并进行授权后，会进入到以下界面：

![学号绑定](/img/classroom_invite.png)

点击自己的学号并绑定后，`Accept this assignment` 即可自动生成一个提交作业的仓库。

![个人作业仓库](/img/your_repo.png)

点击上图中红线画出来的链接即可跳转到仓库页面。

![仓库首页](/img/repo_homepage.png)

点击绿色的 `Clone or download` 并选中复制 `Clone with SSH` 的链接，可以进入下一个阶段。

### 配置公私钥对

要使用 `git` 来 `clone` 作业仓库，首先要使用之前提到的 `puttygen.exe` 生成公私钥对来生成公私钥对。

![puttygen](/img/puttygen_start.png)

点击 `Generate` 并持续晃动鼠标，即可完成公私钥生成。

![puttygen](/img/putty_keys.png)

上图中红色区域是公钥的文本，请全选然后复制到剪贴板，打开 Github 并登录自己账户，点击右上角个人头像，在弹出的下拉菜单中选择 `Settings` 进入设置页面，并点击设置 `SSH and GPG keys` 然后点击 `New SSH key` 来新建一个 `SSH key` 。

![SSH key 配置](/img/open_ssh_setting_page.png)

在新建 `SSH key` 的页面将刚才用 `puttygen` 生成并复制了的文本形式公钥 (以 ssh-rsa 开头的一大串字符) 贴在 `Key` 对应区域，并在 `Title` 处填入自己喜欢的名字保存即可。

![SSH key 配置](/img/paste_pubkey.png)

账号中的公钥配置就完成了，然后在 `puttygen.exe` 的界面中点 `Save private key` 并确定不用密码保护后，选择一个路径存放自己的私钥。

### clone 仓库

完成上面两个步骤，即复制了个人仓库的 `Clone with SSH` 链接，并完成了公私钥对配置后，即可开始 clone 仓库。

选择自己存放代码的文件夹，空白处点右键，在弹出的系统右键菜单中选择 `Git Clone...` 选项，会自动弹出 clone 界面。

![clone](/img/clone.png)

`URL` 是个人作业仓库的 `Clone with SSH` 链接，`Directory` 是你要存放代码的本地路径，`Load Putty Key` 则是私钥的路径（注意：私钥必须是与刚才在 Github 账号中粘贴的公钥是同时生成的才能认证成功），然后点 OK 就会把作业仓库 clone 到本地，就可以开始写代码啦。

### 本次作业要求

使用 Markdown 记录安装 Windows 的过程，commit 并 push 到个人作业仓库即可。

## 附加资料

Git 官方视频中字 https://www.nowcoder.com/courses/2

