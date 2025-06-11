import { defineConfig } from 'vitest/config'
import { workspaces } from './package.json'

export default defineConfig({
  test: {
    projects: workspaces,
  },
})
