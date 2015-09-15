import assert from 'assert';
import oq from '../src/index';

describe('oq()', () => {
    const ARRAY_OF_SCALARS = [1, 2, 3, 4, 5, 6];
    const ARRAY_OF_OBJECTS = [
        {a: 1, b: {c: 1}, d: [{e: 1, f: [{g: 1, h: [1, 2, 3, 4]}]}]},
        {a: 2, b: {c: 2}, d: [{e: 2, f: [{g: 2, h: [2, 3, 4, 5]}]}]},
        {a: 3, b: {c: 3}, d: [{e: 3, f: [{g: 3, h: [3, 4, 5, 6]}]}]}
    ];
    const OBJECT = {
        a: 1,
        b: {
            c: 1
        }
    };

    it('returns a function', () => {
        let o = oq('test');
        assert.strictEqual(typeof o, 'function');
    });

    describe('compiled query', () => {
        [
            [
                ARRAY_OF_SCALARS,
                '[0, 1, 2]',
                [
                    1, 2, 3
                ]
            ],
            [
                ARRAY_OF_SCALARS,
                '[*]',
                [
                    1, 2, 3, 4, 5, 6
                ]
            ],
            [
                ARRAY_OF_SCALARS,
                '[0:3]',
                [
                    1, 2, 3
                ]
            ],
            [
                ARRAY_OF_OBJECTS,
                '[*].a',
                [1, 2, 3]
            ],
            [
                ARRAY_OF_OBJECTS,
                '[*].aa',
                [undefined, undefined, undefined]
            ],
            [
                ARRAY_OF_OBJECTS,
                '[*].b.c',
                [
                    1, 2, 3
                ]
            ],
            [
                ARRAY_OF_OBJECTS,
                '[*].d[0].f[0].h',
                [
                    [1, 2, 3, 4],
                    [2, 3, 4, 5],
                    [3, 4, 5, 6]
                ]
            ],
            [
                ARRAY_OF_OBJECTS,
                '[*].d[0].f[0].h[0]',
                [
                    1, 2, 3
                ]
            ],
            [
                ARRAY_OF_OBJECTS,
                '[*].d[0].f[0].h[*]',
                [
                    [1, 2, 3, 4],
                    [2, 3, 4, 5],
                    [3, 4, 5, 6]
                ]
            ],
            [
                ARRAY_OF_OBJECTS,
                '[*].d[0].f[0].h[0, 2]',
                [
                    [1, 3],
                    [2, 4],
                    [3, 5]
                ]
            ],
            [
                ARRAY_OF_OBJECTS,
                '[*].d[0].f[0].h[0:3]',
                [
                    [1, 2, 3],
                    [2, 3, 4],
                    [3, 4, 5]
                ]
            ],
            [
                OBJECT,
                'a',
                1
            ],
            [
                OBJECT,
                'b.c',
                1
            ]
        ].forEach((test) => {
                let [data, query, expected] = test;

                it(`returns correct result for "${query}"`, () => {
                    let o = oq(query);

                    assert.deepEqual(o(data), expected);
                });
            });
    });
});
