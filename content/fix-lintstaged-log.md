---
title: 【问题记录】解决lint-staged在使用husky处理校验时log无限循环显示问题
date: 2023-05-28T10:34
authors: Barry
category: coding
layout: article
---

## 问题是什么

正常应该这样

![](https://pic1.imgdb.cn/item/6472b938f024cca1730682ce.jpg)

![](https://pic1.imgdb.cn/item/6472c0e1f024cca173103cb5.jpg)

版本不一样会导致输出格式不同

但是无限循环 log
![](https://pic1.imgdb.cn/item/6472b8d7f024cca1730632fb.webp)

## 解决方案

在 github issue 已经有人提过了，其实这个问题我在去年就遇到了，只是没怎么在意，因为只是显示问题，结果没啥问题。

哈哈哈，只要能跑就行，过程不重要，经典。

下面是 issue

[Why "lint-staged" log is different when is triggered by husky (v6)? #968](https://github.com/typicode/husky/issues/968)

其实解决方案最近才出来，下面链接是解决方案

[Definitive cross-platform lint-staged config (explained)](https://gist.github.com/webbertakken/c2b457d39224baf701c8de1589b61555)

在 `pre-commit` 文件中

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# 新加的一行
# If tty is available, apply fix from https://github.com/typicode/husky/issues/968#issuecomment-1176848345
if sh -c ": >/dev/tty" >/dev/null 2>/dev/null; then exec >/dev/tty 2>&1; fi


npx --no -- lint-staged
```

但是这个可能和版本有关系

如果这么设置了就去修改版本

```json
{
  "devDependencies": {
    "husky": "=8.0.3",
    "lint-staged": "=13.2.1"
  }
}
```
