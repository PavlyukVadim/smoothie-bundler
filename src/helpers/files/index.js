const path = require('path')

const getNextPath = (basePath, relativePath) => {
  const baseDir = path.dirname(basePath)
  return path.join(baseDir, relativePath)
}

exports.getNextPath = getNextPath
