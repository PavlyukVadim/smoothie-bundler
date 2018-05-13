const path = require('path');
const { supportedExtensions, } = require('../../config').config;
const {
  isFileExist,
  readFile,
} = require('../file');
const { raceToSuccess, } = require('../promise');


/**
 * Returns the real filePath of dependency
 *
 * @param  {String} basePath
 * @param  {String} relativePath - like ./data
 * @return {Object} { basePath, realPath, }
 */
const getFullRealPath = (basePath, relativePath) => {
  const isInternalDep = relativePath.includes('/') && relativePath.startsWith('.');
  if (isInternalDep) {
    const baseDir = path.dirname(basePath);
    const fullPath = path.join(baseDir, relativePath);
    return getPathOfInternalDep(relativePath, fullPath);
  }
  return getPathOfExternalDep(basePath, relativePath);
};


/**
 * Returns the real filePath of internal dependency
 *
 * @param  {String} relativePath - like ./data
 * @param  {String} fullPath
 * @return {Object} { basePath, realPath, }
 */
const getPathOfInternalDep = (relativePath, fullPath) => {
  return getPathWithDefaultExtsAndDefaultFile(fullPath)
    .then((realPath) => ({
      relativePath,
      realPath,
    }))
    .catch(() => ({
      basePath,
    }));
};


const getPathWithDefaultExtsAndDefaultFile = (basePath) => {
  const exts = supportedExtensions.map((ext) => `.${ext}`);
  const attempts = exts.map((ext) => {
    const pathWithDefaultExt = getPathWithDefaultExt(basePath, ext);
    return isFileExist(pathWithDefaultExt);
  });

  const pathOfDefaultFile = getPathOfDefaultFile(basePath);
  attempts.push(isFileExist(pathOfDefaultFile));

  return raceToSuccess(attempts);
};


const getPathWithDefaultExt = (basePath, defaultExt = '.js') => {
  const extname = path.extname(basePath);
  if (extname) return basePath;
  return path.format({
    name: basePath,
    ext: defaultExt,
  });
};


const getPathOfDefaultFile = (
  basePath,
  defaultFileName = 'index',
  defaultExt = '.js'
) => {
  const extname = path.extname(basePath);
  if (extname) return basePath;
  return path.format({
    dir: basePath,
    name: defaultFileName,
    ext: defaultExt,
  });
};


/**
 * Returns the real filePath of external dependency
 *
 * @param  {String} basePath - like ./src/demo/index.js
 * @param  {String} moduleName - like react
 * @return {String}
 */
const getPathOfExternalDep = (basePath, moduleName) => {
  const defaultMainFile = 'index.js';
  const isRootModule = !moduleName.includes('/'); // like 'react'
  let baseDirName = basePath;
  const attempts = [];
  while (baseDirName !== '.') {
    baseDirName = path.dirname(baseDirName);
    const modulePath = path.join(baseDirName, 'node_modules', moduleName);
    attempts.push(
      isFileExist(modulePath),
      getPathWithDefaultExtsAndDefaultFile(modulePath)
    );
  }

  return raceToSuccess(attempts)
    .then((modulePath) => {
      if (isRootModule) {
        const pjsonPath = path.join(modulePath, 'package.json');
        return readFile(pjsonPath)
          .then(({ source, }) => JSON.parse(source))
          .then((data) => {
            const mainFile = data.main || defaultMainFile;
            const fullModulePath = path.join(modulePath, mainFile);
            return {
              relativePath: moduleName,
              realPath: fullModulePath,
            };
          });
      }
      return {
        relativePath: moduleName,
        realPath: modulePath,
      };
    })
    .catch(() => ({
      relativePath: basePath,
    }));
};


module.exports = {
  getPathOfDefaultFile,
  getPathWithDefaultExt,
  getFullRealPath,
};
