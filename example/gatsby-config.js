module.exports = {
  plugins: [
    {
      resolve: `gatsby-theme-woly`,
      options: { components: `src` },
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
  ],
};
