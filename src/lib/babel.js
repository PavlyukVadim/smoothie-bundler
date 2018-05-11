const babel = require('babel-core')
const plugins = ['transform-es2015-modules-commonjs']

const transformToCJS = (code) => {
  const transformed = babel.transform(code, { plugins })
  return transformed.code
}

module.exports = {
  transformToCJS,
}
