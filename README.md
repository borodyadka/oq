# Deep object queries

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
oq.get('[*]')

// iterate over 0, 1, and 5 items
oq.get('[0, 1, 5]')

// iterate over 0 to 5 items (not inclusive)
oq.get('[0:5]')

// get "a" property
oq.get('a')

// get "a.b.c" property
oq.get('a.b.c')

// get first 3 children of "a"
oq.get('a[0:3]')
```

You can pass an array for query like `[true, 'a', 1, [1, 2, 3]]` instead of string `"[*].a[1][1,2,3]"`;

Translation rules:

* `a` → `['a']`;
* `a.b` → `['a', 'b']`;
* `[*]` → `[true]`;
* `[*].a` → `[true, 'a']`;
* `[1:3]` → `[{start: 1, end: 3}]`;
* `[1,2,3]` → `[[1, 2, 3]]`;
