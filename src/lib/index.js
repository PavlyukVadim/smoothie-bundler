const program = require('commander')
const precinct = require('precinct')
const debug = require('debug')('tree')
const pathHelpers = require('./../helpers/path')
const fileHelpers = require('./../helpers/file')
const pjson = require('./../../package.json')

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

/**
 * Recursively find all dependencies
*/
const traverse = (entryFile, deps = {}) => {
  debug('entryFile', entryFile)
  return getDepsFromFile(entryFile, deps)
    .then((fileDeps) => {
      if (fileDeps && fileDeps[0]) {
        const pFullRealDeps = fileDeps.map((fileName) => {
          return getFullRealPath(getRelativePath(entryFile, fileName))
        })

        return Promise.all(pFullRealDeps)
          .then(fullRealDeps => {
            deps[entryFile] = fullRealDeps
            const pTraverses = fullRealDeps.map((fullRealDep) => {
              return traverse(fullRealDep, deps)
            })
            return Promise.all(pTraverses)
              .then(() => deps)
          })
      }
    })
}

traverse(inputFile)
  .then((data) => {
    console.log('traverse', data)
  })
