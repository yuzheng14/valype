# Getting Started

## Installation

Install the plugin:

::: code-group

```bash [npm]
npm add zod@latest
npm add -D unplugin-valype
```

```bash [yarn]
yarn add zod@latest
yarn add -D unplugin-valype
```

```bash [pnpm]
pnpm add zod@latest
pnpm add -D unplugin-valype
```

```bash [bun]
bun add zod@latest
bun add -D unplugin-valype
```

> zod's version should be `3.25.0` at least, because valype generates zod v4 schema

:::

## Configuration

Add the plugin to your build tool configuration:

::: details Vite
```ts
// vite.config.ts
import valype from 'unplugin-valype/vite'

export default defineConfig({
  plugins: [
    valype({ /* options */ }),
  ],
})
```
:::

::: details Rollup
```ts
// rollup.config.js
import valype from 'unplugin-valype/rollup'

export default {
  plugins: [
    valype({ /* options */ }),
  ],
}
```
:::

::: details Webpack
```ts
// webpack.config.js
module.exports = {
  plugins: [
    require('unplugin-valype/webpack')({ /* options */ })
  ]
}
```
:::

::: details Nuxt
```ts
// nuxt.config.js
export default defineNuxtConfig({
  modules: [
    ['unplugin-valype/nuxt', { /* options */ }],
  ],
})
```
:::

::: details Vue CLI
```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require('unplugin-valype/webpack')({ /* options */ }),
    ],
  },
}
```
:::

::: details esbuild
```ts
// esbuild.config.js
import { build } from 'esbuild'
import valype from 'unplugin-valype/esbuild'

build({
  plugins: [valype()],
})
```
:::

## Usage

1. Define your types (use `.valype.ts` extension):

```typescript
// user.valype.ts
export interface User {
  name: string
  age: number
}
```

2. Use the generated validator:

```typescript
import { validateUser } from './user.valype'

const issues = validateUser(data) // Returns ZodIssue[] or undefined
if (issues) {
  // Handle validation errors
}
```

For IDE/editor integration (VSCode extension, TypeScript plugin, etc.), see [Editor & IDE Integration](./advanced/editor-integration.md).

## Validator Signature

`unplugin-valype` generates validators for types exported from `*.valype.ts` files:

```typescript
export declare function validateSome(data: unknown): ZodIssue[] | undefined
```

- Returns `undefined` when validation passes
- Returns `ZodIssue[]` with error details when validation fails

> Note: You typically don't need to use `valype` package directly, just use the generated validators.
