const chalk = require('chalk')

const unit = Symbol()
const _ = unit
const _unitmachine = _ => true
const TRACE = false
const trace = (...args) => TRACE ? console.log(chalk.gray(...args)) : unit
const bond = (f, ...affixes) => affixes.reduce((f, a, i) => f[a.name||i] = a, f)

class Input {
  constructor(contents) {
    this.buffer = contents
    this._position = 0
  }
  get position() {
    return this._position
  }
  set position(value) {
    this._position = value
  }
  static fromArray(array) {
    let input = new Input(array)
    return new Proxy({}, {
      get: function(target, property, receiver) {
        if (property === 'position')
          return input[property]
        try {
          return array[property].bind ? array[property].bind(array) : array[property]
        } catch(e) {
          throw `${e}, property = ${property.toString()}`
        }
      },
      set: function(target, property, value, receiver) {
        if (property === 'position')
          input[property] = value
        else
          array[property] = value
        return true
      }
    })
  }
}

/**
 * Provides fluent pattern matching for iterable input data.
 */
class Match {
  constructor(inputmachine) {
    this.input = inputmachine
    this.breakset = false
  }
  get position() {
    return this.input.position
  }
  set position(value) {
    this.input.position = value
  }
  break() {
    this.breakset = true
  }
  load(...machines) {
    // patch special machines
    machines.forEach((machine, i) => {
      if (machine === _)
        machines[i] = Match.make(_)(_unitmachine)
    })
    // TODO: bind machines
    //let machinesbound = machines.map(machine => machine.bind(this))
    let matcher = {
      runmatch: (function() {
        trace('machines: ', machines)
        let cycle = 0
        do {
          trace(`cycle: ${cycle}`)
          let positionin = this.position
          machines.find((machine, index) => {
            trace(`\tmachine: ${index} ${machine.machine.name} = ${machine.machine}`)
            let outcome = machine.bind(this)()
            trace(`\t\toutcome: ${outcome}`)
            return outcome
          })
          let positionout = this.position
          if (this.eof()) {
            trace("is eof")
            break
          }
          if (positionin == positionout) {
            throw new Error(`no pattern from ${this.position} to ${this.input.length}, ensure there are machines for expected input or use _`)
          }
        } while(++cycle && !this.breakset)
      }).bind(this)
    }
    return matcher
  }
  runmachine(machine) {
    let _input = this.collect(this.input, machine.length)
    trace(`\t\t${_input}`)
    let start = this.position
    let pass = machine.bind(this)(..._input)
    let location = { start: start, length: _input.length }
    if (pass) {
      this.advance(machine.length)
      let result = { value: _input, signal: pass, location }
      if (machine.suffixes) {
        machine.suffixes.forEach(suffix => suffix.bind(this)(result))
      }
      return result
    } else {
      return unit
    }
  }
  collect(input, length) {
    return input.slice(this.position, this.position + length)
  }
  advance(offset) {
    this.position += offset
  }
  rewindto(position) {
    this.position = position
  }
  eof() {
    return this.position >= this.input.length
  }
  static objectEqual(left, right) {
    if (left == null)
      return left == right
    return undefined == Object.keys(left).find(key => typeof(left[key] == 'object') ? Match.objectEqual(left[key], right[key]) : left[key] != right[key])
  }
  static get _() {
    return _
  }
  static input(input) {
    let inputmachine = Input.fromArray(input)

    return inputmachine
  }
  /**
   * Creates the match-machine for the provided input. The match-machine is a callable
   * object that accepts machines created by {@link Match.make}
   * @example
   * // supplying alphabetmachine with vowelmachine
   *
   * let vowelmachine = make(letter => "aeiou".find(letter) >= 0)
   * let alphabetmachine = match(..."abcdefghijklmnopqrstuvwxyz")
   *
   * alphabetmachine(
   *   vowelmachine(vowel => console.log("found vowel: " + vowel), error => logError(error)),
   *   _
   * )
   * @example
   * // supplying gesturemachine with pinchmachine and swipemachine
   *
   * let swipe = (p1, p2) => distance(p1, p2) > 500 * timespan(p1, p2)
   * let swipemachine = make(swipe)
   *
   * let pinch = (p1, p2, p3, p4) => swipe(p1, p3) && swipe(p2, p4) && overlap([p1, p3], [p2, [p4]])
   * let pinchmachine = make((e1, e2) => e1.f == e2.f && isPinch(e1, e2))
   *
   * let gesturemachine = match(...inputEventsArray)
   * gesturemachine(
   *   pinchmachine(pinch => this.fire("pinched")),
   *   swipemachine(swipe => this.fire("swiped")),
   *   _
   * )
   * @param {object} input - Array-like input data, to be processed from left to right
   * @returns {function} The match-machine, callable
   */
  static match(...input) {
    let inputmachine = Match.input(input)
    let match = new Match(inputmachine)
    let machine = (function(...machines) {
      return match.load(...machines).runmatch()
    }).bind(match)
    machine.$machine = "match"
    return machine
  }
  /**
   * Makes a predicate-machine from a predicate.
   * @param {predicate} machine - A predicate; p => true|false
   * @returns {function} The predicate-machine, callable
   */
  static make(predicatevalue, ...rest) {
    rest.unshift(predicatevalue)

    // rationalise
    rest.forEach((pv, i) => {
      // value->predicate step
      if (pv == unit)
        rest[i] = _unitmachine
      if (typeof(pv) == 'string')
        rest[i] = eval(`p => p == '${pv}'`)
      if (typeof(pv) == 'number' || typeof(pv) == 'boolean')
        rest[i] = eval(`p => p == ${pv}`)
      if (typeof(pv) == 'object')
        rest[i] = eval(`p => Match.objectEqual(p, ${JSON.stringify(pv)})`)

      Object.defineProperty(rest[i], 'initialvalue', { value: pv.toString() })
    })

    // concatenate to multivariate step
    let machine = rest.length == 1 ? rest[0] : Object.defineProperty(
      rest.reduce((f,p,i) => (...x) => f(...x) && p(x[i]), () => true),
      'toString', { value: () => `(${rest.map((p, i) => `p${i}`).join(', ')}) => ${rest.map((p, i) => `p${i} == '${p.initialvalue}'`).join(' && ')}` }
    )

    let terminator = function (ok, fault = () => unit) {
      let terminatingmachine = function () {
        // make$machine terminated
        try {
          let outcome = this.runmachine(machine)
          if (outcome != unit)
            ok(outcome)
          return outcome != unit
        } catch(e) {
          fault(e)
          throw e
        }
      }

      terminatingmachine.break = () => {
        if (machine.suffixes === undefined)
          machine.suffixes = []
        machine.suffixes.push(function(){ this.break() })
        return terminatingmachine
      }
      terminatingmachine.machine = machine
      return /* latebound */ terminatingmachine
    }
    // compose "if break() called suffix break activity to machine()"

    // terminator insert-operator
    let until = function(stopmachine) {
      // value to machine conversion
      if (stopmachine.$machine === undefined) {
        stopmachine = Match.make(stopmachine)
      }
      let terminator$until = (ok, fault = () => unit) => {
        let terminatingmachine = function() {
          trace(`until: ${stopmachine}`)
          let outcomes = []
          let okredirect = outcome => {
            outcomes.push(outcome)
          }
          let untillingmachine = terminator(okredirect, fault)
          let stoppingmachine = function () {
            let inpos = this.position
            let outcome = this.runmachine(stopmachine(() => {}))
            this.rewindto(inpos)
            return outcome != unit
          }

          while (true) {
            let start = this.position
            let need = untillingmachine.bind(this)()
              console.log("loop", start, this.position)
            if (start + untillingmachine.machine.length < this.position) {
              if (outcomes.length > 0)
                ok(outcomes)
              break
            }
            if (need) {
              let stop = stoppingmachine.bind(this)()
              if (stop) {
                if (outcomes.length > 0) {
                  ok(outcomes)
                  break
                }
              }
            } else {
              if (stoppingmachine.bind(this)()) {
                break
              }
            }
            if (this.eof() || this.position == start) {
              break
            }
          }
        }
        terminatingmachine.machine = stopmachine
        return /* latebound */ terminatingmachine
      }
      // TODO: this is duplicated above
      terminator$until.break = () => {
        if (machine.suffixes === undefined)
          machine.suffixes = []
        machine.suffixes.push(function(){ this.break() })
        return terminator$until
      }
      return terminator$until
    }

    bond(terminator, until)
    // TODO: this is duplicated above
    terminator.break = () => {
      if (machine.suffixes === undefined)
        machine.suffixes = []
      machine.suffixes.push(function(){ this.break() })
      let terminatormachine = function(){
        try {
          let outcome = this.runmachine(machine)
          //if (outcome != unit)
          //  ok(outcome)
          return outcome != unit
        } catch(e) {
          //fault(e)
          throw e
        }
      }
      terminatormachine.machine = machine
      return terminatormachine
    }
    terminator.toString = () => machine.toString()
    terminator.$machine = "make"

    return terminator
  }
  static arrowwitharity(arrow, desiredarity) {
    Object.defineProperty(arrow, 'length', { value: desiredarity })
    return arrow
  }
  static not(machine) {
    if (machine.$machine === undefined)
      machine = Match.make(machine)
    let notmachine = Match.arrowwitharity((...args) => !machine(...args), machine.length)
    Object.defineProperty(notmachine, 'name', { value: `!${machine.name}` })
    notmachine.toString = () => `not(${machine.toString()})`
    return notmachine
  }
}

