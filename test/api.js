'use strict';

const { expect } = require('chai'),
    createValidator = require('../fluent-validator');

describe('API tests', () => {
    it('Providing no include or exclude options should return all schemas', () => {
        const schemas = createValidator({ include: ['string', 'bool'] }).schemas;

        Object.keys(schemas)
            .map(key => schemas[key])
            .forEach(createSchema => expect(createSchema).to.be.a('function'));
    });

    it('Providing include array of type names should return only those schemas', () => {
        const { string, bool, number, array } = createValidator({ include: ['string', 'bool'] }).schemas;

        expect(string).to.be.a('function');
        expect(bool).to.be.a('function');
        expect(number).to.equal(undefined);
        expect(array).to.equal(undefined);
    });

    it('Providing exclude array of type names should return only the other schemas', () => {
        const { object, string, union, bool, number } = createValidator({
            exclude: [ 'string', 'bool' ]
        }).schemas;

        expect(object).to.be.a('function');
        expect(string).to.equal(undefined);
        expect(union).to.be.a('function');
        expect(bool).to.equal(undefined);
        expect(number).to.be.a('function');
    });

    it('.extendWith() should add the given schema to the validator', () => {
        let TestSch;

        const testSchemaFactory = (BaseSchema, { createError, ERROR_TYPES }) => {
            expect(BaseSchema).to.be.a('function');
            expect(createError).to.be.a('function');
            expect(ERROR_TYPES).to.be.an('object');

            TestSch = class TestSchema extends BaseSchema {
                get type() {
                    return 'test';
                }
            };

            return TestSch;
        }

        const validator = createValidator();

        validator.extendWith('test', testSchemaFactory);

        const { test } = validator.schemas;

        expect(test).to.be.a('function');
        expect(test() instanceof TestSch).to.equal(true);
    });
});