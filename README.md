# erm.js
The Esoteric Reactive Machine

note: this project is alpha right now (0.0.0)

If like me you've got data, you've tried pattern matching with rxjs, you've tried finding arrays in arrays with the Knuth-Morris-Pratt algorithm, but it's all too much and not quite what you need, then maybe erm is the javascript pattern matching library you're looking for!

erm does works like this:

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
