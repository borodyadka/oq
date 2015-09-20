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

var getter = oq.get('[*].id');

console.log(getter(users)); // [1, 2, 3, 4]
```

Query syntax
------------

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

You can pass an array for query like `[true, 'a', 1, [1, 2, 3]]` instead of string `"[*].a[1][1,2,3]"`;

Translation rules:

* `a` → `['a']`;
* `a.b` → `['a', 'b']`;
* `[*]` → `[true]`;
* `[*].a` → `[true, 'a']`;
* `[1:3]` → `[{start: 1, end: 3}]`;
* `[1,2,3]` → `[[1, 2, 3]]`;

Benchmarks
----------

Note: oq uses precompiled and cached query. If you disable cache and compile query on every iteration oq will be slowest one.

```
oq: 282
dref: 1944
json-query: 320
simple-object-query: 521
```
