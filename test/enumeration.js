'use strict';

const { expect } = require('chai'),
    { shouldReturnErrors, shouldNotReturnErrors } = require('../helpers/test-templates'),
    { enumeration } = require('../fluent-validator')().schemas,
    ERROR_TYPES = require('../fluent-validator/errors').ERROR_TYPES;

describe('EnumerationSchema with primitive values', () => {
    it('Should not return errors for values that are part of the schema enumeration', () => {
        const someEducationLevels = ['none', 'primary school', 'secondary school', 'bachelor'],
            educationSchema = enumeration(...someEducationLevels);

        shouldNotReturnErrors(educationSchema, someEducationLevels);
    });

    it('Should return errors for values that are not a part of the schema enumeration', () => {
        const enumerationSchema = enumeration(1, 4, 10, 33),
            notLevels = [-5, 11, 15, 78];

        shouldReturnErrors(enumerationSchema, notLevels, { type: ERROR_TYPES.ARGUMENT, root: 'val' });
    });

    it('Should not return errors for enumerations with values of different types', () => {
        const weirdoEnum = [1, true, 'podlena', null],
            schema = enumeration(...weirdoEnum);

        shouldNotReturnErrors(schema, weirdoEnum);
    });

    it('EnumerationSchema declared with a map should return errors for values that are not included', () => {
        const errorTypes = {
            engine: 'EngineExecutionError',
            application: 'ApplicationError',
            database: 'DatabaseError'
        },
            schema = enumeration(errorTypes);

        shouldReturnErrors(schema, ['Engine', 'gosho', 1, 2, true, null, {}, [], 'podlqrkova'], { type: ERROR_TYPES.ARGUMENT });
    });

    it('EnumerationSchema delcared with a map should not erturn errors for values included in the enumeration', () => {
        const errorTypes = {
            engine: 'EngineExecutionError',
            application: 'ApplicationError',
            database: 'DatabaseError'
        },
            schema = enumeration(errorTypes);

        shouldNotReturnErrors(schema, Object.keys(errorTypes).map(k => errorTypes[k]));
    });
});