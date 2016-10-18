'use strict'

const os = require('os')
const path = require('path')
const HOME_PATH = os.homedir()

module.exports = {
  fileExists: false,
  initialized: false,
  isWatching: false,
  STYLESHEET_PATH: path.normalize(`${HOME_PATH}/.hyper.css`)
}
