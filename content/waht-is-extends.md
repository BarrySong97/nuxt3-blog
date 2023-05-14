---
title: 【前端基础】盘根错节的寄生世界之继承？
date: 2023-05-14T17:17
authors: Barry
category: coding
layout: article
---

## 前言

寄生世界的最后一部曲，也就是所谓的“继承”,这也是为什么叫寄生世界的原因，就是打破原来的认知，Javascript 世界里没有继承，而是寄生, 我们不妨来回想一下 java，c++这种事怎么继承的。

首先必须要有一个类 Super，我们把它比作 DNA,然后需要一个子类 Sub 继承类 Super,也就是一个由 Super 的 DNA 延展出来的新的 DNA

我们创建的对象是依据这两个 DNA 创建，可以是创建 Super 的对象，按照 Super 的 DNA 创建。也可以是创建 Sub 的对象，按照 Sub 的 DNA（包含了 Super 的 DNA）创建。

> Javascript 的世界一切皆对象

那么在我们 Javascript 的世界，为了实现类似的功能，我们没有类，只有对象，没法继承拓展。

但是有原型链，把所有对象通过原型链关联起来，一环扣一环。

加上 this 的指向的能力，可以随时改变对象里面 this 的指向.

就像寄生虫一样，我没有这个能力，那我就寄生在你的身体里，你使用这个能力获得好处，反馈是在我的身上。

## 正文

以下为了统一阅读体验，我还是把寄生称之为继承。

继承和对象有关，那自然和创建对象的构造函数有关系，当然在 es6 里面还有 class 关键字（是构造函数的语法糖）

### 原型式继承和原型链继承

我从最简单的继承来说原型链和原型是继承式继承。

大部分文章把这两个分开，我这里合在一起讲，免得后面搞迷糊了

#### 原型链式继承

```javascript
function Parent() {
  this.isShow = true;
  this.info = {
    name: "yhd",
    age: 18,
  };
}

Parent.prototype.getInfo = function () {
  console.log(this.info);
  console.log(this.isShow); // true
};

function Child() {}
Child.prototype = new Parent();

let Child1 = new Child();
Child1.info.gender = "男";
Child1.getInfo(); // {name: "yhd", age: 18, gender: "男"}

let child2 = new Child();
child2.getInfo(); // {name: "yhd", age: 18, gender: "男"}
child2.isShow = false;

console.log(child2.isShow); // false
```

#### 原型式继承

```javascript
function object(obj) {
  function F() {}
  F.prototype = obj;
  return new F();
}

var person = {
  name: "Nicholas",
  friends: ["Shelby", "Court", "Van"],
};

var anotherPerson = object(person);
anotherPerson.name = "Greg";
anotherPerson.friends.push("Rob");

var yetAnotherPerson = object(person);
yetAnotherPerson.name = "Linda";
yetAnotherPerson.friends.push("Barbie");

alert(person.friends); //"Shelby,Court,Van,Rob,Barbie"
```

它们之间的最明显的区别是什么？

这个老实说困惑了我很久

```javascript
// 原型链继承
function Sub() {}
Sub.prototype = new Super();
const sub = new Sub();

// 原型式继承
const super = {}
function create(obj) {
  function F() {}
  F.prototype = Obj;
  return new F();
}
const sub = create(super);
```

我们看原型链继承，我们调用了 Super 的构造方法，如果我们把 Sub 的 prototype 变成 Super 的对象，那么我们其实是继承了 Super 创建这个的对象的能力，而不是 Super.prototype 的能力

这里很巧妙，我们回想一下原型的内容，一个对象的能力都是挂在它的 prototype 上的，也就是说 Sub 要继承 Super 的能力，是要继承 Super.prototype 而不是 new Super()虽然这样也能继承到 Super.prototype 但是如 new Super 的时候对 this 进行了各种操作，那么 Sub 在创建对象的时候 this 会多出各种莫名其妙的东西。

再者，其实这里只是规范的问题，就是大家都把构造函数的 prototype 当做能力的拓展，而不是构造函数本身创建的对象。因为构造函数的能力体现就是 prototype 本身能力的体现。

这里有点绕，大家可以多想一会，我们继承某个构造函数的能力而不是继承某个构造函数创建对象的能力。

> Javascript 的世界一切皆对象

不得不感叹这句话的威力

当让它依旧有缺点，就是引用值在 prototype 上的时候，创建的对象对其修改都会影响到所有的引用值。

并且，不能传参数，局限性非常大。

那么其他的进阶版本的继承，就是为了解决这两个问题，传参数和对每个创建的对象“复制”prototype 上的引用值复制
