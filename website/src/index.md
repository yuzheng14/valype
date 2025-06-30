---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'Valype'
  text: 'TypeScript Runtime Validator'
  tagline: 'Generate Validator from Type Definitions'
  image:
    src: /logo.svg
    alt: Valype logo
  actions:
    - theme: brand
      text: What is Valype?
      link: /what-is-valype
    - theme: alt
      text: Get Started
      link: /getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/yuzheng14/valype

features:
  - icon: 🎯
    title: Type-safe validation
    details: TypeScript type inference for runtime validation
  - icon: 🔌
    title: Build tool integration
    details: Seamless unplugin integration (Vite/Rollup/esbuild/Astro/Farm/Nuxt/Rspack/Webpack)
  - icon: 🛡️
    title: Unified type validation
    details: Define types once and get runtime validation automatically
  - icon: 💻
    title: IDE Support
    details: TypeScript plugin provides editor support for .valype.ts files
---
