'use strict';

function getTestHelpers(expect) {
    function dfs(root, cb) {
        if (Array.isArray(root)) {
            for (const value of root) {
                cb(value);
            }
        } else {
            for (const key in root) {
                dfs(root[key], cb);
            }
        }
    }

    function shouldReturnErrors(schema, values, options = {}) {
        const expectedType = options.type,
            root = options.root || 'root',
            expectedPath = options.path || root;

        const errors = values
            .map(val => {
                const errorsArray = [];
                dfs(schema.validate(val, root).errors, err => errorsArray.push(err));
                expect(errorsArray.length).to.equal(1);
                const [err] = errorsArray;

                expect(err.path).to.equal(expectedPath);
                expect(err.type).to.equal(expectedType);

                return err;
            });

        return errors;
    }

    function shouldNotReturnErrors(schema, values, options = {}) {
        values.forEach(val => {
            const errorsArray = [];
            //dfs(schema.validate(val, 'root').errors, err => errorsArray.push(err));

            expect(schema.validate(val).errorsCount).to.equal(0);
        });
    }

    return {
        shouldReturnErrors,
        shouldNotReturnErrors,
        forEachErrors: dfs
    };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = getTestHelpers;
}