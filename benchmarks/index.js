import oq from '../src/index';
import dref from 'dref';
import jq from 'json-query';
import soq from 'simple-object-query';
import op from 'object-path';

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

console.log('=====SET=====');

(() => {
    let i = ITERATIONS;
    let start = Date.now();
    let setter = oq.set('a.b.c');

    while (i--) {
        setter(1, OBJECT);
    }

    let result = Date.now() - start;
    console.log(`oq: ${result}ms`);
})();

(() => {
    let i = ITERATIONS;
    let start = Date.now();

    while (i--) {
        oq.set('a.b.c')(1, OBJECT);
    }

    let result = Date.now() - start;
    console.log(`oq w/o precompiled setter: ${result}ms`);
})();

(() => {
    let i = ITERATIONS;
    let start = Date.now();
    oq.clone = (o) => o;
    let setter = oq.set('a.b.c');

    while (i--) {
        setter(1, OBJECT);
    }

    let result = Date.now() - start;
    console.log(`oq with runtime patch of oq.clone: ${result}ms`);
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
