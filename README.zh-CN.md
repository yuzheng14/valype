<p align="center">
  （翻译自 DeepSeek）<br />
  <img width="180" src="./assets/logo.svg" alt="Valype 标志">
</p>
<br />
<p align="center">
  <a href="https://www.npmjs.com/package/valype"><img src="https://img.shields.io/npm/v/valype?color=a1b858&label=" alt="valype 版本"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/npm/l/valype" alt="valype 许可证"></a>
</p>
<br/>
<p align="center">
  <a href="./README.zh-CN.md">[中文]</a> | <a href="./README.md">[English]</a>
</p>
<br />

# Valype 🐉

![Alt](https://repobeats.axiom.co/api/embed/21d8a2a1bd32ca3de06711098fe077905c5e8adf.svg "Repobeats analytics image")

**TypeScript 运行时验证器** - 从类型定义生成验证逻辑

> [!WARNING]
>
> Valype 目前正在积极开发中。API 可能会在未来版本中变更。请遵循 [Semver](https://semver.org/) 规范以避免**破坏性变更**。

- 🎯 类型安全的验证与 TypeScript 类型推断
- 🔌 无缝的 unplugin 集成 (Vite/Rollup/esbuild/Astro/Farm/Nuxt/Rspack/Webpack)
- 🛡️ 统一的类型验证
- 💻 TypeScript 插件
- 🛠️ IDE/编辑器扩展支持

Valype = Validate + Type。自动从 TypeScript 类型定义生成运行时验证器。

## 🚀 快速开始

1. 安装插件:

```bash
# npm 用户
npm add zod@latest
npm add -D unplugin-valype

# yarn 用户
yarn add zod@latest
yarn add -D unplugin-valype

# pnpm 用户
pnpm add zod@latest
pnpm add -D unplugin-valype

# bun 用户
bun add zod@latest
bun add -D unplugin-valype
```

> zod 的版本至少需要 `3.25.0`，但我们推荐使用 zod v4 以获得最佳体验，因为 valype 生成的是 zod v4 schema

2. 根据 [unplugin-valype 文档](./packages/plugin/README.md) 为你的构建工具配置插件

3. TypeScript 语言支持请参考下方 [编辑器集成](#-编辑器集成)。

4. 定义你的类型 (使用 `.valype.ts` 扩展名):

```typescript
// user.valype.ts
export interface User {
  name: string
  age: number
}
```

5. 使用生成的验证器:

```typescript
import { validateUser } from './user.valype'

const issues = validateUser(data) // 返回 ZodIssue[] 或 undefined
if (issues) {
  // 处理验证错误
}
```

## 📖 使用方式

`unplugin-valype` 会为从 `*.valype.ts` 文件导出的类型生成验证器。验证器的类型签名为:

```typescript
export declare function validateSome(data: unknown): ZodIssue[] | undefined
```

- 验证通过时返回 `undefined`
- 验证失败时返回包含错误详情的 `ZodIssue[]`

> [!NOTE]
>
> 通常你不需要直接使用 `valype` 包，只需使用生成的验证器即可。

## 📦 包列表

| 包                                                               | 版本                                                                                                                                       | 描述             |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| [valype](https://www.npmjs.com/package/valype)                   | [![valype 版本](https://img.shields.io/npm/v/valype?color=a1b858&label=)](https://www.npmjs.com/package/valype)                            | 核心模式生成逻辑 |
| [unplugin-valype](https://www.npmjs.com/package/unplugin-valype) | [![unplugin-valype 版本](https://img.shields.io/npm/v/unplugin-valype?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-valype) | 构建工具插件     |

## 🧑‍💻 编辑器集成

### VSCode 扩展

只需安装 [Valype VSCode 扩展](https://marketplace.visualstudio.com/items?itemName=yuzheng14.vscode-valype)，即可在 `.valype.ts` 文件中获得类型提示、补全、跳转等 IDE 体验。

- 无需手动配置 tsconfig 插件
- 对所有 `.valype.ts` 文件开箱即用
- 支持类型检查、补全、跳转等

在 VSCode 扩展市场搜索 “Valype” 并安装即可。

### TypeScript 语言服务插件

如需手动配置或在其他编辑器中使用，可以安装 TypeScript 语言服务插件：

```bash
npm install -D @valype/typescript-plugin
```

然后在 tsconfig.json 中添加：

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "@valype/typescript-plugin"
      }
    ]
  }
}
```

这样可以在支持 TypeScript 插件的编辑器中为 `.valype.ts` 文件启用类型提示、补全和跳转。

> [!TIP]
> 如果你在 VSCode 中使用该插件，为获得最佳类型体验，请设置为使用工作区的 TypeScript 版本：
> 1. 打开任意 TypeScript 文件
> 2. 点击状态栏中的 TypeScript 版本号
> 3. 选择“使用工作区版本”

## 💡 项目动机

TypeScript 提供了编译时的类型安全，但在运行时我们仍需要验证外部数据。传统方案（如 Zod）要求重复定义类型且会丢失代码提示文档（tsdoc）。Valype 通过自动生成运行时验证器，完美解决了这些问题：

- **单一定义** - 只需编写 TypeScript 类型，自动获得静态和运行时验证
- **完整类型信息** - 保留所有 tsdoc 文档和编辑器类型提示
- **无缝集成** - 与现有 TypeScript 开发生态完美兼容

```typescript
const userSchema = z.object({
  name: z.string(),
  age: z.number(),
})

type User = z.infer<typeof userSchema>
// 并且 `User['name']` 无法包含 tsdoc 信息
```

改用 valype:

```typescript
export interface User {
  /**
   * 用户名称
   */
  name: string
  age: number
}

// 校验函数是自动生成的！
const result = validateUser(data)

// 同时 `User['name']` 包含 tsdoc 信息
```

Valype 让你可以**只定义一次类型**就能自动获得运行时验证！

## 🥰 贡献指南

欢迎提交 Pull Request。对于重大变更，请先开 issue 讨论你想要做的修改。

## 🪪 许可证

[MIT](./LICENSE)

## 🙏 灵感来源

Valype 从以下优秀项目中获得灵感:

- [ts-to-zod](https://github.com/fabien0102/ts-to-zod)
- [Zod](https://github.com/colinhacks/zod)
- [@sinclair/typebox](https://github.com/sinclairzx81/typebox)

## 🌟 Star 历史

[![Star 历史图](https://api.star-history.com/svg?repos=yuzheng14/valype&type=Date)](https://www.star-history.com/#yuzheng14/valype&Date)
