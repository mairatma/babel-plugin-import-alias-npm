'use strict';

var assert = require('assert');
var babel = require('babel-core');
var path = require('path');
var plugin = require('../index');

var nodeModulesPath = path.resolve('node_modules');

module.exports = {
  testNpmImport: function(test) {
    var code = 'import foo from "npm:bar/src/foo";';
    var result = babel.transform(code, {plugins: [plugin]});

    var expectedPath = path.join(nodeModulesPath, 'bar/src/foo');
    assert.strictEqual('import foo from "' + expectedPath + '";', result.code);
    assert.strictEqual(expectedPath, result.metadata.modules.imports[0].source);
    test.done();
  },

  testNpmImportWithBaseUrl: function(test) {
    var code = 'import foo from "npm:bar/src/foo";';
    var result = babel.transform(code, {plugins: [[plugin, {basePath: '/base/path'}]]});

    var expected = 'import foo from "/base/path/node_modules/bar/src/foo";';
    assert.strictEqual(expected, result.code);
    assert.strictEqual('/base/path/node_modules/bar/src/foo', result.metadata.modules.imports[0].source);
    test.done();
  },

  testNotNpmImport: function(test) {
    var code = 'import foo from "../bar/src/foo";';
    var result = babel.transform(code, {plugins: [plugin]});

    var expected = 'import foo from "../bar/src/foo";';
    assert.strictEqual(expected, result.code);
    assert.strictEqual('../bar/src/foo', result.metadata.modules.imports[0].source);
    test.done();
  },

  testNpmExport: function(test) {
    var code = 'export * from "npm:bar/src/foo";';
    var result = babel.transform(code, {plugins: [plugin]});

    var expectedPath = path.join(nodeModulesPath, 'bar/src/foo');
    assert.strictEqual('export * from "' + expectedPath + '";', result.code);
    assert.strictEqual(expectedPath, result.metadata.modules.exports.specifiers[0].source);
    test.done();
  },

  testNotNpmExport: function(test) {
    var code = 'export * from "../bar/src/foo";';
    var result = babel.transform(code, {plugins: [plugin]});

    var expected = 'export * from "../bar/src/foo";';
    assert.strictEqual(expected, result.code);
    assert.strictEqual('../bar/src/foo', result.metadata.modules.exports.specifiers[0].source);
    test.done();
  },

  testNoSourceExport: function(test) {
    var code = 'export default foo;';
    var result = babel.transform(code, {plugins: [plugin]});

    var expected = 'export default foo;';
    assert.strictEqual(expected, result.code);
    test.done();
  }
};
