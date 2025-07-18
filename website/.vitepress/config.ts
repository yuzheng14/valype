import { defineConfig } from 'vitepress'
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from 'vitepress-plugin-group-icons'

const githubActions = process.env.GITHUB_ACTIONS === 'true'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  // site metadata
  title: 'valype',
  description:
    'TypeScript Runtime Validator - Generate validation from type definitions',
  base: githubActions ? '/valype/' : '/',
  head: [
    [
      'link',
      { rel: 'icon', href: (githubActions ? '/valype' : '') + '/logo.svg' },
    ],
  ],

  // build
  srcDir: 'src',

  // routing
  cleanUrls: true,

  // theming
  lastUpdated: true,

  themeConfig: {
    logo: { src: '/logo.svg', alt: 'Valype Logo', width: 24, height: 24 },

    search: {
      // TODO perhaps use Algolia
      provider: 'local',
    },

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/what-is-valype' },
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'What is Valype?', link: '/what-is-valype' },
          { text: 'Getting Started', link: '/getting-started' },
        ],
      },
      {
        text: 'Advanced',
        items: [
          {
            text: 'Editor & IDE Integration',
            link: '/advanced/editor-integration',
          },
          { text: 'API Reference', link: '/advanced/api-reference' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yuzheng14/valype' },
    ],
  },

  // customization
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin)
    },
  },
  vite: {
    plugins: [groupIconVitePlugin()],
  },
})
