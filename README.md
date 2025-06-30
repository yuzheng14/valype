<p align="center">
  <img width="180" src="./assets/logo.svg" alt="Valype log">
</p>
<br />

<p align="center">
  <a href="https://www.npmjs.com/package/valype"><img src="https://img.shields.io/npm/v/valype?color=a1b858&label=" alt="valype version"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/npm/l/valype" alt="valype license"></a>
</p>
<br/>
<p align="center">
  <a href="./README.zh-CN.md">[中文]</a> | <a href="./README.md">[English]</a>
</p>
<br />

# Valype 🐉

![Alt](https://repobeats.axiom.co/api/embed/21d8a2a1bd32ca3de06711098fe077905c5e8adf.svg 'Repobeats analytics image')

**TypeScript Runtime Validator** - Generate validation from type definitions

> [!WARNING]
>
> Valype is currently under active development. APIs may change in future releases. Please follow [Semver](https://semver.org/) to avoid **breaking changes**.

- 🎯 Type-safe validation with TypeScript type inference
- 🔌 Seamless unplugin integration (Vite/Rollup/esbuild/Astro/Farm/Nuxt/Rspack/Webpack)
- 🛡️ Unified type validation
- 💻 TypeScript plugin for IDE support
- 🚧 IDE/editor extension support (WIP)

Valype = Validate + Type. Automatically generates runtime validators from TypeScript type definitions.

## 🚀 Getting Started

1. Install plugin:

```bash
# for npm users
npm add zod@latest
npm add -D unplugin-valype

# for yarn users
yarn add zod@latest
yarn add -D unplugin-valype

# for pnp users
pnpm add zod@latest
pnpm add -D unplugin-valype

# for bun users
bun add zod@latest
bun add -D unplugin-valype
```

> zod's version should be `3.25.0` at least, because valype generates zod v4 schema

2. Configure plugin for your build tool following [unplugin-valype docs](./packages/plugin/README.md)

3. For TypeScript language support, install the plugin:

```bash
npm install -D @valype/typescript-plugin
```

Then add to your tsconfig.json:

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

> For VSCode users, ensure you're using the workspace version of TypeScript

4. Define your types (use `.valype.ts` extension):

```typescript
// user.valype.ts
export interface User {
  name: string
  age: number
}
```

4. Use the generated validator:

```typescript
import { validateUser } from './user.valype'

const issues = validateUser(data) // Returns ZodIssue[] or undefined
if (issues) {
  // Handle validation errors
}
```

## 📖 Usage

`unplugin-valype` generates validators for types exported from `*.valype.ts` files. The validator type signature is:

```typescript
export declare function validateSome(data: unknown): ZodIssue[] | undefined
```

- Returns `undefined` when validation passes
- Returns `ZodIssue[]` with error details when validation fails

> [!NOTE]
>
> You typically don't need to use `valype` package directly, just use the generated validators.

## 📦 Packages

| Package                                                          | Version                                                                                                                                       | Description                  |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| [valype](https://www.npmjs.com/package/valype)                   | [![valype version](https://img.shields.io/npm/v/valype?color=a1b858&label=)](https://www.npmjs.com/package/valype)                            | Core schema generation logic |
| [unplugin-valype](https://www.npmjs.com/package/unplugin-valype) | [![unplugin-valype version](https://img.shields.io/npm/v/unplugin-valype?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-valype) | Build tool plugin            |

## 💡 Motivation

While TypeScript ensures compile-time type safety, runtime data validation remains essential. Traditional solutions like Zod require duplicate type definitions and lose valuable tsdoc information. Valype solves this by:

- **Single Source of Truth** - Define types once, get both static and runtime validation
- **Full Type Information** - Preserves all tsdoc documentation and editor hints
- **Seamless Integration** - Works natively with TypeScript tooling

```typescript
const userSchema = z.object({
  name: z.string(),
  age: z.number(),
})

type User = z.infer<typeof userSchema>
// And `User['name'] does not have tsdoc info
```

Using valype:

```typescript
export interface User {
  /**
   * name of user
   */
  name: string
  age: number
}

// Validator is generated automatically!
const result = validateUser(data)

// Also `User['name'] has tsdoc info
```

Valype lets you **define types once** and get runtime validation automatically!

## 🥰 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## 🪪 License

[MIT](./LICENSE)

## 🙏 Inspired By

Valype draws inspiration from these excellent projects:

- [ts-to-zod](https://github.com/fabien0102/ts-to-zod)
- [Zod](https://github.com/colinhacks/zod)
- [@sinclair/typebox](https://github.com/sinclairzx81/typebox)

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yuzheng14/valype&type=Date)](https://www.star-history.com/#yuzheng14/valype&Date)
