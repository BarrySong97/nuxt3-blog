---
title: 【前端基础】盘根错节的寄生世界之原型和原型链
date: 2023-02-23T17:00
authors: Barry
category: coding
layout: article
---

## 前言

原型链虽然概念上比较简单，用了奇怪的姿势模拟了继承的功能性，但是在整个 Javascript 的世界里面，它的的关系错综复杂，很容易被它们之间的关系绕进去

- `__ proto __` ，`[[prototype]]`， `prototype`傻傻分不清楚,
- 是`Object`创建了`Function`，还是`Function`创建了`Object`？

所以我想要从头梳理一遍，让大家（自己）更清晰的看清原型链。

开始之前

回顾我们学习 Javascript 的时候，一定听说过一句话

> 一切皆**对象**

这句话说的非常准确，但是有一点例外，就是**primitive**基础类型值，不过在使用其方法的时候也会自动被包装成对象，不过这是题外之话。

这里你肯定有一个疑问，那么我们执行的 function 是对象吗？

答案是肯定的，以下我会将函数称为函数对象

说完这个，我们正式开始吧

## 正文

### 最原始的原型结构

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba841a4cdfda4cfca208a1e7f0679683~tplv-k3u1fbpfcp-watermark.image?)

```
const obj = {};
```

在 Javscript 中如果我们这样声明一个对象 obj，那么它的原型结构如上图。

`Javascript`它通过`Object()`构造函数创建了`obj`，并且创建的 obj 都有一个隐藏内置属性`[[prototype]]`并把它指向`Object.prototype`属性，Object.prototype 的`constructor`指回构造函数 Object()，而 Object.prototype 之中也有一个`[[prototype]]`，它指向了虚无 null

而这个 Object.prototype 是所有原型链（prototype chain）的终点

> 记住这个结构，这个结构可以推导出所有的原型链，它是 Javascript 世界的基本结构！

### 逐渐复杂的原型

我们除了上面说的第一种创建对象的方式还有另外一种，就是通过构造函数的方式来创建

```javascript
function Bar() {}
const foo = new Bar();
```

类比上面结构，我们得出以下结构

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f94817d208e453f87f70fabe08c47bf~tplv-k3u1fbpfcp-watermark.image?)

上面提到，`Object.prototype`是所有原型链的终点，而`Bar.prototype`就是一个普通的对象，那么这个`?`就是`Object.prototype`, 结合第一张图，得到以下的图

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/70aaf6c087be46acbab79f0b6694af96~tplv-k3u1fbpfcp-watermark.image?)

到此我们创建最基础的原型链（prototype chain），所有的原型链（prototype chain）都是基于这个结构不断累加，不过现在只说清楚了普通的对象，Javascript 的世界一切皆对象，函数对象又是谁创建的？不过在说这个之前我们先把一些概念说清楚。

### `__ proto __` ，`[[prototype]]`， `prototype`三姐妹

现在`prototype`，`[[prototype]]`已经浮出水面，加上`__proto__`就来说说它们之间的区别

`[[prototype]]`它是每个 Javascript 对象都会有的隐藏内置属性，为的都是能让每个对象都能顺着它的 prototype chain 往上找，也就是每个对象与生俱来的能力，它的终点是 null

`__proto__` 是一个非正规的访问`[[prototype]]`属性的方式，本质上是一个定义在 Object.prototype 上面的属性**proto**，通过 getter，setter 方法操作访问。obj 本身没有**proto** 没有这个属性，但是通过`[[prototype]]`我们访问到了 Object.prototype 上面的**proto**(通过 this 绑定，我们知道了是 obj 的),所以获取到了`[[prototype]]`的对象。 不过现在并不推荐这么做，而是推荐使用`Object.getPrototypeOf(obj)`和`Object.setPrototypeOf(obj, parent)`来访问操作**proto**。

`prototype`它只存在在函数对象上面的一个正常公开的属性，`Bar.hasOwnProperty('prototype')`这个可以证明， 不过函数对象自然也有一个`[[prototype]]`，它指向哪？我们先按下不表。

先通过代码验证一下，刚刚说过的结构

```javascript
const obj = {};
function Bar() {}
const foo = new Bar();

obj.__proto__.__proto__; // null
obj.__proto__ === Object.prototype; /// true
bar.prototype.__proto__ === obj.__proto__; //true
bar.prototype.__proto__.__proto__; // null

obj.__proto__ === Object.getPrototypeOf(obj); // true
Object.getPrototypeOf(obj) === Bar.prototype; // false
Object.getPrototypeOf(obj) === Bar.prototype.__proto__; // true

foo.__proto__ === Bar.prototype; // true
foo.prototype; // undefined
Bar.prototype; // {constructor: ƒ}
```

### 函数对象从哪里来

Javascript 世界所有对象都源自两个创世神，Object 和 Function，一个创建普通对象，一个创建函数对象，而 Object 本身就是一个构造函数，所以它也是被 Function 所创建。

通过前面的基础结构，我们可以简单推断出一个函数对象它的原型结构是什么样子

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/645ecb4cc3724801bb14e3edd75b1821~tplv-k3u1fbpfcp-watermark.image?)

> 注意[[prototype]]并不是 prototype 这个公开的属性，它就是**proto**，前面已经详细解释过三个东西

```
function Bar(){}
Bar.__proto__ === Function.prototype // true
```

通过代码验证了，结构确实是这个结构，我们继续往上探索，Function.prototype 的`[[prototype]]`是什么？Object 创建普通对象，Function 创建函数对象，Function.prototype 是一个普通对象，自然是 Object 创建，`?`是什么呼之欲出，我们先用代码推断一下。

```
Function.prototype.__proto__ === Object.prototype // true
Object.__proto__ === Function.prototype // true
```

通过以上两行代码，我们终于把 Function 和 Object 联系起来了，也证明了 Object 确实是 Function 创建。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/edb265103b69407c8f09d49e77539002~tplv-k3u1fbpfcp-watermark.image?)

看到这里感觉是不是少了点什么？Function 它也是一个函数对象，它的[[prototype]]呢？

根据上面的结构推断，只有可能是 Function**自己**创建了自己，所以它的[[prototype]]指向了 Function.prototype。

这里没有鸡生蛋，蛋生鸡的问题，这里的**自己**很明显是由 native code 创建了，也就是我们的 JS 引擎里面的原生代码，然后 Function 才执行自己的本身的功能。

到此，我们完成了 Javacript 世界之中原型链 prototype chain 的关系梳理。

下面我会放出一张非常经典流传十分之久的关系图，想不通的时候不妨看看最基本的那个结构，通过基本结构类比函数对象的结构，再把它们结合起来，就能变成下面这张图。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/04be7d7e391e4c6599a0cf3ec0580e40~tplv-k3u1fbpfcp-watermark.image?)

### 一些奇怪的代码

在 Javascript 之中我们有一个 a instanceof b 操作符，它的作用是判断 b 是否在 a 的原型链上面，它的原理就是

a.** prot o**. ..... .** proto ** .constructor === b

先小试牛刀

```js
function Bar() {}
const Foo = new bar();
foo instanceof bar; // true
```

结合上面所分析，再来看看以下代码，一切都说的通了

```js
Object instanceof Function; // ture
Object.__proto__.constructor === Function;
Object instanceof Object; // ture
Object.__proto__.__proto__.constructor === Object;
Function instanceof Function; // ture
Function.__proto__.constructor === Function;
Function instanceof Object; // ture
Function.__proto__.__proto__.constructor === Object;
```