module.exports = {
  Match
}

/*
let { match, make, not } = Match

let a = p => p == 'a'
let b = p => p == 'b'
let z = p => p == 'z'
let zz = (p, q) => z(p) && z(q)
let zzz = (p, q, qq) => z(p) && zz(q, qq)
let t = p => p == 't'

match(...'t') (
//  make(a)(result => console.log('a:', result)),
//  make(b)(result => console.log('b:', result)),
//  make(zzz)(result => console.log('zzz:', result)),
  make(t).until(not(t))(result => console.log('t...t:', result)),
  make(_)(result => console.log('_'))
)

let move = (p, q) => p.offsetX != q.offsetX || p.offsetY != q.offsetY
let leftdown = p => p.type == "mousedown" && p.which == 1
let leftup = p => p.type == "mouseup" && p.which == 1

let keydown = p => p.type == "keydown"
let keyup = p => p.type == "keyup"


let leftclick = (p, q) => leftdown(p) && leftdown(q) && !move(p, q)
let doubleclick = (p, q, pp, qq) => leftclick(p, q) && leftclick(pp, qq) && !move(p, pp)

let keystroke = (p, q) => keydown(p) && keyup(q)

match(...input.steps) (
  make(leftclick)(result => console.log("leftclick")),
  make(doubleclick)(result => console.log("doubleclick")),
  make(keystroke).until(not(keystroke))(result => log("keystroke(s)"))
)
*/
