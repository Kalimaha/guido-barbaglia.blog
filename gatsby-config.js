module.exports = {
  siteMetadata: {
    title: "Blog",
    titleTemplate: "%s | Guido Barbaglia",
    description: "Guido Barbaglia's personal blog.",
    url: "https://guido-barbaglia.blog",
    siteUrl: "https://guido-barbaglia.blog",
    image: "src/images/guido-barbaglia.webp",
    twitterUsername: "@Kalimaha",
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdown-pages`,
        path: `${__dirname}/src/markdown-pages`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-highlight-code`,
            options: {
              theme: "vscode",
              lineNumbers: true,
            }
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Guido Barbaglia`,
        short_name: `Guido Barbaglia`,
        description: "Guido Barbaglia's personal blog.",
        lang: "en",
        icon: "src/images/guido-barbaglia.webp",
        start_url: `/`,
        background_color: `#171717`,
        theme_color: `#171717`,
        display: `standalone`,
      },
    },
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-preact`,
    `gatsby-plugin-fontawesome-css`,
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: 'https://guido-barbaglia.blog',
        sitemap: 'https://guido-barbaglia.blog/sitemap.xml',
        env: {
          development: {
            policy: [{ userAgent: '*', disallow: ['/'] }]
          },
          production: {
            policy: [{ userAgent: '*', allow: '/' }]
          }
        }
      }
    },
    {
      resolve: `gatsby-plugin-google-adsense`,
      options: {
        publisherId: `ca-pub-3293377835042944`
      },
    },
    {
      resolve: `gatsby-plugin-advanced-sitemap`,
      options: {
        output: "/sitemap.xml",
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        precachePages: [`/`],
      },
    },
    {
      resolve: `gatsby-plugin-gatsby-cloud`,
      options: {
        allPageHeaders: [
          "cache-control: public, max-age=31536000, immutable"
        ]
      },
    },
    {
      resolve: `gatsby-plugin-netlify`,
      options: {
        headers: {
          "/**/*.html": [
            "cache-control: public",
            "cache-control: max-age=0",
            "cache-control: must-revalidate",
          ],
          "/page-data/*.json": [
            "cache-control: public",
            "cache-control: max-age=0",
            "cache-control: must-revalidate",
          ],
          "/app-data.json": [
            "cache-control: public",
            "cache-control: max-age=0",
            "cache-control: must-revalidate",
          ],
          "/static/*": [
            "cache-control: public",
            "cache-control: max-age=31536000",
            "cache-control: immutable",
          ],
        },
      },
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: [
          "UA-87710589-1"
        ],
      },
    },
  ],
};
