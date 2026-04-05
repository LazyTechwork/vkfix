import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import monkey from 'vite-plugin-monkey'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    monkey({
      entry: 'src/index.ts',
      userscript: {
        grant: ['GM_getValue', 'GM_setValue', 'GM_addStyle', 'unsafeWindow'],
        match: ['https://vk.com/*', 'https://vk.ru/*', 'https://cargo.tau.vk.ru/*'],
      },
    }),
  ],
  resolve: {
    alias: {
      '#src': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    cssCodeSplit: false,
  },
})
