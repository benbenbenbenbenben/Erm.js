var assert = require('assert')

const { match, make, not, _ } = require('../').Match

describe("Match(...'hello world')", () => {

  let h = make(p => p == 'h')
  let l = make(p => p == 'l')
  let z = make(p => p == 'z')

  it(`should match once for: ${h}`, () => {
    let count = 0
    match(...'hello world')(
      h(result => count++),
      _
    )
    assert.equal(count, 1)
  })

  it(`should match thrice for: ${l}`, () => {
    let count = 0
    match(...'hello world')(
      l(result => count++),
      _
    )
    assert.equal(count, 3)
  })

  it(`should match never for: ${z}`, () => {
    let count = 0
    match(...'hello world')(
      z(result => count++),
      _
    )
    assert.equal(count, 0)
  })
})
