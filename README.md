# Deep object queries

```
npm install oq
```

General use case is getting same property from large amount of similar documents.
oq will be slow if you'll use lot of different queries because it need a time for compile fetching plan.
But if you want to select something like `a.b.c.d.e[*].f[1:3].g.h[1,2,3,4]` from thousands of documents — `oq` is better choice.

**WARNING** API for `oq.set()` has changed, setter now requires object as first parameter and value as second. Now there is no more `oq.clone()`. Added new method `oq.patch()`. See docs for more information.

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
let bagginsfication = oq.set('name', (name) => name + ' Baggins');
users = bagginsfication(users[0]);
console.log(users[0].name); // "Frodo Baggins"
```

Get
---

```js
// get all items in array
let getter = oq.get('[*]');

// get 0, 1, and 5 items
let getter = oq.get('[0, 1, 5]');

// get 0 to 5 (not inclusive) items
let getter = oq.get('[0:5]');

// get "a" property
let getter = oq.get('a');

// get "a.b.c" property
let getter = oq.get('a.b.c');

// get first 3 children of "a"
let getter = oq.get('a[0:3]');

// do your stuff with getter
let res = getter(myObj);
```

Set
---

```js
// set all items to value
let setter = oq.set('[*]');
// or
let setter = oq.set('[*]', myVal);

// set 0, 1 and 5 items to value
let setter = oq.set('[0, 1, 5]');
// or
let setter = oq.set('[0, 1, 5]', myVal);

// set items from 0 to 5 (not inclusive)
let setter = oq.set('[0:5]');
// or
let setter = oq.set('[0:5]', myVal);

// add new item to array
let setter = oq.set('[]');
// or
let setter = oq.set('[]', myVal);

// set a.b.c property
let setter = oq.set('a.b.c');
// or
let setter = oq.set('a.b.c', myVal);

// do your stuff with setter
setter(myObj, myVal);
// or
setter(myObj); // if value already bound with set(query, value)
```

Note: `oq.set()` is extremely slow because it need to copy source object and return new. If you not worrying about modifying source object you can use `oq.patch()`, it has same API as `oq.set()` but no returns new object.


Query syntax
------------

* `a` — get/set `a` property from object;
* `a.b` — get/set `b` property from property `a` of object;
* `[*]` — get/set all items in array;
* `[*].a` — get/set `a` properties from all objects in array;
* `a[*]` — get/set all items from `a` property which should be an array;
* `[1:3]` — get/set items from 1 to 3 (not inclusive);
* `[1,2,3]` — get/set 1, 2 and 3 items in array;
* `[]` (only for setter) — push new item to array;


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

Get `a.b.c` property from object 1M times. On Intel(R) Core(TM) i7-3635QM CPU @ 2.40GHz.

```
=====GET=====
oq: 50ms
oq w/o precompiled getter: 418ms
dref: 1711ms
json-query: 607ms
simple-objet-query: 433ms
object-path: 16354ms
=====SET=====
oq: 7171ms
oq w/o precompiled setter: 17187ms
oq.patch(): 151ms
dref: 1881ms
json-query: N/A
simple-objet-query: N/A
object-path: 12852ms
```
