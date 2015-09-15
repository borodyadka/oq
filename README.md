# Object query compiler

Usage
-----

```js
var oq = require('oq');
var users = [
    {id: 1, name: 'Frodo'},
    {id: 2, name: 'Samwise'},
    {id: 3, name: 'Peregrin'},
    {id: 4, name: 'Meriadoc'}
];

var fetchId = oq('[*].id');

console.log(fetchId(users)); // [1, 2, 3, 4]
```

Syntax
------

```js
// iterate over all items in array
oq('[*]')

// iterate over 0, 1, and 5 items
oq('[0, 1, 5]')

// iterate over 0 to 5 items (not inclusive)
oq('[0:5]')

// get "a" property
oq('a')

// get "a.b.c" property
oq('a.b.c')

// get ids of first 3 children of "a"
oq('a[0:3]')
```
