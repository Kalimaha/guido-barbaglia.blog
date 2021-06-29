module.exports = {
  siteMetadata: {
    title: "Blog",
    titleTemplate: "%s | Guido Barbaglia",
    description: "Guido Barbaglia's personal blog.",
    url: "https://guido-barbaglia.blog",
    image: "/guido-barbaglia.png",
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
        icon: "src/images/guido-barbaglia.png",
        start_url: `/`,
        background_color: `#171717`,
        theme_color: `#171717`,
        display: `standalone`,
      },
    },
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
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
  ],
};
