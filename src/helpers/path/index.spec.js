/* eslint-env mocha */

const expect = require('chai').expect;
const filesHelpers = require('./index.js');

const {
  getRelativePath,
  getPathOfDefaultFile,
  getPathWithDefaultExt,
} = filesHelpers;


describe('Files helpers. getRelativePath.', function () {
  it('should return new path in the same dir', function () {
    const basePath = './../../demo/src/index.js';
    const relativePath = './data';
    const expectedResult = '../../demo/src/data';
    expect(getRelativePath(basePath, relativePath)).to.eql(expectedResult);
  });
});


describe('Files helpers. getPathOfDefaultFile.', function () {
  it('should return new path with default file', function () {
    const defaultFileName = 'index';
    const defaultExt = '.js';
    const basePath = './../../demo/src/data';
    const expectedResult = './../../demo/src/data/index.js';
    const result = getPathOfDefaultFile(
      basePath,
      defaultFileName,
      defaultExt
    );
    expect(result).to.eql(expectedResult);
  });

  it('should return the same path for path with file', function () {
    const basePath = './../../demo/src/index.js';
    expect(getPathOfDefaultFile(basePath)).to.eql(basePath);
  });
});


describe('Files helpers. getPathWithDefaultExt.', function () {
  it('should return new path with default file', function () {
    const basePath = './../../demo/src/data';
    const expectedResult = './../../demo/src/data.js';
    const result = getPathWithDefaultExt(basePath);
    expect(result).to.eql(expectedResult);
  });
});
