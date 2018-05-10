const { readFileAsync } = require('./../helpers/file')

const getFiles = (filePaths) => {
  const filesSrc = {}
  const filesReading = filePaths.map((filePath) => readFileAsync(filePath))
  return Promise.all(filesReading)
    .then((data) => {
      data.map(({fileName, source}) => {
        filesSrc[fileName] = source
      })
      return filesSrc
    })
}

module.exports = {
  getFiles,
}
