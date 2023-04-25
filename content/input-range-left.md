---
title: 关于如何计算input [type="range"]里面小球(thumb)的位置
date: 2022-08-10T16:54
authors: Barry
category: coding
layout: article
tags: [HTML, 组件开发思路]
---

本来用 input [type="range"]来做视频进度条，进度条下面有标识来做进度条跳转。

跳转的基本逻辑就是点击标识，视频跳到指定时间，然后进度条小球也跟着跳。

我天真的以为小球的位置是 `(时间 / 总时间 * 进度条宽度)`

做完了以后发现标识和 input 里面的小球并不是在一个位置上。

如下图

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84a3fac5005c46efb11f58460de9d84b~tplv-k3u1fbpfcp-watermark.image?)

<!--truncate-->

### 正文

如果你也想做一个进度条或者音量的控制器

那么可以看 mdn 关于 input [type="range"]的介绍，里面站着的，躺着的进度条都有例子。

[ - HTML: HyperText Markup Language | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7d33469f4184efc9e40ed97cb8aa70a~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87d990727ba1478aa427bb0a3383ba71~tplv-k3u1fbpfcp-watermark.image?)

好了现在进入正题

现在先设置 value 的位置是`totalLeft = percent * input width`

但是小球的位置不代表 input 的 value 所在的位置，这个应该是我们大部分人都会搞错的东西。

![5tZGA.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e43d9e4b5ce4ccca9045d59296ca03a~tplv-k3u1fbpfcp-watermark.image?)

观察上面这张图，发现小球的位置其实和 value 是有关系的

如果 value 在 4 的时候，那么小球的偏移位置是基于 4 的位置往后偏移`offsetWidth = 4 / 10 * 小球的width`

那么小球的位置是`left = totalLeft - offsetWidth`

但是

不对，看起来很像小球偏移了 value 的 percent 的大小

于是我在 stackoverflow 上搜索了一番

找到了这个公式

`offset = (percent - 0.5) * 小球宽度`

`left = totalLeft - offset - 小球宽度一半`

实际上公式后面的 `- 小球一半宽度`是我自己试验使出来的，原本的公式还是有偏移。

我也没搞清楚为什么这样，如果有小伙伴知道，欢迎评论区给我解释一下。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d32378c03794f7a967974a5be887197~tplv-k3u1fbpfcp-watermark.image?)

## 参考

[css - Range input thumb gets offset over time - Stack Overflow](https://stackoverflow.com/questions/52564224/range-input-thumb-gets-offset-over-time)

[css - How to precisely find thumb position of input [type="range"]? - Stack Overflow](https://stackoverflow.com/questions/48880523/how-to-precisely-find-thumb-position-of-input-type-range)
