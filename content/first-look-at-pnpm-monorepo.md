---
title: 第一眼看pnpm monorepo（1）项目结构与依赖安装
date: 2022-07-26
category: coding
layout: article
authors: Barry
tags: [Pnpm, Monorepo]
---

pnpm 天生支持 monorepo，所以认为 pnpm 未来会成为前端基础标准之一，现在已经有大量的新兴项目都在使用 pnpm 作为 monorepo。

并且 pnpm 天生作为包管理工具，对于 monorepo 的优点是毋庸置疑的。

<!--truncate-->

monorepo 我认为目前适合用来写工具库或者多个关联性比较强的小项目，对于业务非常大的项目并不是太适合。主要还是认为 git 的管理会比较混乱， 加上分支和各个项目的 commit 什么的都在一个仓库下面，不知道有没有比较好的管理方案。

## 正文

首先来看一下 pnpm 的 monorepo 的结构

```
├── ...
├── packages/
├── docs/
├── pnpm-workspace.yaml
└── package.json
```

目前 pnpm monorepo 项目都是这个结构，比如[vite](https://github.com/vitejs/vite), [ ahooks](https://github.com/alibaba/hooks)

相信你也看到了一个特殊的文件`pnpm-workspace.yaml`这是这篇文章主角

里面的内容如下

```
packages:
  - packages/*
  - docs
```

packages 表示一般你要管理的项目，都是放在 packages 下面，而后面的\*是通配符，表示下面所有项目。

当我们有多个项目的时候，每个项目可能会有共同的依赖，这个时候我们就会全局下载

```
pnpm add xxxx -w
```

但是有时候某个项目会有特殊的依赖，我们只想给这个项目加上，在使用安装命令的时候就需要特殊指定这个项目。

那么就会使用到`--filter`来指定某个包

如果要给`docs`装依赖，那么我们会执行以下命令

```
pnpm --filter docs i
```

注意这里 docs 的 packages.json 的 name 必须和文件夹名称一样，只要有一个不一样都会找不到。

如果我们要给 packages 下面的某个子项目装依赖又该如何装呢？

首先和 docs 不一样的是，光是名字和 packages.json 的名字相同是不行的。因为它是属于 packages 下面的子项目。

这里可以使用

```
pnpm --filter xxxxx test
```

来测试你的包是否能被 pnpm 找到

当在 packages 下面有一个 foo 项目的时候

```
├── ...
├── packages/
    ├── foo
        └── package.json
├── docs/
├── pnpm-workspace.yaml
└── package.json
```

foo 作为子项目而言，name 的命名规则比较特殊，不再需要文件名和 package.json 的 name 相同（文件夹名叫什么都可以，`--filter`只认 package.json 的 name）

而且与 root 目录下的 `package.json` name 有关联。

比如 root 下面的 package.json 的 name 为 z-components

那么 foo 的 package.json 的 name 就叫做@z-components/foo

添加依赖的命令就是

```
pnpm i --filter @z-components/foo ahooks
```

`--filter`命令适用于所有 pnpm 的命令，不管是添加依赖还是删依赖，以及其他的操作。

## 总结

- 这篇文章讲解了 pnpm monorepo 的基本结构
- 学会了如何全局装依赖，需要使用到`-w`来指定全局
- 单独给某个子项目添加依赖，需要使用`--filter`来指定子项目。
