---
title: 当我们再说Javascrpt引擎的时候我们再说什么（小白向）
date: 2023-01-16T19:56
authors: Barry
category: coding
tags: [JavaScript, 引擎, 基础知识]
---

# 前言

当我在阅读《你不知道的 Javascript》的时候，开篇就阐述了 JS 的工作流程为了更好的给读者解释作用域。对整个工作路程划成了三个角色。

- **引擎**从头到尾负责整个 JavaScript 程序的编译及执行过程。
- **编译器**引擎的好朋友之一，负责语法分析及代码生成等脏活累活。
- **作用域**引擎的另一位好朋友，负责收集并维护由所有声明的标识符（变量）组成的一系列查询，并实施一套非常严格的规则，确定当前执行的代码对这些标识符的访问权限。

因为展开篇幅不多，而且对流程说的比较模糊，让我十分好奇所谓的**引擎**到底做了什么，而且我们经常在别的文章里面看到的

- 边**解释**边**执行**是是什么？
- **编译**和**解释**又有什么关系呢？
- 什么是**编译器**（compiler），什么是**解释器**（Interpreter）？

<!--truncate-->

# 起步

作为一个 Web 工程师，至少我们了解，代码是先编译成机器码，这样机器才能执行。

这样的哲学也体现在我们的项目中。

比如我需要用到一个**ES6**的**新特性**，最新的浏览器版本支持，但是还必须兼容那些还在使用旧版本的浏览器用户。

所以需要我们把新特性的代码转换成旧版本的兼容代码，而我们常说的**babel** **polify**就是做这方面的工作的。

# 小做探究

如果我们对平时的阅读文章稍有记忆，就会想起编程语言其实分成两种

- **解释性语言**：执行速度**慢**、效率**低**、依靠**解释器**、跨平台性能**好**。 Python,Php,Ruby
- **编译性语言**：执行速度**快**、效率**高**、依靠**编译器**、跨平台性较**差**。 C, C++, Go

## 编译型语言

依赖编译器，启动之前会把全部代码编译成**二进制**可执行文件，可以直接执行然后得到结果。

所以编译性语言**启动慢**，但是**执行快**。

> 源代码 -> 编译 -> 包含机器代码的特定文件 -> 执行程序 -> 得到结果

## 解释性语言

依赖解释器，启动之前会以非常快的速度编译一些关键的东西，然后一边执行一边解释，通俗来说就是扫描一行开始解释一行执行一行，中间不会生成任何文件，直接得到结果。

所以解释性语言**启动**比较快，但是这样效率低，而且**执行**比较**慢**。

> 源代码 -> 遇到一行解释器解释 -> 执行这一行得到结果 -> 不断循环前面的知道代码发生错误或者结束

举个例子来说，如果阅读一本外语书如果是编译性语言那么就直接给你全部翻译了，你才能看。如果是解释性那么我就需要一边看一边问翻译。

但是实际上就算一个**解释**，一个**编译**，一个**不生成文件**，一个**生成文件**，本质上都是把代码转换成机器语言，所以为啥一个叫做解释器，一个叫做编译器呢？

当我敲到这里的时候，我开始迷糊了，搜寻了许多资料才发现和我想象的不太一样。

首先先下**结论**

> 解释器立即执行代码，编译器为稍后的执行准备好源代码。所有实际的差异都因为他们有不同的目标。

但是语言真的会把编译和解释分的这么开吗，实际上结合两个不是更好吗，更快的启动速度和更快的运行速度！

是的，这个东西早在十年前就有了。

最开始我想举**Java**作为例子来说明**编译性语言**，但是经过一番搜索后，结果让我大吃一惊！

Java 的**编译器**会把 **.java** 文件编译成 **.class**文件，这一步我们根据上面的定义可以看做是编译性，但是

我们大名鼎鼎**Java 虚拟机**（JVM），里面却有一个及解释器来解释.class 文件里面的代码，所以 Java 既是**解释性语言**，也是一个**编译性语言**。

所以 Javascript 是否只是我们所想的解释性语言呢？

Javascript 如果是单单的解释性语言的话，在浏览器执行根本就没有这么好的性能，那么 Javscript 就一定不是单纯的解释性语言，一定运用到来编译器来提升速度。

以下是我在[compilation - Is Java a Compiled or an Interpreted programming language ? - Stack Overflow](https://stackoverflow.com/questions/1326071/is-java-a-compiled-or-an-interpreted-programming-language) 看到一段话

[informatik01](https://stackoverflow.com/users/814702/informatik01)：

The terms "interpreted language" or "compiled language" don't make sense, because any programming language can be interpreted and/or compiled.

解释性语言和编译性语言，其实不太能说的通，因为任何编程语言都可以是解释性的也可以是编译性的。

As for the existing implementations of Java, most involve a compilation step to [_bytecode_](https://en.wikipedia.org/wiki/Java_bytecode), so they involve compilation. The runtime also can load bytecode dynamically, so some form of a bytecode interpreter is always needed. That interpreter may or may not in turn use compilation to native code internally.

用现在 Java 实现的来说，都有编译成 Bytecode 的一步，所以是编译性语言。但 Java 的运行时也包含了动态的导入 Bytecode，有些形式下也是需要解释器来解释，解释器不一定需要把编译后的代码再转换成原生代码。

These days partial just-in-time compilation is used for many languages which were once considered "interpreted", for example JavaScript.

现在新的 JIT 编译技术已经用到了许多的语言中，比如 Javascript

（这一段回答是 2009 年的，但是非常准确）

## JIT（Just In Time）

在说 JIT 之前，我们思考一下。

如果我们在做一个计算复杂的东西，计算的资源非常宝贵，如果不小心很容易导致应用性能不好，我们最常用的手段就就是把可能重读的过程得到的结果存储下来。创建一个 map list 或者一个对象来存重要的结果，每当计算的时候我们会先去先前创建的容器检查是否会有重复的计算结果，如果有那么我们就直接使用不再计算，这样就可以加快速度和效率。

而 JIT 就是如此。

我们在一边解释一边执行代码代码的时候，肯定会有大量重复解释的代码，如果不做特殊处理，肯定导致运行起来非常的缓慢。

也就是上面说到的大体思路缓存重复的需要解释的代码。

基本流程

Javascripy 源代码 -> 转换成 AST -> 进入 JIT Compiler -> 标记热点（hot，warm，very hot）代码 -> 不是的立即转换成 Bytecode 压缩优化 -> 是的就检查缓存有没有已经转换过了 -> 执行

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2664038acc014b76a0f9c76d2ba73ea8~tplv-k3u1fbpfcp-watermark.image?)

cr:[V8 引擎与 JIT 原理 - 掘金 (juejin.cn)](https://juejin.cn/post/7179130165262286885)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8425905e47fb4140bb0cf1f03eca6962~tplv-k3u1fbpfcp-watermark.image?)

# 最后

费了不少精力来写一篇小文章，本来开始只想写作用域的梳理的，但是在边看资料边写的过程中，发现 JS 基本工作流程看着比较模糊和晕，现在终于搞清楚大家都在说引擎是什么，以及 JIT 等，编译，解释等名词的含义。

各位，下次再见！
