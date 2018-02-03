const fs = require('fs')
const meta = require('../package.json')
const watch = require('./watch.js')
const { STYLESHEET_PATH, STYLESHEET_TMPL } = require('./store.js')

/**
 * Creates new .hyper.css file and initializes watcher
 */
function initFile (createNew = true) {
  try {
    fs.accessSync(STYLESHEET_PATH)
  } catch (error) {
    if (createNew) {
      fs.writeFileSync(STYLESHEET_PATH, STYLESHEET_TMPL, 'utf-8')
    }
  }

  if (!store.fileExists) {
    store.fileExists = true
  }

  if (!store.isWatching) {
    watch()
  }
}

/**
 * Initial one-time plugin setup
 */
function initMain (config) {
  store.options = Object.assign({
    'auto-reload': true
  }, (config[meta.name] || {}))

  initFile(false)
  store.initialized = true
}

module.exports = {
  file: initFile,
  main: initMain
}
