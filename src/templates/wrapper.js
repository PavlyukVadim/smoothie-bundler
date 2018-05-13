const innerWrapper = function (installedModules, modules, entryFile) {
  var require = function (moduleName) {
    // Check if module is in cache
    if (installedModules[moduleName]) {
      return installedModules[moduleName].exports;
    }
    // Create a new module (and put it into the cache)
    var module = installedModules[moduleName] = {
      name: moduleName,
      l: false, // loaded
      exports: {},
    };

    // Execute the module function
    modules[moduleName].call(module.exports, module, module.exports, require);

    // Flag the module as loaded
    module.l = true;

    // Return the exports of the module
    return module.exports;
  };
  return require(entryFile);
};


const smoothieWrapper = (modulesStr, entryFile) => (
  `
  // This wrapper is to prevent global variable assignments.
  (function() {
    // \`{}\` is to guarantee that any subsequent \`mod.result\` assignment will make
    // the variable different from the initial value.
    var installedModules = {};
    
    var process = {
      env: {
      }
    }
    
    var modules = {
      ${modulesStr}
    };
    // This wrapper is to prevent naming conflicts.
    (${innerWrapper})(installedModules, modules, '${entryFile}');
  })();
  `
);


module.exports = {
  smoothieWrapper,
};
