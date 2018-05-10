const program = require('commander')
const wrapper = require('./../templates/wrapper')
const pjson = require('./../../package.json')
const dependencyTree = require('./dependency-tree')

const { traverse } = dependencyTree
const { version } = pjson

program
  .version(version)
  .option('-i, --input [fileName]', 'input fileName')
  .option('-o, --output [fileName]', 'output fileName')
  .parse(process.argv)

const inputFile = program.input
const outputFile = program.output // ./../../demo/src/index.js
console.log('outputFile', outputFile)

traverse(inputFile)
  .then((data) => {
    console.log('traverse', data)
  })
  .catch((err) => {
    console.error('traverseErr', err.toString())
  })
