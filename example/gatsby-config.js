module.exports = {
  plugins: [
    {
      resolve: `gatsby-theme-woly`,
      options: {
        components: `src`,
        examplesGlobalImports: {
          'gatsby-theme-woly/src/components/frame': {
            namedImports: [{ name: 'Frame', value: 'Frame' }]
          }
        }
      },
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
  ],
};
