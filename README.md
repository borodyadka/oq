# Deep object queries

```
npm install oq
```

General use case is getting same property from large amount of similar documents.
oq will be slow if you'll use lot of different queries because it need a time for compile fetching plan.
But if you want to select something like `a.b.c.d.e[*].f[1:3].g.h[1,2,3,4]` from thousands of documents — `oq` is better choice.

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

// get
var getter = oq.get('[*].id');
console.log(getter(users)); // [1, 2, 3, 4]

// set
var setter = oq.set('[]'); // push new item
users = setter({id: 5, name: 'Aragorn'}, users);
console.log(users); // [hobbits..., {id: 5, name: 'Aragorn'}]
```

Get
---

```js
// iterate over all items in array
oq.get('[*]')

// iterate over 0, 1, and 5 items
oq.get('[0, 1, 5]')

// iterate over 0 to 5 (not inclusive) items
oq.get('[0:5]')

// get "a" property
oq.get('a')

// get "a.b.c" property
oq.get('a.b.c')

// get first 3 children of "a"
oq.get('a[0:3]')
```

Set
---

```js
// set all items to value
oq.set('[*]')

// set 0, 1 and 5 items to value
oq.set('[0, 1, 5]')

// set items from 0 to 5 (not inclusive)
oq.set('[0:5]')

// add new item to array
oq.set('[]')

// set a.b.c property
oq.set('a.b.c')
```

Note: setters in oq is extremely slow because it need to copy source object and return new. If you not worrying about modifying source object you can speed up it with patching of `oq.clone` in runtime:

```js
import oq from 'oq';
oq.clone = (o) => o;

// do your stuff...
```

Query syntax
------------

You can pass an array for query like `[true, 'a', 1, [1, 2, 3]]` instead of string `"[*].a[1][1,2,3]"`;

Translation rules:

* `a` → `['a']`;
* `a.b` → `['a', 'b']`;
* `[*]` → `[true]`;
* `[*].a` → `[true, 'a']`;
* `[1:3]` → `[{start: 1, end: 3}]`;
* `[1,2,3]` → `[[1, 2, 3]]`;
* `[]` → `[{push: true}]`;

Use `oq.parse()` for parsing query string and `oq.format()` for convert query array to string.

Benchmarks
----------

Note: oq uses precompiled query. If you compile query on every iteration oq will be slowest one.

```
=====GET=====
oq: 144ms
oq w/o precompiled getter: 1833ms
dref: 1973ms
json-query: 633ms
simple-objet-query: 440ms
object-path: 19410ms
=====SET=====
oq: 8076ms
oq w/o precompiled setter: 22150ms
oq with runtime patch of oq.clone: 158ms
dref: 1939ms
json-query: N/A
simple-objet-query: N/A
object-path: 14654ms
```
