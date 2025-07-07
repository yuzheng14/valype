#!/usr/bin/env node
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

if (process.argv.includes('--version')) {
  const pkgJSON = JSON.parse(
    readFileSync(join(__dirname, '../package.json'), 'utf8'),
  )
  console.log(`${pkgJSON['version']}`)
} else {
  await import('../dist/index.js')
}
