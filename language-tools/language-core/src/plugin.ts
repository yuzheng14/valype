/// <reference types="@volar/typescript" />
import { forEachEmbeddedCode, type LanguagePlugin } from '@volar/language-core'
import { ValypeCode } from './language'
import type { ScriptKind } from 'typescript'

export function createPlugin<T>(
  resolveFileName: (scriptId: T) => string,
): LanguagePlugin<T, ValypeCode> {
  return {
    getLanguageId(scriptId) {
      if (resolveFileName(scriptId).endsWith('.valype.ts')) return 'valype'
    },
    createVirtualCode(scriptId, languageId, snapshot) {
      if (languageId === 'valype')
        return new ValypeCode(resolveFileName(scriptId), snapshot)
    },
    updateVirtualCode(_scriptId, virtualCode, newSnapshot) {
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
