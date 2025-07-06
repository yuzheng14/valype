import type { CodeMapping, VirtualCode } from '@volar/language-core'
import { computed, signal } from 'alien-signals'
import type { IScriptSnapshot } from 'typescript'
import { generateSync } from 'valype'

export class ValypeCode implements VirtualCode {
  //sources
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
    initSnapshot: IScriptSnapshot,
  ) {
    this._snapshot(initSnapshot)
  }

  update(newSnapshot: IScriptSnapshot) {
    this._snapshot(newSnapshot)
  }
}
