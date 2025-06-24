import { createLanguageServicePlugin } from '@volar/typescript/lib/quickstart/createLanguageServicePlugin'
import { valype } from './language'

// doesn't use currently
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const plugin = createLanguageServicePlugin((_ts, _info) => {
  return {
    languagePlugins: [valype],
  }
})

export default plugin
