var assert = require('assert')

describe('Match', () => {

  let { match, make, not } = require('../').Match

  it('should have member #match', () => assert(match))
  describe('#match()', () => {
    it('should accept 0 arguments', () => {
      assert(typeof(match()) == 'function', "Match.match() was not a function")
    })
    it('should accept 1 argument', () => {
        assert(typeof(match({})) == 'function', "Match.match() was not a function")
    })
    it('should accept many arguments', () => {
        assert(typeof(match({},{})) == 'function', "Match.match() was not a function")
    })
  })

  it('should have member #make', () => assert(match))
  describe('#make()', () => {
    it('should accept 0 arguments', () => {
      try {
        let fail = make()
        assert(false, 'make() did not fail but should have with 0 arguments')
      } catch (e) {
        assert(true, 'make() did not fail but should have with 0 arguments')
      }
    })
    it('should accept 1 argument', () => {
      assert(typeof(make(() => true)) == 'function')
    })
    it('should print the predicate when calling toString()', () => {
      assert.equal(make(p => p == p).toString(), 'p => p == p')
    })
  })


  it('should have member #not', () => assert(match))
  describe('#not()', () => {
    it('should invert a predicate', () => {
      assert(not(() => true)() === false)
    })
    it('should return a predicate of the same arity', () => {
      assert(not(() => true).length == 0)
      assert(not((p, q) => true).length == 2)
    })
  })
})
