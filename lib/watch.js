import crypto from 'crypto'
import gaze from 'gaze'
import store from './store.js'
import { readFileSync, writeFileSync } from 'fs'
import { name as META_NAME } from '../package.json'

const { CONFIG_PATH, STYLESHEET_PATH } = store

function md5 (input) {
  return crypto
    .createHash('md5')
    .update(input)
    .digest('hex')
}

/**
 * Updates `hyper-stylesheet-hash` in .hyper.js to trigger
 * a plugin reload
 */
function updateHash () {
  const key = `${META_NAME}-hash`
  const stylesheet = readFileSync(STYLESHEET_PATH, 'utf-8')
  const hash = md5(`${key}:${stylesheet}`)
  const hashLine = `// -- ${key}:${hash} --`
  const regex = new RegExp(`\\/\\/ -- ${key}:[^-]+--`)
  let config = readFileSync(CONFIG_PATH, 'utf-8')

  if (regex.test(config)) {
    // replace existing
    config = config.replace(regex, hashLine)
  } else {
    // add new
    config = `${hashLine}\n${config}`
  }

  writeFileSync(CONFIG_PATH, config, 'utf-8')
}

/**
 * Creates a file watcher on .hyper.css
 */
export default function watch () {
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
