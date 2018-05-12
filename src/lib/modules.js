const {
  readFileAsync,
  writeFileAsync,
} = require('./../helpers/file');
const {
  smoothieModule,
  smoothieWrapper,
} = require('./../templates');


/**
 * Returns files by paths
 *
 * @param  {Array} filePaths - arr of paths
 * @return {String}
 */
const getFiles = (filePaths) => {
  const filesSrc = {};
  const filesReading = filePaths.map((filePath) => readFileAsync(filePath));
  return Promise.all(filesReading)
    .then((data) => {
      data.map(({ fileName, source, }) => {
        filesSrc[fileName] = source;
      });
      return filesSrc;
    });
};


/**
 * Returns module with IIFE surround the module
 *
 * @param  {String} moduleSrc - source code of the module
 * @return {String}
 */
const wrapModule = (moduleSrc) => {
  return smoothieModule(moduleSrc);
};


/**
 * Returns modules inside the wrapper with calling modules
 *
 * @param  {String} modulesSrc - source code of the modules
 * @return {String}
 */
const wrapModules = (modulesSrc) => {
  return smoothieWrapper(modulesSrc);
};


const combineModules = (files) => {
  const bundle = files.map((file) => {
    const fileName = file.fileName;
    const moduleSrc = file.code;
    const moduleStr = '/***** \n Module: ' + fileName + '\n *****/ \n' + '\'' + fileName + '\': ' + moduleSrc;
    return moduleStr;
  }).join(',\n\n');
  const wrappedBundle = wrapModules(bundle, './demo/src/index.js');
  return writeFileAsync('demo/build.js', wrappedBundle);
};


module.exports = {
  getFiles,
  combineModules,
  wrapModule,
};
