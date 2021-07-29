const parseImports = require('parse-es6-imports')

/*
 * Get parsed imports from the whole file source code
 */
function extract(source) {
  return parseImports(source)
}

/*
 * Create imports source code lines from the parsed data
 */
function serializeInLines(imports) {
  const lines = []

  for (const { defaultImport, namedImports = [], starImport, fromModule } of imports) {
    if (starImport) {
      const line = `import * as ${starImport} from '${fromModule}';`
      lines.push(line)
      continue
    }

    let line = 'import '
    const hasNamed = namedImports.length > 0

    if (defaultImport) {
      line += defaultImport
      line += hasNamed ? ', ' : ' from '
    }

    if (hasNamed) {
      const namedString = namedImports
        .map(({ name, value }) => {
          if (name === value) return value
          return `${name} as ${value}`
        })
        .join(', ')

      line += `{ ${namedString} } from `
    }

    line += `'${fromModule}'`
    line += ';'
    lines.push(line)
  }

  return lines
}

/*
 * Create imports source code from the parsed data
 */
function serialize(imports) {
  const lines = serializeInLines(imports)
  return lines.join('\n')
}

const IMPORT_REGEXP = /(import\s+?(?:[\w*\s{},]*)\s+from\s+?)((?:".*?")|(?:'.*?'))([\s]*?(;|$|))/g

/*
 * Get imports group start and end indexes (for future replacement or deletion)
 */
function getEdges(source) {
  const importMatches = source.match(IMPORT_REGEXP)

  if (!importMatches || importMatches.length === 0) {
    return { start: 0, end: 0 }
  }

  const lastMatch = importMatches[importMatches.length - 1]
  const lastMatchStart = source.indexOf(lastMatch)
  return { start: 0, end: lastMatchStart + lastMatch.length }
}

function add({ imports, new: toAdd }) {
  const result = []
  const added = new Set()

  for (const importItem of imports) {
    const { fromModule } = importItem

    const toAddEntry = toAdd[fromModule]

    if (!toAddEntry) {
      result.push(importItem)
      continue
    }

    if (!toAddEntry.namedImports) {
      toAddEntry.namedImports = []
    }

    const mergedNamedImports = [...importItem.namedImports, ...toAddEntry.namedImports]
    const finalNamedImports = []
    const existing = new Set()

    for (const namedImport of mergedNamedImports) {
      if (existing.has(namedImport.value)) continue
      finalNamedImports.push(namedImport)
      existing.add(namedImport.value)
    }

    result.push({
      ...importItem,
      ...toAddEntry,
      namedImports: finalNamedImports
    })

    added.add(fromModule)
  }

  for (const path in toAdd) {
    if (added.has(path)) continue

    result.push({
      fromModule: path,
      ...toAdd[path]
    })
  }

  return result
}

function update({
  imports,
  if: condition = () => true,
  updater,
}) {
  const result = []

  for (const importItem of imports) {
    const shouldUpdate = condition(importItem)

    if (!shouldUpdate) {
      result.push(importItem)
      continue
    }

    const updated = updater(importItem)
    result.push(updated)
  }

  return result
}

function replace({ in: source, with: imports }) {
  const edges = getEdges(source)
  const before = source.slice(0, edges.start)
  const after = source.slice(edges.end)
  return before + serialize(imports) + after
}

exports.imports = {
  extract,
  serialize,
  getEdges,
  update,
  add,
  replace,
}
