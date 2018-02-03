import os from 'os'
import path from 'path'
import { readFileSync } from 'fs'

const HOME_PATH = os.homedir()

export default {
  CONFIG_PATH: path.normalize(`${HOME_PATH}/.hyper.js`),
  fileExists: false,
  initialized: false,
  isWatching: false,
  STYLESHEET_PATH: path.normalize(`${HOME_PATH}/.hyper.css`),
  STYLESHEET_TMPL: readFileSync(path.resolve(`${__dirname}/../tmpl/hyper.css`), 'utf-8')
}
