#!/usr/bin/env bun
import { $, BunLockFile } from 'bun'
import { parse, modify, applyEdits } from 'jsonc-parser'

async function main() {
  // 1. 生成 changelog
  const { exitCode, stderr } = await $`bun -b changelog`
  if (exitCode) {
    console.error(stderr)
    process.exit(exitCode)
  }

  // 2. 更新 bun.lock 中的 workspace 版本
  try {
    const packageJson = await Bun.file('./package.json').json()
    const version = packageJson.version
    const lockFile = await Bun.file('./bun.lock').text()
    const lockData = parse(lockFile) as BunLockFile

    // 更新 workspaces 中的版本号
    // 精确修改每个 workspace 的版本号
    let modifiedContent = lockFile
    Object.keys(lockData.workspaces).forEach((pkgKey) => {
      if (lockData.workspaces[pkgKey].version) {
        const path = ['workspaces', pkgKey, 'version']
        const edits = modify(lockFile, path, version, {})
        modifiedContent = applyEdits(modifiedContent, edits)
      }
    })

    await Bun.write('./bun.lock', modifiedContent)
    console.log('✅ Successfully updated bun.lock workspace versions')
  } catch (err) {
    console.error(
      '❌ Failed to update bun.lock:',
      err instanceof Error ? err.message : String(err),
    )
    process.exit(1)
  }
}

main().catch((err) => {
  console.error(
    '❌ Script failed:',
    err instanceof Error ? err.message : String(err),
  )
  process.exit(1)
})
