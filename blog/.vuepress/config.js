const articles = require('../articles/list.js')
const guide = require('../guide/list.js')

module.exports = {
  title: "فندوق",
  description: "وبلاگ سرویس ابری فندوق",
  head: [["link", { rel: "icon", href: `/logo.png` }]],
  base: "/",
  dest: "./dist",
  themeConfig: {
    nav: [
      { text: "خانه", link: "/" },
      { text: "مستندات", link: "/guide/" },
      { text: "گیتهاب", link: "https://github.com/fandoghpaas/fandogh-blog" }
    ],
    sidebar: {
      '/guide/': [
        {
          title: 'مستندات',
          collapsable: false,
          children: guide()
        }
      ],
      'home': articles()
    }
  },

  markdown: {
    // options for markdown-it-anchor
    anchor: { permalink: false },
    config: md => {
      md.use(require("markdown-it-katex"));
    }
  }
};

