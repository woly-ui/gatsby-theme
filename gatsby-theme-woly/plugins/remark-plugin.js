const visit = require('unist-util-visit');

module.exports = (options) => {
  // console.log('REMARK PLUGIN', options);

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

    // When new element added to AST list, other elements is moved down
    // Absolute index of each element in `codes` has incorrect `at` position
    let shift = 0;
    codes.forEach(({ at, node, parent }) => {
      parent.children.splice(at + 1 + shift, 0, node);
      shift++;
    });

    delete codes;

    // console.log('REMARK PLUGIN TRANSFORMER', tree);
  }

  return transformer;
};
