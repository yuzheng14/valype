import type { UnpluginFactory } from 'unplugin'
import type { Options } from './types'
import { createUnplugin } from 'unplugin'
import { generate } from 'valype'
import MagicString from 'magic-string'

export const unpluginFactory: UnpluginFactory<Options | undefined> = () => {
  const schemaMap = new Map<string, string>()

  // FIXME pre-transform(esbuild) could not find exports in `*.valype.ts`,
  // it seemed like esbuild doesn't call `transform` for `*.valype.ts` files
  return {
    name: 'unplugin-valype',
    // should process ts before esbuild plugin,
    // otherwise it will receive code without type definitions
    enforce: 'pre',
    resolveId(id) {
      if (id.startsWith('valype:')) {
        return id
      }
    },
    load(id) {
      // load valype virtual modules, if not found, report an error
      if (id.startsWith('valype:')) {
        const realId = id.slice('valype:'.length)
        const code = schemaMap.get(realId)
        if (!code) {
          this.error(`Cannot find schema for ${realId}`)
          return
        }
        return code
      }
    },
    buildEnd() {
      schemaMap.clear()
    },
    transform: {
      filter: { id: /.valype.ts$/ },
      async handler(code, id) {
        const result = await generate(code)
        if (result.code && result.schemas.length > 0) {
          schemaMap.set(id, result.code)
          const s = new MagicString(code)
          s.prepend(
            `import { ${result.schemas.join(', ')} } from 'valype:${id}'\n`,
          )
          // FIXME now export all schemas directly to test
          s.append(
            `\n${result.schemas.map((schema) => `export { ${schema} }`).join('\n')}\n`,
          )
          return {
            code: s.toString(),
            map: s.generateMap({
              source: id,
              includeContent: true,
              hires: 'boundary',
            }),
          }
        }
      },
    },
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
