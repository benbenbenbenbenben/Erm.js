# erm.js - The Esoteric Reducing Machine

erm.js creates composable machines for pattern matching. 

```javascript
let monkeyKeystrokes =
    infiniteTypewriters(infiniteMonkeys).readToEnd()

match(...monkeyKeystrokes)(
  make(macbeth)(book => worksOfShakespeare.push(book)),
  make(twogentlemenofverona)(book => worksOfShakespeare.push(book)),
  make(ayorkshiretragedy)(book => haltAndCatchFire()),
  _
)
```

If like me you've got data, you've tried pattern matching with rxjs, you've tried finding arrays in arrays with the Knuth-Morris-Pratt algorithm, but it's all too much and not quite what you need, then maybe erm is the javascript pattern matching library you're looking for!

_note: this project is (pre) alpha right now and discussed APIs are subject to change_

## Introduction

erm.js will work with arrays of anything, including strings.

### Principle of Operation

- A _match$machine_ has one iterable input and has many _make$machines_.
- A _match$machine_ sends its iterable input in slices of _n(1,&#8734;)_ items to a _make$machine_ accepting _n_ arguments.
- When a _make$machine_ predicate returns _false_, the _match$machine_ restarts the slicing cycle sending input to the next _make$machine_ in the chain.
- A _match$machine_ will terminate when all input is accepted by the _make$machines_.
- A `_` machine is a _make$machine_ that accepts any input and always advances _match$machine_ 1 position.

### The static Match API

> __match__(_...input_)(__make__(_predicate|value_)\[.__until__(_haltpredicate|value_)](_output_, \[_error_])\[,...])

__match__ accepts _...input_ and returns a __match$machine__ - a callable object that accepts one or more make$machines

__make__ accepts _predicate_ and return a __make$machine__- a callable object that accepts an _output_ callback and optionally and _error_ callback.

#### Fixed Size Patterns

A __make$machine__ will be activated with the same number of items as _predicate_ has parameters; which is to say they have the same arity; so a predicate `p => ...` will produce a machine that activate with 1 parameter, in this instance `p`. Because of this, predicates with a `...rest` parameter are not currently compatible. Variable length patterns can still be matched using __make$machine.until__

#### Variable Size Patterns

The __make$machine__ also exposes an optional __until__ method which causes the machine to run again until the _haltpredicate_ signals true. To illustrate this with an albeit contrived example, compare it to the Regex \[^] and * operator:
```javascript
// regex
let username = /[^@]*/.match(emailaddress)
saveUsername(username)

// erm with predicates
match(emailaddress)(
  make(c => true).until(make(c => c == '@'))(output => saveUsername(output)),
  _
)

// erm with literals
match(emailaddress)(
  make(_).until('@')(output => saveUsername(output)),
  _
)
```

#### Predicates, Values and Callbacks

_predicate_ and _haltpredicate_ are as you would expect, p => true|false.

If a value _value_ is supplied to make it is automatically converted to _p => p == value_ i.e. `make(3.14) == make(p => p == 3.14)`

_output_ is your supplied callback function that is invoked with a single object `{ value, signal, location: { start, length } }`

_error_ is your optional callback function that is invoked with a single object `{ error, location: { start, length } }`

#### Utility Functions and Constants

__Match.not()__ will invert a predicate while preserving arity e.g. `let TRUE = make(p => true); let FALSE = make(not(TRUE))`

**Match.\_** is the 'unit' value symbol and acts as a wildcard when used in place of a make$machine. Like the `default:` label in a `switch` statement, `_` catches anything that your make$machines don't. Unlike the `default:` label in a switch statement, a match$machine without a `_` will not be able to read unmatched data and may not terminate.

## Quick Start

### Install
`npm install erm-js`

### Usage
The Match class exposes the basic building blocks `{ match, make, not, _ }` for composing machines:

```javascript
const { match, make, not, _  } = require('erm-js').Match

match(..."my input data") (
  make((i, n) => i == "i" && n == "n")(_in => console.log(_in)),
  _
)
```

### Examples
```javascript
const { match, make, not, _  } = require('erm-js').Match

// simple predicates
let h = p => p == 'h'
let e = p => p == 'e'
let l = p => p == 'l'
let o = p => p == 'o'
let z = p => p == 'z'

// still simple but more useful
let hello = (ph,pe,pl,pL,po) => h(ph) && e(pe) && l(pl) && l(pL) && o(po)

// tada!
match(...'hello world')(
  make(h)(x => console.log('h found:', x)),
  make(e)(x => console.log('e found:', x)),
  make(l)(x => console.log('l found:', x)),
  _
)

// kapow!
match(...'hello world')(
  make(hello)(x => console.log('hello found:', x)),
  _
)

// zorb!
match(...'hello world')(
  make(l).until(not(o))(x => console.log('ll found:', x)),
  _
)
```
