import { describe, it, expect } from 'vitest'
import vitePlugin from '../vite'
import { Plugin as VitePlugin } from 'vite'

function getPlugin(): VitePlugin {
  const plugin = vitePlugin()
  if (Array.isArray(plugin))
    throw new Error('Expected a single plugin instance, but got an array.')

  return plugin
}

describe('unplugin-valype', () => {
  // beforeEach(() => {
  //   const mockGenerate = vi.fn()
  //   const mockMagicString = {
  //     prepend: vi.fn(),
  //     toString: vi.fn().mockReturnValue('transformed code'),
  //     generateMap: vi.fn().mockReturnValue({ mappings: '' }),
  //   }
  //   vi.resetAllMocks()
  //   vi.mock('valype', () => ({
  //     generate: mockGenerate,
  //   }))
  //   vi.mock('magic-string', () => ({
  //     default: vi.fn().mockImplementation(() => mockMagicString),
  //   }))
  // })

  it('should create plugin with correct name', () => {
    const plugin = getPlugin()
    expect(plugin.name).toBe('unplugin-valype')
  })

  describe('load', () => {
    it('should return schema code for virtual module', async () => {
      const plugin = getPlugin()
      const id = '/path/to/file.valype.ts'
      const code = 'export interface User { name: string }'

      // @ts-expect-error - it should exist
      plugin.transform.handler(code, id)

      // @ts-expect-error - it should exist
      const result = plugin.load(`valype:${id}`)
      expect(result).toMatchInlineSnapshot()
    })

    it('should throw error when virtual module not found', () => {
      const plugin = getPlugin()
      expect(() =>
        // @ts-expect-error - it should exist
        plugin.load.call(
          {
            error(e: string) {
              throw e
            },
          },
          'valype:/not/exist',
        ),
      ).toThrowError('Cannot find schema for /not/exist')
    })
  })

  describe('transform', () => {
    it('should transform .valype.ts files', async () => {
      const plugin = getPlugin()
      const id = '/path/to/file.valype.ts'
      const code = 'export interface User { name: string }'

      // @ts-expect-error - it should exist
      const result = await plugin.transform.handler(code, id)

      // @ts-expect-error - it should exist
      expect(plugin.transform.filter.id.test(id)).toBeTruthy()
      expect(result).toMatchInlineSnapshot(`
        {
          "code": "import { UserSchema } from 'valype:/path/to/file.valype.ts'
        export interface User { name: string }",
          "map": SourceMap {
            "file": undefined,
            "mappings": ";AAAA,MAAM,CAAC,SAAS,CAAC,IAAI,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,MAAM,CAAC",
            "names": [],
            "sources": [
              "/path/to/file.valype.ts",
            ],
            "sourcesContent": [
              "export interface User { name: string }",
            ],
            "version": 3,
          },
        }
      `)
    })

    it('should not transform non-valype files', async () => {
      const plugin = getPlugin()

      // @ts-expect-error - it should exist
      const result = await plugin.transform.handler('', '/path/to/file.ts')

      expect(result).toBeUndefined()
    })
  })

  describe('buildEnd', () => {
    it('should clear schemaMap', async () => {
      const plugin = getPlugin()
      const id = '/path/to/file.valype.ts'
      const code = 'export interface User { name: string }'

      // @ts-expect-error - it should exist
      await plugin.transform.handler(code, id)
      // @ts-expect-error - it should exist
      plugin.buildEnd()

      expect(() =>
        // @ts-expect-error - it should exist
        plugin.load.call(
          {
            error(e: string) {
              throw e
            },
          },
          'valype:/path/to/file.valype.ts',
        ),
      ).toThrowError('Cannot find schema for /path/to/file.valype.ts')
    })
  })
})
