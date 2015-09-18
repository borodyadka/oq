import oq from '../src/index';
import dref from 'dref';
import jq from 'json-query';
import soq from 'simple-object-query';

const ITERATIONS = 1000000;

let results = {
    oq: {},
    dref: {},
    jq: {},
    soq: {}
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

})();

(() => {
    let i = ITERATIONS;
    let start = Date.now();

    while (i--) {
        dref.get(OBJECT, 'a.b.c');
    }

    results.dref.get = Date.now() - start;
})();

(() => {
    let i = ITERATIONS;
    let start = Date.now();

    while (i--) {
        jq('a.b.c', OBJECT);
    }

    results.jq.get = Date.now() - start;
})();

(() => {
    let i = ITERATIONS;
    let start = Date.now();

    while (i--) {
        soq.get(OBJECT, 'a.b.c');
    }

    results.soq.get = Date.now() - start;
})();

console.log(`oq: ${results.oq.get}`);
console.log(`dref: ${results.dref.get}`);
console.log(`json-query: ${results.jq.get}`);
console.log(`simple-object-query: ${results.soq.get}`);
