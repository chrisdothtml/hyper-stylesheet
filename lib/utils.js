import crypto from 'crypto'
import { accessSync } from 'fs'
import { name as META_NAME } from '../package.json'

const BANNER_KEY = `${META_NAME}-hash`

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

function generateBanner (hash) {
  return `/* -- ${BANNER_KEY}:${hash} -- */`
}

export function hasBanner (str, hash) {
  const banner = generateBanner(hash)
  return !!~str.indexOf(banner)
}

export function updateBanner (str, hash) {
  const pattern = new RegExp(`\\/\\* -- ${BANNER_KEY}:[^-]+-- \\*\\/`)

  // remove old
  if (pattern.test(str)) {
    str = str.replace(pattern, '')
  }

  return `${generateBanner(hash)}\n${str}`
}

export function md5 (input) {
  return crypto
    .createHash('md5')
    .update(input)
    .digest('hex')
}
