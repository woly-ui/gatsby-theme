/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const pathsPath = require.resolve('./src/paths.js');
const { paths } = require(pathsPath);

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
          tableOfContents
          fileAbsolutePath
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query`);
    throw result.errors;
  }

  const component = require.resolve('./src/templates/usage.js');

  result.data.usages.nodes.forEach(({ frontmatter, id }) => {
    actions.createPage({
      path: paths.componentUsage(frontmatter),
      component,
      context: {
        pageID: id,
      },
    });
  });
}
