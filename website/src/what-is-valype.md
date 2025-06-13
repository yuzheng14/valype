# What is Valype?

Valype is a **TypeScript Runtime Validator** that automatically generates runtime validation from TypeScript type definitions. It transforms type definitions directly into validation functions, eliminating the need to write separate schemas and validation logic.

> [!TIP]
>
> Just want to try it out? Skip to the [Quickstart](./getting-started).

## Use Cases

- **API Validation**

  Validate HTTP request bodies and responses against your TypeScript types, ensuring runtime data matches your compile-time expectations.

- **Function Input Validation**

  Add runtime type checking to function parameters while maintaining full TypeScript type inference.

- **Configuration Validation**

  Validate configuration objects loaded at runtime while keeping type safety.

## Key Features

- 🎯 **Type-safe Validation**

  Generated validators preserve TypeScript type inference, giving you both compile-time and runtime safety.

- 🔌 **Build Tool Integration**

  Seamless integration via [unplugin](https://github.com/unjs/unplugin) for Vite, Rollup, esbuild, Astro, Farm, Nuxt, Rspack and Webpack.

- 🛡️ **Unified Type Definition**

  Define your types once in TypeScript and get runtime validation automatically - no need to maintain separate schemas.

- 🫂 **Zod Compatibility**

  Returns standard Zod issues when validation fails, making it easy to integrate with existing error handling.

## How It Works

1. Define TypeScript types/interfaces in `.valype.ts` files
2. Valype generates corresponding runtime validators during build
3. The validators check unknown data at runtime and either:
   - Return `undefined` if validation passes
   - Return `ZodIssue[]` with error details if validation fails

## Comparison With Alternatives

- **Zod**

  While Zod requires duplicating type definitions, Valype lets you define types once and generates validators automatically.

- **io-ts**

  Valype provides a more TypeScript-native experience compared to io-ts's functional style.

- **class-validator**

  Unlike class-validator which requires decorators, Valype works with plain TypeScript interfaces.

## Motivation

While TypeScript ensures compile-time type safety, runtime data validation remains essential. Traditional solutions like Zod require duplicate type definitions and lose valuable tsdoc information. Valype solves this by:

- **Single Source of Truth** - Define types once, get both static and runtime validation
- **Full Type Information** - Preserves all tsdoc documentation and editor hints
- **Seamless Integration** - Works natively with TypeScript tooling

::: code-group

```typescript [using-zod.ts]
const userSchema = z.object({
  name: z.string(),
  age: z.number(),
})

type User = z.infer<typeof userSchema>
// And `User['name'] does not have tsdoc info
```

```typescript [using-valype.ts]
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

:::

Valype lets you **define types once** and get runtime validation automatically!
