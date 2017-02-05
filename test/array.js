'use strict';

const { expect } = require('chai'),
    { shouldReturnErrors, shouldNotReturnErrors } = require('../helpers/test-templates'),
    { array, string, number, bool, object } = require('../lib')().schemas,
    { ERROR_TYPES } = require('../lib/errors');

describe('ArraySchema individual methods', () => {
    it('ArraySchema.type: should return correct types for typed arrays', () => {
        const schemas = [string(), number(), bool(), object()],
            arraySchemas = schemas.map(array);

        for (let i = 0; i < arraySchemas.length; i += 1) {
            expect(arraySchemas[i].type).to.equal(`array<${schemas[i].type}>`);
        }
    });

    it('ArraySchema.type: should return array<any> for untyped array', () => {
        expect(array().type).to.equal('array<any>');
    });

    it('ArraySchema.validateType(): should true for untyped array with values of multiple types', () => {
        const schema = array(),
            values = [[1, 2, 3], ['adf', true, {}], [null, undefined, []]];

        const allValid = values.every(untyped => schema.validateType(untyped));

        expect(allValid).to.equal(true);
    });

    it('ArraySchema.validateType(): should return true for empty array', () => {
        expect(array(bool()).validateType([])).to.equal(true);
    });

    it('ArraySchema.validateType(): should return true for arrays with values of correct type', () => {
        expect(array(string()).validateType(['a', 'spica', 'huffman', 'beer', new String('fire')])).to.equal(true);
        expect(array(bool()).validateType([true, false, new Boolean(true)])).to.equal(true);
        expect(array(number()).validateType([1, 2, 3, 4, 10, -20, new Number(10), new Number(0)])).to.equal(true);
        expect(array(object()).validateType([{}])).to.equal(true);
    });

    it('ArraySchema.validateType(): should return false for arrays with values of incorrect types', () => {
        const invalidStrings = [null, 1, NaN, {}, [], () => 1, true, undefined];
        for (const invalidStr of invalidStrings) {
            expect(array(string()).validateType([invalidStr])).to.equal(false);
        }

        const invalidBools = [null, undefined, 1, 0, '', 'sdf', {}, [], () => true];
        for (const invalidB of invalidBools) {
            expect(array(bool()).validateType([invalidB])).to.equal(false);
        }

        const invalidNumber = [null, undefined, NaN, Infinity, '', '10', [], {}, () => 10, false];
        for (const invalidNum of invalidNumber) {
            expect(array(number()).validateType([invalidNum])).to.equal(false);
        }

        const invalidObjects = [1, 2, [], () => { }, 'dsf', true];
        for (const invalidObj of invalidObjects) {
            expect(array(object()).validateType([invalidObj])).to.equal(false);
        }
    });

    it('ArraySchema.required(): .validate() should return error when array is not present', () => {
        const schema = array(string()).required(),
            notArrays = [1, 2, 0, {}, { length: 1 }, () => 1, 'dsfsdf'];

        shouldReturnErrors(schema, notArrays, { type: ERROR_TYPES.TYPE });
    });

    it('ArraySchema.required(): .validate() should not return errors when array is present and has values of correct type', () => {
        const schema = array(number()),
            numberArrays = [[1, 2, 0, 10], [new Number(10), 5, new Number(0)]];

        shouldNotReturnErrors(schema, numberArrays[0]);
        shouldNotReturnErrors(schema, numberArrays[1]);
    });

    it('ArraySchema.minlength(): .validate() should return range error with too short arrays', () => {
        const schema = array().minlength(5),
            values = [[], ['a', 'tedi'], ['steven', 'kon', 'beer', 'coding'], ['kyci the mermaid']];

        shouldReturnErrors(schema, values, { type: ERROR_TYPES.RANGE });
    });

    it('ArraySchema.maxlength(): .validate() should return range error for too long arrays', () => {
        const schema = array().maxlength(2),
            values = [[1, 2, 3], ['sdgfds', 'sdgfdg', 'errere', null], [true, false, true, false, true], [[], [], []]];

        shouldReturnErrors(schema, values, { type: ERROR_TYPES.RANGE });
    });

    it('ArraySchema.validate(): should return error for first invalid value only', () => {
        const schema = array(number().integer()).required(),
            values = [1, 2, 0, new Number(5), new Number(1.10), new Number(2.5)];

        const { errors } = schema.validate(values, 'nums');
        expect(errors.length).to.equal(1);

        const [err] = errors;

        expect(err.path).to.equal('nums[4]');
        expect(err.type).to.equal(ERROR_TYPES.ARGUMENT);
    });
});

describe('ArraySchema method combinations', () => {
    it('All methods should enable chaining', () => {
        const schema = array(number()).minlength(5).maxlength(10).required().predicate(x => true);

        expect(schema.validate).to.be.a('function');
    });
});

describe('ArraySchema nesting', () => {
    it('Should return errors when nested schema doesnt match values', () => {
        const schema = array(array()).required(),
            values = [[1, 2], ['dfdf'], [{ length: 1 }]];

        shouldReturnErrors(schema, values, { type: ERROR_TYPES.TYPE });
    });

    it('Should return errors for multiple levels of nesting', () => {
        const schema = array(array(array(number()))).required(),
            values = [
                [[['asadd', 23]]],
                [[1, 2, 3]],
                [9, 10, -5]
            ];

        shouldReturnErrors(schema, values, { type: ERROR_TYPES.TYPE });
    });

    it('Should return type errors for valid level of nesting but invalid type of values', () => {
        const schema = array(array(array(bool()))).required(),
            values = [
                [[[0, 1]]],
                [[['true']]],
                [[[null]]],
                [[[undefined]]]
            ];

        shouldReturnErrors(schema, values, { type: ERROR_TYPES.TYPE });
    });

    it('Should return errors for array of objects', () => {
        const schema = array(object({ name: string().required() })).required(),
            values = [
                null,
                undefined,
                {},
                { name: 1 },
                { name: null }
            ];

        shouldReturnErrors(schema, values, { type: ERROR_TYPES.TYPE });
    });

    it('Should not return errors an array of valid objects', () => {
        const schema = array(object({ name: string().required() })).required(),
            values = [
                [ { name: 'gosho' } ],
                [ { name: 'tedi' } ],
                [ { name: 'kyci' } ],
                [ { name: 'bychveto' } ]
            ];

        shouldNotReturnErrors(schema, values);
    });
});