import { createPlugin } from '@valype/language-core'
import {
  createConnection,
  createServer,
  createTypeScriptProject,
  loadTsdkByPath,
} from '@volar/language-server/node.js'
import { URI } from 'vscode-uri'

const connection = createConnection()
const server = createServer(connection)

connection.listen()

connection.onInitialize((params) => {
  const tsdk = params.initializationOptions.tsdk

  if (!tsdk) {
    throw new Error(
      'The `tsdk` init option is required. It should point ot a directory containing a `js` or `tsserverlibrary.js` file, such as `node_modules/typescript/lib`.',
    )
  }

  const { typescript, diagnosticMessages } = loadTsdkByPath(tsdk, params.locale)

  return server.initialize(
    params,
    createTypeScriptProject(typescript, diagnosticMessages, () => ({
      languagePlugins: [createPlugin<URI>((scriptId) => scriptId.fsPath)],
    })),
    [],
  )
})

connection.onInitialized(server.initialized)

connection.onShutdown(server.shutdown)
