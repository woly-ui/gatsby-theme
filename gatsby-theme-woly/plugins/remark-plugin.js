const visit = require('unist-util-visit');
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const EXAMPLES_DIR = path.join(process.cwd(), '.temp/examples')

if (!fs.existsSync(EXAMPLES_DIR)){
  fs.mkdirSync(EXAMPLES_DIR, { recursive: true });
}

async function digest(message) {
  const hash = crypto.createHash('sha1')
  hash.update(message)
  return hash.digest("hex")
}

function generateNextPlaygroundId(content) {
  return digest(content)
}

function generatePlaygroundFilePath(id) {
  const fileName = `${id}.tsx`
  return path.join(EXAMPLES_DIR, fileName)
}

const REGEXPS = {
  import: /(import\s+?(?:[\w*\s{},]*)\s+from\s+?)((?:".*?")|(?:'.*?'))([\s]*?(;|$|))/,
  importAll: /(import\s+?(?:[\w*\s{},]*)\s+from\s+?)((?:".*?")|(?:'.*?'))([\s]*?(;|$|))/g
}

function createPlaygroundFile({ at, content, file }) {
  const fileDirectory = path.parse(file.history[0]).dir
  const relativePathFromTemp = path.relative(EXAMPLES_DIR, fileDirectory)

  let updatedContent = content

  updatedContent = updatedContent.replace(REGEXPS.importAll, (importString) => {
    return importString.replace(REGEXPS.import, (match, p1, p2) => {
      const modulePath = p2.slice(1, -1)
      if (!modulePath.startsWith('.')) return match
      const updatedModulePath = path.join(relativePathFromTemp, modulePath)
      return `${p1}'${updatedModulePath}'`
    })
  })

  if (!updatedContent.includes('import React')) {
    updatedContent = `import React from 'react'\n` + updatedContent
  }

  fs.writeFileSync(at, updatedContent)
}

module.exports = () => {
  const codeQueue = []

  function placeCodeInQueue({ node, index, parent }) {
    codeQueue.push({ node, index, parent })
  }

  async function processCodeQueue(file) {
    for (const { node, index, parent } of codeQueue) {
      const { meta, value: content } = node
      if (meta !== 'playground') return

      const playgroundId = await generateNextPlaygroundId(content)
      const playgroundFilePath = generatePlaygroundFilePath(playgroundId)

      createPlaygroundFile({
        at: playgroundFilePath,
        content,
        file
      })

      const componentName = `Playground_${playgroundId}`
      const importString = `import { Example as ${componentName} } from '${playgroundFilePath}'`
      const jsxString = `<${componentName} />`

      parent.children.splice(0, 0, {
        type: 'import',
        value: importString
      })

      parent.children.splice(index + 1, 0, {
        type: 'jsx',
        value: jsxString
      })
    }
  }

  async function processCodeBlocks(tree, file) {
    visit(tree, 'code', (node, index, parent) => {
      placeCodeInQueue({ node, index, parent })
    })

    await processCodeQueue(file)
  }

  async function transformer(tree, file) {
    await processCodeBlocks(tree, file)
  }

  return transformer;
};
