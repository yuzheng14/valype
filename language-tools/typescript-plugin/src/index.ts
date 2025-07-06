import { createLanguageServicePlugin } from '@volar/typescript/lib/quickstart/createLanguageServicePlugin'
import { createPlugin } from '@valype/language-core'

const plugin = createLanguageServicePlugin((_ts, _info) => {
  return {
    languagePlugins: [createPlugin((scriptId) => scriptId)],
  }
})

export default plugin
