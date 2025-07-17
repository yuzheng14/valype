import { access, mkdir, symlink } from 'node:fs/promises'
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    'dist/extension': 'src/extension.ts',
    'node_modules/valype-typescript-plugin/index':
      '../../language-tools/typescript-plugin/src/index.ts',
  },
  external: (id) => ['vscode', 'oxc-parser'].includes(id),
  outDir: '.',
  clean: false,
  sourcemap: true,
  dts: { sourcemap: true },
  plugins: [
    {
      name: 'symlink',
      async buildEnd() {
        await mkdir('node_modules/@valype', { recursive: true })

        await access('node_modules/@valype/typescript-plugin').catch(() =>
          symlink(
            '../../../../language-tools/typescript-plugin',
            'node_modules/@valype/typescript-plugin',
          ),
        )
      },
    },
  ],
})
