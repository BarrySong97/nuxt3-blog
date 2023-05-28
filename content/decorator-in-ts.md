---
title: Typescript5.x的装饰器（decorator）
date: 2023-05-27T18:34
authors: Barry
category: coding
layout: article
---

## 小说两句

写这篇文章的原因是最近在学

[zxg\_神说要有光](https://juejin.cn/user/2788017216685118) 的 [Nest 通关秘籍](https://juejin.cn/book/7226988578700525605?enter_from=course_center&utm_source=course_center)

每天按照学习两节的速度前进，今天学到了如何自定义 nest 里面的装饰器。

其实装饰器原理我早就明白，无非就是高阶函数。

在 nest 里面无非就是利用了 Reflect 包里面的一些 api，做了许多的拓展。

加上 nest 本身对装饰器从中注入了服务的 context，让注解能够获得 req 和 res 的能力。

不过这些不太重要，这些都是应用层面，大家去看小册就好了，小册非常值得大家购买，光子说有四个项目带着大家做，所以性价比就不用我说了吧。

好了回到正题，我其实在看装饰器这一章的时候就在回想，装饰器使用的一些细节，因为我知道装饰器到现在都快 56 年了都在提案阶段。

所以就去检索了一下写法，不搜不知道，一搜才发现写法又变了。

```typescript
// js version
function decorator(value, context) {
  console.log("decorated value is:", value);
  console.log("context is: ", context);
}

@decorator
class C {
  @decorator // decorates a class field
  p = 5;

  @decorator // decorates a method
  m() {}

  @decorator // decorates a getter
  get x() {}

  @decorator // decorates a setter
  set x(v) {}
}

// ts version

function loggedMethod<This, Args extends any[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<
    This,
    (this: This, ...args: Args) => Return
  >
) {
  const methodName = String(context.name);

  function replacementMethod(this: This, ...args: Args): Return {
    console.log(`LOG: Entering method '${methodName}'.`);
    const result = target.call(this, ...args);
    console.log(`LOG: Exiting method '${methodName}'.`);
    return result;
  }

  return replacementMethod;
}

// decorator 的定义

type Decorator = (
  target: Input,
  context: {
    kind: string;
    name: string | symbol;
    access: {
      get?(): unknown;
      set?(value: unknown): void;
    };
    private?: boolean;
    static?: boolean;
    addInitializer?(initializer: () => void): void;
  }
) => Output | void;
```

这些是新的写法，我特别标注了 ts 版本，因为 ts 版本能让你更好的看到类型是什么。

以下是就得版本的写法

```javascript
function first() {
  console.log("first(): factory evaluated");
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log("first(): called");
  };
}

function second() {
  console.log("second(): factory evaluated");
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log("second(): called");
  };
}

function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class ExampleClass {
  @first()
  @second()
  method() {}
}
```

## 正文

大概率，你现在去搜索中文的装饰器，可能还流淌在以前的例子，虽然大家都在提案阶段，一样要 bable 转换。

首先说说它们的区别吧。

最大的区别就是写法，不在分类装饰器和函数装饰器了。

老的写法

- 类装饰器，获取构造函数本身
- 函数装饰器，获取函数参数以及，并且返回一个的函数用来执行，这个返回的函数用来执行原本的函数，并在函数之前或者之后执行一些逻辑（nest AOP 的基本原理）

新的写法

- 接收的参数都是一样的
- value 被装饰对象（非 js 对象，表示某个目标）
  - 如果是 filed（也就是属性）那么就是属性的值
  - 如果是函数，那么就是[Function]类型
  - 类就更不用说了，只不过是构造函数的语法糖，那么也是 [Function] 类型
- context 就是用来表达装饰所在对象的信息，他有以下属性
  - kind 是什么类型，有 getter setter field class method
  - name 不用多说
  - isStatic 不用多说
  - isPrivate 不用多说
  - setMetadata
  - getMetaData
