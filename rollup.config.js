import json from 'rollup-plugin-json'

const meta = require('./package.json')

function getExternals () {
  return Object.keys(meta.dependencies)
    .concat(require('repl')._builtinLibs)
}

export default {
  input: 'lib/index.js',
  output: {
    file: meta.main,
    format: 'cjs'
  },
  external: getExternals(),
  plugins: [
    json()
  ]
}
