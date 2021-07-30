const visit = require('unist-util-visit');
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const { imports } = require('./imports');

const EXAMPLES_DIR = path.join(process.cwd(), '.temp/examples')

/*
 * Create unique idempotent hash from any string
 * We use it to create stable unique string for temporary files
 */
async function digest(message) {
  const hash = crypto.createHash('sha1')
  hash.update(message)
  return hash.digest("hex")
}

function generateNextPlaygroundId({ filePath, codePosition }) {
  return digest(`${filePath}-${codePosition}`)
}

function generatePlaygroundFilePath(id) {
  const fileName = `${id}.tsx`
  return path.join(EXAMPLES_DIR, fileName)
}

function writePlaygroundFile({ at, content, filePath, options }) {
  const { examplesGlobalImports = {} } = options

  // initial file directory
  const fileDirectory = path.parse(filePath).dir

  // needed to fix the wrong relative imports
  const relativePathFromTemp = path.relative(EXAMPLES_DIR, fileDirectory)

  let parsedImports = imports.extract(content)

  parsedImports = imports.add({
    imports: parsedImports,
    new: {
      'react': {
        defaultImport: 'React'
      },
      ...examplesGlobalImports
    }
  })

  parsedImports = imports.update({
    imports: parsedImports,
    if: ({ fromModule }) => fromModule.startsWith('.'),
    updater: (importItem) => ({
      ...importItem,
      fromModule: path.join(relativePathFromTemp, importItem.fromModule)
    })
  })

  const updatedContent = imports.replace({
    in: content,
    with: parsedImports
  })

  // write the result in temp directory
  fs.writeFileSync(at, updatedContent)

  console.log('WRITE', at)
}

module.exports = (options) => {
  const codeQueue = []

  function placeCodeInQueue({ node, index, parent, codePosition }) {
    codeQueue.push({ node, index, parent, codePosition })
  }

  async function processCodeQueue(file) {
    let inserted = 0

    for (const { node, index: initialIndex, parent, codePosition } of codeQueue) {
      const index = initialIndex + inserted
      const { meta, value: content } = node

      if (meta !== 'playground') {
        // this is not what we need
        return
      }

      const filePath = file.history[0]

      // generate the unique hash from filename and relative code block position
      const playgroundId = await generateNextPlaygroundId({ filePath, codePosition })

      // the unique temporary file path
      const playgroundFilePath = generatePlaygroundFilePath(playgroundId)

      writePlaygroundFile({
        at: playgroundFilePath,
        content,
        filePath,
        options
      })

      // create unique component name to prevent any conflicts
      const componentName = `Example_${playgroundId}`

      const importString = `import { Example as ${componentName} } from '${playgroundFilePath}'`

      // we can use the default MDX feature - JSX rendering
      const jsxString = `<${componentName} />`

      // insert the import declaration at the very start of MDX document
      parent.children.splice(0, 0, {
        type: 'import',
        value: importString
      })

      // insert the JSX at the current position
      // it's increased by 1 since previously inserted import caused the index shift
      parent.children.splice(index + 1, 0, {
        type: 'jsx',
        value: jsxString
      })

      inserted += 2
    }
  }

  function enqueueCodeBlocks(tree) {
    // used for unique idempotent hash generation
    let codePosition = 0

    visit(tree, 'code', (node, index, parent) => {
      codePosition += 1
      placeCodeInQueue({ node, index, parent, codePosition })
    })
  }

  async function transformer(tree, file) {
    // we can't use async in 'visit' function, so just enqueue first
    enqueueCodeBlocks(tree)

    await processCodeQueue(file)

    // for backward compatibility
    visit(tree, 'jsx', (node, index, parent) => {
      if (node.value.includes('Example_')) return

      parent.children.splice(index + 1, 0, {
        type: 'code',
        lang: 'jsx',
        meta: null,
        value: node.value,
      });
    });
  }

  return transformer;
};
