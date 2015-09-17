import assert from 'assert';
import oq from '../src/index';

describe('oq.format()', () => {
    [
        [
            'a',
            'a'
        ],
        [
            ['a'],
            'a'
        ],
        [
            [[0, 2]],
            '[0,2]'
        ],
        [
            [{start: 0, end: 2}],
            '[0:2]'
        ],
        [
            [1],
            '[1]'
        ],
        [
            [1, 2],
            '[1][2]'
        ],
        [
            ['a', 'b', {start: 0, end: 2}, 1, 2, [1, 2, 3]],
            'a.b[0:2][1][2][1,2,3]'
        ]
    ].forEach((test) => {
            let [query, expected] = test;

            it(`returns "${expected}" for query ${JSON.stringify(query)}`, () => {
                assert.strictEqual(oq.format(query), expected);
            });
        });
});

describe('oq.parse()', () => {
    [
        [
            ['a'],
            ['a']
        ],
        [
            'a',
            ['a']
        ],
        [
            '[0,2]',
            [[0, 2]]
        ],
        [
            '[0:2]',
            [{start: 0, end: 2}]
        ],
        [
            '[1]',
            [1]
        ],
        [
            '[1][2]',
            [1, 2]
        ],
        [
            'a.b[0:2][1][2][1,2,3]',
            ['a', 'b', {start: 0, end: 2}, 1, 2, [1, 2, 3]]
        ]
    ].forEach((test) => {
            let [query, expected] = test;

            it(`returns ${JSON.stringify(expected)} for query "${query}"`, () => {
                assert.deepEqual(oq.parse(query), expected);
            });
        });
});

describe('oq.get()', () => {
    const ARRAY_OF_SCALARS = [1, 2, 3, 4, 5, 6];
    const ARRAY_OF_OBJECTS = [
        {a: 1, b: {c: 1}, d: [null, {e: 1, f: [{g: 1, h: [1, 2, 3, 4]}]}]},
        {a: 2, b: {c: 2}, d: [null, {e: 2, f: [{g: 2, h: [2, 3, 4, 5]}]}]},
        {a: 3, b: {c: 3}, d: [null, {e: 3, f: [{g: 3, h: [3, 4, 5, 6]}]}]}
    ];
    const OBJECT = {
        a: 1,
        b: {
            c: 1
        }
    };

    it('oq === oq.get', () => {
        assert.strictEqual(oq, oq.get);
    });

    it('returns a function', () => {
        let o = oq('test');
        assert.strictEqual(typeof o, 'function');
    });

    describe('run query', () => {
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
                [[0, 1, 2]],
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
                [true],
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
                ARRAY_OF_SCALARS,
                [{start: 0, end: 3}],
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
                [true, 'a'],
                [1, 2, 3]
            ],
            [
                ARRAY_OF_OBJECTS,
                '[*].aa',
                [undefined, undefined, undefined]
            ],
            [
                ARRAY_OF_OBJECTS,
                [true, 'aa'],
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
                [true, 'b', 'c'],
                [
                    1, 2, 3
                ]
            ],
            [
                ARRAY_OF_OBJECTS,
                '[*].d[1].f[0].h',
                [
                    [1, 2, 3, 4],
                    [2, 3, 4, 5],
                    [3, 4, 5, 6]
                ]
            ],
            [
                ARRAY_OF_OBJECTS,
                [true, 'd', 1, 'f', 0, 'h'],
                [
                    [1, 2, 3, 4],
                    [2, 3, 4, 5],
                    [3, 4, 5, 6]
                ]
            ],
            [
                ARRAY_OF_OBJECTS,
                '[*].d[1].f[0].h[0]',
                [
                    1, 2, 3
                ]
            ],
            [
                ARRAY_OF_OBJECTS,
                [true, 'd', 1, 'f', 0, 'h', 0],
                [
                    1, 2, 3
                ]
            ],
            [
                ARRAY_OF_OBJECTS,
                '[*].d[1].f[0].h[*]',
                [
                    [1, 2, 3, 4],
                    [2, 3, 4, 5],
                    [3, 4, 5, 6]
                ]
            ],
            [
                ARRAY_OF_OBJECTS,
                [true, 'd', 1, 'f', 0, 'h', true],
                [
                    [1, 2, 3, 4],
                    [2, 3, 4, 5],
                    [3, 4, 5, 6]
                ]
            ],
            [
                ARRAY_OF_OBJECTS,
                '[*].d[1].f[0].h[0, 2]',
                [
                    [1, 3],
                    [2, 4],
                    [3, 5]
                ]
            ],
            [
                ARRAY_OF_OBJECTS,
                [true, 'd', 1, 'f', 0, 'h', [0, 2]],
                [
                    [1, 3],
                    [2, 4],
                    [3, 5]
                ]
            ],
            [
                ARRAY_OF_OBJECTS,
                '[*].d[1].f[0].h[0:3]',
                [
                    [1, 2, 3],
                    [2, 3, 4],
                    [3, 4, 5]
                ]
            ],
            [
                ARRAY_OF_OBJECTS,
                [true, 'd', 1, 'f', 0, 'h', {start: 0, end: 3}],
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
                ['a'],
                1
            ],
            [
                OBJECT,
                'b.c',
                1
            ],
            [
                OBJECT,
                ['b', 'c'],
                1
            ]
        ].forEach((test) => {
                let [data, query, expected] = test;

                it(`returns correct result for ${(typeof query == 'string' ? '"' + query + '"': JSON.stringify(query))}`, () => {
                    let o = oq.get(query);

                    assert.deepEqual(o(data), expected);
                });
            });
    });
});
