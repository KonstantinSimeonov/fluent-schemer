import test from 'ava';
import { enumeration, ERROR_TYPES } from '../../';
import { shouldReturnErrors, shouldNotReturnErrors } from '../helpers';

test('.type returns "enumeration"', assert => {
	assert.is(enumeration().type, 'enumeration');
});

test('.validate() returns errors for values that are part of the schema enumeration', assert => {
	const someEducationLevels = ['none', 'primary school', 'secondary school', 'bachelor'];
	const educationSchema = enumeration(...someEducationLevels);

	shouldNotReturnErrors(assert, educationSchema, someEducationLevels);
});

test('.validate() returns errors for values that are not a part of the schema enumeration', assert => {
	const enumerationSchema = enumeration(1, 4, 10, 33);
	const notLevels = [-5, 11, 15, 78];

	shouldReturnErrors(assert, enumerationSchema, notLevels, { type: ERROR_TYPES.ARGUMENT, root: 'val' });
});

test('.validate() returns errors for enumerations with values of different types', assert => {
	const weirdoEnum = [1, true, 'podlena', null];
	const schema = enumeration(...weirdoEnum);

	shouldNotReturnErrors(assert, schema, weirdoEnum);
});

test('.validate() returns errors correctly when object map has been passed to the constructor', assert => {
	const errorTypes = {
		engine: 'EngineExecutionError',
		application: 'ApplicationError',
		database: 'DatabaseError'
	};
	const schema = enumeration(errorTypes);

	shouldReturnErrors(assert, schema, ['Engine', 'gosho', 1, 2, true, null, {}, [], 'podlqrkova'], { type: ERROR_TYPES.ARGUMENT });
});

test('.validate() does not return errors when object map has been passed to the constructor when values are part of the enumeration', assert => {
	const errorTypes = {
		engine: 'EngineExecutionError',
		application: 'ApplicationError',
		database: 'DatabaseError'
	};
	const schema = enumeration(errorTypes);

	shouldNotReturnErrors(assert, schema, Object.keys(errorTypes).map(k => errorTypes[k]));
});
