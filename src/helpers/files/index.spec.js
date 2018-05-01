const expect = require('chai').expect
const filesHelpers = require('./index.js')

const {
  getNextPath,
  getDefaultPath,
} = filesHelpers


describe('Files helpers. getNextPath.', function () {
  it('should return new path in the same dir', function () {
  const basePath = './../../demo/src/index.js'
  const relativePath = './data'
  const expectedResult = '../../demo/src/data'
    expect(getNextPath(basePath, relativePath)).to.eql(expectedResult)
  })
})


describe('Files helpers. getDefaultPath.', function () {
  it('should return new path with default file', function () {
  const basePath = './../../demo/src/data'
  const expectedResult = './../../demo/src/data/index.js'
    expect(getDefaultPath(basePath)).to.eql(expectedResult)
  })

  it('should return the same path for path with file', function () {
  const basePath = './../../demo/src/index.js'
    expect(getDefaultPath(basePath)).to.eql(basePath)
  })

})
