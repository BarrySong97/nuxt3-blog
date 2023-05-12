---
title: 【前端基础】盘根错节的寄生世界之夺舍this指向和绑定
date: 2023-05-12T14:00
authors: Barry
category: coding
layout: article
---

## 前言

this 指向和绑定是寄生世界的系列之一，如果说原型结构是寄生世界的基本结构创建了寄生的通道，那么 this 传递 就是寄生能力的体现。

## 正文

在开始之前，我必须要回顾一句非常重要的话。

> 📷 Javascript 的世界里面一切皆对象

我们的 this 绑定和指向的也是对象。

this 的绑定一共有四种方式

- 默认绑定
- 显式绑定
- 隐式绑定
- new 绑定

### 默认绑定

默认绑定没什么好说的，直接看代码

```javascript
// 在非严格模式下，全局变量会挂在window上, 并且this如果没有指定就是undefined(不能绑定window)
"use strict";
function Foo() {
  console.log(this.a);
}
var a = 1;

Foo(); // 1
```

直接调用方法 this 会绑定到全局对象 window 上面（在非'strict'模式下，知道即可）

### 显式绑定

这里去看我写的另外一篇文章[改变 this 的指向三剑客之 call, apply, bind](https://bs4real.netlify.app/call-bind-apply)

显示绑定指的就是利用 call, apply, bind 三个原生工具函数改变 this 的指向。

### 隐式绑定

先看以下代码

```javascript
function foo() {
  console.log(this.a);
}
var obj1 = { a: 2, foo: foo };
obj1.foo(); // 2

var obj2 = {
  a: 3,
  foo: foo,
};
obj2.foo(); // 3
```

隐式绑定它有一个非常明显的特点

**obj.fn()**

`obj`表示某个对象，`fn`表示`obj`上的一个函数，如果在 `fn` 里面使用了 **this**，**this** 指向的就是 `obj`

隐式绑定规则就是 this 跟着调用它的对象走

说到这里要特别提一句，不要把 this 的指向和词法作用域搞混了，词法作用域是对作用域里面变量的引用，this 指向说的是在函数里面的 this 关键字，虽然它看上去就像一个变量，但是它不是变量，它是存在于原型上面对关联对象的引用（听起来有点玄乎）。

### new 绑定

这里就不得不提一道经典面试题，new 背后发生了什么？

一共四个步骤

- 构造函数创建对象
- 将对象的原型结构构建好(也就就是对象的[[prototype]]指向构造函数的 prototype)
- 将构造函数里面的 this 指向创建的对象
- 如果函数没有返回其他对象，就返回创建的对象

### 绑定的优先级以及箭头函数

箭头函数不能绑定 this

也就无法使用 call, apply, bind 绑定 this，也不能作为构造函数

所在在使用 this 的时候要小心箭头函数。

但是在箭头函数里面还是可以使用 this 的

我们来看以下代码

```javascript
const obj = { a: 3 };
const foo = {
  a: 1,
  c: () => {
    console.log(this.a);
  },
  b: function () {
    (() => {
      console.log(this.a);
    })();
  },
};
foo.b(); // 1
foo.c(); // undefined
foo.b.call(obj); // 3

function foo() {
  // 返回一个箭头函数
  return (a) => {
    //this继承自foo()
    console.log(this.a);
  };
}
var obj1 = { a: 2 };
var obj2 = {
  a: 3,
};
var bar = foo.call(obj1);
bar.call(obj2); // 2, 不是3！
```

由上面的代码我们可以看到，箭头函数的 this 属于自己的上一层作用域所属的那个 this。

那么我们说了这么多绑定方式，它们之间的优先级是什么。

直接上结果!

默认 < 隐式 < 显式 < new

以下是测试代码

```javascript
function foo() {
  console.log(this.a);
}
var obj1 = { a: 2, foo: foo };
var obj2 = { a: 3, foo: foo };
obj1.foo(); // 2
obj2.foo(); // 3
obj1.foo.call(obj2); // 3
obj2.foo.call(obj1); // 2

function Bar(a) {
  this.a = 10;
}

// 显示绑定和new绑定
const ss = obj1.foo.bind(obj2);
const ff = new ss(); // {}
```

new 绑定没办法使用代码来证明，但是从逻辑上来说，每次 new 一个构造函数都是创建一个新的对象，将新的对象赋值给 this，所以 new 绑定一定比显式绑定的优先级高，或者说 new 绑定就不应该在优先级里面。

## 总结

- this 的绑定有四种方式，默认，隐式，显式，new 绑定
- 箭头函数 this 绑定上一层作用域的 this
- 优先级是 new > 显式 > 隐式
