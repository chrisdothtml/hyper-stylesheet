'use strict'

const fs = require('fs')
const open = require('open')
const os = require('os')
const path = require('path')
const stylesheet = path.normalize(path.join(os.homedir(), '.hyper.css'))

/**
 * Adds .hyper.css contents to the config object
 */
function decorateConfig (config) {
  const css = fs.readFileSync(stylesheet, 'utf-8')

  return Object.assign({}, config, {
    css: `
      ${config.css || ''}
      ${css}
    `
  })
}

/**
 * Adds button to Hyper menu for opening stylesheet
 */
function decorateMenu (menus) {
  const newItem = {
    label: 'Stylesheet...',
    click: () => {
      open(stylesheet)
    }
  }

  // break reference
  menus = Object.assign({}, menus)

  menusLoop:
  for (let i = 0; i < menus.length; i++) {
    let menu = menus[i]

    if (menu.label === 'Hyper') {
      let items = menu.submenu

      itemsLoop:
      for (let i = 0; i < items.length; i++) {
        let item = items[i]

        if (item.label === 'Preferences...') {
          items.splice(i + 1, 0, newItem)
          break menusLoop
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
