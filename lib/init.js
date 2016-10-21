'use strict'

const defaults = require('defaults')
const fs = require('fs')
const pkg = require('../package.json')
const store = require('./store.js')
const watch = require('./watch.js')
const {STYLESHEET_PATH, STYLESHEET_TMPL} = store

/**
 * Adds options to store
 */
function storeOptions (options) {
  store.options = defaults(options, {
    'auto-reload': true
  })
}

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
  const options = config[pkg.name] || {}

  storeOptions(options)
  initFile(false)
  store.initialized = true
}

module.exports = {
  file: initFile,
  main: initMain
}
