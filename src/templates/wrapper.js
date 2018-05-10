const innerWrapper = function(installedModules, modules) {
  var __smoothie__require = function(moduleName) {
    // Check if module is in cache
    if(installedModules[moduleName]) {
      return installedModules[moduleName].exports;
    }
    // Create a new module (and put it into the cache)
    var module = installedModules[moduleName] = {
      name: moduleName,
      l: false, // loaded
      exports: {}
    };

    // Execute the module function
    modules[moduleName].call(module.exports, module, module.exports, __smoothie__require);

    // Flag the module as loaded
    module.l = true;

    // Return the exports of the module
    return module.exports;
  };
  return __smoothie__require(modules[0])
}

const wrapper = (modulesStr) => (
  `
  // This wrapper is to prevent global variable assignments.
  (function() {
    // \`{}\` is to guarantee that any subsequent \`mod.result\` assignment will make
    // the variable different from the initial value.
    var installedModules = {};
    var modules = [
      ${modulesStr}
    ];
    // This wrapper is to prevent naming conflicts.
    (${innerWrapper})(installedModules, modules);
  })();

  `
)

// console.log('wrapper', wrapper())

module.exports = {
  wrapper,
}
