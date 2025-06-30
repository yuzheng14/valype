# @valype/typescript-plugin

TypeScript language service plugin that provides IDE support for `.valype.ts` files.

## Features

- Recognizes `.valype.ts` file extension
- Transforms valype code to TypeScript in real-time
- Provides IDE features like type checking, code completion and go-to-definition
- Supports validation, semantic analysis and formatting

## Installation

::: code-group

```bash [npm]
npm install -D @valype/typescript-plugin
```

```bash [yarn]
yarn add -D @valype/typescript-plugin
```

```bash [pnpm]
pnpm add -D @valype/typescript-plugin
```

```bash [bun]
bun add -D @valype/typescript-plugin
```

:::

## Usage

1. Configure plugin in tsconfig.json:

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

2. Create `.valype.ts` files and start writing valype code

3. For VSCode users, ensure you're using the workspace version of TypeScript:
   - Open a TypeScript file in VSCode
   - Click the TypeScript version number in the status bar
   - Select "Use Workspace Version" from the dropdown

## Example

```typescript
// user.valype.ts
interface User {
  name: string
  age: number
}
```

```typescript
// use user.valype.ts
import { validateUser, assertUser, isUser, type User } from './user.valype'

const data = {} satisfies User

const result = validateUser(data)

if (isUser(data)) console.log('data is User')

assertUser(data)
```
