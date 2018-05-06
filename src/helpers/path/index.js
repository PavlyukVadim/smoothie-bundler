const path = require('path')
const { supportedExtensions } = require('../../config').config
const { isFileExist } = require('../file')
const { raceToSuccess } = require('../promise')

const getRelativePath = (basePath, relativePath) => {
  const baseDir = path.dirname(basePath)
  return path.join(baseDir, relativePath)
}


/**
 * Returns the real filePath of dependency with ext
 *
 * @param  {String} basePath
 * @return {String}
 */
const getFullRealPath = (basePath) => {
  const exts = supportedExtensions.map((ext) => `.${ext}`)
  const attempts = exts.map((ext) => {
    const pathWithDefaultExt = getPathWithDefaultExt(basePath, ext)
    return isFileExist(pathWithDefaultExt)
  })

  const pathOfDefaultFile = getPathOfDefaultFile(basePath)
  attempts.push(isFileExist(pathOfDefaultFile))

  return raceToSuccess(attempts)
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

module.exports = {
  getRelativePath,
  getPathOfDefaultFile,
  getPathWithDefaultExt,
  getFullRealPath
}
