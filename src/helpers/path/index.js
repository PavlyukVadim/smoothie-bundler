const path = require('path')
const { supportedExtensions } = require('../../config').config
const {
  isFileExist,
  readFileAsync,
} = require('../file')
const { raceToSuccess } = require('../promise')


/**
 * Returns the real filePath of dependency
 *
 * @param  {String} basePath
 * @return {String}
 */
const getFullRealPath = (basePath, relativePath) => {
  const isInternalDep = relativePath.includes('/') && relativePath.startsWith('.')
  if (isInternalDep) {
    const baseDir = path.dirname(basePath)
    const fullPath = path.join(baseDir, relativePath)
    return getPathOfInternalDep(fullPath)
  }
  return getPathOfExternalDep(basePath, relativePath)
}


/**
 * Returns the real filePath of internal dependency
 *
 * @param  {String} basePath - like ./src/demo/index
 * @return {String}
 */
const getPathOfInternalDep = (basePath) => {
  const exts = supportedExtensions.map((ext) => `.${ext}`)
  const attempts = exts.map((ext) => {
    const pathWithDefaultExt = getPathWithDefaultExt(basePath, ext)
    console.log('getPathOfInternalDep', pathWithDefaultExt)
    return isFileExist(pathWithDefaultExt)
  })

  const pathOfDefaultFile = getPathOfDefaultFile(basePath)
  attempts.push(isFileExist(pathOfDefaultFile))

  return raceToSuccess(attempts)
    .then((data) => data)
    .catch(() => basePath)
}


const getPathWithDefaultExt = (basePath, defaultExt = '.js') => {
  const extname = path.extname(basePath)
  if (extname) return basePath
  return path.format({
    name: basePath,
    ext: defaultExt
  })
}


const getPathOfDefaultFile = (
  basePath,
  defaultFileName = 'index',
  defaultExt = '.js'
) => {
  const extname = path.extname(basePath)
  if (extname) return basePath
  return path.format({
    dir: basePath,
    name: defaultFileName,
    ext: defaultExt
  })
}


/**
 * Returns the real filePath of external dependency
 *
 * @param  {String} basePath - like ./src/demo/index.js
 * @param  {String} moduleName - like react
 * @return {String}
 */
const getPathOfExternalDep = (basePath, moduleName) => {
  console.log('getPathOfExternalDep', basePath, moduleName)
  const defaultMainFile = 'index.js'
  const isRootModule = !moduleName.includes('/') // like 'react'
  console.log('isRootModule', moduleName, isRootModule)
  let baseDirName = basePath
  const attempts = []
  while (baseDirName !== '.') {
    baseDirName = path.dirname(baseDirName)
    const modulePath = path.join(baseDirName, 'node_modules', moduleName)
    // const modulePathAsFileWithoutExt = path.dirname(modulePath)
    // console.log('attempts', moduleName, modulePath)
    attempts.push(
      isFileExist(modulePath),
      getPathOfInternalDep(modulePath)
      // isFileExist(modulePathAsFileWithoutExt)
    )
  }

  return raceToSuccess(attempts)
    .then((modulePath) => {
      console.log('raceToSuccess', modulePath)
      if (isRootModule) {
        const pjsonPath = path.join(modulePath, 'package.json')
        console.log('pjsonPath', pjsonPath)
        return readFileAsync(pjsonPath)
          .then((pjson) => JSON.parse(pjson))
          .then((data) => {
            const mainFile = data.domain || defaultMainFile
            const fullModulePath = path.join(modulePath, mainFile)
            console.log('fullModulePath',fullModulePath)
            return fullModulePath
          })
      }
      return modulePath
    })
    .catch(() => basePath)
}


module.exports = {
  getPathOfDefaultFile,
  getPathWithDefaultExt,
  getFullRealPath
}
