const fs = require('fs')
const program = require('commander')
const pjson = require('./../../package.json')
const precinct = require('precinct')
const filesHelpers = require('./../helpers/files')

const { getNextPath } = filesHelpers
const { version } = pjson

program
  .version(version)
  .option('-i, --input [fileName]', 'input fileName')
  .option('-o, --output [fileName]', 'output fileName')
  .parse(process.argv)

const inputFile = program.input
const outputFile = program.output // ./../../demo/src/index.js

fs.readFile(inputFile, 'utf8', (err, content) => {
  if (err) throw err
  // Pass in a file's content or an AST
  const deps = precinct(content, { es6: { mixedImports: true } })
  console.log(getNextPath(inputFile, deps[0]))
  // console.log(deps)
})
