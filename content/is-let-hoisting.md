---
title: 变量提升？let到底有没有变量提升?
date: 2022-03-22T10:00
authors: Barry
category: coding
layout: article
tags: [JavaScript Basic, hoisting]
---

最近在准备面试，所以开始复习以前的老知识。现在看到了 let 和 var，有讲到变量提升这个东西。这个时候我就有疑问，let 变量提升吗？

## 先回顾一下老知识

对于 var 定义的变量

```javascript
console.log(a); //undefined
var a = 1;
```

对于 let 定义的变量

```javascript
let a = 1;
{
  console.log(a); //ReferenceError: a is not defined
  let a = 2;
}
```

对于 Function

```javascript
hello(); // "hello"

function hello() {
  console.log("Hello");
}
```

```javascript
hello(); // TypeError: hello is not a function

var hello = () => {
  console.log("Hello");
};
```

```javascript
hello(); // "Hello1"

var hello = () => {
  console.log("Hello2");
};

function hello() {
  console.log("Hello1");
}
```

```javascript
console.log(hello); // [Function: hello]

var hello = () => {
  console.log("Hello2");
};

function hello() {
  console.log("Hello1");
}
```

### 所以就意味着`let`没有变量提升吗

答案是否定的。

所以直接在 MDN 上查了一下

[Hoisting](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting)`Variable`和`Class`都有提升，但是区别就是`let`在提升的时候没有初始化一个值

Variables declared with `let` and `const` are also hoisted but, unlike `var`, are not initialized with a default value. An exception will be thrown if a variable declared with `let` or `const` is read before it is initialized.

这里虽然知道了个大概，但是感觉讲的还是不清楚。

接着变量提升我查到了新的东西

`let` and `const` declarations define variables that are scoped to [the running execution context](https://262.ecma-international.org/6.0/#sec-execution-contexts)’s [LexicalEnvironment](https://262.ecma-international.org/6.0/#sec-execution-contexts). The variables are created when their containing [Lexical Environment](https://262.ecma-international.org/6.0/#sec-lexical-environments) is instantiated but may not be accessed in any way until the variable’s _LexicalBinding_ is evaluated. A variable defined by a _LexicalBinding_ with an _Initializer_ is assigned the value of its _Initializer_’s _AssignmentExpression_ when the _LexicalBinding_ is evaluated, not when the variable is created. If a _LexicalBinding_ in a `let` declaration does not have an _Initializer_ the variable is assigned the value **undefined** when the _LexicalBinding_ is evaluated.

Under the hood When the engine works with variables, their lifecycle consists of the following phases

1.  **Declaration phase** is registering a variable in the scope.In declaration phase variable is not defined.
1.  **Initialization phase** is allocating memory and creating a binding for the variable in the scope. At this step, the variable is automatically initialized with `undefined`.
1.  **Assignment phase** is assigning a value to the initialized variable.

我这里结合自己的理解简单翻译一下

- 声明阶段

  `var a` | `let b`

  在词法环境里面声明这个变量，但是还不能通过任何方式访问

- 初始化阶段

  `a = undefined`

  var 在这个时候绑定变量到包含自己的作用域，并且初始化了一个 undefined 的值，这个时候 var 可以访问了。

  let 虽然被创建了，但是他只能等到赋值的时候才能把自己绑定到作用域上，这个时候引擎已经知道。

  也就说这个阶段，var 和 let 都被提升了。而 var 是可以访问了，但是 let 不让访问。

- 赋值阶段

  var 在这个阶段发现赋值语句，把 a 原本的值 undefined 替换为 2

  ​ `a = 2`

  let 先绑定到作用域上，并且分配内存赋值为 2

  ​ `b = 2`

## 参考

[Are variables declared with let or const hoisted?](https://stackoverflow.com/questions/31219420/are-variables-declared-with-let-or-const-hoisted)

[Hoisting](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting)

[JavaScript Variables Lifecycle: Why let Is Not Hoisted](https://dmitripavlutin.com/variables-lifecycle-and-why-let-is-not-hoisted/#:~:text=When%20the%20engine%20works%20with,the%20variable%20in%20the%20scope.&text=Assignment%20phase%20is%20assigning%20a%20value%20to%20the%20initialized%20variable.)
