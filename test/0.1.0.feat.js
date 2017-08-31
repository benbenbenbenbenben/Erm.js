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

// a take function
let takewhile = (...input) => {
  return (predicate) => {
    let result = []
    let count = 4
    match(...input)(
      make(predicate).until(() => count-- > 0)(items => result.push(...items.map(i => i.value))),
      _
    )
    console.log(result)
    return result
  }
}
takewhile(...dumbpasswords)(password => password.length < 8)
