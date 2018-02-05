import path from 'path'
import stylesheet from './stylesheet/index.js'
import { homedir } from 'os'
import { name as META_NAME } from '../package.json'

/*
 * override default options if provided; ignore all other properties
 */
function overrideDefaults (options, defaults) {
  const result = {}

  Object.keys(defaults)
    .forEach(key => {
      result[key] = typeof options[key] === 'undefined' ? defaults[key] : options[key]
    })

  return result
}

export function decorateConfig (config) {
  const options = config[META_NAME] || {}

  stylesheet.applyOptions(
    overrideDefaults(options, {
      'auto-reload': null, // deprecated
      autoReload: true,
      CONFIG_PATH: path.join(homedir(), '.hyper.js')
    })
  )

  const configProperties = stylesheet.get()

  if (configProperties) {
    const { css, termCSS } = configProperties

    config = Object.assign(config, {
      css: (config.css || '') + css,
      termCSS: (config.termCSS || '') + termCSS
    })
  }

  return config
}

export function decorateMenu (menus) {
  const parentMenuName = process.platform === 'win32' ? 'Edit' : 'Hyper'
  const newItem = {
    label: 'Stylesheet...',
    click: stylesheet.open.bind(stylesheet)
  }

  // break reference
  menus = Array.from(menus)

  menusLoop: // eslint-disable-line no-labels
  for (let i = 0; i < menus.length; i++) {
    const menu = menus[i]

    if (menu.label === parentMenuName) {
      const items = menu.submenu

      for (let i = 0; i < items.length; i++) {
        const item = items[i]

        if (item.label === 'Preferences...') {
          items.splice(i + 1, 0, newItem)
          break menusLoop // eslint-disable-line no-labels
        }
      }
    }
  }

  return menus
}
