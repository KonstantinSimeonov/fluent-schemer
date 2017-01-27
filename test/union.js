'use strict';

const { expect } = require('chai'),
    { shouldReturnErrors, shouldNotReturnErrors } = require('../helpers/test-templates'),
    { union, string, number, bool, object, array } = require('../fluent-validator')().schemas,
    ERROR_TYPES = require('../fluent-validator/errors').ERROR_TYPES;

describe('UnionSchema individual methods', () => {
    it('UnionSchema.type: should return concatenation of all possible types', () => {
        const schema = union(number(), string(), bool());

        expect(schema.type).to.equal([number().type, string().type, bool().type].join('|'));
    });

    it('UnionSchema.validateType(): should return false for values that are not of one of the listed types', () => {
        const schema = union(string(), number()).required(),
            values = [null, undefined, true, {}, [], () => 1];

        for(const v of values) {
            expect(schema.validateType(v)).to.equal(false);
        }
    });

    it('UnionSchema.validateType(): should return true for values that are of at least one of the listed types', () => {
        const schema = union(number(), bool()).required(),
            values = [1, true, false, 0, new Number(10), new Boolean(true)];

        const allAreTrue = values.every(v => schema.validateType(v));

        expect(allAreTrue).to.equal(true);
    });
});