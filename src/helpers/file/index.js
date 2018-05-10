const fs = require('fs')


const readFileAsync = fileName => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, 'utf8', (err, source) => {
      if (err) {
        reject(err)
      } else {
        resolve({
          fileName,
          source,
        })
      }
    })
  })
}


const isFileExist = (basePath) => {
  return new Promise((resolve, reject) => {
    fs.stat(basePath, (err, stat) => {
      if (err === null) {
        resolve(basePath)
      } else {
        reject(err.code)
      }
    })
  })
}


const isDirectory = (basePath) => {
  return new Promise((resolve, reject) => {
    fs.stat(basePath, (err, stat) => {
      if (err === null) {
        const isDirectory = stat.isDirectory()
        resolve(isDirectory)
      } else {
        reject(err.code)
      }
    })
  })
}


module.exports = {
  readFileAsync,
  isFileExist,
  isDirectory,
}
