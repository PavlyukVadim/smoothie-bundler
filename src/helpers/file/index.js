const fs = require('fs')

const readFileAsync = filename => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

const isFileExist = (basePath) => {
  console.log('basePath', basePath)
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

module.exports = {
  readFileAsync,
  isFileExist
}
