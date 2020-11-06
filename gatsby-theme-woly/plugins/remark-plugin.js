const visit = require('unist-util-visit');

module.exports = (options) => {
  console.log('REMARK PLUGIN', options);

  function transformer(tree) {
    const codes = [];

    visit(tree, 'jsx', (node, index, parent) => {
      codes.push({
        at: index,
        node: {
          type: 'code',
          lang: 'jsx',
          meta: null,
          value: node.value,
        },
        parent,
      });
    });

    codes.forEach(({ at, node, parent }) => {
      parent.children.splice(at + 1, 0, node);
    });

    delete codes;

    // console.log('REMARK PLUGIN TRANSFORMER', tree);
  }

  return transformer;
};
