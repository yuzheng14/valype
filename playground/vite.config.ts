import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import valype from 'unplugin-valype/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [valype(), vue()],
})
