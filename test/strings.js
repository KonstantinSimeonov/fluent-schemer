'use strict';

const { expect } = require('chai'),
    { shouldReturnErrors, shouldNotReturnErrors, forEachErrors } = require('../helpers/test-templates'),
    { string } = require('../lib')().schemas,
    { ERROR_TYPES } = require('../lib/errors');
    
const ROOT = 'root';

describe('StringSchema individual methods', () => {
    it('StringSchema.type should return string', () => {
        expect(string().type).to.equal('string');
    });

    it('StringSchema.validateType(): should return true for primitive strings and string objects', () => {
        const primitives = ['1', '', 'sdfsdf', '324jn'],
            stringObjects = primitives.map(str => new String(str)),
            schema = string();

        const allAreStrings = primitives.concat(stringObjects).every(str => schema.validateType(str));

        expect(allAreStrings).to.equal(true);
    });

    it('StringSchema.required(): should return errors with invalid types when required has been called', () => {

        const schema = string().required(),
            values = [true, {}, 10, [], null, undefined];

        shouldReturnErrors(schema, values, { type: ERROR_TYPES.TYPE });
    });

    it('StringSchema.required(): should not return errors with invalid types when no required has been called', () => {
        const schema = string(),
            invalidTypeValues = [true, {}, 10, null, [], undefined];

        shouldNotReturnErrors(schema, invalidTypeValues);
    });

    it('StringSchema.required(): should not return errors with valid strings when required has been called', () => {
        const schema = string(),
            stringValues = ['', 'gosho', new String('10'), new String(10)];

        shouldNotReturnErrors(schema, stringValues);
    });

    it('StringSchema.minlength(): should return range error for too short string', () => {
        const schema = string().minlength(5),
            tooShortStrings = ['a', '', 'b', 'ivan', 'pe'];

        shouldReturnErrors(schema, tooShortStrings, { type: ERROR_TYPES.RANGE });
    });

    it('StringSchema.minlength(): should not return errors for strings with at least minlength length', () => {
        const schema = string().minlength(10),
            validStrings = ['kalata shte hodi na fitnes', 'petya e iskreno i nepodkupno parche', 'tedi lyje, mami i obicha da tancuva'];

        shouldNotReturnErrors(schema, validStrings);
    });

    it('StringSchema.maxlength(): should return errors for strings with more than allowed length', () => {
        const schema = string().maxlength(8),
            tooLongStrings = [
                'iskam si shala, inache shte te obesya',
                '6al 6al 6al 6al',
                '4ao 4ao 4ao 4ao s tvoya 6al 6al 6al 6al 6al',
                'here iz a test',
                'gosho tosho pesho shosho rosho'
            ];

        shouldReturnErrors(schema, tooLongStrings, { type: ERROR_TYPES.RANGE });
    });

    it('StringSchema.maxlength(): should not return errors for strings with less than or equal to allowed length', () => {
        const schema = string().maxlength(5),
            validStrings = ['', '1', 'gg', 'ooo', 'four', 'gosho'];

        shouldNotReturnErrors(schema, validStrings);
    });

    it('StringSchema.pattern(): should return errors for strings that do not match the provided regexp', () => {
        const schema = string().pattern(/^[a-z]{5,10}$/i),
            invalidStrings = ['abc', 'gg', 'kot', 'tedi pish-e i krad-e i lyj-e i mam-i i zaplashv-a i gled-a lo6o', 'testtesttest'];

        shouldReturnErrors(schema, invalidStrings, { type: ERROR_TYPES.ARGUMENT });
    });

    it('StringSchema.pattern(): should not return errors for strings that match the provided regexp', () => {
        const schema = string().pattern(/^[a-z]{5,10}$/i),
            validStrings = ['Goshko', 'TEODORA', 'petya', 'chieftain', 'viktor', 'cykuchev'];

        shouldNotReturnErrors(schema, validStrings);
    });
});

describe('StringSchema method combinations', () => {
    it('All methods should enable chaining', () => {
        const schema = string()
            .required()
            .minlength(10)
            .maxlength(20)
            .pattern(/^[a-z]{5}$/i)
            .predicate(x => x !== 'test');

        expect(schema.validate).to.be.a('function');
    });

    it('StringSchema .minlength(), .maxlength(), .required() should return errors together with invalid strings', () => {
        const schema = string()
            .required()
            .minlength(7)
            .maxlength(14)
            .predicate(value => value.startsWith('cyki'));

        const invalidValues = ['tedi', 'gosho', new String('spica'), 'konsko pecheno sys shal', new String('konsko pecheno bez shal'), 'horsehorsehorsehorse'];

        const validationErrors = invalidValues
            .forEach(val => {
                const errorsArray = schema.validate(val, ROOT).errors;
                expect(errorsArray.filter(err => (err.type === ERROR_TYPES.RANGE) && (err.path === ROOT)).length).to.equal(1);
                expect(errorsArray.filter(err => (err.type === ERROR_TYPES.PREDICATE) && (err.path === ROOT)).length).to.equal(1);
            });

    });

    it('StringSchema methods should return type error when validating value of incorrect type', () => {
        const schema = string()
            .minlength(10)
            .maxlength(20)
            .pattern(/^[0-9]+$/i)
            .predicate(v => v)
            .required();

        const root = 'arrayValue';
        const notStrings = [null, undefined, { prop: 'somevalue' }, ['lol'], 10, new Number(3), () => null, /testregexp/g];

        notStrings
            .map(v => schema.validate(v, root).errors)
            .forEach(errorsArray => {
                expect(errorsArray.length).to.equal(1);

                const [err] = errorsArray;

                expect(err.path).to.equal(root);
                expect(err.type).to.equal(ERROR_TYPES.TYPE);

                return err;
            });
    });

    it('StringSchema methods should not return errors when .required() has not been called', () => {
        const schema = string()
            .minlength(10)
            .maxlength(20)
            .pattern(/^[0-9]+$/i)
            .predicate(v => v);

        const notStrings = [null, undefined, false, {}, [], String];

        shouldNotReturnErrors(schema, notStrings);
    });

    it('StringSchema methods should not return errors for valid strings', () => {
        const schema = string()
            .required()
            .minlength(2)
            .maxlength(6)
            .pattern(/^[0-9]+$/i)
            .predicate(v => v[0] === '0');

        const validValues = ['012', '00', '001122', new String('01283')];

        shouldNotReturnErrors(schema, validValues);
    });
});