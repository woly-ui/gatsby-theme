module.exports = (themeOptions) => {
  const IS_DEV = process.env.NODE_ENV !== 'production';
  console.log('OPTIONS', themeOptions);

  return {
    plugins: [
      'gatsby-plugin-sitemap',
      'gatsby-plugin-react-helmet',
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
        resolve: `gatsby-plugin-mdx`,
      },
    ],
  };
};
