const assert = require('assert')
const {match,make,not,_} = require('../').Match

let dumbpasswords = ["123456","123456789","qwerty","12345678","111111","1234567890","1234567","password","123123","987654321","qwertyuiop","mynoob","123321","666666","18atcskd2w","7777777","1q2w3e4r","654321","555555","3rjs1la7qe","google","1q2w3e4r5t","123qwe","zxcvbnm","1q2w3e"]

// simple match
console.log("numeric passwords:")
match(...dumbpasswords)(
  make(pwd => pwd.match(/^\d+$/))(p => console.log(p.value[0])),
  _
)

// simple match once
console.log("single numeric password:")
match(...dumbpasswords)(
  make(pwd => pwd.match(/^\d+$/))(p => console.log(p.value[0])).break(),
  _
)

// a take-while function
let takewhile = input => predicate => {
  let items = []
  match(...input)(
    make(predicate).until(p => !predicate(p))(result => items.push(...result.value)).break(),
    _
  )
  return items
}

let taken = takewhile(dumbpasswords)(p => p != "111111")
console.log("take while !111111")
console.log(taken)

// a partition by function
let partition = input => predicate => {
  let left = []
  let right = []
  match(...input)(
    make(p => predicate(p))(q => left.push(q.value)),
    make(p => !predicate(p))(q => right.push(q.value)),
    _
  )
  return [left, right]
}

let [pleft, pright] = partition(dumbpasswords)(p => p.match(/^\d*$/))
console.log("partitioned, numbers only, not numbers only")
console.log({ pleft, pright })

// direct to array demonstration
let numbers = []
match(...dumbpasswords)(
  make(p => p.match(/^\d*$/)).push(numbers),
  _
)
console.log("filtered direct to array reference")
console.log(numbers)

// stream to function
console.log("stream to function")
let stream = function(...args) {
  console.log(...args)
}
match(...dumbpasswords)(
  make(p => p.match(/^\d*$/)).stream(stream),
  _
)

// yield to caller
let output = match(...dumbpasswords)(make(_).yield())
console.log("yield to caller")
console.log(output)
