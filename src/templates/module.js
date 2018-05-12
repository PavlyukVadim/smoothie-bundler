const smoothieModule = (moduleStr) => (
  `
    (function(module, exports, require) {
      ${moduleStr}
    })
  `
);


module.exports = {
  smoothieModule,
};
