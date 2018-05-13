const precinct = require('precinct');
const debug = require('debug');
const debugTree = debug('tree');
const { getFullRealPath, } = require('./../helpers/path');
const { readFile, } = require('./../helpers/file');


/**
 * Returns array of modules dependencies
 *
 * @param  {String} fileName
 * @return {Array}
 */
const getDepsFromFile = (fileName) => {
  return readFile(fileName)
    .then(({ source, }) => {
      const deps = precinct(source, { es6: { mixedImports: true, }, });
      return deps;
    });
};


/**
 * Recursively find all dependencies
 */
const traverse = (entryFile, deps = {}) => {
  debugTree('entryFile', entryFile);
  if (deps[entryFile]) {
    return Promise.resolve();
  }
  return getDepsFromFile(entryFile, deps)
    .then((fileDeps) => {
      if (fileDeps && fileDeps[0]) {
        const pFullRealDeps = fileDeps.map((fileName) => {
          return getFullRealPath(entryFile, fileName);
        });

        return Promise.all(pFullRealDeps)
          .then(fullRealDeps => {
            deps[entryFile] = fullRealDeps;
            const pTraverses = fullRealDeps.map(({realPath}) => {
              return traverse(realPath, deps);
            });
            return Promise.all(pTraverses)
              .then(() => deps);
          });
      } else {
        deps[entryFile] = [];
      }
    });
};


module.exports = {
  traverse,
};
