import {
  forEachEmbeddedCode,
  type CodeMapping,
  type LanguagePlugin,
  type VirtualCode,
} from '@volar/language-core'
import type { IScriptSnapshot, ScriptKind } from 'typescript'
import { computed, signal } from 'alien-signals'
import '@volar/typescript'

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

  // getters
  get snapshot() {
    return this._snapshot()
  }
  get mappings() {
    return this._mappings()
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

export const valype: LanguagePlugin<string, ValypeCode> = {
  getLanguageId(scriptId) {
    if (scriptId.endsWith('.valype.ts')) return 'valype'
  },
  createVirtualCode(scriptId, languageId, snapshot) {
    if (languageId === 'valype') return new ValypeCode(scriptId, snapshot)
  },
  updateVirtualCode(_scriptId, virtualCode, newSnapshot) {
    virtualCode.update(newSnapshot)
    return virtualCode
  },
  typescript: {
    extraFileExtensions: [
      {
        extension: '.valype.ts',
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
