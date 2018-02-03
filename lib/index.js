const fs = require('fs')
const init = require('./init.js')
const open = require('open')
const parse = require('./parse.js')
const { STYLESHEET_PATH } = require('./store.js')

/**
 * Adds .hyper.css contents to the config object
 *
 * @returns {object}
 */
// TODO: preprocessor support
function decorateConfig (config) {
  if (!store.initialized) {
    init.main(config)
  }

  if (store.fileExists) {
    let src = fs.readFileSync(STYLESHEET_PATH, 'utf-8')
    let parsed = parse(src)

    return Object.assign({}, config, {
      css: (config.css || '') + parsed.css,
      termCSS: (config.termCSS || '') + parsed.termCSS
    })
  }

  return config
}

/**
 * Adds button to Hyper menu for opening stylesheet
 *
 * @returns {array}
 */
function decorateMenu (menus) {
  const newItem = {
    label: 'Stylesheet...',
    click () {
      if (!store.fileExists) {
        init.file()
      }

      open(STYLESHEET_PATH)
    }
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
