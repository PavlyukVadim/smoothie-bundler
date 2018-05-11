const babel = require('babel-core')
const plugins = ['transform-es2015-modules-commonjs']


/**
 * Transform all ES6 modules to CJS
 *
 * @param  {String} code - source code of file
 * @return {String}
 */
const transformToCJS = (code) => {
  const transformed = babel.transform(code, { plugins })
  return transformed.code
}


module.exports = {
  transformToCJS,
}
