---
title: 无缝滚动的列表
date: 2021-06-19T10:00
authors: Barry
category: coding
tags: [CSS, 组件开发思路]
---

codesandbox：https://codesandbox.io/s/infinity-scroll-list-u3k4n?file=/src/styles.css
![scroll-list423.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ef8168421cfe4e47b039efc283b376b9~tplv-k3u1fbpfcp-watermark.image)
思路很简单，原没有想象的那么复杂，只需要了一个 css 属性就可以实现，当然 gif 看着图有点抖这是正常的，实际观感会更顺滑一点。

<!--truncate-->

# 滚动特效

```css
@keyframes mymove {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(0, -50%, 0);
  }
}
animation: mymove 6s infinite linear;
```

只需要了解这一个动画属性即可，css animation 已经帮你实现了无限滚动的特效。

- **mymove** **animation-name**是你的动画名字，我们使用 transform - CSS: Cascading Style Sheets | MDN 属性来移动我们的元素，这里就不展开了。
- **6s** **animation-duration** 是你动画执行完成一次的时间，也就是控制你的速度，也就是说在你的高度不变的情况下，你的时间越多速度越快
- **lnfinite** **animation-iteration-count** 执行多少次动画
- **linear** 在 animation 中叫做 **animation-timing-function**，也就是每个循环的时间与速度的效果，linear 表示匀速

# 无缝滚动

一开始我把这里想的很复杂，要计算最后一个元素距离到顶的时间和高度是多少，然后找到那个最佳时机把第一次的数据插入进去。
后面参考了别人的文章，反复读了又读才发现是自己想麻烦了，所以读文章和文档的时候要慢慢读不要急。
![mmexport1619619829463.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c97a7f08fbc24bb49814f81313369d38~tplv-k3u1fbpfcp-watermark.image)

在滚完 100%的高度之后会有一片空白，并且设置了 infinite，所以重新开始执行新的一次动画效果，会有闪烁的效果。如果我们用两份一样的数据，我们只用显示一半的内容（即容器高度只有一半）。当第一份数据走完之后，原本会因为空白闪烁，但是第二份数据刚刚的第一个刚好接替第一份显示的数据来到最开始，因为闪烁前后内容一样，所以也就没有闪烁效果。也就是两个一样的东西在你的眼前很快的相互切换（这里为了展示没有显示高度）。
![scroll-list4524.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d29c5d22460416c8d0f7a0bf7df2771~tplv-k3u1fbpfcp-watermark.image)
![scroll-list45.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/546d78a7ebf141fa855820c3c02ce004~tplv-k3u1fbpfcp-watermark.image)

所以，我们其实只需要移动 50%的高度，也就是第一份数据的高度，第二份数据刚好接替第一份数据，这个时候一次动画效果已经执行完了，开始执行第二次这就实现了无缝滚动。

但在现实开发中是有可能不知道元素的高度，因为高度很可能会变，所以需要 dom api 来计算高度。

参考

- [用 CSS3 实现无限循环的无缝滚动](https://www.xiabingbao.com/css3/2017/07/03/css3-infinite-scroll.html)
