import { access, cp, mkdir, rename, rm } from 'node:fs/promises'
import path from 'node:path'
import { defineConfig } from 'tsdown'
import packageJson from 'package-json'
import axios from 'axios'
import type Stream from 'node:stream'
import { createGunzip } from 'node:zlib'
import { x } from 'tar'

export default defineConfig([
  {
    entry: {
      'valype-typescript-plugin/index':
        '../../language-tools/typescript-plugin/src/index.ts',
    },
    define: {
      'process.env.NAPI_RS_NATIVE_LIBRARY_PATH': JSON.stringify(
        '@oxc-parser/binding-wasm32-wasi',
      ),
    },
    format: ['cjs'],
    plugins: [
      {
        name: 'symlink',
        // download wasm if not exists
        async buildStart() {
          const wasm = 'node_modules/@oxc-parser/binding-wasm32-wasi'
          try {
            await access(wasm)
          } catch {
            // if there is no wasm, download it
            await mkdir(wasm, {
              recursive: true,
            })

            const mainifest = await packageJson(
              '@oxc-parser/binding-wasm32-wasi',
              {
                version: 'latest',
              },
            )

            const tarball = await axios.get<Stream>(mainifest.dist.tarball, {
              responseType: 'stream',
            })

            await new Promise((resolve, reject) =>
              tarball.data
                .pipe(createGunzip())
                .pipe(
                  x({
                    C: wasm,
                    strip: 1,
                  }),
                )
                .on('error', reject)
                .on('finish', resolve),
            )
          }
        },
        // move valype-typescript-plugin to node_modules at top level
        async closeBundle() {
          try {
            await access('node_modules/valype-typescript-plugin')
            await rm('dist/valype-typescript-plugin', {
              recursive: true,
              force: true,
            })
          } catch {
            try {
              await access('node_modules')
            } catch {
              await mkdir('node_modules', { recursive: true })
            }
            await rename(
              'dist/valype-typescript-plugin',
              'node_modules/valype-typescript-plugin',
            )
          }

          // List of packages to copy
          const packages = [
            'typescript',
            '@emnapi/core',
            '@emnapi/runtime',
            '@tybys/wasm-util',
            '@emnapi/wasi-threads',
            'tslib',
            '@napi-rs/wasm-runtime',
          ]
          const cwd = process.cwd()
          for (const pkg of packages) {
            // Handle scoped packages
            const src = path.join(cwd, '../../node_modules', ...pkg.split('/'))
            const dest = path.join(cwd, 'node_modules', ...pkg.split('/'))
            try {
              await access(dest)
              // Already exists, skip
              continue
            } catch {
              // Does not exist, copy
              await cp(src, dest, { recursive: true })
            }
          }
        },
      },
    ],
  },
])
