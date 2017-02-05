'use strict';

const obj = {
    name: ['pesho', 'gosho'],
    nested: {
        value: [1, 2, 3],
        other: [3, 2, 5]
    }
};

function dfs(root, cb) {
    for(const key in root) {
        if(Object.prototype.toString.call(root[key]) === '[object Object]') {
            dfs(root[key], cb);
        } else {
            cb(key, root[key]);
        }
    } 
}

function * dfsGen(root) {
    for(const key in root) {
         if(Object.prototype.toString.call(root[key]) === '[object Object]') {
            for(const kvp of dfsGen(root[key])) {
                yield kvp;
            }
        } else {
            yield { key, value: root[key] };
        }
    }
}

// dfs(obj, (key, value) => console.log(key, value));

for(const kvp of dfsGen(obj)) {
    console.log(kvp);
}