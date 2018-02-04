import { name as META_NAME } from '../package.json'

function wrapConsoleMethod (method) {
  const decoration = `[${META_NAME}]`

  return function () {
    return console[method].apply(
      console,
      [decoration].concat(Array.from(arguments))
    )
  }
}

export const error = wrapConsoleMethod('error')
export const log = wrapConsoleMethod('log')
export const warn = wrapConsoleMethod('warn')
