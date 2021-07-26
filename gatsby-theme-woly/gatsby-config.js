module.exports = (themeOptions) => {
  const IS_DEV = process.env.NODE_ENV !== 'production';
  // console.log('WOLY THEME OPTIONS', themeOptions);

  return {
    plugins: [
      // 'gatsby-plugin-sitemap',
      'gatsby-plugin-react-helmet',
      {
        resolve: `gatsby-plugin-mdx`,
        options: {
          gatsbyRemarkPlugins: [
            {
              resolve: require.resolve('./plugins/gatsby-plugin.js'),
              options: {},
            },
          ],
          rehypePlugins: [require('./plugins/rehype-plugin.js')],
          remarkPlugins: [
            require('./plugins/remark-plugin.js'),
            {
              resolve: require.resolve('remark-comments'),
              options: {
                beginMarker: '',
                endMarker: ''
              }
            }
          ],
        },
      },
      {
        resolve: 'gatsby-plugin-styled-components',
        options: { displayName: IS_DEV },
      },
      {
        resolve: `gatsby-source-filesystem`,
        options: {
          name: `usages`,
          path: themeOptions.components,
        },
      },
      {
        resolve: `gatsby-plugin-page-creator`,
        options: {
          path: themeOptions.components,
          ignore: ['**/!(__screenshot-test__)/*', '**/*.(js|ts|jsx)'],
        },
      },
    ],
  };
};
