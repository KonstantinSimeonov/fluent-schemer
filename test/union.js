'use strict';

const { expect } = require('chai'),
    { shouldReturnErrors, shouldNotReturnErrors } = require('../helpers/test-templates'),
    { union, string, number, bool, object, array } = require('../dist/fluent-schemer').createInstance().schemas,
    { ERROR_TYPES } = require('../dist/fluent-schemer').errorsFactory;

describe('UnionSchema individual methods', () => {
    it('UnionSchema.type: should return concatenation of all possible types', () => {
        const schema = union(number(), string(), bool());

        expect(schema.type).to.equal([number().type, string().type, bool().type].join('|'));
    });

    it('UnionSchema.validateType(): should return false for values that are not of one of the listed types', () => {
        const schema = union(string(), number()).required(),
            values = [null, undefined, true, {}, [], () => 1];

        for (const v of values) {
            expect(schema.validateType(v)).to.equal(false);
        }
    });

    it('UnionSchema.validateType(): should return true for values that are of at least one of the listed types', () => {
        const schema = union(number(), bool()).required(),
            values = [1, true, false, 0, new Number(10), new Boolean(true)];

        const allAreTrue = values.every(v => schema.validateType(v));

        expect(allAreTrue).to.equal(true);
    });

    it('UnionSchema.required(): .validate() should not return errors when no type of the union matches when .required() has not been called', () => {
        const schema = union(number(), bool()),
            notNumbersOrBools = [NaN, Infinity, {}, [], () => true, null, undefined];

        shouldNotReturnErrors(schema, notNumbersOrBools);
    });

    it('UnionSchema.required(): .validate() should return errors when .required() been called', () => {
        const schema = union(number(), bool()).required(),
            notNumbersOrBools = [NaN, Infinity, {}, [], () => true, null, undefined];

        shouldReturnErrors(schema, notNumbersOrBools, { type: ERROR_TYPES.TYPE });
    });

    it('UnionSchema.validate(): should not return errors when at least one of the schema types match the value', () => {
        const schema = union(string(), array(number().integer())).required(),
            values = ['zdrkp', new String('jesuisstring'), [], [1, 2], [new Number(0), 3], new Array()];

        shouldNotReturnErrors(schema, values);
    });

    it('UnionSchema.validate(): should return errors when the values satisfies the conditions of no schema', () => {
        const schema = union(string().minlength(5), number().integer()).required(),
            // expected errors are of type range error for too short strings and argument errors for floating point numbers
            shortStrings = ['js', '', new String('1')],
            floats =  [1.5, -0.5, new Number(2.5)];

            shouldReturnErrors(schema, shortStrings, { type: ERROR_TYPES.RANGE });
            shouldReturnErrors(schema, floats, { type: ERROR_TYPES.ARGUMENT });
    });
});