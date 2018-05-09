const innerWrapper = function(initialModResult_, modules) {
  var initialModResult = initialModResult_;
  var run = function(index) {
    var module = modules[index];
    var theModule = {
      exports: {}
    };
    var __smoothie__require = function(name) {
      // half-way result, for caching & preventing infinite loops
      module.result = theModule.exports;
      var newIndex = module.nameIndexes[name];
      if (newIndex === undefined) {
        throw new Error("Cannot find module " + JSON.stringify(name) + ".");
      }
      if (modules[newIndex].result === initialModResult) {
        run(newIndex);
      }
      return modules[newIndex].result;
    };
    module.fun.call(theExports, theModule.exports, theModule, __smoothie__require);
    module.result = theModule.exports; // for caching
  };
  run(0);
}

const wrapper = (modulesStr) => (
  `
  // This wrapper is to prevent global variable assignments.
  (function() {
    // \`{}\` is to guarantee that any subsequent \`mod.result\` assignment will make
    // the variable different from the initial value.
    var initialModResult_ = {};
    var mods_ = [
      ${modulesStr}
    ];
    // This wrapper is to prevent naming conflicts.
    (${innerWrapper})(initialModResult_, mods_);
  })();

  `
)

console.log('wrapper', wrapper())

module.exports = {
  wrapper,
}
