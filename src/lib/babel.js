const babel = require('babel-core');
const plugins = ['transform-es2015-modules-commonjs'];

/**
 * Transform all ES6 modules to CJS
 *
 * @param  {String} code - source code of file
 * @param  {String} fileName
 * @return {String}
 */
const transformToCJS = (fileName, code) => {
  const transformed = babel.transform(code, { plugins });
  return {
    fileName,
    code: transformed.code
  };
};

module.exports = {
  transformToCJS
};
