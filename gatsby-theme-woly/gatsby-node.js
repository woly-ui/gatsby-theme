/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const pathsPath = require.resolve('./src/paths.js');
const { paths } = require(pathsPath);
const fs = require('fs');

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

  result.data.usages.nodes.forEach(({ id, fileAbsolutePath }) => {
    const [_, name, category, packageName] = fileAbsolutePath
      .split('/')
      .reverse();

    actions.createPage({
      id,
      path: paths.componentPage({ package: packageName, category, name }),
      component,
      context: {
        pageID: id,
        name,
        category,
        package: packageName,
      },
    });
  });
}

exports.onPostBuild = async (gatsby) => {
  await findScreenshotTestingConfigs(gatsby);
};

async function findScreenshotTestingConfigs({ graphql, reporter }) {
  const result = await graphql(`
    {
      configs: allFile(filter: { name: { eq: "config" } }) {
        nodes {
          relativePath
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query`);
    throw result.errors;
  }

  const configPaths = result.data.configs.nodes.map(({ relativePath }) => {
    const [name, category, packageName] = relativePath
      .replace('/__screenshot-test__/config.js', '')
      .split('/')
      .reverse();

    return {
      path: relativePath,
      name,
      category,
      package: packageName,
    };
  });

  fs.writeFileSync(
    `./public/screenshot-test-configs.json`,
    JSON.stringify(configPaths, null, 2),
  );
}
