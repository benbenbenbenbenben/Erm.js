const { Match } = require("./erm")
const { match, make, not, _ } = Match

const assert = value => expect(value).toBeTruthy()
const assertEqual = (left, right) => expect(left).toBe(right)

describe("erm-js", () => {
    describe("Match", () => {
        it('should have member #match', () => {
            expect(match).toBeDefined()
        })
        describe('#match()', () => {
            it('should accept 0 arguments', () => {
                assert(typeof (match()) == 'function', "Match.match() was not a function")
            })
            it('should accept 1 argument', () => {
                assert(typeof (match({})) == 'function', "Match.match() was not a function")
            })
            it('should accept many arguments', () => {
                assert(typeof (match({}, {})) == 'function', "Match.match() was not a function")
            })
            it('should have descriptor property $machine equal to "match"', () => {
                expect(match().$machine).toBe("match")
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
                assert(typeof (make(() => true)) == 'function')
            })
            it('should print the predicate when calling toString()', () => {
                assertEqual(make(p => p == p).toString(), 'p => p == p')
            })
            it('should have descriptor property $machine equal to "make"', () => {
                assertEqual(make(p => p).$machine, "make")
            })
            it('should have member #until', () => {
                assert(make(_).until)
            })

            it('should have member #until#break', () => {
                debugger
                assert(make(_).until(_).break)
            })
            it('should have member #break', () => {
                assert(make(_).break)
            })
            it('should have member ()#break', () => {
                assert(make(_)(() => true).break)
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

    describe("Make(<type>) acts as Make(<predicate:type=>true|false>)", () => {

        it(`should accept char'a' as if p => p == 'a'`, () => {
            let chara = make('a')
            assertEqual(chara.toString(), (p => p == 'a').toString())
        })

        it(`should accept string'hello' as if p => p == 'hello'`, () => {
            let stringhello = make('hello')
            assertEqual(stringhello.toString(), (p => p == 'hello').toString())
        })

        it(`should accept number 3.14 as is p => p == 3.14`, () => {
            let pi = make(3.14)
            assertEqual(pi.toString(), (p => p == 3.14).toString())
        })

        it(`should accept ...string'hello' as (p0, p1, p2, p3, p4) => p0 == 'h' && p1 == 'e' && p2 == 'l' && p3 == 'l' && p4 == 'o'`, () => {
            let hello = make(...'hello')
            assertEqual(hello.toString(), ((p0, p1, p2, p3, p4) => p0 == 'h' && p1 == 'e' && p2 == 'l' && p3 == 'l' && p4 == 'o').toString())
        })

        it(`should accept object { foo: 1, bar: 2 } as p => Match.objectEqual(p, { foo: 1, bar: 2 })`, () => {
            let object = make({ foo: 1, bar: 2 })
            let strip = s => s.toString().replace(/["' \r\n]/g, "") /* note: breaks string literals */
            let expected = strip(object)
            let actual = strip(p => Match.objectEqual(p, { foo: 1, bar: 2 }))
            expect(expected).toEqual(actual)
        })

    })

    describe('scenario: match(..."xxxyz") can break()', () => {
        it(`should match ...'xxxyz' once for x and break`, () => {
            let count = 0
            match(..."xxxyz")(
                make('x')(x => count++).break(),
                _
            )
            assertEqual(count, 1)
        })
        it(`should match ...'xxxyz' thrice for 'x' then break for 'y'`, () => {
            let count = 0
            match(..."xxxyz")(
                make('x')(x => count++),
                make('y')(x => count++).break(),
                _
            )
            assertEqual(count, 4)
        })
        it(`should match ...'xxxyz' but break on 'x' before 'y'`, () => {
            let count = 0
            match(..."xxxyz")(
                make('x').break(),
                make('y')(x => count++).break(),
                _
            )
            assertEqual(count, 0)
        })
    })

    describe('scenario: match(..."xxxyzxxxxxyz") can until()', () => {
        it(`should make('x').until('x') as 'xxx'`, () => {
            let found = ""
            match(..."xxxyz")(
                make('x').until('y')(result => found = result.value.map(x => x).join("")),
                _
            )
            assertEqual(found, "xxx")
        })

        it(`should make('x').until('x') as ['xxx','xxxxx']`, () => {
            let found = []
            match(..."xxxyzxxxxxyz")(
                make('x').until(p => p == 'y')(result => found.push(result.value.map(x => x).join(""))),
                _
            )
            assertEqual(JSON.stringify(found), JSON.stringify(["xxx", "xxxxx"]))
        })
    })

    describe('scenario: match(..."abAB") with "a" before "A"', () => {
        it(`should make('a').before('A') as 'a'`, () => {
            let found = []
            match(...'abAB')(
                make('a').before('A')(result => found.push(result.value)),
                _
            )
            assertEqual(JSON.stringify(found), JSON.stringify([['a']]))
        })
        it(`should not make('a').before('C')`, () => {
            let found = []
            match(...'abAB')(
                make('a').before('C')(result => found.push(result.value)),
                _
            )
            assertEqual(JSON.stringify(found), JSON.stringify([]))
        })
        it(`should not make('A').before('a')`, () => {
            let found = []
            match(...'abAB')(
                make('A').before('a')(result => found.push(result.value)),
                _
            )
            assertEqual(JSON.stringify(found), JSON.stringify([]))
        })
    })

    describe("Match(...'hello world')", () => {

        let h = p => p == 'h'
        let e = p => p == 'e'
        let l = p => p == 'l'
        let o = p => p == 'o'
        let z = p => p == 'z'
        let hello = (ph, pe, pl, pL, po) => h(ph) && e(pe) && l(pl) && l(pL) && o(po)

        it(`should match once for: ${h}`, () => {
            let count = 0
            match(...'hello world')(
                make(h)(result => count++),
                _
            )
            assertEqual(count, 1)
        })

        it(`should match thrice for: ${l}`, () => {
            let count = 0
            match(...'hello world')(
                make(l)(result => count++),
                _
            )
            assertEqual(count, 3)
        })

        it(`should match never for: ${z}`, () => {
            let count = 0
            match(...'hello world')(
                make(z)(result => count++),
                _
            )
            assertEqual(count, 0)
        })

        it(`should match 3 contingent letters 'hel'`, () => {
            let expected = [{ start: 0, length: 1 }, { start: 1, length: 1 }, { start: 2, length: 1 }]
            let actual = []
            match(...'hello world')(
                make(h)(result => { if (actual.length < 3) actual.push(result.location) }),
                make(e)(result => { if (actual.length < 3) actual.push(result.location) }),
                make(l)(result => { if (actual.length < 3) actual.push(result.location) }),
                _
            )
            expect(expected).toEqual(actual)
        })

    })

})