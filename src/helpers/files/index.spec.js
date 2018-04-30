const expect = require('chai').expect
const filesHelpers = require('./index.js')

const { getNextPath } = filesHelpers

describe('Files helpers. getNextPath.', function () {
  it('should return new path in the same dir', function () {
  	const basePath = './../../demo/src/index.js'
  	const relativePath = './data'
  	const expectedResult = '../../demo/src/data'
    expect(getNextPath(basePath, relativePath)).to.eql(expectedResult)
  })
})
