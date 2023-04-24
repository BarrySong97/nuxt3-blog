---
title: 前端环境配置一些小问题
date: 2021-05-09T10:00
category: coding
authors: Barry
tags: [nvm, nodejs, 环境配置]
---

# 前言

迁移自己的开发环境这种事情其实是很少发生的，一般是换工作或者自己买了一台新电脑。

最近换了一份工作，由于工作年限比较短，所以发现还是有点问题

主要体现到以下几个问题

- node 版本的管理
- chrome 浏览器阻止其更新
- vscode 设置，插件同步

# 正文

### node 版本管理

一般年限比较久的公司，通常都会维护比较旧的项目，所以 node 版本一定比较老

所以我们要能灵活的切换版本

所以我们需要[nvm-windows](https://github.com/coreybutler/nvm-windows) (如果你是其他环境可以直接搜索 nvm 就好，我们以大多数是 windows 环境为主)

我来说说使用过程中的一些小坑

- 安装（略过，没什么好讲的，windows 的安装十分流畅不需要配置环境变量）

- 使用

  - 我们主要使用几个命令

    ```
    // 用来安装某个特定的nodejs版本
    nvm install <version>
    // 查看电脑上安装的nodejs版本
    nvm list
    // 使用指定的nodejs版本
    nvm use <version>
    ```

    ![](https://files.catbox.moe/886j7j.png)

- 注意的问题

      -   使用cmd或者gibash切换版本的时候，需要使用管理员打开才行，gitbash没有测试过，但是cmd一定要用管理员模式。

  ![](https://files.catbox.moe/8e8z7i.png)

### vscode

vscode 我们只需要关注一样东西，那就是同步你旧电脑的设置。

假设你是一个会在家里写代码的人。

为什么会有这种假设，我的高中同学也是程序员，因为疫情只能在家办公。

最好玩的事情来了，他们公司有几个程序员家里面没有电脑。

这是我无法想象的，就算回家不写代码，也不至于电脑都没有。

扯远了。

如果同步你的 vscode 设置

非常简单

![](https://files.catbox.moe/dvikvf.png)

他会弹出一个选项，让你选择是 github 同步还是微软账号同步，根据自己喜好选择即可

### chrome

node 需要版本限制，chrome 同样需要版本限制

但是网上的一些方法都不是很靠谱

这个是我唯一觉得靠谱的，其他的都没用，只有这个有用

[4 种方法彻底禁止 chrome 更新](https://zh.wikihow.com/%E5%BD%BB%E5%BA%95%E7%A6%81%E7%94%A8%E8%B0%B7%E6%AD%8CChrome%E6%9B%B4%E6%96%B0)
