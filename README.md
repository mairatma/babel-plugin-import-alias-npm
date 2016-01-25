babel-plugin-import-alias-npm
===================================

A babel plugin that allows using aliases to reference npm files in ES2015 imports.

## Requirements

This plugin assumes that [NPM](https://www.npmjs.com/) is being used with version >= 3.0.0. That's important because that's the first NPM version that uses flat dependencies, a feature that this plugin depends on.

## Usage

This is a [babel plugin](http://babeljs.io/docs/plugins/) that converts imports with sources starting with the **npm:** prefix to their path inside the node_modules folder. To use it, just add it to your package.json and pass it as a plugin when calling babel:

```javascript
{
  "plugins": ["import-alias-npm"]
}
```
