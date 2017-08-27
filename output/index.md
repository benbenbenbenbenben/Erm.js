# Global





* * *

## Class: Match



## Class: Match


### Match.match(input) 

Creates the match-machine for the provided input. The match-machine is a callableobject that accepts machines created by [Match.make](#match.make)

**Parameters**

**input**: `object`, Array-like input data, to be processed from left to right

**Returns**: `function`, The match-machine, callable

**Example**:
```js
// supplying alphabetmachine with vowelmachinelet vowelmachine = make(letter => "aeiou".find(letter) >= 0)let alphabetmachine = match(..."abcdefghijklmnopqrstuvwxyz")alphabetmachine(  vowelmachine(vowel => console.log("found vowel: " + vowel), error => logError(error)),  _),// supplying gesturemachine with pinchmachine and swipemachinelet swipe = (p1, p2) => distance(p1, p2) > 500 * timespan(p1, p2)let swipemachine = make(swipe)let pinch = (p1, p2, p3, p4) => swipe(p1, p3) && swipe(p2, p4) && overlap([p1, p3], [p2, [p4]])let pinchmachine = make((e1, e2) => e1.f == e2.f && isPinch(e1, e2))let gesturemachine = match(...inputEventsArray)gesturemachine(  pinchmachine(pinch => this.fire("pinched")),  swipemachine(swipe => this.fire("swiped")),  _)
```

**Example**:
```js
// supplying alphabetmachine with vowelmachinelet vowelmachine = make(letter => "aeiou".find(letter) >= 0)let alphabetmachine = match(..."abcdefghijklmnopqrstuvwxyz")alphabetmachine(  vowelmachine(vowel => console.log("found vowel: " + vowel), error => logError(error)),  _),// supplying gesturemachine with pinchmachine and swipemachinelet swipe = (p1, p2) => distance(p1, p2) > 500 * timespan(p1, p2)let swipemachine = make(swipe)let pinch = (p1, p2, p3, p4) => swipe(p1, p3) && swipe(p2, p4) && overlap([p1, p3], [p2, [p4]])let pinchmachine = make((e1, e2) => e1.f == e2.f && isPinch(e1, e2))let gesturemachine = match(...inputEventsArray)gesturemachine(  pinchmachine(pinch => this.fire("pinched")),  swipemachine(swipe => this.fire("swiped")),  _)
```

### Match.make(machine) 

Makes a predicate-machine from a predicate.

**Parameters**

**machine**: `predicate`, A predicate; p => true|false

**Returns**: `function`, The predicate-machine, callable



* * *










