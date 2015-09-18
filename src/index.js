let oq = null;

function parse(query) {
    if (Array.isArray(query)) {
        return Object.assign([], query);
    }
    if (query.trim() == '') {
        return [];
    }

    let tokens = query.match(
        /([\w\d]+)|(\[\s*\d+:\d+\s*\])|(\[\s*\d+\s*\])|(\[\s*\*\s*\])|(\[[\s\d,]+\])/g
    );

    if (!tokens || !tokens.length) {
        return [];
    }

    return tokens
        .map((q) => {
            if (q[0] == '[' && q[q.length - 1] == ']') {
                let p = q.slice(1, -1);
                if (p.indexOf('*') > -1) {
                    return true;
                } else if (p.indexOf(',') > -1) {
                    return p.split(',').map((i) => parseInt(i, 10));
                } else if (p.indexOf(':') > -1) {
                    let r = p.split(':');
                    return {start: parseInt(r[0], 10), end: parseInt(r[1], 10)};
                } else {
                    return parseInt(q.slice(1, -1), 10);
                }
            } else {
                return q;
            }
        });
}

function format(query) {
    if (!Array.isArray(query)) {
        return query;
    }

    return query
        .reduce((acc, q) => {
            let res = '';
            if (typeof q == 'string') {
                let suffix = '.';
                if (acc === '') {
                    suffix = '';
                }
                res = suffix + q;
            } else if (q === true) {
                res =  '[*]';
            } else if (Array.isArray(q)) {
                res =  `[${q.join(',')}]`;
            } else if (typeof q == 'object' && Number.isInteger(q.start) && Number.isInteger(q.end)) {
                res =  `[${q.start}:${q.end}]`;
            } else if (Number.isInteger(q)) {
                res =  `[${q}]`;
            } else {
                throw new Error(`Wrong argument: ${JSON.stringify(q)}`);
            }
            return `${acc}${res}`;
        }, '');
}

function getKey(key, obj) {
    if (obj) {
        return obj[key];
    } else {
        return undefined;
    }
}

function getKeys(keys, obj) {
    if (obj) {
        return keys.map((key) => {
            return obj[key];
        });
    } else {
        return undefined;
    }
}

function getRange(range, obj) {
    if (Array.isArray(obj)) {
        return obj.slice(range.start || 0, range.end || Infinity);
    } else {
        return undefined;
    }
}

let cache = {};

function log(v) {
    console.log(JSON.stringify(v, null, 2));
}

function get(q) {
    let query = parse(q);
    let qs = format(query);

    if (!query.length) {
        return (obj) => obj;
    }

    if (!cache[qs]) {
        //console.log(Object.keys(cache));

        cache[qs] = [];

        for (let index in query) {
            if (!query.hasOwnProperty(index)) {
                continue;
            }
            let path = query[index];

            if (typeof path == 'string') {
                let f = (obj) => {
                    return getKey(path, obj);
                };
                cache[qs].push(f);
            } else if (path === true) {
                let getter = get(query.slice(index + 1));
                let f = (obj) => {
                    return getRange({}, obj).map((item) => {
                        return getter(item);
                    });
                };
                cache[qs].push(f);
                break;
            } else if (Array.isArray(path)) {
                let getter = get(query.slice(index + 1));
                let f = (obj) => {
                    return path.map((p) => {
                        return getter(obj[p]);
                    });
                };
                cache[qs].push(f);
                break;
            } else if (typeof path == 'object') {
                let getter = get(query.slice(index + 1));
                let f = (obj) => {
                    return getRange(path, obj).map((item) => {
                        return getter(item);
                    });
                };
                cache[qs].push(f);
                break;
            } else if (typeof path == 'number') {
                let f = (obj) => {
                    return getKey(path, obj);
                };
                cache[qs].push(f);
            }
        }
    }

    return (obj) => {
        return cache[qs].reduce((result, f) => {
            return f(result);
        }, obj);
    };
}

function set(q, value) {
    throw new Error('Not implemented yet');
}

oq = get;
oq._cache = cache;
oq.parse = parse;
oq.format= format;
oq.get = get;
oq.set = set;

export default oq;
