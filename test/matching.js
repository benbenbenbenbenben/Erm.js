var assert = require('assert')

const { match, make, not, _ } = require('../').Match

describe("Match(...'hello world')", () => {

  let h = p => p == 'h'
  let e = p => p == 'e'
  let l = p => p == 'l'
  let o = p => p == 'o'
  let z = p => p == 'z'
  let hello = (ph,pe,pl,pL,po) => h(ph) && e(pe) && l(pl) && l(pL) && o(po)

  it(`should match once for: ${h}`, () => {
    let count = 0
    match(...'hello world')(
      make(h)(result => count++),
      _
    )
    assert.equal(count, 1)
  })

  it(`should match thrice for: ${l}`, () => {
    let count = 0
    match(...'hello world')(
      make(l)(result => count++),
      _
    )
    assert.equal(count, 3)
  })

  it(`should match never for: ${z}`, () => {
    let count = 0
    match(...'hello world')(
      make(z)(result => count++),
      _
    )
    assert.equal(count, 0)
  })

  it(`should match 3 contingent letters 'hel'`, () => {
    let expected = [{start: 0, length: 1}, {start:1, length: 1}, {start:2, length:1}]
    let actual = []
    match(...'hello world')(
      make(h)(result => {if(actual.length < 3) actual.push(result.location)}),
      make(e)(result => {if(actual.length < 3) actual.push(result.location)}),
      make(l)(result => {if(actual.length < 3) actual.push(result.location)}),
      _
    )
    assert.deepEqual(expected, actual)
  })

})
