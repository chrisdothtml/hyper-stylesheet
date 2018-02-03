import store from './store.js'
import watch from './watch.js'
import { accessSync, writeFileSync } from 'fs'
import { name as META_NAME } from '../package.json'

const { STYLESHEET_PATH, STYLESHEET_TMPL } = store

/**
 * Creates new .hyper.css file and initializes watcher
 */
function initFile (createNew = true) {
  try {
    accessSync(STYLESHEET_PATH)
  } catch (error) {
    if (createNew) {
      writeFileSync(STYLESHEET_PATH, STYLESHEET_TMPL, 'utf-8')
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
  }, (config[META_NAME] || {}))

  initFile(false)
  store.initialized = true
}

export {
  initFile as file,
  initMain as main
}
