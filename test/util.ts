import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export function getFakeProgramPath(name: string) {
  return resolve(fileURLToPath(new URL('.', import.meta.url)), `fake-program/${name}`)
}
