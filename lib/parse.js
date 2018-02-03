/**
 * Parses each section out of the provided file source
 *
 * @returns {object}
 */
function getSections (src) {
  const result = {}
  const sections = {
    css: 'window|css',
    termCSS: 'terminal|termCSS'
  }

  Object.keys(sections).forEach(key => {
    const heading = sections[key]
    const regex = new RegExp(`\\n?\\/\\* #(?:${heading}) \\*\\/\\n?([\\s\\S]*)`)
    const match = src.match(regex)

    if (match) {
      const [ full, body ] = match
      result[key] = { body, full }
    } else {
      result[key] = false
    }
  })

  return result
}

/**
 * Separates CSS into sections
 *
 * @returns {object}
 */
function parse (src) {
  const {css, termCSS} = getSections(src)
  const result = {}

  if (!css && !termCSS) {
    // no sections in file
    result.css = src
    result.termCSS = ''
  } else {
    result.css = css.body || ''
    result.termCSS = termCSS.body || ''
  }

  if (css && termCSS) {
    // strip sections out of eachother
    result.css = result.css.replace(termCSS.full, '')
    result.termCSS = result.termCSS.replace(css.full, '')
  }

  return result
}

module.exports = parse
