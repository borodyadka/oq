function parse(query) {
    if (Array.isArray(query)) {
        return Object.assign([], query);
    }
    if (query.trim() == '') {
        return [];
    }

    let tokens = query.match(
        /([\w\d]+)|(\[\s*\d+:\d+\s*\])|(\[\s*\d+\s*\])|(\[\s*\*\s*\])|(\[[\s\d,]+\])|(\[\s*\])/g
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
                } else if (p.match(/\d/)) {
                    return parseInt(q.slice(1, -1), 10);
                } else if (p.trim() === '') {
                    return {push: true};
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
            } else if (typeof q == 'object' && q.push === true) {
                res =  '[]';
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

function cloneObject(obj) {
    if (Array.isArray(obj)) {
        return Object.assign([], obj);
    } else {
        return Object.assign({}, obj);
    }
}

function noClone(o) {
    return o;
}

function get(q) {
    let query = parse(q);

    if (!query.length) {
        return (obj) => obj;
    }

    let walk = [];
    let ql = query.length;
    for (let index = 0; index < ql; index++) {
        let path = query[index];

        if (typeof path == 'string') {
            let f = (obj) => {
                return getKey(path, obj);
            };
            walk.push(f);
        } else if (path === true) {
            let getter = get(query.slice(index + 1));
            let f = (obj) => {
                if (!Array.isArray(obj)) {
                    return undefined;
                }
                return obj.map((item) => {
                    return getter(item);
                });
            };
            walk.push(f);
            break;
        } else if (Array.isArray(path)) {
            let getter = get(query.slice(index + 1));
            let f = (obj) => {
                return path.map((p) => {
                    return getter(obj[p]);
                });
            };
            walk.push(f);
            break;
        } else if (typeof path == 'object') {
            let getter = get(query.slice(index + 1));
            let f = (obj) => {
                return getRange(path, obj).map((item) => {
                    return getter(item);
                });
            };
            walk.push(f);
            break;
        } else if (typeof path == 'number') {
            let f = (obj) => {
                return getKey(path, obj);
            };
            walk.push(f);
        }
    }

    return (obj) => {
        return walk.reduce((result, f) => f(result), obj);
    };
}

function set(q, defval, cloneFn) {
    let query = parse(q);
    let clone = cloneFn || cloneObject;

    if (!query.length) {
        return (o, v) => (typeof v == 'function' ? v(o) : v);
    }

    let path = query[0];
    let f;

    if (typeof path == 'string') {
        let setter = set(query.slice(1), defval, clone);
        f = (obj, val) => {
            let o = clone(obj) || {};
            o[path] = setter(typeof obj == 'undefined' ? {} : obj[path], val);
            return o;
        };
    } else if (path === true) {
        let setter = set(query.slice(1), defval, clone);
        f = (obj, val) => {
            if (Array.isArray(obj)) {
                return obj.map((item) => setter(item, val));
            }
            return obj;
        };
    } else if (Array.isArray(path)) {
        let setter = set(query.slice(1), defval, clone);
        f = (obj, val) => {
            let o = clone(obj);
            path.forEach((p) => {
                o[p] = setter(o[p], val);
            });
            return o;
        };
    } else if (typeof path == 'object') {
        if (path.start !== undefined && path.end !== undefined) {
            let setter = set(query.slice(1), defval, clone);
            f = (obj, val) => {
                let o = clone(obj);
                if (Array.isArray(obj)) {
                    return o.slice(path.start, path.end).map((item) => {
                        return setter(item, val);
                    });
                } else {
                    return o;
                }
            };
        } else if (path.push === true) {
            let setter = set(query.slice(1), defval, clone);
            f = (obj, val) => {
                let o = clone(obj);
                if (Array.isArray(obj)) {
                    o.push(setter({}, val));
                }
                return o;
            };
        } else {
            throw new Error(`Unknown query: ${JSON.stringify(path)}`);
        }
    } else if (typeof path == 'number') {
        let setter = set(query.slice(1), defval, clone);
        f = (obj, val) => {
            let o = [];
            if (typeof obj != 'undefined') {
                o = clone(obj);
            }
            o[path] = setter(typeof obj == 'undefined' ? [] : obj[path], val);
            return o;
        };
    }

    if (typeof defval !== 'undefined') {
        return (obj) => {
            let val = typeof defval == 'function' ? defval : () => defval;
            let o = clone(obj);

            return f(o, val);
        }
    } else {
        return (obj, v) => {
            let val = typeof v == 'function' ? v : () => v;
            let o = clone(obj);

            return f(o, val);
        }
    }
}

function patch(q, defval) {
    return set(q, defval, noClone);
}

function oq(key, value) {
    if (typeof value == 'undefined') {
        return get(key);
    } else {
        return set(key, value);
    }
}

oq.parse = parse;
oq.format= format;
oq.get = get;
oq.set = set;
oq.patch = patch;

export default oq;
