---
title: 如何调试Android手机浏览器页面
date: 2022-08-05T11:33
authors: Barry
category: coding
layout: article
tags: [JavaScript, Android, 调试]
---

最近公司让我把一部分业务搬到 App 上，本来想说是 uniapp 的。但 uniapp 听说坑很多，就被我直接拒绝，用 webview 的形式来解决。

本来写的好好的，结果手机浏览器调试发现，有些效果在电脑手机上可以，但是在手机上调试不行。

以前没有调试过 android 浏览器，不知道能不能类似电脑浏览器一样的 inspect，就去搜索了一下。

没想到现在居然如此便利可以调试手机访问的页面。

<!--truncate-->

## 正文

不管是 chrome 还是新版的 edge

直接在地址栏输入

`edge://inspect/#devices`

或者

`chrome://inspect/#devices`

然后数据线链接电脑和手机

在手机打开`usb 调试`

![7ce786ea692fdb1ecb7b712103b226e.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/34b748e24c0046338525142ece89b64c~tplv-k3u1fbpfcp-watermark.image?)

可能需要拔掉然后再插一次

选择可以传输文件

然后等一会

`edge://inspect/#devices` 页面就可以看到手机访问的网站，最后点击 inspect 就好了

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/06566c7ebb3b447dbfed574d2894dd6e~tplv-k3u1fbpfcp-watermark.image?)
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f7be6b70445f4625b3b71dbaf7766973~tplv-k3u1fbpfcp-watermark.image?)
