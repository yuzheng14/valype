import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: { extension: 'src/extension.ts' },
  external: (id) => id === 'vscode',
  sourcemap: true,
  dts: { sourcemap: true },
})
