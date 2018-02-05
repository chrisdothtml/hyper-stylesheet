import { hasBanner, updateBanner } from '../lib/utils.js'

describe('banner utils', () => {
  describe('- hasBanner', () => {
    it('should check whether the provided string has a banner for the provided hash', () => {
      expect(hasBanner('/* -- hyper-stylesheet-hash:TEST_HASH -- */', 'TEST_HASH')).to.equal(true)
      expect(hasBanner('/* -- hyper-stylesheet-hash:TEST_HASH_2 -- */', 'TEST_HASH')).to.equal(false)
      expect(hasBanner('', 'TEST_HASH')).to.equal(false)
    })
  })

  describe.skip('- updateBanner', () => {
    it('should add or replace the existing banner in the provided string', () => {
      //
    })
  })
})
