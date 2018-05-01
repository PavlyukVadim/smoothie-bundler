const path = require('path')

const getNextPath = (basePath, relativePath) => {
  const baseDir = path.dirname(basePath)
  return path.join(baseDir, relativePath)
}

const getDefaultPath = (basePath) => {
  const extname = path.extname(basePath)
  if (extname) return basePath
  const defaultFileName = 'index'
  const defaultExt = '.js'
  return path.format({
    dir: basePath,
    name: defaultFileName,
    ext: defaultExt
  })
}

module.exports = {
  getNextPath,
  getDefaultPath
}
