# unplugin-valype

[![NPM version](https://img.shields.io/npm/v/unplugin-valype?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-valype)

## Install

```bash
npm add -D unplugin-valype
yarn add -D unplugin-valype
pnpm add -D unplugin-valype
bun add -D unplugin-valype
```

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import valype from 'unplugin-valype/vite'

export default defineConfig({
  plugins: [
    valype({ /* options */ }),
  ],
})
```

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import valype from 'unplugin-valype/rollup'

export default {
  plugins: [
    valype({ /* options */ }),
  ],
}
```

<br></details>

<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('unplugin-valype/webpack')({ /* options */ })
  ]
}
```

<br></details>

<details>
<summary>Nuxt</summary><br>

```ts
// nuxt.config.js
export default defineNuxtConfig({
  modules: [
    ['unplugin-valype/nuxt', { /* options */ }],
  ],
})
```

> This module works for both Nuxt 2 and [Nuxt Vite](https://github.com/nuxt/vite)

<br></details>

<details>
<summary>Vue CLI</summary><br>

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

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from 'esbuild'
import valype from 'unplugin-valype/esbuild'

build({
  plugins: [valype()],
})
```

<br></details>
