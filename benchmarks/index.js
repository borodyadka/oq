import oq from '../src/index';
import dref from 'dref';
import jq from 'json-query';
import soq from 'simple-object-query';
import op from 'object-path';
import R from 'ramda';

const ITERATIONS = 1000000;

const OBJECT = {
    a: {
        b: {
            c: ITERATIONS
        }
    }
};

console.log('=====GET=====');

(() => {
    let i = ITERATIONS;
    let start = Date.now();
    let getter = oq.get('a.b.c');

    while (i--) {
        getter(OBJECT);
    }

    let result = Date.now() - start;
    console.log(`oq: ${result}ms`);
})();

(() => {
    let i = ITERATIONS;
    let start = Date.now();

    while (i--) {
        oq.get('a.b.c')(OBJECT);
    }

    let result = Date.now() - start;
    console.log(`oq w/o precompiled getter: ${result}ms`);
})();

(() => {
    let i = ITERATIONS;
    let start = Date.now();

    while (i--) {
        dref.get(OBJECT, 'a.b.c');
    }

    let result = Date.now() - start;
    console.log(`dref: ${result}ms`);
})();

(() => {
    let i = ITERATIONS;
    let start = Date.now();

    while (i--) {
        jq('a.b.c', {data: OBJECT});
    }

    let result = Date.now() - start;
    console.log(`json-query: ${result}ms`);
})();

(() => {
    let i = ITERATIONS;
    let start = Date.now();

    while (i--) {
        soq.get(OBJECT, 'a.b.c');
    }

    let result = Date.now() - start;
    console.log(`simple-objet-query: ${result}ms`);
})();

(() => {
    let i = ITERATIONS;
    let start = Date.now();

    while (i--) {
        op.get(OBJECT, 'a.b.c');
    }

    let result = Date.now() - start;
    console.log(`object-path: ${result}ms`);
})();

(() => {
    let i = ITERATIONS;
    let start = Date.now();

    while (i--) {
        R.path(['a', 'b', 'c'], OBJECT);
    }

    let result = Date.now() - start;
    console.log(`ramda.path: ${result}ms`);
})();

console.log('=====SET=====');

(() => {
    let i = ITERATIONS;
    let start = Date.now();
    let setter = oq.set('a.b.c');

    while (i--) {
        setter(OBJECT, 1);
    }

    let result = Date.now() - start;
    console.log(`oq: ${result}ms`);
})();

(() => {
    let i = ITERATIONS;
    let start = Date.now();

    while (i--) {
        oq.set('a.b.c')(OBJECT, 1);
    }

    let result = Date.now() - start;
    console.log(`oq w/o precompiled setter: ${result}ms`);
})();

(() => {
    let i = ITERATIONS;
    let start = Date.now();
    let setter = oq.patch('a.b.c');

    while (i--) {
        setter(OBJECT, 1);
    }

    let result = Date.now() - start;
    console.log(`oq.patch(): ${result}ms`);
})();

(() => {
    let i = ITERATIONS;
    let start = Date.now();

    while (i--) {
        dref.set(OBJECT, 'a.b.c', 1);
    }

    let result = Date.now() - start;
    console.log(`dref: ${result}ms`);
})();

(() => {
    console.log(`json-query: N/A`);
})();

(() => {
    console.log(`simple-objet-query: N/A`);
})();

(() => {
    let i = ITERATIONS;
    let start = Date.now();

    while (i--) {
        op.set(OBJECT, 'a.b.c');
    }

    let result = Date.now() - start;
    console.log(`object-path: ${result}ms`);
})();

console.log('=====OQ METHODS: GET=====');

const OBJECT2 = {
    a: {
        b: {
            c: ITERATIONS
        },
        d: [{e: 1}, {e: 2}, {e: 3}, {e: 4}, {e: 5}]
    }
};

(() => {
    let i = ITERATIONS;
    let start = Date.now();
    let getter = oq.get('a.b.c');

    while (i--) {
        getter(OBJECT2);
    }

    let result = Date.now() - start;
    console.log(`oq.get('a.b.c'): ${result}ms`);
})();

(() => {
    let i = ITERATIONS;
    let start = Date.now();
    let getter = oq.get('a.d[*]');

    while (i--) {
        getter(OBJECT2);
    }

    let result = Date.now() - start;
    console.log(`oq.get('a.d[*]'): ${result}ms`);
})();

(() => {
    let i = ITERATIONS;
    let start = Date.now();
    let getter = oq.get('a.d[*].e');

    while (i--) {
        getter(OBJECT2);
    }

    let result = Date.now() - start;
    console.log(`oq.get('a.d[*].e'): ${result}ms`);
})();

(() => {
    let i = ITERATIONS;
    let start = Date.now();
    let getter = oq.get('a.d[0:3].e');

    while (i--) {
        getter(OBJECT2);
    }

    let result = Date.now() - start;
    console.log(`oq.get('a.d[0:3].e'): ${result}ms`);
})();

(() => {
    let i = ITERATIONS;
    let start = Date.now();
    let getter = oq.get('a.d[0, 2, 3].e');

    while (i--) {
        getter(OBJECT2);
    }

    let result = Date.now() - start;
    console.log(`oq.get('a.d[0, 2, 3].e'): ${result}ms`);
})();
