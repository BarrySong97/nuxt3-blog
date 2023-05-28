---
title: Typescript奇思妙想之什么是module和namespace，export和declare
date: 2023-05-25T15:17
authors: Barry
category: coding
layout: article
---

为什么写这篇文章，其实也是我无意之间想到的。

typescript 本身就有复杂概念，体操编程，也就是所谓的类型编程，类型比任何强类型语言都要复杂。

但是今天不是要提这个内容，而是 module 和 namespace，以及 decalre 和 export

在 typescript 大行其道今天，始终有一些库是没有 js 写的，并且它们又很重要。

就不得不去帮他们定义类型，一般会发出一个包叫做@types/xxxx，只要添加到项目，ts 自己会加载出来。

而这个内容和 namespace 以及 module 有关。

一般来说我们基本可以在@types 下面找到对应的包

但是假如你拓展了某个第三方库的功能，需要定义 typescript 类型，并且全局生效。

最常见的做法是什么？

```typescript
declare xxxModule {

}
```

或者你需要引用其他的类型过来，结合自己的类型进行拓展

那么就有下面的语句

```typescript
/// <reference types="@nuxt/content" />
```

这个是什么，我相信对大部分人都很陌生，不过今天我们就来搞清楚，因为我也不清楚，在我打出文字的这一刻。

我实在太好奇了（太害怕面试官问了，桀桀）

## 正文

### 先声明一个全局类型

直接 clone 我的项目

```
git@github.com:BarrySong97/typescript-article-sample.git
```

[github](https://github.com/BarrySong97/typescript-article-sample)

进入项目

```bash
cd ./declare-exports-namespace-module
```

安装依赖

```bash
pnpm i
```

vscode 请按 f1，输入 npm scripts，选择 dev 直接启动，不用直接在 terminal 输入

```bash
pnpm start
```

不启动也可以，反正也是只是看 typescript 类型效果

找到`/src/types`文件夹

在 index.d.ts 里面声明

```typescript
type Foo = {
  bar: string;
};
```

回到 App.tsx 添加上这一段代码

```typescript
const foo: Foo = {
  bar: "1",
};
```

这就是全局声明一个类型，有些时候很多组件都有一个共同的 props 怎么办，就需要全局声明一个属性，当你定义 props 的时候

你无需 import export type 类型既可以享受到你定义的类型。

首先这是如何做到的?

打开`tsconfig.json`

```json
{
  "include": ["src", "types"]
}
```

把`/types`去掉，关掉 vscode 或者直接切换到 App.tsx 检查是否报错

![error](https://images-1253529509.cos.ap-chengdu.myqcloud.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20230525165935.png)

### tsconfig 里面加载类型的门道

- d.ts 的 d 是 decalre，d.ts 是 ts 声明文件

如果你在 d.ts 文件里面定义一个 module，如果没有 declare 关键字，就会有报错提示

- tsconfig 里面关键字
  - ts 默认会把 nodemudles 下面所有的 @types 文件夹里面的 type 编译进去
  - typeRoots 只有 typesroots 下面的包才会包含进来，值是一个路径数组，就会忽略 nodemodules 的 types
  - types，值也是一个路径数组，关键字可以指定 nodemodules 里面的 types 才能被包含进来，如果值是一个空数组，那么禁止引入 types 里面的包

