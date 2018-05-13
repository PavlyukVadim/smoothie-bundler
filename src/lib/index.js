const program = require('commander');
const pjson = require('./../../package.json');
const dependencyTree = require('./dependency-tree');
const {
  getFiles,
  combineModules,
  wrapModule,
} = require('./modules');
const { transformToCJS, } = require('./babel');
const { writeFile, } = require('./../helpers/file');
const { replaceInCode, } = require('./../helpers/text');
const { traverse, } = dependencyTree;
const { version, } = pjson;


program
  .version(version)
  .option('-i, --input [fileName]', 'input fileName')
  .option('-o, --output [fileName]', 'output fileName')
  .option('-g, --graph', 'save dependency-tree')
  .parse(process.argv);


const inputFile = program.input;
const outputFile = program.output;


if (program.graph) {
  return traverse(inputFile)
    .then((data) => JSON.stringify(data, undefined, 2))
    .then((json) => {
      console.log('data', json)
      writeFile(outputFile, json)
    })
}

traverse(inputFile)
  .then((data) => {
    const filePaths = Object.keys(data);
    return getFiles(filePaths)
      .then(files => Object.keys(files)
        .map((name) => transformToCJS(name, files[name]))
        .map((tFile) => {
          const { code, fileName, } = tFile;
          const wrappedModule = wrapModule(code);
          const fileDeps = data[fileName]
          const wrappedModuleWithRealPaths = fileDeps.reduce((prevModule, dep) => {
            const { relativePath, realPath, } = dep
            return replaceInCode(prevModule, relativePath, realPath)
          }, wrappedModule)
          return {
            fileName,
            code: wrappedModuleWithRealPaths,
          };
        })
      );
  })
  .then((files) => combineModules(files, outputFile))
  .catch((err) => {
    console.error('traverseErr', err.toString());
  });
