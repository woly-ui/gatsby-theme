const visit = require('unist-util-visit');

module.exports = ({ markdownAST, actions }, options) => {
  console.log('GATSBY PLUGIN', markdownAST, options);
  const imports = [];
  visit(markdownAST, 'import', (node, index, parent) => {
    imports.push(node);
  });
  console.log('IMPORTS', imports);
};
