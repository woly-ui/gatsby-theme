const visit = require('unist-util-visit');
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const rimraf = require('rimraf')
const parseImports = require('parse-imports')

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

const REGEXPS = {
  import: /(import\s+?(?:[\w*\s{},]*)\s+from\s+?)((?:".*?")|(?:'.*?'))([\s]*?(;|$|))/,
  importAll: /(import\s+?(?:[\w*\s{},]*)\s+from\s+?)((?:".*?")|(?:'.*?'))([\s]*?(;|$|))/g
}

function writePlaygroundFile({ at, content, filePath }) {
  // initial file directory
  const fileDirectory = path.parse(filePath).dir

  console.log(fileDirectory)

  // needed to fix the wrong relative imports
  const relativePathFromTemp = path.relative(EXAMPLES_DIR, fileDirectory)

  let updatedContent = content

  // call replace function for each import declaration in source code
  updatedContent = updatedContent.replace(REGEXPS.importAll, (importString) => {
    /*
     * match - full import string
     * p1 - first import part ("import something from ")
     * p2 - second import part ("'./path'")
     * p3 - optional semicolon (";") - we don't need it
     */
    return importString.replace(REGEXPS.import, (match, p1, p2) => {
      // remove quotes
      const modulePath = p2.slice(1, -1)

      // it's absolute/module path - skip it
      if (!modulePath.startsWith('.')) return match

      // before the source path, add the relative "difference" between temp folder and file initial path
      const updatedModulePath = path.join(relativePathFromTemp, modulePath)

      // put all parts together
      return `${p1}'${updatedModulePath}'`
    })
  })

  // we always use JSX in examples, so the React import is required
  if (!updatedContent.includes('import React')) {
    updatedContent = `import React from 'react'\n` + updatedContent
  }

  if (!updatedContent.includes('import { Frame')) {
    updatedContent = `import { Frame } from 'gatsby-theme-woly/src/components/frame'\n` + updatedContent
  }

  // write the result in temp directory
  fs.writeFileSync(at, updatedContent)
}

module.exports = () => {
  const codeQueue = []

  function placeCodeInQueue({ node, index, parent, codePosition }) {
    codeQueue.push({ node, index, parent, codePosition })
  }

  async function processCodeQueue(file) {
    for (const { node, index, parent, codePosition } of codeQueue) {
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
        filePath
      })

      // create unique component name to prevent any conflicts
      const componentName = `Playground_${playgroundId}`

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

  // clean the old examples from the previous build
  rimraf.sync(EXAMPLES_DIR)

  // create examples folder (it can be nested, that's why it should be recursive)
  fs.mkdirSync(EXAMPLES_DIR, { recursive: true });

  async function transformer(tree, file) {
    // we can't use async in 'visit' function, so just enqueue first
    enqueueCodeBlocks(tree)

    await processCodeQueue(file)
  }

  return transformer;
};
