---
title: 给前端项目配置代码规范工具
date: 2021-06-19T10:00
category: coding
authors: Barry
tags: [Eslint, Typescript, JavaScripts]
---

## 前言

在多人协作的工程之下，我们需要一个规范指导我们写出风格类似的代码

比如

- 代码缩进格式，双引号还是单引号
- 代码是否格式化
- commit 信息是否清晰
- typescript 的类型是否定义清楚

如果没有这些规范，那么代码除了逻辑不好懂，还会乱七八糟的缩进格式以及 lint 的红线，以及本来可以通过规范来规避的 bug，这一切会让开发过程十分难受。更别提多人协作的项目，简直要人命。

<!--truncate-->

## 正文

所以我们会使用如下几个工具

- prettier 对代码格式化检查
- stylelint 规范样式文件
- eslint 规范 javascript/typescript 代码
- tsc 检查 typescript 类型
- commitlint 检查 commit 信息格式
- lint-staged 整合上面几个工具，在提交代码的时候统一检查

stylelint，eslint，prettier 都是有 vscode 插件，记得在 vscode 里面把它们打开，这样可以实时看到问题在哪，不要等到上传代码的时候再改。（默认大家的 ide 都是 vscode）

### [Stylelint](https://stylelint.io/user-guide/get-started)

```bash
pnpm i stylelint stylelint-config-standard stylelint-config-prettier stylelint-config-recess-order stylelint-config-standard-scss stylelint-prettier -D
```

在 root 目录创建`.stylelintrc.js`

内容如下

```js
module.exports = {
  // 注册 stylelint 的 prettier 插件
  plugins: ["stylelint-prettier"],
  // 继承一系列规则集合
  extends: [
    // standard 规则集合
    "stylelint-config-standard",
    // standard 规则集合的 scss 版本
    "stylelint-config-standard-scss",
    // 样式属性顺序规则
    "stylelint-config-recess-order",
    // 接入 Prettier 规则
    "stylelint-config-prettier",
    "stylelint-prettier/recommended",
  ],
  // 配置 rules
  rules: {
    // 开启 Prettier 自动格式化功能
    "prettier/prettier": true,
  },
};
```

### [Prettier](https://prettier.io/docs/en/install.html)

```js
pnpm i prettier -D // 使用自己喜欢的包管理工具
```

在 root 目录创建`.prettierrc.js`

```js
module.exports = {
  printWidth: 80, //一行的字符数，如果超过会进行换行，默认为80
  tabWidth: 2, // 一个 tab 代表几个空格数，默认为 2 个
  useTabs: false, //是否使用 tab 进行缩进，默认为false，表示用空格进行缩减
  singleQuote: true, // 字符串是否使用单引号，默认为 false，使用双引号
  semi: true, // 行尾是否使用分号，默认为true
  trailingComma: "none", // 是否使用尾逗号
  bracketSpacing: true, // 对象大括号直接是否有空格，默认为 true，效果：{ a: 1 }
};
```

尽管我们装了 prettier 的插件，但是 vscode 在格式化的时候并不是默认使用 prettier 来格式化。
我们需要配置一下

首先我们按`F1`

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64cd79f81da44f7c84a09138c1fa236b~tplv-k3u1fbpfcp-watermark.image?)

输入 `format` 会看到 `Format Document With`

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/89ca0ed8d1eb4b2eaf9f520553019fa6~tplv-k3u1fbpfcp-watermark.image?)

选择 prettier 作为默认的格式化工具

如果想要在**保存**的的时候格式化，那么按`ctrl ,`, 输入 format，并且勾选 format on save

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b0aa315df584a618ea4d4f10766d60f~tplv-k3u1fbpfcp-watermark.image?)

如果需要某些文件不要格式化，那么可以添加一个`.prettierignore`，原理和.gitignore 一样

### [Eslint](https://eslint.org/docs/user-guide/getting-started)

```js
pnpm i eslint -D
```

在 root 目录创建`.eslintrc.js`

内容如下

```js
// eslint-disable-next-line no-undef
module.exports = {
  settings: {
    react: {
      version: "detect", // React version. "detect" automatically picks the version you have installed.
    },
  },
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    // 1. 接入 prettier 的规则
    "prettier",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  // 2. 加入 prettier 的 eslint 插件
  plugins: ["react", "@typescript-eslint", "prettier"],
  rules: {
    // 3. 注意要加上这一句，开启 prettier 自动修复的功能
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    quotes: ["error", "single"],
    semi: ["error", "always"],
    "react/react-in-jsx-scope": "off",
    "reactdisplay-name": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error"],
    "react/prop-types": 0,
    "react/display-name": 0,
  },
};
```

这里先依次安装几个 eslint 插件

```
pnpm i @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier  eslint-plugin-prettier eslint-plugin-react -D
```

