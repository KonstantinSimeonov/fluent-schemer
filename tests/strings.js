'use strict';

const { expect } = require('chai'),
    BaseSchema = require('../../fluent-validator/schemas/base-schema'),
    StringSchema = require('../../fluent-validator/schemas/string-schema')(BaseSchema);

function string(...args) {
    return new StringSchema(...args);
}

const ROOT = 'root';

const ERROR_TYPES = {
    RANGE: 'range',
    ARGUMENT: 'argument',
    TYPE: 'type',
    PREDICATE: 'predicate'
};

describe('StringSchema individual methods', () => {
    it('StringSchema.required(): should return errors with invalid types when required has been called', () => {

        const schema = string().required(),
            values = [true, {}, 10, [], null, undefined];

        const validationErrors = values
            .map(v => schema.validate(v, ROOT))
            .map(errors => {
                expect(errors.length).to.equal(1);
                const [err] = errors;

                expect(err.path).to.equal(ROOT);
                expect(err.type).to.equal('type');

                return errors.pop();
            })
            .filter(err => err);

        expect(validationErrors.length).to.equal(values.length);
    });

    it('StringSchema.required(): should not return errors with invalid types when no required has been called', () => {
        const schema = string(),
            invalidTypeValues = [true, {}, 10, null, [], undefined];

        const validationErrors = invalidTypeValues
            .map(v => schema.validate(ROOT))
            .filter(errorArray => errorArray.length !== 0);

        expect(validationErrors.length).to.equal(0);
    });

    it('StringSchema.required(): should not return errors with valid strings when required has been called', () => {
        const schema = string(),
            stringValues = ['', 'gosho', new String('10'), new String(10)];

        const validationErrors = stringValues
            .map(v => schema.validate(ROOT))
            .filter(errorArray => errorArray.length !== 0);

        expect(validationErrors.length).to.equal(0);
    });

    it('StringSchema.minlength(): should return range error for too short string', () => {
        const schema = string().minlength(5),
            tooShortStrings = ['a', '', 'b', 'ivan', 'pe'];

        const validationErrors = tooShortStrings
            .map(v => schema.validate(v, ROOT))
            .map(errorArray => {
                expect(errorArray.length).to.equal(1);

                const [err] = errorArray;

                expect(err.path).to.equal(ROOT);
                expect(err.type).to.equal(ERROR_TYPES.RANGE);

                return err;
            });

        expect(validationErrors.length).to.equal(tooShortStrings.length);
    });

    it('StringSchema.minlength(): should not return errors for strings with at least minlength length', () => {
        const schema = string().minlength(10),
            validStrings = ['kalata shte hodi na fitnes', 'petya e iskreno i nepodkupno parche', 'tedi lyje, mami i obicha da tancuva'];

        const validationErrors = validStrings
            .map(v => schema.validate(v, ROOT))
            .filter(errorsArray => errorsArray.length !== 0);

        expect(validationErrors.length).to.equal(0);
    });

    it('StringSchema.maxlength(): should return errors for strings with more than allowed length', () => {
        const schema = string().maxlength(8),
            tooLongStrings = [
                'iskam si shala, inache shte te obesya',
                '6al 6al 6al 6al 4ao 4ao 4ao 4ao',
                's tvoya 6al 6al 6al 6al 6al',
                'here iz a test',
                'gosho tosho pesho shosho rosho'
            ];

        const validationErrors = tooLongStrings
            .map(v => schema.validate(v, ROOT))
            .map(errorsArray => {
                expect(errorsArray.length).to.equal(1);

                const [err] = errorsArray;

                expect(err.path).to.equal(ROOT);
                expect(err.type).to.equal(ERROR_TYPES.RANGE);

                return err;
            });

        expect(validationErrors.length).to.equal(validationErrors.length);
    });

    it('StringSchema.maxlength(): should not return errors for strings with less than or equal to allowed length', () => {
        const schema = string().maxlength(5),
            validStrings = ['', '1', 'gg', 'ooo', 'four', 'gosho'];

        const validationErrors = validStrings
            .map(v => schema.validate(v, ROOT))
            .filter(errorsArray => errorsArray.length !== 0);

        expect(validationErrors.length).to.equal(0);
    });

    it('StringSchema.pattern(): should return errors for strings that do not match the provided regexp', () => {
        const schema = string().pattern(/^[a-z]{5,10}$/i),
            invalidStrings = ['abc', 'gg', 'kot', 'tedi pish-e i krad-e i lyj-e i mam-i i zaplashv-a i gled-a lo6o', 'testtesttest'];

        const validationErrors = invalidStrings
            .map(v => schema.validate(v, ROOT))
            .map(errorsArray => {
                expect(errorsArray.length).to.equal(1);

                const [err] = errorsArray;

                expect(err.type).to.equal(ERROR_TYPES.ARGUMENT);
                expect(err.path).to.equal(ROOT);

                return err;
            });

        expect(validationErrors.length).to.equal(invalidStrings.length);
    });

    it('StringSchema.pattern(): should not return errors for strings that match the provided regexp', () => {
        const schema = string().pattern(/^[a-z]{5,10}$/i),
            validStrings = ['Goshko', 'TEODORA', 'petya', 'chieftain', 'viktor', 'cykuchev'];

        const validationErrors = validStrings
            .map(v => schema.validate(v, ROOT))
            .filter(errorsArray => errorsArray.length !== 0);

        expect(validationErrors.length).to.equal(0);
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

        expect(schema instanceof StringSchema).to.equal(true);
    });

    it('StringSchema .minlength(), .maxlength(), .required() should return errors together with invalid strings', () => {
        const schema = string()
            .required()
            .minlength(7)
            .maxlength(14)
            .predicate(value => value.startsWith('cyki'));

        const invalidValues = ['tedi', 'gosho', new String('spica'), 'konsko pecheno sys shal', new String('konsko pecheno bez shal'), 'horsehorsehorsehorse'];

        const validationErrors = invalidValues
            .map(v => schema.validate(v, ROOT))
            .map(errorsArray => {
                expect(errorsArray.filter(err => (err.type === ERROR_TYPES.RANGE) && (err.path === ROOT)).length).to.equal(1);
                expect(errorsArray.filter(err => (err.type === ERROR_TYPES.PREDICATE) && (err.path === ROOT)).length).to.equal(1);

                return errorsArray;
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
            .map(v => schema.validate(v, root))
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

        const validationErrors = notStrings
                                    .map(v => schema.validate(v, ROOT))
                                    .filter(errorsArray => errorsArray.length !== 0);

        expect(validationErrors.length).to.equal(0);
    });

    it('StringSchema methods should not return errors for valid strings', () => {
        const schema = string()
            .required()
            .minlength(2)
            .maxlength(6)
            .pattern(/^[0-9]+$/i)
            .predicate(v => v[0] === '0');

        const validValues = ['012', '00', '001122', new String('01283')];

        const validationErrors = validValues
                                        .map(v => schema.validate(v, ROOT))
                                        .filter(errorsArray => errorsArray.length !== 0);

        expect(validationErrors.length).to.equal(0);
    });
});