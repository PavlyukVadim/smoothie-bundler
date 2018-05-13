const replaceInCode = (code, findWhat, replaceWith) => {
  if (typeof code !== 'string') return '';
  return code.replace(findWhat, replaceWith);
}

module.exports = {
  replaceInCode,
};
