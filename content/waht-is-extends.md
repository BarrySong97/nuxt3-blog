---
title: 【前端基础】盘根错节的寄生世界之继承？
date: 2023-05-14T17:17
authors: Barry
category: coding
layout: article
---

## 前言

寄生世界的最后一部曲，也就是所谓的“继承”。 我们不妨来回想一下 java，c++这种事怎么继承的。

首先必须要有一个类 Super，class 就像 DNA，然后需要一个子类 Sub 继承类 Super，也就是一个由 Super 的 DNA 延展出来的新的 DNA

创建的对象是依据这两个 DNA 创建，它们会复刻 DNA 上面的东西。

就像建造房子，我画好一个设计图作为母版就是构造函数，建出来的房子就是根据模板建造出来的的对象。

如果我需要拓展，我只需要拓展母版就好，再根据模板创建新的对象。

那么在我们 Javascript 的世界，我们没有类，只有对象。

没法直接继承然后 Javascript 都帮你做好，而是需要安排好所有对象之间的关系，建立对象之间的联系模式，也就有了原型链 prototype。

所以看这篇文章之前一定要过一遍这两个东西，不一定非要非常清晰，但是必须要有一个大概的了解，它们不是分割开来的知识。

([【前端基础】盘根错节的寄生世界之原型和原型链](https://bs4real.netlify.app/what-is-prototype))

([【前端基础】盘根错节的寄生世界之夺舍 this 指向和绑定](https://bs4real.netlify.app/what-is-this)
)

## 正文

### 原型式继承和原型链继承

我从最简单的原型链和原型式继承说起。

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

我们看原型链继承，我们调用了 Super 的构造方法，如果我们把 Sub 的 prototype 变成 Super 的对象，那么我们其实是继承了 Super 创建这个的对象自身，而不是 Super.prototype

这里很巧妙，我们回想一下原型的内容，一个对象的能力除了来自它本身，还有就是挂在它的构造函数的 prototype 上的。

Super 的能力可以被任何以 Super 构造函数创建的对象所获得。也就是说 Sub 要继承 Super 的能力。

要继承 Super.prototype 而不是 new Super()，虽然这样也能继承到 Super.prototype 但是如果 new Super 的时候对 this 进行了各种操作，这个 this 的操作应该是要复制到 Sub 上面的(比如添加了一个属性，虽然通过 prototype 也能获取到)，而不是在 Super 上面，因为我们创建的又不是 Super 的对象。

这里有点绕，大家可以多想一会，我们继承某个构造函数的能力而不是继承某个构造函数创建出来的对象的能力。

所以原型式和原型链继承，一个是继承了 Super.prototype，一个继承了 Super 创建的对象作为 prototype，虽然它们的效果是一样的，因为原型链的存在，但是原型链却多出了许多副作用。

当然他们的缺点依然明显

- 原型链

  - 如果 Super 构造函数里面有引用值，那么每个创建的 Sub 都能修改引用值。

- 原型式和原型链
  - 不能传参数。

那么其他的进阶版本的继承，就是为了解决这两个问题。

#### 盗用构造函数继承

```javascript
function Parent() {
  this.info = {
    name: "yhd",
    age: 19,
  };
}

function Child() {
  Parent.call(this);
}

let child1 = new Child();
child1.info.gender = "男";
console.log(child1.info); // {name: "yhd", age: 19, gender: "男"};

let child2 = new Child();
console.log(child2.info); // {name: "yhd", age: 19}
```

盗用构造函数继承非常好理解，在记得构造函数里面调用别人的构造函数，也就是利用显式绑定 this 的方法，把自己的 this 传递给继承的构造函数。

解决了传递参数和引用值的问题。

依旧有缺点，还记得上面说的我们要继承的是 Super.prototype 的能力吗，这里我们单纯的就是把 this 传递过去，让 Super 里面的 this 变成 Sub 的 this，这样 Super 的构造函数的操作就会盗取过来，但是 Super.prototype 并没有一起盗过来。

#### 组合式继承（原型链 + 组合）

```javascript
function SuperType(name) {
  this.name = name;
  this.colors = ["red", "blue", "green"];
}
SuperType.prototype.sayName = function () {
  alert(this.name);
};

function SubType(name, age) {
  // 继承属性
  // 第二次调用SuperType()
  SuperType.call(this, name);
  this.age = age;
}

// 继承方法
// 构建原型链
// 第一次调用SuperType()
SubType.prototype = new SuperType();
// 重写SubType.prototype的constructor属性，指向自己的构造函数SubType
SubType.prototype.constructor = SubType;
SubType.prototype.sayAge = function () {
  alert(this.age);
};

var instance1 = new SubType("Nicholas", 29);
instance1.colors.push("black");
alert(instance1.colors); //"red,blue,green,black"
instance1.sayName(); //"Nicholas";
instance1.sayAge(); //29

var instance2 = new SubType("Greg", 27);
alert(instance2.colors); //"red,blue,green"
instance2.sayName(); //"Greg";
instance2.sayAge(); //27
```

优点就是前面两者的结合，但是缺点大家一定注意到了，就是 Super 被调用了两次，一次是原型链的形式调用的，一次是盗用构造函数的时候调用的。

也就是说，在 Sub 和 Super 里面分别存了一份 colors 的副本，只是它们不会互相影响罢了。

也就是原型链模式本身带来的缺陷。

### 寄生式继承

```javascript
function object(obj) {
  function F() {}
  F.prototype = obj;
  return new F();
}

function createAnother(original) {
  var clone = object(original); // 通过调用 object() 函数创建一个新对象
  clone.sayHi = function () {
    // 以某种方式来增强对象
    alert("hi");
  };
  return clone; // 返回这个对象
}
```

寄生式更像是一个原型式继承的过渡版本，所以优缺点和原型式一样。

### 寄生组合式继承（寄生 + 原型式 + 盗用）

```javascript
function inheritPrototype(subType, superType) {
  var prototype = Object.create(superType.prototype); // 创建对象，创建父类原型的一个副本
  prototype.constructor = subType; // 增强对象，弥补因重写原型而失去的默认的constructor 属性
  subType.prototype = prototype; // 指定对象，将新创建的对象赋值给子类的原型
}

// 父类初始化实例属性和原型属性
function SuperType(name) {
  this.name = name;
  this.colors = ["red", "blue", "green"];
}
SuperType.prototype.sayName = function () {
  alert(this.name);
};

// 借用构造函数传递增强子类实例属性（支持传参和避免篡改）
function SubType(name, age) {
  SuperType.call(this, name);
  this.age = age;
}

// 将父类原型指向子类
inheritPrototype(SubType, SuperType);

// 新增子类原型属性
SubType.prototype.sayAge = function () {
  alert(this.age);
};

var instance1 = new SubType("xyc", 23);
var instance2 = new SubType("lxy", 23);

instance1.colors.push("2"); // ["red", "blue", "green", "2"]
instance1.colors.push("3"); // ["red", "blue", "green", "3"]
```

回想一下上面的问题，组合式已经接近最佳实践，就是多调用了一次 Super，并且并不是继承的 Super.prototype 而是 Super 创建的对象。

寄生+原型的手法解决了继承 Super.prototype 的问题，并且少调用一次 Super 构造函数。

class 关键字语法糖的背后就是寄生组合的写法。

```javascript
prototype.constructor = subType; // 增强对象，弥补因重写原型而失去的默认的constructor 属性
subType.prototype = prototype; // 指定对象，将新创建的对象赋值给子类的原型
```

当然这里为了 instanceof 的体验，需要还原新继承的 prototype 上面对应的属性，具体去看原型的结构那片文章([【前端基础】盘根错节的寄生世界之原型和原型链](https://bs4real.netlify.app/what-is-prototype)
)

我们最后来自己分析寄生组合继承到底发生了什么事情。

- 我们需要改变 Sub 的 prototype，使用了 create 函数创建了一个空白的构造函数，这个空白的构造函数的 prototype 就是我们要继承的 Super.prototype。
- 使用这个空白的构造函数创建一个新的对象出去作为 Sub.prototype，这样我们对这个 Sub.prototype 做任何操作都不会影响到 Super.prototype。
- 我们既然获得了 Super.prototype 上面的能力，但是我们还需要 Super 里面的 this 的操作还原到 Sub 上面来，所以使用了盗用构造函数的方式，把 this 的操作偷过来，这样引用值就不会共同拥有了。

## 总结

Javascript 没有真正的继承，有的只是对象的关联，利用 prototype 的关联以及构造函数的盗用（改变 this 的指向），让对象之间的能力得到复用。

在这之中我们遇到的困难

- 传参数，通过盗用构造函数解决，并且能复制 Super 构造函数里面 this 的操作。
- 继承的是谁，需要的是继承构造函数的 prototype，而不是构造函数创建的对象。
- 不相互影响，既然大家只是对象之间的关联，我们在对继承的 prototype 做拓展的时候不要影响到其他的继承，用 Object.create 创建一个空白的继承对象，后面对这个 Sub 对象的拓展是在这个空白的对象(Sub.prototype)做拓展，而不是 Super.prototype 上，这也方便了别的对象对 Sub 的继承。
