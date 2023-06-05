---
title: 小说几句 debounce 和 throttle (防抖和节流)
date: 2023-06-05T11:50
authors: Barry
layout: article
category: coding
---

## 小说两句

什么是防抖和节流，其实这两个概念非常简单，早期我在学习的时候把它想复杂了。

它的唯一目的就是节省资源，像网络请求，页面渲染。

只是它们的触发时机不一样

## 正文

### 触发时机

假设每当用户触发一个交互事件回去调用一个 function，我们称之为 fn

- 防抖 debounce
  触发 1 ... 100 次 fn，成功触发的是第 100 次
- 节流 throttle
  触发 1 ... 100 次 fn，成功触发的是第 1 次

### 时间限制
