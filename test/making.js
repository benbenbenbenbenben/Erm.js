var assert = require('assert')

const { match, make, not, _ } = require('../').Match

describe("Make(<type>) acts as Make(<predicate:type=>true|false>)", () => {

  it(`should accept char'a' as if p => p == 'a'`, () => {
    let chara = make('a')
    assert.equal(chara.toString(), (p => p == 'a').toString())
  })

  it(`should accept string'hello' as if p => p == 'hello'`, () => {
    let stringhello = make('hello')
    assert.equal(stringhello.toString(), (p => p == 'hello').toString())
  })

  it(`should accept number 3.14 as is p => p == 3.14`, () => {
    let pi = make(3.14)
    assert.equal(pi.toString(), (p => p == 3.14).toString())
  })

  it(`should accept ...string'hello' as (p0, p1, p2, p3, p4) => p0 == 'h' && p1 == 'e' && p2 == 'l' && p3 == 'l' && p4 == 'o'`, () => {
    let hello = make(...'hello')
    assert.equal(hello.toString(), ((p0, p1, p2, p3, p4) => p0 == 'h' && p1 == 'e' && p2 == 'l' && p3 == 'l' && p4 == 'o').toString())
  })

  it(`should accept object { foo: 1, bar: 2 } as p => Match.objectEqual(p, { foo: 1, bar: 2 })`, () => {
    let object = make({ foo: 1, bar: 2 })
    let strip = s => s.toString().replace(/["' ]/g, "") /* note: breaks string literals */
    assert.equal(strip(object), strip(p => Match.objectEqual(p, { foo: 1, bar: 2 })))
  })
})
