import { defineExtension, useOutputChannel } from 'reactive-vscode'

const LANGUAGE_SERVER_NAME = 'Valype Language Server'
export const { activate, deactivate } = defineExtension(async () => {
  const outputChannel = useOutputChannel(LANGUAGE_SERVER_NAME)
  outputChannel.appendLine(`${LANGUAGE_SERVER_NAME} initialized`)
})
