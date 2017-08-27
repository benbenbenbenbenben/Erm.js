let input = {
  "medium": {
    "name": "vnc",
    "version": "1.0",
    "data": {}
  },
  "steps": [
    {
      "timestamp": 1502560253127,
      "type": "start",
      "frame": "0.png"
    },
    {
      "timestamp": 1502560256626,
      "offsetX": 106,
      "offsetY": 39,
      "which": 1,
      "shiftKey": false,
      "type": "mousedown",
      "frame": "1.png"
    },
    {
      "timestamp": 1502560256667,
      "offsetX": 106,
      "offsetY": 39,
      "which": 1,
      "shiftKey": false,
      "type": "mouseup",
      "frame": "2.png"
    },
    {
      "timestamp": 1502560256801,
      "offsetX": 106,
      "offsetY": 39,
      "which": 1,
      "shiftKey": false,
      "type": "mousedown",
      "frame": "3.png"
    },
    {
      "timestamp": 1502560256859,
      "offsetX": 106,
      "offsetY": 39,
      "which": 1,
      "shiftKey": false,
      "type": "mouseup",
      "frame": "4.png"
    },
    {
      "timestamp": 1502560262478,
      "offsetX": 167,
      "offsetY": 49,
      "which": 1,
      "shiftKey": false,
      "type": "mousedown",
      "frame": "5.png"
    },
    {
      "timestamp": 1502560262726,
      "offsetX": 167,
      "offsetY": 49,
      "which": 1,
      "shiftKey": false,
      "type": "mouseup",
      "frame": "6.png"
    },
    {
      "timestamp": 1502560264086,
      "which": 67,
      "keyCode": 67,
      "shiftKey": false,
      "type": "keydown",
      "frame": "7.png"
    },
    {
      "timestamp": 1502560264129,
      "which": 67,
      "keyCode": 67,
      "shiftKey": false,
      "type": "keyup",
      "frame": "8.png"
    },
    {
      "timestamp": 1502560264137,
      "which": 72,
      "keyCode": 72,
      "shiftKey": false,
      "type": "keydown",
      "frame": "9.png"
    },
    {
      "timestamp": 1502560264206,
      "which": 72,
      "keyCode": 72,
      "shiftKey": false,
      "type": "keyup",
      "frame": "10.png"
    },
    {
      "timestamp": 1502560265719,
      "which": 73,
      "keyCode": 73,
      "shiftKey": false,
      "type": "keydown",
      "frame": "11.png"
    },
    {
      "timestamp": 1502560265820,
      "which": 73,
      "keyCode": 73,
      "shiftKey": false,
      "type": "keyup",
      "frame": "12.png"
    },
    {
      "timestamp": 1502560265869,
      "which": 67,
      "keyCode": 67,
      "shiftKey": false,
      "type": "keydown",
      "frame": "13.png"
    },
    {
      "timestamp": 1502560265991,
      "which": 67,
      "keyCode": 67,
      "shiftKey": false,
      "type": "keyup",
      "frame": "14.png"
    },
    {
      "timestamp": 1502560265992,
      "which": 75,
      "keyCode": 75,
      "shiftKey": false,
      "type": "keydown",
      "frame": "15.png"
    },
    {
      "timestamp": 1502560266040,
      "which": 75,
      "keyCode": 75,
      "shiftKey": false,
      "type": "keyup",
      "frame": "16.png"
    },
    {
      "timestamp": 1502560266119,
      "which": 69,
      "keyCode": 69,
      "shiftKey": false,
      "type": "keydown",
      "frame": "17.png"
    },
    {
      "timestamp": 1502560266221,
      "which": 78,
      "keyCode": 78,
      "shiftKey": false,
      "type": "keydown",
      "frame": "18.png"
    },
    {
      "timestamp": 1502560266230,
      "which": 69,
      "keyCode": 69,
      "shiftKey": false,
      "type": "keyup",
      "frame": "19.png"
    },
    {
      "timestamp": 1502560266258,
      "which": 78,
      "keyCode": 78,
      "shiftKey": false,
      "type": "keyup",
      "frame": "20.png"
    },
    {
      "timestamp": 1502560266806,
      "which": 13,
      "keyCode": 13,
      "shiftKey": false,
      "type": "keydown",
      "frame": "21.png"
    },
    {
      "timestamp": 1502560266921,
      "which": 13,
      "keyCode": 13,
      "shiftKey": false,
      "type": "keyup",
      "frame": "22.png"
    },
    {
      "timestamp": 1502560271554,
      "offsetX": 268,
      "offsetY": 246,
      "which": 1,
      "shiftKey": false,
      "type": "mousedown",
      "frame": "23.png"
    },
    {
      "timestamp": 1502560271678,
      "offsetX": 268,
      "offsetY": 246,
      "which": 1,
      "shiftKey": false,
      "type": "mouseup",
      "frame": "24.png"
    },
    {
      "timestamp": 1502560278839,
      "offsetX": 1249,
      "offsetY": 4,
      "which": 1,
      "shiftKey": false,
      "type": "mousedown",
      "frame": "25.png"
    },
    {
      "timestamp": 1502560278943,
      "offsetX": 1249,
      "offsetY": 4,
      "which": 1,
      "shiftKey": false,
      "type": "mouseup",
      "frame": "26.png"
    },
    {
      "timestamp": 1502560280915,
      "type": "end",
      "frame": "27.png"
    }
  ]
}

const chalk = require('chalk')

const unit = Symbol()
const _ = unit
const _unitmachine = _ => true
const TRACE = false
const trace = (...args) => TRACE ? console.log(chalk.gray(...args)) : unit
class Match {
  constructor(...input) {
    this.input = input
    this.position = 0
  }
  load(...machines) {
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
            trace(`\tmachine: ${index} ${machine.innermachine.name} = ${machine.innermachine}`)
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
            throw new Error(`no pattern from ${this.position} to ${this.input.length}`)
          }
        } while(++cycle)
      }).bind(this)
    }
    return matcher
  }
  runmachine(machine) {
    let _input = this.collect(this.input, machine.length)
    trace(`\t\t${_input}`)
    let pass = machine(..._input)
    let location = { start: 0, length: _input.length }
    if (pass) {
      this.advance(machine.length)
      return { signal: pass, location }
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
  static match(...input) {
    let match = new Match(...input)
    return (function(...machines) {
      return match.load(...machines).runmatch()
    }).bind(match)
  }
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
        }
      }
      terminatingmachine.innermachine = machine
      return /* latebound */ terminatingmachine
    }

    // terminator insert-operator
    terminator.until = function(machine) {

      return terminator
    }

    return terminator
  }
  static not(machine) {
    Match.make(machine) // TODO
  }
}
let { match, make, not } = Match

let a = p => p == 'a'
let b = p => p == 'b'

match('a', 'b', 'zz') (
  make(a)(result => console.log('a:', result)),
  make(b)(result => console.log('b:', result)),
  make(_)(result => console.log('_'))
)

/*
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