根据插件的前缀 scope，大概能看出他们的作用

检查 typescript

- @typescript-eslint/eslint-plugin
- @typescript-eslint/parser

因为 eslint 有自己的格式化规则，所以需要解决它和 prettier 的冲突

- eslint-config-prettier
- eslint-plugin-prettier

检查 react 代码

- eslint-plugin-react

现在简单来看看`.eslintrc.js`里面的内容

```
 extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    // 1. 接入 prettier 的规则
    'prettier',
    'plugin:prettier/recommended'
  ],
```

这里是继承了已经写好的规则，非常容易理解，一些重复的规则可以直接继承，类似 tsconfig 里面的 extends

```
parser: '@typescript-eslint/parser',
```

eslint 并不能解析 typescript，所以需要指定 parser

```
  plugins: ['react', '@typescript-eslint', 'prettier'],
```

刚刚安装的 plugin

```
  rules: {
    // 3. 注意要加上这一句，开启 prettier 自动修复的功能
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto'
      }
    ],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'react/react-in-jsx-scope': 'off',
    'reactdisplay-name': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    'react/prop-types': 0,
    'react/display-name': 0
  }
```

这里可能出现一种情况，在 rules 里面可能需要添加一条这样的规则

```
'react/prop-types': 0,
```

因为 react 本身使用了另外一种工具来定义类型，所以会和 typescript 的类型校验冲突，所以我们需要把它关掉

如果需要忽略某地方不做 lint，和 prettier 同理，添加`.eslintignore`即可

## 配置 commit 规范

配置 commit 规范分为两个部分

- 一个是使用工具 cz-cli 来输出格式化的 commit 工具
- 一个是通过 commitlint 来校验 commit 合法

### [cz-cli](https://github.com/commitizen/cz-cli)

```js
pnpm i -g commitizen
```

首先全局安装 commitizen

有两种途径能输出和 cz-cli（commitizen）一样的 commit messgae

1. 直接使用 Visual Studio Code Commitizen Support 插件

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bdd0ffa4f38044729ab8c3bd696310b0~tplv-k3u1fbpfcp-watermark.image?)

安装完成之后按`F1`,输入 commit

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c8324c54fbd4991ba124e34fcf8637c~tplv-k3u1fbpfcp-watermark.image?)

第一步选择你的 commit 类型

- feaure 新功能
- fix 修复 bug
- docs 文档注释
- style 样式 ui
- refactor 重构
- …………

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f84dd4a4c69340138384dd0de237ec92~tplv-k3u1fbpfcp-watermark.image?)

第二步 输入功能概述或者影响范围
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b79957be16ce407fb764a5d8e86b0ac7~tplv-k3u1fbpfcp-watermark.image?)

第三步 用两句话描述你干了什么，从这里开始后面的都不是必填的选项了
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4b680652608473c9e1b6893d8dd7ce5~tplv-k3u1fbpfcp-watermark.image?)

后面的可以自己探索

2. 使用`npx cz`或者`git cz`来进行使用 cz-cli

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7295cfe887ea4600be4447fd047b5fe4~tplv-k3u1fbpfcp-watermark.image?)

![commit.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f10c7cc06214d0e8ac374608e60ba2f~tplv-k3u1fbpfcp-watermark.image)

使用步骤和上面的插件一模一样

如果想要使用自己 title

在 package.json 里面添加

```json
   "config": {
    "commitizen": {
      "path": "cz-conventional-changelog",
      "types": {
        "新功能": {
          "description": "新增的功能",
          "title": "新功能"
        },
        "修复BUG": {
          "description": "修复 BUG、问题",
          "title": "修复BUG"
        },
        "文档": {
          "description": "添加文档或修改注释",
          "title": "文档"
        },
        "格式": {
          "description": "调整代码格式，未修改代码逻辑(比如修改空格、格式化、缺少分号等)",
          "title": "格式"
        },
        "重构": {
          "description": "代码重构，既没修复 bug 也没有添加新功能",
          "title": "重构"
        },
        "测试": {
          "description": "添加或修改测试代码",
          "title": "测试"
        },
        "编译": {
          "description": "影响编译的更改相关，比如打包路径更改、npm 过程更改等",
          "title": "编译"
        },
        "回滚 ": {
          "description": "版本回滚相关",
          "title": "回滚"
        }
      }
    }
  },
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5af23b713bd944ebbd7b9ce66afa6c63~tplv-k3u1fbpfcp-watermark.image?)

如果团队里面大家都用上了这个工具，commit 本应该无需校验，但是你懂的有人就是乱提交

所以我们需要

### [Commitlint](https://github.com/conventional-changelog/commitlint)

```

pnpm i @commitlint/config-conventional @commitlint/cli -D

echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js

