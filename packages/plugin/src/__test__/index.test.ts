import { describe, it, expect } from 'vitest'
import vitePlugin from '../vite'
import { Plugin as VitePlugin, build } from 'vite'
import { dirname, resolve } from 'node:path'
import { promisify } from 'node:util'
import { exec } from 'node:child_process'
import { tmpdir } from 'node:os'
import { mkdir, rm, symlink, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'

function getPlugin(): VitePlugin {
  const plugin = vitePlugin()
  if (Array.isArray(plugin))
    throw new Error('Expected a single plugin instance, but got an array.')

  return plugin
}

describe('unplugin-valype', () => {
  it('should create plugin with correct name', () => {
    const plugin = getPlugin()
    expect(plugin.name).toBe('unplugin-valype')
  })

  describe('load', () => {
    it('should throw error when virtual module not found', async () => {
      const plugin = getPlugin()
      await expect(
        async () =>
          // @ts-expect-error - it should exist
          await plugin.load.handler.call(
            {
              error(e: string) {
                throw e
              },
            },
            'valype:/not/exist',
          ),
      ).rejects.toThrowError('Cannot find schema for /not/exist')
    })
  })

  describe('build', async () => {
    it('should build correctly', async () => {
      const dirName = `valype-test-${Date.now()}`
      try {
        const plugin = getPlugin()

        const result = await build({
          plugins: [plugin],
          // root: resolve('src/__test__/fake-programs'),
          build: {
            target: 'esnext',
            lib: {
              entry: resolve(
                'packages/plugin/src/__test__/fake-programs/index.ts',
              ),
              formats: ['es'],
            },
            write: false,
            minify: false,
            rollupOptions: {
              external: [/zod.*/],
            },
          },
          logLevel: 'silent',
        })
        expect(result).toBeInstanceOf(Array)
        if (!Array.isArray(result)) throw new Error('unexpected result type')
        expect(
          result.map((r) =>
            r.output.map((o) =>
              o.type === 'chunk' ? { code: o.code, names: o.name } : o,
            ),
          ),
        ).toMatchInlineSnapshot(`
          [
            [
              {
                "code": "import { z } from 'zod/v4';

          const UserSchema = z.object({
            name: z.string(),
            age: z.number(),
            email: z.string()
          });

          function validateUser(data) {
            const result = UserSchema.safeParse(data);
            return result.error?.issues;
          }

          const result = validateUser({
            name: "John Doe"
          });
          console.log(result);
          ",
                "names": "index",
              },
            ],
          ]
        `)

        const tempDir = resolve(tmpdir(), dirName)
        await mkdir(tempDir)
        const tempFile = resolve(tempDir, 'test-output.mjs')
        await writeFile(tempFile, result[0].output[0].code)

        const require = createRequire(import.meta.url)
        const nodeModulesPath = resolve(
          require.resolve('zod/v4').split('node_modules')[0],
          'node_modules',
        )

        await symlink(
          nodeModulesPath,
          resolve(dirname(tempFile), 'node_modules'),
          'dir',
        )

        const { stdout } = await promisify(exec)(
          `${process.execPath} ${tempFile}`,
          {
            env: { NODE_PATH: nodeModulesPath },
          },
        )

        expect(stdout).toMatchInlineSnapshot(`
          "[
            {
              expected: 'number',
              code: 'invalid_type',
              path: [ 'age' ],
              message: 'Invalid input: expected number, received undefined'
            },
            {
              expected: 'string',
              code: 'invalid_type',
              path: [ 'email' ],
              message: 'Invalid input: expected string, received undefined'
            }
          ]
          "
        `)
      } finally {
        await rm(resolve(tmpdir(), dirName), { recursive: true, force: true })
      }
    })
  })
})
