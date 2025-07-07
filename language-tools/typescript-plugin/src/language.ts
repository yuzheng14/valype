import {
  forEachEmbeddedCode,
  type CodeMapping,
  type LanguagePlugin,
  type VirtualCode,
} from '@volar/language-core'
import type { IScriptSnapshot, ScriptKind, server } from 'typescript'
import { computed, signal } from 'alien-signals'
import '@volar/typescript'
import { generateSync } from 'valype'

export class ValypeCode implements VirtualCode {
  // sources
  id = 'root'
  languageId = 'valype'
  private _snapshot = signal<IScriptSnapshot>(undefined!)

  // computed

  private _mappings = computed(() => {
    const snapshot = this._snapshot()
    return [
      {
        sourceOffsets: [0],
        generatedOffsets: [0],
        lengths: [snapshot.getLength()],
        data: {
          verification: true,
          completion: true,
          semantic: true,
          navigation: true,
          structure: true,
          format: true,
        },
      },
    ] satisfies CodeMapping[]
  })

  private _embeddedCodes = computed<VirtualCode[]>(() => {
    const sourceCode = this._snapshot().getText(0, this._snapshot().getLength())
    const result = generateSync(sourceCode)

    // TODO error handling
    if (result instanceof Error) throw result

    const code = [
      ...result.code.imports,
      result.validatorImport,
      sourceCode,
      result.code.banner,
      result.code.content,
      ...result.exports.map((e) => {
        const r = result.generateValidator(e.interface, e.schema)
        return [r.banner, ...r.imports, r.content].join('\n')
      }),
    ].join('\n')

    this.context.logger.info(`generated embedded code: ${code}`)

    return [
      {
        id: 'ts',
        languageId: 'typescript',
        snapshot: {
          getText: (start, end) => code.slice(start, end),
          getChangeRange: () => undefined,
          getLength: () => code.length,
        },
        mappings: [
          {
            sourceOffsets: [0],
            generatedOffsets: [code.indexOf(sourceCode)],
            lengths: [sourceCode.length],
            data: {
              verification: true,
              completion: true,
              semantic: true,
              navigation: true,
              structure: true,
              format: true,
            },
          },
        ],
      } satisfies VirtualCode,
    ]
  })

  // getters
  get snapshot() {
    return this._snapshot()
  }
  get mappings() {
    return this._mappings()
  }
  get embeddedCodes() {
    return this._embeddedCodes()
  }

  constructor(
    public filename: string,
    private context: ValyePluginContext,
    initSnapshot: IScriptSnapshot,
  ) {
    this._snapshot(initSnapshot)
  }

  update(newSnapshot: IScriptSnapshot) {
    this._snapshot(newSnapshot)
  }
}

export interface ValyePluginContext {
  logger: server.Logger
}

export function getValyePlugin(
  ctx: ValyePluginContext,
): LanguagePlugin<string, ValypeCode> {
  const { logger } = ctx
  return {
    getLanguageId(scriptId) {
      logger.info(`getLanguageId received ${scriptId}`)
      if (scriptId.endsWith('.valype.ts')) return 'valype'
    },
    createVirtualCode(scriptId, languageId, snapshot) {
      logger.info(
        `createVirtualCode received ${scriptId}, ${languageId}, ${snapshot.getText(0, snapshot.getLength())}`,
      )
      if (languageId === 'valype')
        return new ValypeCode(scriptId, ctx, snapshot)
    },
    updateVirtualCode(_scriptId, virtualCode, newSnapshot) {
      logger.info(
        `updateVirtualCode received ${newSnapshot.getText(0, newSnapshot.getLength())}`,
      )
      virtualCode.update(newSnapshot)
      return virtualCode
    },
    typescript: {
      extraFileExtensions: [
        {
          extension: 'valype.ts',
          isMixedContent: false,
          scriptKind: 3 satisfies ScriptKind.TS,
        },
      ],
      getServiceScript(root) {
        for (const code of forEachEmbeddedCode(root)) {
          if (code.id === 'ts') {
            return {
              code,
              extension: '.ts',
              scriptKind: 3 satisfies ScriptKind.TS,
            }
          }
        }
      },
    },
  }
}
