---
title: 写一个文件约定式路由vite插件
date: 2023-05-30T18:51
authors: Barry
layout: article
category: coding
---

## 小说两句

我是真的服了，今天好不容易写了一个约定式路由插件，结果 lint-staged 在使用 eslint 规范代码格式的时候给我把文件删除了。

目前还不知道是什么原因给我删除的。

初步判断是因为使用 eslint fix 命令，因为 fix 没有成功，需要手动改，也就导致了 lintstaged 任务失败，lintstage 在任务失败的时候是不会继续 commit 流程的。

也就是会让文件回到上一个 commit 状态，但是 staged 的文件会有一个备份在 stash 里面。

但是

但是！！！

它这次没有给我备份，导致我的代码全没了，没看出来原因在哪，有兄弟知道说一声。

我用 lint-staged 都三四年了，第一次遇到这种情况，以前都是到 stash 里面 pop 出来就完事了。

我看了我的 eslint 命令明没有使用 fix，就很奇怪

目前在官方 issue 找到一个类似的提案希望重置文件状态

现在已经支持，只要在 run lint-staged 的时候加 --no-stash 命令，就不会重置文件状态，保持修改错误的文件，但是不会 commit。

如果你是 vscode，那么可以安装 local history，这种以文件保存为历史记录，可以回退的插件，这样就可以避免下次出现问题回溯。

## 正文

最近正在学习[基于 Vite 的 SSG 框架开发实战](https://juejin.cn/video/7163857336258265102?enter_from=course_center&utm_source=course_center)

而且我刚好要写一个 ssg 产物的工具，专门用来生成静态博客。

当然和市面上的 vite-press docusarus 没什么不同，只是这些提供固定的主题，以及很多乱七八糟的配置，想要从白纸开始自定义就很麻烦。

正好看到了这本小册，非常符合我的想法。

就准备开始做。

其中第一个难点就是写一个 vite 的插件，也就是 plugin。

其实我很早就之前就学会了写插件，但是时间一久我就忘记了。

通过这次写插件的过程，然我更加熟悉 vite 插件，以及 vite 的流程。

首先 vite 的插件是百分百兼容 rollup 的插件。

也就是 vite 的插件也能在 rollup 上面运行。

但是这个不是重点，稍微说一下。

vite 插件运行机制用最简单的流程表示

输入文件 -> 经过各种声明周期对资源进行增删改查 -> 返回新的内容 -> 输出文件(可以不要)

在这里做一个小小的补充。

我们和 webpack 的插件对比一下，webpack plugin 是辅助 webpack 做事情，也是在各种声明周期之下做事情，但是资源的处理都是通过 loader，但是在 vite 两者都模糊成 plugin 里面了。
