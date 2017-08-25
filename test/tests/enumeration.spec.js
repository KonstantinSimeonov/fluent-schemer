import { expect } from 'chai';
import { enumeration, ERROR_TYPES } from '../../';
import { shouldReturnErrors, shouldNotReturnErrors } from '../helpers';

describe('EnumerationSchema with primitive values', () => {
	describe('get type(): ', () => {
		it('returns "enumeration"', () => {
			expect(enumeration().type).to.equal('enumeration');
		});
	});

	describe('.validate()', () => {
		it('returns errors for values that are part of the schema enumeration', () => {
			const someEducationLevels = ['none', 'primary school', 'secondary school', 'bachelor'];
			const educationSchema = enumeration(...someEducationLevels);

			shouldNotReturnErrors(educationSchema, someEducationLevels);
		});

		it('returns errors for values that are not a part of the schema enumeration', () => {
			const enumerationSchema = enumeration(1, 4, 10, 33);
			const notLevels = [-5, 11, 15, 78];

			shouldReturnErrors(enumerationSchema, notLevels, { type: ERROR_TYPES.ARGUMENT, root: 'val' });
		});

		it('returns errors for enumerations with values of different types', () => {
			const weirdoEnum = [1, true, 'podlena', null];
			const schema = enumeration(...weirdoEnum);

			shouldNotReturnErrors(schema, weirdoEnum);
		});
	});

	describe('constructor(): ', () => {
		it('.validate() returns errors correctly when object map has been passed to the constructor', () => {
			const errorTypes = {
				engine: 'EngineExecutionError',
				application: 'ApplicationError',
				database: 'DatabaseError'
			};
			const schema = enumeration(errorTypes);

			shouldReturnErrors(schema, ['Engine', 'gosho', 1, 2, true, null, {}, [], 'podlqrkova'], { type: ERROR_TYPES.ARGUMENT });
		});

		it('.validate() does not return errors when object map has been passed to the constructor when values are part of the enumeration', () => {
			const errorTypes = {
				engine: 'EngineExecutionError',
				application: 'ApplicationError',
				database: 'DatabaseError'
			};
			const schema = enumeration(errorTypes);

			shouldNotReturnErrors(schema, Object.keys(errorTypes).map(k => errorTypes[k]));
		});
	});
});
