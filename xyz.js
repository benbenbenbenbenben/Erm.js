const { match, make, not, _, before } = require('./').Match
const fs = require('fs')

let data = JSON.parse(fs.readFileSync('./../seance_/electron-boilerplate/app/examples/recordings/1502560280916.json'))

let move = (p, q) => p.offsetX != q.offsetX || p.offsetY != q.offsetY
let leftdown = p => p.type == "mousedown" && p.which == 1
let leftup = p => p.type == "mouseup" && p.which == 1

let keydown = p => p.type == "keydown"
let keyup = p => p.type == "keyup"
let andkeyup = (p, q) => keydown(p) && keyup(q) && p.which == q.which


let leftclick = (p, q) => leftdown(p) && leftup(q) && !move(p, q)
let doubleclick = (p, q, pp, qq) => leftclick(p, q) && leftclick(pp, qq) && !move(p, pp)

let keystroke = (p, q) => keydown(p) && keyup(q) && p.which == q.which

match(...data.steps)(
  make(doubleclick).stream(d => console.log("doubleclick")),
  make(leftclick).stream(d => console.log("click")),
  make(keydown, before(keyup))(k => console.log(String.fromCharCode(k.value[0].which))),
  //make(keyup)(k => console.log(String.fromCharCode(k.value[0].which))),
  _
)
