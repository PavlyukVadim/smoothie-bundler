const fs = require('fs');
const encoding = 'utf8';


const readFile = (fileName) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, encoding, (err, source) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          fileName,
          source,
        });
      }
    });
  });
};


const writeFile = (fileName, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, data, encoding, (err, source) => {
      if (err) {
        reject(err);
      } else {
        console.log('The file was saved!');
        resolve({
          fileName,
          source,
        });
      }
    });
  });
};


const isFileExist = (basePath) => {
  return new Promise((resolve, reject) => {
    fs.stat(basePath, (err, stat) => {
      if (err === null) {
        resolve(basePath);
      } else {
        reject(err.code);
      }
    });
  });
};


const isDirectory = (basePath) => {
  return new Promise((resolve, reject) => {
    fs.stat(basePath, (err, stat) => {
      if (err === null) {
        const isDirectory = stat.isDirectory();
        resolve(isDirectory);
      } else {
        reject(err.code);
      }
    });
  });
};


module.exports = {
  readFile,
  writeFile,
  isFileExist,
  isDirectory,
};
