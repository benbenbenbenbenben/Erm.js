const assert = require('assert')
const { match, make, not, _ } = require('../').Match

describe('scenario: match(..."xxxyz") can break()', () => {
  it(`should match ...'xxxyz' once for x and break`, () => {
    let count = 0
    match(..."xxxyz")(
      make('x')(x => count++).break(),
      _
    )
    assert.equal(count, 1)
  })
  it(`should match ...'xxxyz' thrice for 'x' then break for 'y'`, () => {
    let count = 0
    match(..."xxxyz")(
      make('x')(x => count++),
      make('y')(x => count++).break(),
      _
    )
    assert.equal(count, 4)
  })
  it(`should match ...'xxxyz' but break on 'x' before 'y'`, () => {
    let count = 0
    match(..."xxxyz")(
      make('x').break(),
      make('y')(x => count++).break(),
      _
    )
    assert.equal(count, 0)
  })
})

describe('scenario: match(..."xxxyzxxxxxyz") can until()', () => {
  it(`should make('x').until('x') as 'xxx'`, () => {
    let found = ""
    match(..."xxxyz")(
      make('x').until(p => p == 'y')(result => found = result.value.map(x=>x).join("")),
      _
    )
    assert.equal(found, "xxx")
  })

  it(`should make('x').until('x') as ['xxx','xxxxx']`, () => {
    let found = []
    match(..."xxxyzxxxxxyz")(
      make('x').until(p => p == 'y')(result => found.push(result.value.map(x=>x).join(""))),
      _
    )
    assert.equal(JSON.stringify(found), JSON.stringify(["xxx", "xxxxx"]))
  })
})
