'use strict';

const { expect } = require('chai'),
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
    it('NumberSchema.required(): .validate() should return errors with invalid types when .required() has been called', () => {
        const schema = number().required(),
            NaNValues = [true, NaN, {}, [], 'kalata', null, undefined];

        NaNValues
            .map(v => schema.validate(v, ROOT))
            .forEach(errorsArray => {
                expect(errorsArray.length).to.equal(1);

                const [err] = errorsArray;

                expect(err.path).to.equal(ROOT);
                expect(err.type).to.equal(ERROR_TYPES.TYPE);
            });
    });

    it('NumberSchema.required(): .validate() should not return errors when .required() has not been called', () => {
        const schema = number(),
            NaNValues = [true, NaN, {}, [], 'kalata', null, undefined];

        NaNValues
            .map(v => schema.validate(v, ROOT))
            .forEach(errorsArray => expect(errorsArray.length).to.equal(0));
    });

    it('NumberSchema.required(): .validate() should not return errors with valid numbers and .required() has been called', () => {
        const schema = number().required(),
            validNumbers = [1, new Number(2), new Number(0), -3, 0, -23929229, new Number('-2')];

        validNumbers
            .map(v => schema.validate(v, ROOT))
            .forEach(errorsArray => expect(errorsArray.length).to.equal(0));
    });

    it('NumberSchema.min(): .validate() should return errors for values below the passed minimal value', () => {
        const schema = number().min(10),
            smallNumbers = [1,2, -5, 0, new Number(9), new Number(-3), 9];

        smallNumbers
            .map(v => schema.validate(v, ROOT))
            .forEach(errorsArray => {
                expect(errorsArray.length).to.equal(1);

                const [ err ] = errorsArray;

                expect(err.type).to.equal(ERROR_TYPES.RANGE);
                expect(err.path).to.equal(ROOT);
            });
    });

    it('NumberSchema.min(): .validate() should not return errors for values in correct range', () => {
        const schema = number().min(-10),
            numbers = [-10, -9, -5, new Number(-4), 0, new Number(0), 20];

        numbers
            .map(v => schema.validate(v, ROOT))
            .forEach(errorsArray => expect(errorsArray.length).to.equal(0));
    });

    it('NumberSchema.max(): .validate() should return errors for values greater than the maximum', () => {
        const schema = number().max(30),
            greaterNumbers = [new Number(40), 40, 44, 100, Number.MAX_SAFE_INTEGER];

        greaterNumbers
            .map(v => schema.validate(v, ROOT))
            .forEach(errorsArray => {
                expect(errorsArray.length).to.equal(1);

                const [ err ] = errorsArray;

                expect(err.path).to.equal(ROOT);
                expect(err.type).to.equal(ERROR_TYPES.RANGE);
            });
    });

    it('NumberSchema.max(): .validate() should not return errors for values lesser than or equal to the maximum', () => {
        const schema = number().max(5),
            validNumbers = [5, new Number(5), new Number(-3), new Number(0), 4, -11, 0, -4];

        validNumbers
            .map(v => schema.validate(v, ROOT))
            .forEach(errorsArray => expect(errorsArray.length).to.equal(0));
    });

    it('NumberSchema.integer(): .validate() should return errors for floating point numbers', () => {
        const schema = number().integer(),
            floats = [5.1, 3.4, -1.5, new Number(5.1), new Number(-3.14), new Number(0.5)];

        floats
            .map(v => schema.validate(v, ROOT))
            .forEach(errorsArray => {
                expect(errorsArray.length).to.equal(1);

                const [ err ] = errorsArray;

                expect(err.type).to.equal(ERROR_TYPES.ARGUMENT);
                expect(err.path).to.equal(ROOT);
            });
    });

    it('NumberSchema.integer(): .validate() should not return errors for integer numbers', () => {
        const schema = number().integer(),
            integers = [-10, 10, Number.MAX_SAFE_INTEGER, new Number(5), new Number(1.0), new Number(-2.0)];

        integers
            .map(v => schema.validate(v, ROOT))
            .forEach(errorsArray => {
                console.log(errorsArray)
                expect(errorsArray.length).to.equal(0);
            });
    });
});