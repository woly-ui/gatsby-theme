const visit = require('unist-util-visit');

module.exports = (options) => {
  // console.log('REMARK PLUGIN', options);

  function transformer(tree) {
    visit(tree, 'jsx', (node, index, parent) => {
      parent.children.splice(index + 1, 0, {
        type: 'code',
        lang: 'jsx',
        meta: null,
        value: node.value,
      });
    });

    // console.log('REMARK PLUGIN TRANSFORMER', tree);
  }

  return transformer;
};
