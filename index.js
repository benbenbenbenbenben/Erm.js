const chalk = require('chalk')

const unit = Symbol()
const _ = unit
const _unitmachine = _ => true
const TRACE = false
const trace = (...args) => TRACE ? console.log(chalk.gray(...args)) : unit
/**
 * Provides fluent pattern matching for iterable input data.
 */
class Match {
  constructor(...input) {
    this.input = input
    this.position = 0
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
        } while(++cycle)
      }).bind(this)
    }
    return matcher
  }
  runmachine(machine) {
    let _input = this.collect(this.input, machine.length)
    trace(`\t\t${_input}`)
    let start = this.position
    let pass = machine(..._input)
    let location = { start: start, length: _input.length }
    if (pass) {
      this.advance(machine.length)
      return { value: _input, signal: pass, location }
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
  eof() {
    return this.position >= this.input.length
  }
  static get _() {
    return _
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
    let match = new Match(...input)
    return (function(...machines) {
      return match.load(...machines).runmatch()
    }).bind(match)
  }
  /**
   * Makes a predicate-machine from a predicate.
   * @param {predicate} machine - A predicate; p => true|false
   * @returns {function} The predicate-machine, callable
   */
  static make(machine) {

    if (machine == unit)
      machine = _unitmachine

    let terminator = function (ok, fault = () => unit) {
      let terminatingmachine = function () {
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
      terminatingmachine.machine = machine
      return /* latebound */ terminatingmachine
    }

    // terminator insert-operator
    terminator.until = function(stopmachine) {
      let untilterminator = (ok, fault = () => unit) => {
        let terminatingmachine = function() {
          trace(`until: ${stopmachine}`)
          let outcomes = []
          let okredirect = outcome => outcomes.push(outcome)
          let untillingmachine = terminator(okredirect, fault)
          let stoppingmachine = function () {
            let outcome = this.runmachine(stopmachine)
            if (outcome != unit)
              outcomes.push(outcome)
            return outcome != unit
          }

var k = 50
          while (k--) {
            //console.log("machine loop", this.position)
            let result = untillingmachine.bind(this)()
            if (result) {
            //  console.log("passed until")
              let stop = stoppingmachine.bind(this)()
            //  console.log(result, stop)
              if (stop) {
                if (outcomes.length > 0) {
                  ok(outcomes)
                  //console.log("stopping machine completed", outcomes)
                }
                break
              }
            } else {
              if (stoppingmachine.bind(this)()) {
                break
              }
            }
            if (this.eof()) {
              break
            }
          }
        }
        terminatingmachine.machine = stopmachine
        return /* latebound */ terminatingmachine
      }
      return untilterminator
    }

    terminator.toString = () => machine.toString()

    return terminator
  }
  static arrowwitharity(arrow, desiredarity) {
    Object.defineProperty(arrow, 'length', { value: desiredarity })
    return arrow
  }
  static not(machine) {
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
