'use strict'

const fs = require('fs')
const gaze = require('gaze')
const md5 = require('md5')
const store = require('./store.js')
const {CONFIG_PATH, STYLESHEET_PATH} = store

/**
 * Updates `hyper-stylesheet-hash` in .hyper.js to trigger
 * a plugin reload
 */
function updateHash () {
  const key = 'hyper-stylesheet-hash'
  const stylesheet = fs.readFileSync(STYLESHEET_PATH, 'utf-8')
  const hash = md5(`${key}:${stylesheet}`)
  const hashLine = `// -- ${key}:${hash} --`
  const regex = new RegExp(`\\/\\/ -- ${key}:[^-]+--`)
  var config = fs.readFileSync(CONFIG_PATH, 'utf-8')

  if (regex.test(config)) {
    // replace existing
    config = config.replace(regex, hashLine)
  } else {
    // add new
    config = `${hashLine}\n${config}`
  }

  fs.writeFileSync(CONFIG_PATH, config, 'utf-8')
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
