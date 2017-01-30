'use strict';

const { expect } = require('chai'),
    { shouldReturnErrors, shouldNotReturnErrors } = require('../helpers/test-templates'),
    { bool } = require('../fluent-validator')().schemas,
    ERROR_TYPES = require('../fluent-validator/errors').ERROR_TYPES;

const ROOT = 'boolvalue';

describe('BoolSchema individual methods', () => {
    it('BoolSchema.validateType(): should return true for true and false', () => {
        const schema = bool();

        expect(schema.validateType(true)).to.equal(true);
        expect(schema.validateType(false)).to.equal(true);
    });

    it('BoolSchema.validateType(): should return false for all other values', () => {
        const schema = bool(),
            values = [{}, [], [1], null, undefined, NaN, Infinity, 1, 0, '', 'plamyche', Function, Symbol, 'true', 'false'];

        const falseForAll = values.every(v => !schema.validateType(v));

        expect(falseForAll).to.equal(true);
    });

    it('BoolSchema.validate(): should return errors for values not of strict boolean type when .required() has been called', () => {
        const schema = bool().required(),
            values = [{}, [], [1], null, undefined, NaN, Infinity, 1, 0, '', 'plamyche', Function, Symbol, 'true', 'false'];

        shouldReturnErrors(schema, values, { type: ERROR_TYPES.TYPE });
    });

    it('BoolSchema.validate(): should not return errors for values of other types when required has not been called', () => {
        const schema = bool(),
            values = [{}, [], [1], null, undefined, NaN, Infinity, 1, 0, '', 'plamyche', Function, Symbol, 'true', 'false'];

        shouldNotReturnErrors(schema, values);
    });

    it('BoolSchema.validate(): should not return errors for strict bool values, regardless of required or not', () => {
        const emptyArrayString = [] + '';

        expect(bool().validate(true, ROOT) + '').to.equal(emptyArrayString);
        expect(bool().validate(false, ROOT) + '').to.equal(emptyArrayString);

        expect(bool().required().validate(true) + '').to.equal(emptyArrayString);
        expect(bool().required().validate(false) + '').to.equal(emptyArrayString);
    });

    it('BoolSchema.predicate(): .validate() should return error of type predicate when predicate is not fulfilled', () => {
        const schema = bool().predicate(x => x === false);

        const [ predicateError ] = schema.validate(true, ROOT);

        expect(predicateError.type).to.equal(ERROR_TYPES.PREDICATE);
        expect(predicateError.path).to.equal(ROOT);
    });

    it('BoolSchema.predicate(): .validate() should not return error when predicate is fulfilled', () => {
        const schema = bool().predicate(x => x === false);

        expect(schema.validate(false, ROOT) + '').to.equal([] + '');
    });
});

describe('BoolSchema method combinations', () => {
    it('All methods should enable chaining', () => {
        const schema = bool().required().not(false).predicate(x => x);

        expect(schema.validate).to.be.a('function');
    });

    it('NumberSchema .not() and .required() should cause .validate() to return their respective errors when used together', () => {
        const schema = bool().required().not(true);

        const [ notError ] = schema.validate(true, ROOT);

        expect(notError.type).to.equal(ERROR_TYPES.ARGUMENT);
        expect(notError.path).to.equal(ROOT);

        const notBools = [NaN, 1, 0, {}, [], null, undefined, '', 'pesho i petya pisali .net'];

        shouldReturnErrors(schema, notBools, { type: ERROR_TYPES.TYPE });
    });
});