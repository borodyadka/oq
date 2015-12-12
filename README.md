# Deep object queries

```
npm install oq
```

General use case is getting same property from large amount of similar documents.
oq will be slow if you'll use lot of different queries because it need a time for compile fetching plan.
But if you want to select something like `a.b.c.d.e[*].f[1:3].g.h[1,2,3,4]` from thousands of documents — `oq` is better choice.

**WARNING** API for `oq.set()` has changed, setter now requires object as first parameter and value as second. Now there is no more `oq.clone()`, and new method `oq.patch()`. See docs for more information.

Usage
-----

```js
import oq from 'oq';

let users = [
    {id: 1, name: 'Frodo'},
    {id: 2, name: 'Samwise'},
    {id: 3, name: 'Peregrin'},
    {id: 4, name: 'Meriadoc'}
];

// get
let getter = oq.get('id');
console.log(users.map(getter)); // [1, 2, 3, 4]

// set
let setter = oq.set('[]'); // push new item
users = setter(users, {id: 5, name: 'Aragorn'});
console.log(users); // [hobbits..., {id: 5, name: 'Aragorn'}]

// functions also can be values
let bagginsfication = oq.set('[0].name');
users = bagginsfication(users, (name) => name + ' Baggins');
console.log(users[0].name); // "Frodo Baggins"
```

Get
---

```js
// iterate over all items in array
let getter = oq.get('[*]')

// iterate over 0, 1, and 5 items
let getter = oq.get('[0, 1, 5]')

// iterate over 0 to 5 (not inclusive) items
let getter = oq.get('[0:5]')

// get "a" property
let getter = oq.get('a')

// get "a.b.c" property
let getter = oq.get('a.b.c')

// get first 3 children of "a"
let getter = oq.get('a[0:3]')

// do your stuff with getter
let res = getter(myObj);
```

Set
---

```js
// set all items to value
let setter = oq.set('[*]')
// or
let setter = oq.set('[*]', myVal)

// set 0, 1 and 5 items to value
let setter = oq.set('[0, 1, 5]')

// set items from 0 to 5 (not inclusive)
let setter = oq.set('[0:5]')

// add new item to array
let setter = oq.set('[]')

// set a.b.c property
let setter = oq.set('a.b.c')

// do your stuff with setter
setter(myObj, myVal)
// or
setter(myObj) // if value already bound with set(query, value)
```

Note: setters in oq is extremely slow because it need to copy source object and return new. If you not worrying about modifying source object you should use `oq.patch()`, it has same API as `oq.set()`.


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
oq: 328ms
oq w/o precompiled getter: 1566ms
dref: 1957ms
json-query: 615ms
simple-objet-query: 473ms
object-path: 16933ms
=====SET=====
oq: 7214ms
oq w/o precompiled setter: 20566ms
oq.patch(): 150ms
dref: 1983ms
json-query: N/A
simple-objet-query: N/A
object-path: 13291ms
```
