'use strict';

const { expect } = require('chai');

function shouldReturnErrors(schema, values, options = {}) {
    const expectedType = options.type,
        root = options.root || 'root',
        expectedPath = options.path || root;

    const errors = values
        .map(val => {
            const errorsArray = schema.validate(val, root);
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
        const errorsArray = schema.validate(val, 'root');

        expect(errorsArray.length).to.equal(0);
    });
}

module.exports = {
    shouldReturnErrors,
    shouldNotReturnErrors
}