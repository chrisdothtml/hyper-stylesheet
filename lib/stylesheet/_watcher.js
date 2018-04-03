import gaze from 'gaze'
import { readFile, writeFile } from 'pfs'
import { error, warn } from '../logs.js'
import { name as META_NAME } from '../../package.json'
import { md5 } from '../utils.js'

async function updateHash (paths) {
  const { updatePath, watchPath } = paths
  const key = `${META_NAME}-hash`
  const fileContent = await readFile(watchPath, 'utf-8')
  const hash = md5(`${key}:${fileContent}`)
  const hashLine = `// -- ${key}:${hash} --`
  const pattern = new RegExp(`\\/\\/ -- ${key}:[^-]+--`)
  let config = await readFile(updatePath, 'utf-8')

  if (pattern.test(config)) {
    // replace existing
    config = config.replace(pattern, hashLine)
  } else {
    // add new
    config = `${hashLine}\n${config}`
  }

  return writeFile(updatePath, config, 'utf-8')
}

class Watcher {
  constructor () {
    this.instance = null
    this.state = {
      isWatching: false
    }
  }

  isWatching () {
    return this.state.isWatching
  }

  start (watchPath, updatePath) {
    gaze(watchPath, (err, watcher) => {
      if (err) {
        error('file watcher error', err.message)
      } else {
        Object.assign(this.state, { isWatching: true })

        watcher.on('changed', () => {
          updateHash({ updatePath, watchPath })
            .catch(err => error('error updating .hyper.js', err.message))
        })

        watcher.on('deleted', () => {
          warn('`.hyper.css` was deleted; autoReload disabled')
          this.stop()
        })

        this.instance = watcher
      }
    })
  }

  stop () {
    this.instance.close()
    this.instance = null
    Object.assign(this.state, { isWatching: false })
  }
}

export default new Watcher()
