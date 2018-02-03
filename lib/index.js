import open from 'open'
import parse from './parse.js'
import store from './store.js'
import * as init from './init.js'
import { readFileSync } from 'fs'
import { name as META_NAME } from '../package.json'

const { STYLESHEET_PATH } = store

// TODO: preprocessor support
export function decorateConfig (config) {
  if (!store.initialized) {
    init.main(config[META_NAME])
  }

  if (store.fileExists) {
    const src = readFileSync(STYLESHEET_PATH, 'utf-8')
    const parsed = parse(src)

    return Object.assign({}, config, {
      css: (config.css || '') + parsed.css,
      termCSS: (config.termCSS || '') + parsed.termCSS
    })
  }

  return config
}

export function decorateMenu (menus) {
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
