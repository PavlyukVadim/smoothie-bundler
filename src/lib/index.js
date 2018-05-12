const program = require('commander');
const wrapper = require('./../templates/wrapper');
const pjson = require('./../../package.json');
const dependencyTree = require('./dependency-tree');
const {
  getFiles,
  combineModules,
  wrapModule
} = require('./modules');
const { transformToCJS } = require('./babel');
const { writeFileAsync } = require('./../helpers/file');
const { traverse } = dependencyTree;
const { version } = pjson;

program
  .version(version)
  .option('-i, --input [fileName]', 'input fileName')
  .option('-o, --output [fileName]', 'output fileName')
  .parse(process.argv);

const inputFile = program.input;
const outputFile = program.output; // ./../../demo/src/index.js
console.log('outputFile', outputFile);

traverse(inputFile)
  .then((data) => {
    const filePaths = Object.keys(data);
    return filePaths;
  })
  .then(getFiles)
  .then((files) => Object.keys(files)
    .map((name) => transformToCJS(name, files[name]))
  )
  .then((tFiles) => tFiles.map((tFile) => {
    const wrappedModule = wrapModule(tFile.code);
    return {
      fileName: tFile.fileName,
      code: wrappedModule
    };
  }))
  .then(combineModules)
  // .then((code) => writeFileAsync('dist/exm.js', code))
  .catch((err) => {
    console.error('traverseErr', err.toString());
  });
