import importJson from 'rollup-plugin-json'
import importStrings from 'rollup-plugin-string'

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
    importJson(),
    importStrings({ include: '**/*.tmpl' })
  ]
}
