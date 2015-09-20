import oq from '../src/index';
import dref from 'dref';
import jq from 'json-query';
import soq from 'simple-object-query';
import op from 'object-path';

const ITERATIONS = 1000000;

let results = {
    oq: {},
    oq2: {},
    dref: {},
    jq: {},
    soq: {},
    op: {}
};

const OBJECT = {
    a: {
        b: {
            c: ITERATIONS
        }
    }
};

(() => {
    let i = ITERATIONS;
    let start = Date.now();
    let getter = oq.get('a.b.c');

    while (i--) {
        getter(OBJECT);
    }
    results.oq.get = Date.now() - start;
    console.log('Finished oq');
})();

(() => {
    let i = ITERATIONS;
    let start = Date.now();

    while (i--) {
        oq.get('a.b.c')(OBJECT);
    }
    results.oq2.get = Date.now() - start;
    console.log('Finished oq w/o precompiled getter');
})();

(() => {
    let i = ITERATIONS;
    let start = Date.now();

    while (i--) {
        dref.get(OBJECT, 'a.b.c');
    }

    results.dref.get = Date.now() - start;
    console.log('Finished dref');
})();

(() => {
    let i = ITERATIONS;
    let start = Date.now();

    while (i--) {
        jq('a.b.c', {data: OBJECT});
    }

    results.jq.get = Date.now() - start;
    console.log('Finished json-query');
})();

(() => {
    let i = ITERATIONS;
    let start = Date.now();

    while (i--) {
        soq.get(OBJECT, 'a.b.c');
    }

    results.soq.get = Date.now() - start;
    console.log('Finished simple-objet-query');
})();

(() => {
    let i = ITERATIONS;
    let start = Date.now();

    while (i--) {
        op.get(OBJECT, 'a.b.c');
    }

    results.op.get = Date.now() - start;
    console.log('Finished object-path');
})();

console.log(`oq: ${results.oq.get}`);
console.log(`oq w/o precompiled getter: ${results.oq2.get}`);
console.log(`dref: ${results.dref.get}`);
console.log(`json-query: ${results.jq.get}`);
console.log(`simple-object-query: ${results.soq.get}`);
console.log(`object-path: ${results.op.get}`);
