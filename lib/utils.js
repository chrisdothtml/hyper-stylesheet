import crypto from 'crypto'
import { accessSync } from 'fs'

export function fileExists (path) {
  let result

  try {
    accessSync(path)
    result = true
  } catch (e) {
    result = false
  }

  return result
}

export function md5 (input) {
  return crypto
    .createHash('md5')
    .update(input)
    .digest('hex')
}
