'use strict'

const BrowserWindow = require('electron').BrowserWindow
const defaults = require('defaults')
const fs = require('fs')
const gaze = require('gaze')
const path = require('path')
const pkg = require('../package.json')
const store = require('./store.js')
const STYLESHEET_PATH = store.STYLESHEET_PATH
const STYLESHEET_TMPL = fs.readFileSync(path.resolve(`${__dirname}/../tmpl/hyper.css`), 'utf-8')

/**
 * Adds options to store
 */
function storeOptions (options) {
  store.options = defaults(options, {
    'auto-reload': false
  })
}

/**
 * Creates a file watcher on .hyper.css
 */
function initWatch () {
  gaze(STYLESHEET_PATH, (error, watch) => {
    if (error) throw error

    let reloadQueue = []

    watch.on('deleted', () => {
      watch.close()
      store.fileExists = false
      store.isWatching = false
    })

    watch.on('changed', () => {
      if (store.options['auto-reload']) {
        let windows = BrowserWindow.getAllWindows()

        windows.forEach(win => {
          if (win.rpc) {
            let id = win.rpc.id

            if (reloadQueue.indexOf(id) < 0) {
              reloadQueue.push(id)
            }

            win.on('focus', () => {
              const queueIndex = reloadQueue.indexOf(id)

              if (queueIndex > -1) {
                win.reload()
                reloadQueue.splice(queueIndex, 1)
              }
            })
          }
        })
      }
    })

    store.isWatching = true
  })
}

/**
 * Creates new .hyper.css file if it doesn't exist, and
 * initializes watcher if it isn't already
 */
function initFile (createNew) {
  createNew = createNew === false ? false : true // eslint-disable-line no-unneeded-ternary

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
    initWatch()
  }
}

/**
 *
 */
function initMain (config) {
  const options = config[pkg.name] || {}

  storeOptions(options)
  initFile(false)
  store.initialized = true
}

module.exports = {
  file: initFile,
  main: initMain,
  watch: initWatch
}
