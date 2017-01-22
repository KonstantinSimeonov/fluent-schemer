'use strict';

const { expect } = require('chai'),
    { shouldReturnErrors, shouldNotReturnErrors } = require('../helpers/test-templates'),
    BaseSchema = require('../fluent-validator/schemas/base-schema'),
    NumberSchema = require('../fluent-validator/schemas/number-schema')(BaseSchema);

function number(...args) {
    return new NumberSchema(...args);
}

const ROOT = 'testtest';

const ERROR_TYPES = {
    RANGE: 'range',
    ARGUMENT: 'argument',
    TYPE: 'type',
    PREDICATE: 'predicate'
};

describe('NumberSchema individual methods', () => {
    it('NumberSchema.type: should return "number"', () => {
        expect(number().type).to.equal('number');
    });

    it('NumberSchema.validateType(): should return false for all NaN values, Infinity and values that are not of type "number"', () => {
        const nans = [NaN, '1', '', {}, [], Infinity, null, undefined],
            schema = number();

        const allAreFalse = nans.every(nan => !schema.validateType(nan));

        expect(allAreFalse).to.equal(true);
    });

    it('NumbersSchema.validateType(): should return true for NaN when .allowNaN() is called', () => {
        expect(number().allowNaN().validateType(NaN)).to.equal(true);
    });

    it('NumberSchema.validateType(): should return true for Infinity when .allowInfinity() is called', () => {
        expect(number().allowInfinity().validateType(Infinity)).to.equal(true);
    });

    it('NumberSchema.validateType(): should return false for values of other type even when .allowNaN() has been called', () => {
        const notNumbers = ['1', {}, Function, [], true, null, undefined],
            schema = number().allowNaN();

        const allAreNotNumbers = notNumbers.every(nan => !schema.validateType(nan));

        expect(allAreNotNumbers).to.equal(true);
    });

    it('NumberSchema.validateType(): should return true for primitive numbers and Number objects', () => {
        const primitiveNumbers = [0, 1, -5, Number.MAX_SAFE_INTEGER, Number.MAX_VALUE, 0x12A, 0b110, 0o127],
            numberObjects = primitiveNumbers.map(n => new Number(n)),
            schema = number();

        const allAreNumbers = primitiveNumbers.concat(numberObjects).every(n => schema.validateType(n));
    });

    it('NumberSchema.required(): .validate() should return errors with invalid types when .required() has been called', () => {
        const schema = number().required(),
            NaNValues = [true, NaN, {}, [], 'kalata', null, undefined, Infinity];

        shouldReturnErrors(schema, NaNValues, { type: ERROR_TYPES.TYPE });
    });

    it('NumberSchema.required(): .validate() should not return errors when .required() has not been called', () => {
        const schema = number(),
            NaNValues = [true, NaN, {}, [], 'kalata', null, undefined, Infinity];

        shouldNotReturnErrors(schema, NaNValues);
    });

    it('NumberSchema.required(): .validate() should not return errors with valid numbers and .required() has been called', () => {
        const schema = number().required(),
            validNumbers = [1, new Number(2), new Number(0), -3, 0, -23929229, new Number('-2')];

        shouldNotReturnErrors(schema, validNumbers);
    });

    it('NumberSchema.min(): .validate() should return errors for values below the passed minimal value', () => {
        const schema = number().min(10),
            smallNumbers = [1, 2, -5, 0, new Number(9), new Number(-3), 9];

        shouldReturnErrors(schema, smallNumbers, { type: ERROR_TYPES.RANGE });
    });

    it('NumberSchema.min(): .validate() should not return errors for values in correct range', () => {
        const schema = number().min(-10),
            numbers = [-10, -9, -5, new Number(-4), 0, new Number(0), 20];

        shouldNotReturnErrors(schema, numbers);
    });

    it('NumberSchema.max(): .validate() should return errors for values greater than the maximum', () => {
        const schema = number().max(30),
            greaterNumbers = [new Number(40), 40, 44, 100, Number.MAX_SAFE_INTEGER];

        shouldReturnErrors(schema, greaterNumbers, { type: ERROR_TYPES.RANGE });
    });

    it('NumberSchema.max(): .validate() should not return errors for values lesser than or equal to the maximum', () => {
        const schema = number().max(5),
            validNumbers = [5, new Number(5), new Number(-3), new Number(0), 4, -11, 0, -4];

        shouldNotReturnErrors(schema, validNumbers);
    });

    it('NumberSchema.integer(): .validate() should return errors for floating point numbers', () => {
        const schema = number().integer(),
            floats = [5.1, 3.4, -1.5, new Number(5.1), new Number(-3.14), new Number(0.5)];

        shouldReturnErrors(schema, floats, { type: ERROR_TYPES.ARGUMENT });
    });

    it('NumberSchema.integer(): .validate() should not return errors for integer numbers', () => {
        const schema = number().integer(),
            integers = [-10, 10, Number.MAX_SAFE_INTEGER, new Number(5), new Number(1.0), new Number(-2.0)];

        shouldNotReturnErrors(schema, integers);
    });
});