```

注意！！！
如果你配置中文的 commit title，现在 commitlint 不支持验证中文，作者正在支持这个特性。
我们需要添加特殊的配置忽略中文

在`commitlint.config.js`加上

```
rules: {
    'type-enum': [
      2,
      'always',
      ['新功能', '修复BUG', '文档', '格式', '重构', '测试', '编译', '回滚']
    ],
    'subject-empty': [0],
    'type-empty': [0]
  }

```

## 在提交的时候校验你的代码

### [husky ](https://github.com/typicode/husky)

当我们为了防止有人不规范自己的代码，直接忽略 lint 的提示就上传代码，我们需要在 commit 的时候直接校验他的代码防止他传上去。

配置 husky，我们可以很简单的使用 git hooks，在 commit 完成后检查。

```js
pnpm add husky -D
```

在`package.json`的 script 里面加一条

```json
"prepare": "husky install"
```

接着运行

```
pnpm run prepare


npx husky add .husky/pre-commit "npx tsc --noEmit && npx --no -- lint-staged"
npx husky add .husky/commit-msg "npx --no-install commitlint --edit $1"
```

在根目录我们可以看到

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/07aa4d2908584906b4f15dc6941d677a~tplv-k3u1fbpfcp-watermark.image?)

我们的 commitlint 挂在 commit-msg 这个 git hooks 上，也就是创建 commit 的时候

接下来我们配置 lint-staged

### [lint-staged](https://github.com/okonet/lint-staged)

```js
pnpm add lint-staged -D
```

在`package.json`

首先在`script`里面添加

```
"lint:script": "eslint --ext .js,.jsx,.ts,.tsx --fix --quiet ./",
"lint:style": "stylelint --fix \"src/**/*.{css,less}\"",
```

接着再添加

```json
  "lint-staged": {
    "**/*.{js,jsx,tsx,ts}": [
      "npm run lint:script",
      "git add --force"
    ],
    "**/*.less": [
      "npm run lint:style",
      "git add --force"
    ]
  },
```

整个 package.json

```json
{
  "name": "lint-validation",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "prepare": "husky install",
    "lint:script": "eslint --ext .js,.jsx,.ts,.tsx --fix --quiet ./",
    "lint:style": "stylelint --fix \"src/**/*.{css,less}\""
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@commitlint/cli": "^17.0.3",
    "@commitlint/config-conventional": "^17.0.3",
    "@types/react": "^18.0.15",
    "@types/react-dom": "^18.0.6",
    "@typescript-eslint/eslint-plugin": "^5.31.0",
    "@typescript-eslint/parser": "^5.31.0",
    "@vitejs/plugin-react": "^2.0.0",
    "eslint": "^8.20.0",
    "eslint-config-prettier": "^8.5.0",
    "eslint-plugin-prettier": "^4.2.1",
    "eslint-plugin-react": "^7.30.1",
    "husky": "^8.0.1",
    "lint-staged": "^13.0.3",
    "prettier": "^2.7.1",
    "stylelint": "^14.9.1",
    "stylelint-config-prettier": "^9.0.3",
    "stylelint-config-recess-order": "^3.0.0",
    "stylelint-config-standard": "^26.0.0",
    "stylelint-config-standard-scss": "^5.0.0",
    "stylelint-prettier": "^2.0.0",
    "typescript": "^4.6.4",
    "vite": "^3.0.0"
  },
  "lint-staged": {
    "**/*.{js,jsx,tsx,ts}": ["npm run lint:script", "git add --force"],
    "**/*.less": ["npm run lint:style", "git add --force"]
  },
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog",
      "types": {
        "新功能": {
          "description": "新增的功能",
          "title": "新功能"
        },
        "修复BUG": {
          "description": "修复 BUG、问题",
          "title": "修复BUG"
        },
        "文档": {
          "description": "添加文档或修改注释",
          "title": "文档"
        },
        "格式": {
          "description": "调整代码格式，未修改代码逻辑(比如修改空格、格式化、缺少分号等)",
          "title": "格式"
        },
        "重构": {
          "description": "代码重构，既没修复 bug 也没有添加新功能",
          "title": "重构"
        },
        "测试": {
          "description": "添加或修改测试代码",
          "title": "测试"
        },
        "编译": {
          "description": "影响编译的更改相关，比如打包路径更改、npm 过程更改等",
          "title": "编译"
        },
        "回滚 ": {
          "description": "版本回滚相关",
          "title": "回滚"
        }
      }
    }
  }
}
```

成功的效果图
![commit.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f10c7cc06214d0e8ac374608e60ba2f~tplv-k3u1fbpfcp-watermark.image)

## 补充

如果 package.json 中`type`为`module`，那么需要将上述的`.prettierrc.js .stylelintrc.js` 等配置文件的格式后缀改为`cjs`
