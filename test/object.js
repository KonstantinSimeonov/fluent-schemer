'use strict';

const { expect } = require('chai'),
    { shouldReturnErrors, shouldNotReturnErrors } = require('../helpers/test-templates'),
    { string, number, bool, object } = require('../fluent-validator')().schemas;

const ERROR_TYPES = {
    RANGE: 'range',
    ARGUMENT: 'argument',
    TYPE: 'type',
    PREDICATE: 'predicate'
};

describe('ObjectSchema keys', () => {
    it('ObjectSchema.validateType(): should return true for objects that are not arrays and functions', () => {
        expect(object().validateType({})).to.equal(true);
        expect(object().validateType(Object.create(null))).to.equal(true);
    });

    it('ObjectSchema.validateType(): should return false for arrays and functions', () => {
        expect(object().validateType([])).to.equal(false);
        expect(object().validateType(function () { })).to.equal(false);
    });

    it('ObjectSchema.validateType(): should return true for arrays when .allowArrays() has been called', () => {
        expect(object().allowArrays().validateType([])).to.equal(true);
        expect(object().allowFunctions().validateType(function () { })).to.equal(true);
    });

    it('Should return errors for invalid keys of expected type', () => {
        const personSchema = object({
            name: string().minlength(3).maxlength(10),
            age: number().min(0).max(100),
            isStudent: bool().required()
        }),
            invalidPerson = {
                name: '1',
                age: -1
            };

        const errors = personSchema.validate(invalidPerson, 'person');
        
        const nameError = errors.find(e => e.path === 'person.name'),
            ageError = errors.find(e => e.path === 'person.age'),
            isStudentError = errors.find(e => e.path === 'person.isStudent');

        expect(nameError.type).to.equal(ERROR_TYPES.RANGE);
        expect(ageError.type).to.equal(ERROR_TYPES.RANGE);
        expect(isStudentError.type).to.equal(ERROR_TYPES.TYPE);
    });

    it('Should return errors for keys with invalid values when .required() has been called on the subschemas', () => {
        const softwareProjectSchema = object({
            mainLang: string().required(),
            loc: number().required(),
            size: number().required(),
            isPrivate: bool().required()
        });

        const invalidProject = {
            mainLang: null,
            loc: NaN,
            size: '10'
        };

        const [
            isPrivateError,
            locError,
            mainLangError,
            sizeError
        ] = softwareProjectSchema.validate(invalidProject, 'proj')
            .sort((a, b) => a.path.localeCompare(b.path));

        expect(isPrivateError.path).to.equal('proj.isPrivate');
        expect(locError.path).to.equal('proj.loc');
        expect(mainLangError.path).to.equal('proj.mainLang');
        expect(sizeError.path).to.equal('proj.size');
    });

    it('Should not return errors for valid keys', () => {
        const personSchema = object({
            name: string().minlength(3).maxlength(10),
            age: number().min(0).max(100),
            isStudent: bool().required()
        }),
            pencho = {
                name: 'pencho',
                age: 5,
                isStudent: false
            };

        expect(personSchema.validate(pencho, '') + '').to.equal([] + '');
    });

    it('Should not return errors for keys that have value of invalid type but are not required', () => {
        const animalSchema = object({
            breed: string().minlength(2).maxlength(10),
            weightKg: number().min(0),
            carnivore: bool()
        });

        const blankObj = {};

        expect(animalSchema.validate(blankObj, '') + '').to.equal([] + '');
    });
});