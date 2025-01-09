# `iee-commitlint-config`

> Git 规范

支持配套的 [commitlint 配置](https://commitlint.js.org/#/concepts-shareable-config)，用于对 `git commit message` 进行校验。

## 安装

使用时，需要安装 [@commitlint/cli](https://www.npmjs.com/package/@commitlint/cli)：

```bash
npm install iee-commitlint-config @commitlint/cli --save-dev
```

## 使用

在 `commitlint.config.js` 中集成本包:

```bash
echo "export default { extends: ['iee-commitlint-config'] };" > commitlint.config.js
```

## 设置 git hook

可通过 [husky](https://www.npmjs.com/package/husky) 设置在 `git commit` 时触发 `commitlint`。

首先安装 husky：

```bash
npm install --save-dev husky
```

然后执行添加`commit-msg`:

```bash
npx husky init
echo "npx --no -- commitlint --edit" > .husky/commit-msg
```

更多信息可参考 [commitlint 文档](https://commitlint.js.org/#/guides-local-setup?id=install-husky)。
