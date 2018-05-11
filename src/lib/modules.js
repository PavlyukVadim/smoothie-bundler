const {
  readFileAsync,
  writeFileAsync,
} = require('./../helpers/file')
const { smoothieModule } = require('./../templates/module')


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


const wrapModule = (moduleSrc) => {
  return smoothieModule(moduleSrc)
}

const combineModules = (filesSrc) => {
  const bundle = Object.keys(filesSrc).map((fileName) => {
    const moduleSrc = filesSrc[fileName]
    const moduleStr = '/***** \n Module: ' + fileName + '\n *****/ \n' + moduleSrc
    return moduleStr
  }).join('\n\n')

  return writeFileAsync('demo/build.js', bundle)
}


module.exports = {
  getFiles,
  combineModules,
  wrapModule,
}
