'use strict'

const fs = require('fs')
const open = require('open')
const os = require('os')
const path = require('path')
const store = require('./store.js')
const STYLESHEET_PATH = path.normalize(path.join(os.homedir(), '.hyper.css'))

/**
 * Adds .hyper.css contents to the config object
 *
 * @returns {object}
 */
function decorateConfig (config) {
  if (store.fileExists) {
    try {
      let css = fs.readFileSync(STYLESHEET_PATH, 'utf-8')

      return Object.assign({}, config, {
        css: `
          ${config.css || ''}
          ${css}
        `
      })
    } catch (error) {
      if (error.code === 'ENOENT') {
        store.fileExists = false
      }
    }
  }

  return config
}

/**
 * Opens .hyper.css. Creates new file if one doesn't exist
 */
function openStylesheet () {
  if (!store.fileExists) {
    fs.writeFileSync(STYLESHEET_PATH, '', 'utf-8')
    store.fileExists = true
  }

  open(STYLESHEET_PATH)
}

/**
 * Adds button to Hyper menu for opening stylesheet
 *
 * @returns {array}
 */
function decorateMenu (menus) {
  const newItem = {
    label: 'Stylesheet...',
    click: openStylesheet
  }

  // break reference
  menus = Array.from(menus)

  menusLoop: // eslint-disable-line no-labels
  for (let i = 0; i < menus.length; i++) {
    let menu = menus[i]

    if (menu.label === 'Hyper') {
      let items = menu.submenu

      for (let i = 0; i < items.length; i++) {
        let item = items[i]

        if (item.label === 'Preferences...') {
          items.splice(i + 1, 0, newItem)
          break menusLoop // eslint-disable-line no-labels
        }
      }
    }
  }

  return menus
}

module.exports = {
  decorateConfig,
  decorateMenu
}
