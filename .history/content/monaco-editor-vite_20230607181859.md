---
title: 【踩坑记录】在vite和react中使用monaco-editor
date: 2023-6-07T15:58
authors: Barry
category: coding
layout: article
---

## 一点小补充

前端最常使用的几个代码编辑器

- [ace](https://ace.c9.io/)
- [codemirror](https://codemirror.net/5/)
- [monaco-editor](https://github.com/microsoft/monaco-editor)

其中`monaco-editor`就是微软发布的，相信你已经想到了什么，没错 vscode 的代码编辑器就是**monaco-editor**
所以我们能在网页使用到 vscode 的代码编辑

## 正文

今天踩坑的就是在 vite 里面使用 monaco-editor

因为 monaco-editor 时间非常长，所以早些年大家都是用 webpack 来使用，所以使用起来没什么问题

而来到了今天 vite 这类工具的出现，带来一点问题

好在 evan you 亲自看了这个问题并且解决，官方也有 demo

我们在 react 中使用就直接使用

[react-monaco-editor](https://github.com/react-monaco-editor/react-monaco-editor)

```bash
pnpm add add react-monaco-editor
```

```tsx
import MonacoEditor from "react-monaco-editor";
export default function App() {
  const [cssCode, setCssCode] = useState("");
  return (
    <MonacoEditor
      onChange={(e) => {
        handleCssCodeChange(e);
      }}
      key={size?.width}
      language="css"
      theme="twilight"
      value={cssCode}
      options={options}
    />
  );
}
```

> 这里需要注意 monaco-editro 本身支持 JSON, CSS, HTML, Javascript, typescript 这几种语言

而在 vite 之中问题就在这里

语言的设置目的就在于，对代码高亮格式化

所以 monaco-editor 需要使用 worker 来特殊支持

也就是我们在使用的时候会出现高亮问题

来到

前面说了以前都是用 webpack 打包的，但是到了现代，esm 的落地让 vite 这种 nobundle 工具出现

[integrate-esm.md#using-vite](https://github.com/Microsoft/monaco-editor/blob/main/docs/integrate-esm.md#using-vite)

所以要在 vite 里面要特殊处理 （这里其实就是特殊处理 worker）

在 src 下面创建一个文件`./userWoker.ts`

```typescript
import * as monaco from "monaco-editor";

self.MonacoEnvironment = {
  getWorker: function (workerId, label) {
    const getWorkerModule = (moduleUrl, label) => {
      return new Worker(self.MonacoEnvironment.getWorkerUrl(moduleUrl), {
        name: label,
        type: "module",
      });
    };

    switch (label) {
      case "json":
        return getWorkerModule(
          "/monaco-editor/esm/vs/language/json/json.worker?worker",
          label
        );
      case "css":
      case "scss":
      case "less":
        return getWorkerModule(
          "/monaco-editor/esm/vs/language/css/css.worker?worker",
          label
        );
      case "html":
      case "handlebars":
      case "razor":
        return getWorkerModule(
          "/monaco-editor/esm/vs/language/html/html.worker?worker",
          label
        );
      case "typescript":
      case "javascript":
        return getWorkerModule(
          "/monaco-editor/esm/vs/language/typescript/ts.worker?worker",
          label
        );
      default:
        return getWorkerModule(
          "/monaco-editor/esm/vs/editor/editor.worker?worker",
          label
        );
    }
  },
};

monaco.editor.create(document.getElementById("container"), {
  value: "function hello() {\n\talert('Hello world!');\n}",
  language: "javascript",
});
```

把下面文件加入进去

在 main.tsx 之中

```tsx
import "./useWorker.ts";
```
