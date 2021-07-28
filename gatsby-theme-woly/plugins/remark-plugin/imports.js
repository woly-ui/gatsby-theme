const parseImports = require('parse-imports')

/*
 * Get parsed imports from the whole file source code
 */
async function extract(source) {
  return parseImports(source)
}

/*
 * Create imports source code lines from the parsed data
 */
async function serializeInLines(parsed) {
  const lines = []
}
