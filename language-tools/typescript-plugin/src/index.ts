import { createLanguageServicePlugin } from '@volar/typescript/lib/quickstart/createLanguageServicePlugin'
import { getValyePlugin } from './language'

const plugin = createLanguageServicePlugin((_ts, info) => {
  const logger = info.project.projectService.logger

  return {
    languagePlugins: [getValyePlugin({ logger })],
  }
})

export default plugin
