function parse(query) {
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

function oq(query) {
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

export default oq;
