'use strict';

var path = require('path');

module.exports = function() {
  function renameAlias(source, options) {
    var baseUrl = options.basePath || process.cwd();
    if (source.substr(0, 4) === 'npm:') {
      source = path.join(baseUrl, 'node_modules', source.substr(4));
    }
    return source.replace(/\\/g, '/');
  }

  return {
    visitor: {
      ModuleDeclaration: {
        enter: function(path, state) {
          if (path.node.source) {
            path.node.source.value = renameAlias(path.node.source.value, state.opts);
          }
        }
      }
    },

    post: function(file) {
      var opts = this.opts;
      file.metadata.modules.imports.forEach(function(importData) {
        importData.source = renameAlias(importData.source, opts);
      });
      file.metadata.modules.exports.specifiers.forEach(function(exportData) {
        exportData.source = renameAlias(exportData.source, opts);
      });
    }
  };
};
