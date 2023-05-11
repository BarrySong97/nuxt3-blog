---
title: 盘根错节的寄生世界之夺舍this传递
date: 2023-05-09T10:00
authors: Barry
category: coding
layout: article
---

## 前言

this 传递相当于一个润滑油一般的知识，它结合原型传递引用实现类继承的机制。

它是类继承，外表看成像继承，其实内部是寄生。

在上一篇文章我们已经了解了原型的基本机构，如果想要进一步把“继承”所理解，就需要通过 this 传递来补充，到底什么是"继承”

让我们直接开始。

## 正文

首先我们要回顾一句非常重要的话。

> 📷 Javascript 的世界里面一切皆对象

我们的 this 传递，传递也是对象。

那么我们会在什么地方用到 this 这个关键词？

函数体中。

那么我们函数放置的位置就决定 this 绑定的机制（这也是所谓的词法作用域做决定, 这里应该会有一篇文章）。

请看以下代码

一种是构造函数，一种是普通函数在对象内部

当然如果不在这两个里面，单纯出现在全局下面 this 就是取的全局变量

在 nodejs 里面是 globalThis，在浏览器就是 window (strict 模式下去不到)

```javascript
function Foo(a) {
  this.a = a;
}

const bar = {
  b: function () {
    console.log(this.a);
  },
  c() {
    console.log(this.a);
  },
  d: () => {
    console.log(this.a);
  },
  e: (function () {
    return () => {
      console.log(this.a);
    };
  })(),
  f: function () {
    return () => {
      console.log(this.a);
    };
  },
};
```

### 构造函数

我们先从构造函数这个类型开始比较简单

通常我们都是直接 new 构造函数创建一个新的对象，这样才有 this，因为创建的这个新对象就是传递过来的 this

我们才能将 a 挂载到了创建的新对象上

但是这次我们换个角度，不如我们直接调用 Foo 呢？

```javascript
function Foo(a) {
  this.a = a;
}

Foo(1);
```

this 是什么？

想必聪明你的一定知道，window

没错就是 window，那么刚入门的小朋友就要问了。（其实写的时候我自己也忘了 --!）

> Barry 叔叔为什么是 window 啊？

这就不得不提一下传闻中的词法作用域。

什么是词法作用域，抛开一些乱七八糟的知识点，光看和这里结合最紧密的知识点。

词法作用域就是 你的函数书写（声明）的位置决定了你的变量访问权限，也就是你的作用域链。（这里应该也要有一篇文章, 回顾一下作用域链）

我会用一个例子来稍微回顾一下？

先看如下代码

```javascript
let name = "Barry Song";

function hi() {
  console.log(name);
}

function hiSuperman() {
  let name = "Clark Kent";
  console.log(name);
}

function hiBatman() {
  let name = "Bruce Wayen";
  hi();
}

hi(); // Barry Song
hiSuperman(); //Clark Kent
hiBatman(); //Barry Song
```

看了代码是不是记起来什么是是词法作用域，如果没有搞清楚，请看如下文章

那么我们在再次回到这段代码

```javascript
function Foo(a) {
  this.a = a;
}

Foo(1);
```

我们在直接调用 Foo 函数的时候，我们的 Foo 声明到了全局作用域里面，那么我们需要访问 this，this 是一个对象的应用，也可以理解成一种特殊的变量，这个时候使用的时候发现 Foo 这个函数作用域里面没有 this,那么我就往外面找，外面就是全局作用域，全局作用域找，作为全局作用域的 this 他就是 window，也就是说我们的 a = 1 放在了 window 之上

我们验证一下

[![p9BmMKx.png](https://s1.ax1x.com/2023/05/09/p9BmMKx.png)](https://imgse.com/i/p9BmMKx)

一点小插曲过后，我们再次回到构造函数的 this 传递上面来，后面这个作用域 this 的传递还要在说一次，因为它很重要。

现在从 new 一个构造函数上面看

```javascript
function Foo(a) {
  this.a = a;
}

const bar = new Foo(1);
```

我们创建了一个对象，这个对象指定给 this，在 this 上面挂了一个 a 的变量

这就是最基础的传递 this，也就是继承或者说寄生的基础

不知道你们有没有感受到寄生的味道，也就是我是让 Foo 帮我创建对象，而不是 bar 是继承了 Foo 的能力

扯远了，这里有一道著名的面试题，new 的背后发生了什么？

有以下四点

- 创建一个对象
- 新对象的[[prototype]]属性指向构造函数的 prototype (如果不明白这里，请看上一篇文章[[prototype]]和 prototype 的区别)
- 将这个新的对象赋给 this
- 如果构造函数没有返回其他的值，那么就将这个创建的对象

这里尤其是第二点容易忘记，其他的倒是没有什么。

### 多种函数的 this 调用

```javascript
function Foo(a) {
  this.a = a;
}

const bar = {
  b: function () {
    console.log(this.a);
  },
  c() {
    console.log(this.a);
  },
  d: () => {
    console.log(this.a);
  },
  e: (function () {
    return () => {
      console.log(this.a);
    };
  })(),
  f: function () {
    return () => {
      console.log(this.a);
    };
  },
};
```

1. 箭头函数

箭头函数最为特殊，箭头函数是无法绑定 this 的，所以箭头函数是没法做构造函数，先看下面代码

```javascript
const Foo = () => {
  this.a = 1;
};

const bar = new Foo(1);
```

[![p9BuB4g.png](https://s1.ax1x.com/2023/05/09/p9BuB4g.png)](https://imgse.com/i/p9BuB4g)

其次就是箭头函数不能通过 call 和 bind，apply 改变 this 指向 (这里有一篇小文章复习一下 call bind, apply)

2. 匿名函数和具名函数

3. 闭包函数
