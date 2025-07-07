# @valype/typescript-plugin

为 `.valype.ts` 文件提供 IDE 支持的 TypeScript 语言服务插件。

[English](./README.md)

## 功能特性

- 识别 `.valype.ts` 文件扩展名
- 实时将 valype 代码转换为 TypeScript 代码
- 提供类型检查、代码补全和跳转定义等 IDE 功能
- 支持验证、语义分析和格式化

## 安装

```bash
npm install -D @valype/typescript-plugin # npm 用户
yarn add -D @valype/typescript-plugin # yarn 用户
pnpm add -D @valype/typescript-plugin # pnpm 用户
bun add -D @valype/typescript-plugin # bun 用户
```

## 使用方法

1. 在 tsconfig.json 中配置插件：

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

2. 创建 `.valype.ts` 文件并开始编写 valype 代码

3. VSCode 用户需要确保使用工作区版本的 TypeScript：

   - 在 VSCode 中打开一个 TypeScript 文件
   - 点击状态栏中的 TypeScript 版本号
   - 从下拉菜单中选择"使用工作区版本"

## 示例

```typescript
// user.valype.ts
interface User {
  name: string
  age: number
}
```

```typescript
// 使用 user.valype.ts
import { validateUser, assertUser, isUser, type User } from './user.valype'

const data = {} satisfies User

const result = validateUser(data)

if (isUser(data)) console.log('data 是 User 类型')

assertUser(data)
```
