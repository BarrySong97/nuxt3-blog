---
title: 如何加速你的依赖下载速度
date: 2022-08-05T14:12
authors: Barry
layout: article
category: coding
tags: [Linux, gitbash, 环境配置]
---

不管你是 `linux` 还是 `mac` 亦或是 `windows` ，以下方法都是通用的。

加速依赖下载一般有两种方式

- 代理
- 国内镜像

国内镜像的我就不说了，网上随便搜一大把。

推荐使用代理，就不用各种环境都配置一次国内镜像。

:::note

当然前提能使用类似 clash 的软件，这里我就以 clash + windows 举个例子

:::

<!--truncate-->

## 正文

### 以 Gitbash 为例

- linux
- mac
- gitbash

三种环境都是同理

可以在`~/.bash_profile` 或者`~/.bashrc` （根据自己的环境选择）

添加如下代码

```
export ALL_PROXY=socks5://127.0.0.1:7890
```

端口是你的 clash 代理端口或者 ssr 端口

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/28673d87ae3d4c24ab0c1768b1e0b1a7~tplv-k3u1fbpfcp-watermark.image?)

重新打开一个 terminal，测试一下

```
curl -vv https://www.google.com
```

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc88f3e6f7b3444fbbc178d924eb2457~tplv-k3u1fbpfcp-watermark.image?)

### WSL（Windows Terminal）

windows terminal 不多说了，直接让我们在 windows 使用 linux。（感兴趣的小伙伴可以自己了解一下）

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/46196f22253746379e93808973522c4b~tplv-k3u1fbpfcp-watermark.image?)

WSL 是一个 windows 的子系统，可以看作虚拟机，意味着它有一个自己的网络，所以不能像`git bash`直接访问到`windows`系统的网络。

所以我们需要特殊配置一下

依旧是在`~/.bash_profile` 或者`~/.bashrc`添加

```
export hostip=$(cat /etc/resolv.conf |grep -oP '(?<=nameserver\ ).*')
export https_proxy="http://${hostip}:7890"
export http_proxy="http://${hostip}:7890"
```

接着打开`clash`

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/015112e189d64dda8263008c3a409323~tplv-k3u1fbpfcp-watermark.image?)

把`Allow LAN`勾选上，鼠标放在这一行的同时，我们可以看到 WSL 的网络 ip。

其实这个 ip 是动态变化的，所以上面的脚本也是动态获取，而不是像`gitbash`一样填上一个固定的 ip。
