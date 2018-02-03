const fs = require('fs')
const os = require('os')
const path = require('path')

const HOME_PATH = os.homedir()

module.exports = {
  CONFIG_PATH: path.normalize(`${HOME_PATH}/.hyper.js`),
  fileExists: false,
  initialized: false,
  isWatching: false,
  STYLESHEET_PATH: path.normalize(`${HOME_PATH}/.hyper.css`),
  STYLESHEET_TMPL: fs.readFileSync(path.resolve(`${__dirname}/../tmpl/hyper.css`), 'utf-8')
}
