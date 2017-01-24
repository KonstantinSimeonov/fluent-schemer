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

    it('NumberSchema.not(): should return errors regardless of wether a value is primitive or wrapped in object', () => {
        const schema = number().not(1, 5, -10),
            invalidValues = [1, 5, -10].map(n => new Number(n));

        shouldReturnErrors(schema, invalidValues, { type: ERROR_TYPES.ARGUMENT });
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

describe('NumberSchema method combinations', () => {
    it('All methods should enable chaining', () => {
        const schema = number()
            .required()
            .min(5)
            .max(10)
            .allowNaN()
            .allowInfinity()
            .not(5.2);

        expect(schema instanceof NumberSchema).to.equal(true);
        expect(schema.validate).to.be.a('function');
    });

    it('NumberSchema.min(): should not return errors for NaN when .allowNaN() has been called', () => {
        const schema = number().allowNaN().min(5);

        const validationErrors = schema.validate(NaN, 'tears');

        expect(validationErrors.length).to.equal(0);
    });

    it('NumberSchema.max(): should not return errors for NaN when .allowNaN() has been called', () => {
        const schema = number().allowNaN().max(5);

        const validationErrors = schema.validate(NaN, 'tears');

        expect(validationErrors.length).to.equal(0);
    });

    it('NumberSchema .min() .max() .required() .integer() should return errors for invalid numbers', () => {
        const schema = number()
            .required()
            .min(-5)
            .max(5)
            .integer();

        // test with value greater than max
        const errorsWithGreaterThanMax = schema.validate(10.5, 'value');

        const rangeErrorGreater = errorsWithGreaterThanMax.find(err => err.type === ERROR_TYPES.RANGE),
            argumentErrorsGreater = errorsWithGreaterThanMax.find(err => err.type === ERROR_TYPES.ARGUMENT);

        expect(rangeErrorGreater.path).to.equal('value');
        expect(argumentErrorsGreater.path).to.equal('value');

        // test with value lesser than min
        const errorsWithLessThanMin = schema.validate(-5.2, 'value');

        const rangeErrorLesser = errorsWithLessThanMin.find(err => err.type === ERROR_TYPES.RANGE),
            argumentErrorsLesser = errorsWithLessThanMin.find(err => err.type === ERROR_TYPES.ARGUMENT);

        expect(rangeErrorLesser.path).to.equal('value');
        expect(argumentErrorsLesser.path).to.equal('value');
    });

    it('NumberSchema.not() should return errors when diff is less than specified precision via .precision()', () => {
        const schema = number()
            .not(1.0001, 2.5111, 3.0002)
            .precision(0.0001);

        const numbers = [1.00005, 2.51108, 3.00021],
            numberObjects = numbers.map(n => new Number(n));

        shouldReturnErrors(schema, numbers.concat(numberObjects), { type: ERROR_TYPES.ARGUMENT });
    });

    it('NumberSchema.not() should not return errors when diff is more than specified precision via .precision()', () => {
        const schema = number()
            .not(1.0001, 2.5111, 3.0002)
            .precision(0.000001);

        const numbers = [1.00005, 2.51108, 3.00021],
            numberObjects = numbers.map(n => new Number(n));

        shouldNotReturnErrors(schema, numbers.concat(numberObjects));
    });

    it('NumberSchema .min() .max() .required() .not() should return errors for invalid values', () => {
        const schema = number()
            .required()
            .min(-10)
            .max(0)
            .not(-5, -3, -1);

        shouldReturnErrors(schema, [-15, -16, 1], { type: ERROR_TYPES.RANGE });
        shouldReturnErrors(schema, [-5, -3, -1], { type: ERROR_TYPES.ARGUMENT });
        shouldReturnErrors(schema, [null, {}, '', NaN], { type: ERROR_TYPES.TYPE });
    });

    it('NumberSchema .min() .max() .required() .integer() should not return errors for valid values', () => {
        const schema = number()
            .required()
            .min(-30)
            .max(30)
            .integer(),
            validPrimitiveNumbers = [-30, 15, 0, 1, 5, 30],
            validNumberObjects = validPrimitiveNumbers.map(n => new Number(n));

        shouldNotReturnErrors(schema, validPrimitiveNumbers.concat(validNumberObjects));
    });
});