---
title: 改变this的指向三剑客之call, apply, bind
date: 2023-05-09T10:00
authors: Barry
category: coding
layout: article
---

## 前言

call，apply，bind 是
[盘根错节的寄生世界之 this 传递](https://bs4real.netlify.app/what-is-this)
显式调用的手段，也是前端面试简单手写题常客。

并且在 react 的经典文档里面也有 bind 的写法，依稀记得我第一次看到 react 里面使用 bind 的时候我是没有搞清楚为什么要使用 bind。

至于为什么，到最后面我会解释下面的代码，这也是基础知识对接实战第一块砖，你会融会贯通闭包，this 指向，继承三个知识。

```javascript
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isToggleOn: true };

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState((prevState) => ({
      isToggleOn: !prevState.isToggleOn,
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? "ON" : "OFF"}
      </button>
    );
  }
}
```

## 正文

首先知道这三个作用都是改变 this 的指向，我在另外一篇文章之中说过，this 只会在函数里面使用，所以这三个函数是存在在 Function.prototype 上面，关于原型的文章可以看这里[盘根错节的寄生世界之原型和原型链](https://bs4real.netlify.app/what-is-prototype)

既然它们三个作用是一模一样，那么它们的区别在哪里?

有以下两个区别

1. 是否会执行函数

- call，apply 会立即执行函数
- bind 不会执行函数

2. 函数传参的方式不同

- call，bind 接收多个函数参数，也是不定函数参数的形式
- aplly 接收参数数组，既接收一个数组类型作为函数的多个参数

```javascript
call(this,arg1, …, argN)
apply(this, argsArray)
```

### call, apply

可以看看以下代码，熟悉 call 和 apply 的使用方式(里面就是继承相关的内容，已经开始联系继承相关内容)，bind 无需多说, 理解 call 和 apply 就是理解 bind。

```javascript
const numbers = [5, 6, 2, 3, 7];

const max = Math.max.apply(null, numbers);

console.log(max);
// Expected output: 7

const min = Math.min.apply(null, numbers);

console.log(min);
// Expected output: 2

function Product(name, price) {
  this.name = name;
  this.price = price;
}

function Food(name, price) {
  Product.call(this, name, price);
  this.category = "food";
}

console.log(new Food("cheese", 5).name);
// Expected output: "cheese"
```

### ... 迭代符号

在自己手写实现之前，需要说说这个迭代符号。

想必在真实项目中，你一定会多次用到这个符号。

不管是来解构一个对象，还是一个数组都会用到。

那么为什么这里要说这个呢？

实际上除了迭代数组，结构对象以外，... 迭代符号在函数参数方面有特殊用法。

- 用来表示不定个数的函数参数

```javascript
// args 类型是Array
function foo(...args) {}

foo(1, 2, 3);
foo(1, 2, 3, 5);
```

- 迭代数组将数组元素作为多个函数参数传入函数，并且一一对应位置

```javascript
function bar(arg1, arg2) {}
bar(...[1, 2]); // => bar(1, 2)
```

这里是一些测试的代码，可以试试放在控制台打印，测试

```javascript
const a = [1, 2, 3, 4];

function b(arg1, arg2, arg3) {
  console.log(arg1, arg2, arg3);
}

b(...a); // 1, 2, 3

function c(arr) {
  console.log(arr);
}
c(a); // [1, 2, 3,4]
c(...a); // 1
// 或者
function c(arr) {
  console.log(...arr);
}
c(a); // 1, 2, 3, 4
c(...a); // error

function log(...args) {
  console.log(args);
  console.log(this, ...args);
}

const a = [1, 2, 3, 4];
log(...a);
// [1, 2, 3, 4]
// 1 2 3 4
log(a);
// [Array(4)]
// [1, 2, 3, 4];
```

> 注意一下另外一种在函数参数解构参数的方式

在 react 的组件声明的时候，通常为了把上一层的 props 转给被包裹的组件，一般会这么写 props

```javascript
// props => {foo:string;bar:string;} props的类型是这个
function component({ ...props }) {} // props => {foo:string;bar:string;}
function component({ foo, ...props }) {} // props => {bar:string}
```

这里的 ... 符号不要和函数不定参数搞混了，...props 是表示剩余没有解构的对象属性组成的对象

### 经典面试题，如何手写 call，bind，apply

在我们了解完...符号可以处理函数参数个数的功能之后。

我们前面说过，call, bind | apply 它们主要区别在于参数函数参数方式不同

那么我们完全可以不用重复造轮子，只需要实现一个，利用 ... 迭代符号的特性可以实现剩下两个

```javascript
function myCall(thisArg, ...args) {
  // 具体实现
}

function myApply(thisArgs, argsArray) {
  return this.prototype.myCall(thisArgs, ...argsArray);
}

function myBind(thisArgs, ...args) {
  const fn = this;
  return function (...newArgs) {
    return fn.prototype.myApply(thisArgs, [...args, ...newArgs]);
  };
}

Function.prototype.myCall = myCall;
Function.prototype.myApply = myApply;
Function.prototype.myBind = myBind;
```

现在我们来实现 Call 内部

call 有三个特点

- 改变 this 指向
- 接收不定参数
- 马上执行

#### myCall

```javascript
Function.prototype.myCall = function (thisArg, ...args) {
  // 判断是否传入了要绑定的 this 值
  if (thisArg === undefined || thisArg === null) {
    throw Error("error");
  }
  // 将当前函数作为 thisArg 的一个属性
  thisArg.fn = this;

  // 取出传递给函数的参数，第一个参数是要绑定的 this 值，所以要排除掉

  // 调用该函数，并传入参数
  const result = thisArg.fn(...args);

  // 删除该函数，以免污染 thisArg 对象
  delete thisArg.fn;

  // 返回函数执行的结果
  return result;
};
```

#### myApply

```javascript
Function.prototype.myApply = function (thisArg, arrayArgs) {
  // 判断是否传入了要绑定的 this 值
  if (thisArg === undefined || thisArg === null) {
    throw Error("error");
  }
  // 将当前函数作为 thisArg 的一个属性

  return this.prototype.call(thisArgs, ...arrayArgs);
};
```

#### myBind

```javascript
Function.prototype.myBind = function (thisArg, ...args) {
  // 判断是否传入了要绑定的 this 值
  if (thisArg === undefined || thisArg === null) {
    throw Error("error");
  }
  // 将当前函数作为 thisArg 的一个属性
  const fn = this;
  return function (...fnArgs) {
    return fn.prototype.apply(thisArgs, [...args, fnArgs]);
  };
};
```

> 可能新手朋友，会觉得 call, bind, apply 里面的 this 就是函数这个不好理解，回想一下,
> "javascript 的世界里面一切皆对象"，this 是对象，this 是跟着谁调用方法的前面的那个对象走的(xxx.fn),
> 那么我在调用 call, bind, apply 的时候（fn.call）fn 就是 this

### bind 在 React 里面的应用

```javascript
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isToggleOn: true };

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState((prevState) => ({
      isToggleOn: !prevState.isToggleOn,
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? "ON" : "OFF"}
      </button>
    );
  }
}
```

现在我们再来看为什么 react 里面要使用 bind 绑定
在解释之前可以问问自己以下的知识点是否熟悉，只有熟悉以下所有知识点才能搞清楚为什么这里要使用 bind

- es6 class 关键字
- 闭包
- this 的传递，箭头函数不能改变 this 传递

好了，现在开始解释

#### es6 class

首先从 es6 class 关键字来说。

class 关键字只是构造函数的语法糖。

在 class 上面定义函数有两种写法

- 箭头函数，箭头函数不能绑定 this，获得的 this 是上一级作用域的 this
- 具名函数, 可以绑定 this

```javascript
class Foo {
  bar() {}

  bar: () => {};
}

// 等于以下写法
function Foo() {
  // constructor
}

Foo.prototype.bar = functin(){}
Foo.prototype.bar = () => {}
```

#### 闭包和词法作用域

这里详细解释看闭包的文章 (还没写，后面补上)

闭包能够让函数获取到定义它位置和之上的作用域的变量，也就是不论这个事件函数在任何位置都会记住定义位置用到的变量

#### this 的传递

这里详细解释看 this 传递的文章

```javascript
<button onClick={this.handleClick}>
  {this.state.isToggleOn ? "ON" : "OFF"}
</button>
```

我们仔细看 jsx 里面传入的 onClick 事件是相当于把 handleClick 作为变量传过去，那么在 react 合成事件机制里面

我们触发点击事件，就相当于普通的调用函数而不是 this.handleClick 调用函数，根据 this 传递规则，一般函数里面的除了箭头函数都跟着

xxx.fn xxx 走的, 也就是谁调用了函数，this 就是谁

而触发点击事件的代码类似下面

```javascript
event() {
  handleClick(e);
}
```

也就是说 this 消失了，那么我们需要给它重新指定一个 this，必然使用 bind 方法，重新指定 this

不过还有一种写法就是，传入一个箭头函数，由于箭头函数天生无法绑定 this，当你在箭头函数里面使用 this 的时候，this 获取的是上一层作用域的 this，通过闭包自然不要 bind 绑定。

## 总结

- call, apply, bind 都是修改 this 指向的方法位于 Function.prototype 上
- call, apply 都是直接执行函数，它们的却别在于传递函数参数方式不同
  - call 是不定参数传入 call（this, arg1, arg2, ...）
  - apply 是传入一个参数数组 apply(this, [arg1, arg2])
- bind 是只改变 this 的指向并且不执行函数，返回新修改了 this 指向的函数, bind 传入的函数参数也是多个不定参数
- 手写了 call，利用 ... 迭代符号实现 apply，加上闭包的机制实现的 bind
- ... 迭代操作符可以展开数组和对象，但是作为函数参数表示的函数参数个数不定
  - function foo(...args)，args 表示的参数数组，类型是数组
  - foo(...\[1, 2\]) 可以将数组元素解构成多个元素传递
