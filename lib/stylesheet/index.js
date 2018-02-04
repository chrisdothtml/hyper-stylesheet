import hyperCssTemplate from './_hyper.css.tmpl'
import openFile from 'open'
import parse from './_parse.js'
import path from 'path'
import watcher from './_watcher.js'
import { readFileSync, writeFileSync } from 'fs'
import { error, log, warn } from '../logs.js'
import { fileExists } from '../utils.js'

function createStylesheet (filepath) {
  try {
    writeFileSync(filepath, hyperCssTemplate, 'utf-8')
    log(`created new stylesheet at ${filepath}`)
  } catch (err) {
    error('failed to create new stylesheet', err.message)
  }
}

class Stylesheet {
  constructor () {
    this.state = {
      autoReload: null,
      hyperCssPath: null,
      hyperJsPath: null
    }
  }

  get () {
    const { hyperCssPath } = this.state

    if (fileExists(hyperCssPath)) {
      return parse(
        readFileSync(hyperCssPath, 'utf-8')
      )
    }
  }

  open () {
    const { hyperCssPath } = this.state

    if (!fileExists(hyperCssPath)) {
      const { autoReload, hyperJsPath } = this.state

      createStylesheet(hyperCssPath)

      if (autoReload) {
        watcher.start(hyperCssPath, hyperJsPath)
      }
    }

    openFile(hyperCssPath)
  }

  /*
   * updates state and handle side-effects caused by a state change.
   * the only reason this is so complicated is because of autoReload
   */
  applyOptions (options) {
    let { autoReload, CONFIG_PATH } = options
    const hyperJsPath = path.normalize(CONFIG_PATH)

    // deprecated option
    if (options['auto-reload'] !== null) {
      warn('`auto-reload` option is deprecated; use `autoReload` instead')

      if (autoReload === true && options['auto-reload'] === false) {
        autoReload = false
      }
    }

    // hyperJsPath changed
    if (this.state.hyperJsPath !== hyperJsPath) {
      if (fileExists(hyperJsPath)) {
        const hyperCssPath = path.join(path.dirname(hyperJsPath), '.hyper.css')

        Object.assign(this.state, { hyperJsPath })

        // in case the new js path caused the css path to change
        if (this.state.hyperCssPath !== hyperCssPath) {
          Object.assign(this.state, { hyperCssPath })

          if (!fileExists(hyperCssPath)) {
            createStylesheet(hyperCssPath)
          }

          if (watcher.isWatching()) {
            watcher.stop()
          }

          if (autoReload) {
            watcher.start(hyperCssPath, hyperJsPath)
          }
        }
      } else {
        warn('`CONFIG_PATH` provided does not exist')
      }
    }

    // autoReload changed
    if (this.state.autoReload !== autoReload) {
      Object.assign(this.state, { autoReload })

      if (autoReload === false && watcher.isWatching()) {
        watcher.stop()
      } else if (!watcher.isWatching()) {
        // get fresh paths from state in case they changed above
        const { hyperCssPath, hyperJsPath } = this.state

        watcher.start(hyperCssPath, hyperJsPath)
      }
    }
  }
}

export default new Stylesheet()
