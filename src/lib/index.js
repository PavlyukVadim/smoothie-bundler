const program = require('commander')
const pjson = require('./../../package.json')
const precinct = require('precinct')
const pathHelpers = require('./../helpers/path')
const fileHelpers = require('./../helpers/file')

const {
  getRelativePath,
  getFullRealPath
} = pathHelpers
const { readFileAsync } = fileHelpers
const { version } = pjson

program
  .version(version)
  .option('-i, --input [fileName]', 'input fileName')
  .option('-o, --output [fileName]', 'output fileName')
  .parse(process.argv)

const inputFile = program.input
const outputFile = program.output // ./../../demo/src/index.js
console.log('outputFile', outputFile)

const getDepsFromFile = fileName => {
  return readFileAsync(fileName)
    .then((content) => {
      const deps = precinct(content, { es6: { mixedImports: true } })
      return deps
    })
}

// getDepsFromFile(inputFile)

const traverse = (entryFile, deps) => {
  console.log('E: ', entryFile, deps)
  getDepsFromFile(entryFile)
    .then((fileDeps) => {
      if (fileDeps && fileDeps[0]) {
        getFullRealPath(getRelativePath(entryFile, fileDeps[0]))
          .then((fullPath) => {
            console.log('fullPath: ', fullPath)
            deps.push(fullPath)
            traverse(fullPath, deps)
          })
        // traverse(fullPath, deps)
      }
    })
}

traverse(inputFile, [])
