/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const pathsPath = require.resolve('./src/paths.js');
const { paths } = require(pathsPath);
const path = require('path');

try {
  require.resolve(`babel-plugin-extract-react-types`);
} catch (e) {
  throw new Error(
    `'babel-plugin-extract-react-types' is not installed which is needed by 'gatsby-theme-woly'`,
  );
}

exports.onCreateBabelConfig = ({ stage, actions }, pluginOptions) => {
  actions.setBabelPlugin({
    name: `babel-plugin-extract-react-types`,
    stage,
  });
};

exports.createPages = async (gatsby) => {
  await createUsagePages(gatsby);
};

async function createUsagePages({ actions, graphql, reporter }) {
  const result = await graphql(`
    {
      usages: allMdx {
        nodes {
          id
          frontmatter {
            category
            name
            package
          }
          fileAbsolutePath
          body
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query`);
    throw result.errors;
  }

  const component = require.resolve('./src/templates/usage.js');

  const mdxGroups = result.data.usages.nodes.reduce((all, node) => {
    const { frontmatter, fileAbsolutePath, body } = node;
    const key = `${Object.values(frontmatter).join('-')}`;

    if (!all[key])
      all[key] = {
        ...frontmatter,
        nodes: [],
      };

    all[key].nodes.push({
      type: path.basename(fileAbsolutePath, '.mdx'),
      body,
    });

    return all;
  }, {});

  Object.values(mdxGroups).forEach((mdxGroup) => {
    actions.createPage({
      path: paths.componentUsage({
        package: mdxGroup.package,
        name: mdxGroup.name,
      }),
      component,
      context: {
        ...mdxGroup,
      },
    });
  });
}
