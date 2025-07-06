import { createLabsInfo } from '@volar/vscode'
import {
  defineExtension,
  onDeactivate,
  useOutputChannel,
} from 'reactive-vscode'
import { Uri } from 'vscode'
import {
  BaseLanguageClient,
  LanguageClient,
  type LanguageClientOptions,
  type ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node'
import * as serverProtocol from '@volar/language-server/protocol'

let client: BaseLanguageClient

const LANGUAGE_SERVER_NAME = 'Valype Language Server'
export const { activate, deactivate } = defineExtension(async (context) => {
  const serverModule = Uri.joinPath(
    context.extensionUri,
    'node_modules',
    '@valype/language-server',
    'dist',
    'server.js',
  )

  const serverOptions: ServerOptions = {
    run: {
      module: serverModule.fsPath,
      transport: TransportKind.ipc,
      options: { execArgv: [] },
    },
    debug: {
      module: serverModule.fsPath,
      transport: TransportKind.ipc,
      options: { execArgv: ['--nolazy', '--inspect=' + 6009] },
    },
  }

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ language: 'valype' }],
    initializationOptions: {},
    outputChannel: useOutputChannel(LANGUAGE_SERVER_NAME),
  }

  client = new LanguageClient(
    'valype-language-server',
    LANGUAGE_SERVER_NAME,
    serverOptions,
    clientOptions,
  )

  await client.start()

  onDeactivate(async () => {
    await client?.stop()
  })

  const labsInfo = createLabsInfo(serverProtocol)
  labsInfo.addLanguageClient(client)
  return labsInfo.extensionExports
})
