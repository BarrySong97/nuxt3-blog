---
title: encodeURI和encodeURIComponent的区别
date: 2023-05-25T11:34
authors: Barry
category: coding
layout: article
---

## 小说两句

其实这个问题蛮重要的，在实际开发中遇到过

当你需要把一些数据通过 url 传到后端，如果数据复杂并且有特殊字符，而且特殊字符和 url 的特殊字符冲突，那么就要 encode

这就不得不提原生提供的 **encodeURL** 和 **encodeURIComponent** 有什么区别？

不过大家一般都是用 **encodeURIComponent**，好像这个看起来要全能一点，使用起来也一直没有问题，所以我就一直没有仔细研究过。

那么作为一个在实际项目中要用到的东西，我作为一个面试官肯定要问(我还没当过面试官)，好吧，还是绕不过面试这一关。

当然这至少是一个好的面试题，而不是上来就让你写个算法，没什么意思，无效内卷罢了。

我们直接开始吧。

## 正文

第一我们明确了它的目的是什么

对 url 里面特殊的字符进行编码处理，让 url 能够正确的表达它的意义，正确传入后端解析。

我们一般同 url 传输数据有两种方式

- query

```
http://example.com/path?query1=1
```

- path params

```
http://example.com/path/1;
```

注意 1 可能是一个 url， 也可能是中文

这两个都会让 url 造成混乱无法正确解析，所以必须转换

每次传url参数的时候都要考虑是否有特殊字符串

### 一个简单的小例子

我们先来看一个简单的小例子。

```javascript
const url = "https://example.com/path?param=value&key=hello/world";
```

比如这个 url，`path?param=value&key=hello`是作为 **path params**，还是`hello/world`是作为**query**`key` 的 value 呢？

那其实我们这里肯定是作为 key 的 value

也就是我们要对`hello/world`进行编码

我们先不说 **encodeURI** 和 **encodeURIComponent** 有什么区别，就都试一下

```javascript
var encodedString = encodeURI("hello/world");
console.log(encodedString);
// 输出: "hello/world"

var encodedString = encodeURIComponent("hello/world");
console.log(encodedString);
// 输出: "hello%2Fworld"
```

很显然 encodrURI 并不会对 `/` 进行编码，我们必须使用 encodeURIComponent

`/` 明显是 url 里面本身就有特殊含义的特殊字符

所以我们需要知道 url 里面字符的构成

### 保留字符

保留字符是在 URL 中具有特殊含义或用途的字符。它们在 URL 的结构和解析中扮演着重要的角色，用于指示 URL 的不同部分或执行特定操作。以下是常见的保留字符：

- 冒号（:）： 在 URL 中用于分隔协议和主机名，例如 http://。

- 正斜杠（/）： 在 URL 中用于分隔不同的路径段，例如 /path/to/resource。

- 问号（?）： 在 URL 中用于分隔路径和查询参数，例如 /path?param=value。

- 井号（#）： 在 URL 中用于表示片段标识符（Fragment Identifier），例如 https://example.com/#section1 。

- 等号（=）： 在 URL 中用于分隔查询参数的键和值，例如 param=value。

- 和号（&）： 在 URL 中用于分隔不同的查询参数，例如 param1=value1&param2=value2。

### 特殊字符（ASCII）

以及部分特殊字符，如`,` , `%`, `空格`, `!` ,`\`, `_` , `.` 等等，一些保留字符的之外的标点符号。

### 数字以及字母

a-z, 0-9

### 非 ASCII 字符

日文，中文

### encodeURI 和 encodeURIComponent 的区别

首先我先肯定的第一点，就是直接使用 encodeURIComponent 就行，可以完全替代 encodeURI 的功能。

以下是它们的异同

[ASCII 检索](https://www.asciitable.com/)

相同点

- 对非 ASCII 字符编码
- 数字（[0-9]）和字母（[Aa-Zz]）不编码

不同点

- encodeURI
  - 对保留字符不编码
  - 对部分特殊字符编码，`\` `空格` 等
- encodeURIComponent
  - 对保留字符编码
  - 对部分特殊字符编码， `\` `%` `,`等

```javascript
var url = "https://example.com/路径/文件名?查询=数值#片段";
var encodedUrl = encodeURI(url);
console.log(encodedUrl);
// 输出: "https://example.com/%E8%B7%AF%E5%BE%84/%E6%96%87%E4%BB%B6%E5%90%8D?%E6%9F%A5%E8%AF%A2=%E6%95%B0%E5%80%BC#%E7%89%87%E6%AE%B5"

var url = "https://example.com/路径/文件名?查询=数值#片段";
var encodedUrl = encodeURIComponent(url);
console.log(encodedUrl);
// 输出: "https%3A%2F%2Fexample.com%2F%E8%B7%AF%E5%BE%84%2F%E6%96%87%E4%BB%B6%E5%90%8D%3F%E6%9F%A5%E8%AF%A2%3D%E6%95%B0%E5%80%BC%23%E7%89%87%E6%AE%B5"
```

在使用 encodeURI 结果字符串中继续看见 ?, =, # 因为这些是保留字符

而在 encodeURIComponent 中，保留字符全部转换

而中文作为非 ASCII 码也被转换，因为 url 并不认识中文。

```javascript
var url = "https://example.com/path?url=https://test.com";
```

明显这个 url 并不能被正确的解析，至于用什么来转换，就不用我多说了吧！
