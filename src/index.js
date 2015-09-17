function parse(query) {
    if (Array.isArray(query)) {
        return query;
    }
    if (query.trim() == '') {
        return [];
    }
    return query
        .match(
            /([\w\d]+)|(\[\s*\d+:\d+\s*\])|(\[\s*\d+\s*\])|(\[\s*\*\s*\])|(\[[\s\d,]+\])/g
        )
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

function get(query) {
    let q = parse(query);

    function pick(depth, obj) {
        let path = q[depth];

        if (typeof obj == 'undefined' || typeof path == 'undefined') {
            return obj;
        }

        if (typeof path === 'string') {
            if (typeof obj[path] != 'undefined') {
                if (typeof obj[path] == 'object') {
                    return pick(depth + 1, obj[path]);
                } else {
                    return obj[path];
                }
            } else {
                return obj[path];
            }
        } else if (path === true) {
            return obj.map((o) => pick(depth + 1, o));
        } else if (Array.isArray(path)) {
            return path
                .map((key) => obj[key])
                .map((o) => pick(depth + 1, o));
        } else if (typeof path == 'object') {
            return obj
                .slice(path.start, path.end || 0)
                .map((o) => pick(depth + 1, o));
        } else if (typeof path == 'number') {
            return pick(depth + 1, obj[path]);
        } else {
            return obj;
        }
    }

    return function (obj) {
        return pick(0, obj);
    }
}

function set(query, value) {
    let q = parse(query);


    function put(depth, obj, v) {
        let path = q[depth];

        if (typeof obj == 'undefined' || typeof path == 'undefined') {
            return obj;
        }

        if (typeof path === 'string') {
            if (typeof obj[path] != 'undefined') {
                if (typeof obj[path] == 'object') {
                    return put(depth + 1, obj[path], v);
                } else {
                    return obj[path];
                }
            } else {
                return obj[path];
            }
        } else if (path === true) {
            return obj.map((o) => put(depth + 1, o, v));
        } else if (Array.isArray(path)) {
            return path
                .map((key) => obj[key])
                .map((o) => put(depth + 1, o, v));
        } else if (typeof path == 'object') {
            return obj
                .slice(path.start, path.end || 0)
                .map((o) => put(depth + 1, o, v));
        } else if (typeof path == 'number') {
            return put(depth + 1, obj[path], v);
        } else {
            return obj;
        }
    }

    return function (obj) {
        let v = typeof value == 'function' ? value : () => value;
        put(0, obj, v);
    }
}

let oq = get;
oq.parse = parse;
oq.format= format;
oq.get = get;

export default oq;
