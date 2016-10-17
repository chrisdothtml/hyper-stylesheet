'use strict'

/**
 * Separates window and terminal CSS
 *
 * @returns {object}
 */
// TODO: cleanup
function parse (src) {
  const terminalMatch = src.match(/\/\* #(?:terminal|termCSS) \*\/[\s\S]*/)
  const windowMatch = src.match(/\/\* #(?:window|css) \*\/[\s\S]*/)
  const result = {
    terminal: '',
    window: ''
  }

  if (windowMatch || terminalMatch) {
    if (terminalMatch) {
      result.terminal = terminalMatch[0]
        .replace(/^\/\* #(?:terminal|termCSS) \*\/\n?/, '')
    }

    if (windowMatch) {
      result.window = windowMatch[0]
        .replace(/^\/\* #(?:window|css) \*\/\n?/, '')
    }

    // strip sections out of eachother
    if (result.terminal && result.window) {
      result.terminal = result.terminal.replace(windowMatch[0], '')
      result.window = result.window.replace(terminalMatch[0], '')
    }
  } else {
    // use css for window if no flags
    result.window = src
  }

  return result
}

module.exports = parse
