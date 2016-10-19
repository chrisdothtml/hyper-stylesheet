'use strict'

const gaze = require('gaze')
const md5 = require('md5')
const store = require('./store.js')
const {CONFIG_PATH, STYLESHEET_PATH} = store

/**
 * Updates `hyper-stylesheet-hash` in .hyper.js to trigger
 * a plugin reload
 */
function updateHash () {
  // TODO: update hash
}

/**
 * Creates a file watcher on .hyper.css
 */
function watch () {
  gaze(STYLESHEET_PATH, (error, watch) => {
    if (error) throw error

    watch.on('deleted', () => {
      watch.close()
      store.fileExists = false
      store.isWatching = false
    })

    watch.on('changed', () => {
      if (store.options['auto-reload']) {
        updateHash()
      }
    })

    store.isWatching = true
  })
}

module.exports = watch
