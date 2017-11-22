import test from 'ava';
import { bool, ERROR_TYPES } from '../../';
import { shouldReturnErrors, shouldNotReturnErrors } from '../helpers';

const ROOT = 'boolvalue';

test('bool.type :', assert => assert.is(bool().type, 'bool'));

test('bool.validateType() returns "true" for true and false', assert => {
	const schema = bool();

	assert.true(schema.validateType(true));
	assert.true(schema.validateType(false));
});

test('bool.validateType() returns false for values of various other types', assert => {
	const schema = bool();
	const values = [{}, [], [1], null, undefined, NaN, Infinity, 1, 0, '', 'plamyche', Function, Symbol, 'true', 'false'];

	values.map(v => schema.validateType(v)).forEach(isValid => assert.false(isValid));
});

test('bool.validate() returns errors for values not of struct boolean type', assert => {
	const schema = bool().required();
	const values = [{}, [], [1], null, undefined, NaN, Infinity, 1, 0, '', 'plamyche', Function, Symbol, 'true', 'false'];

	shouldReturnErrors(assert, schema, values, { type: ERROR_TYPES.TYPE });
});

test('bool.validate() does not return errors for values of other types with no required', assert => {
	const schema = bool();
	const values = [{}, [], [1], null, undefined, NaN, Infinity, 1, 0, '', 'plamyche', Function, Symbol, 'true', 'false'];

	shouldNotReturnErrors(assert, schema, values);
});

test('bool.validate() returns predicate errors when predicate is not satisfied', assert => {
	const schema = bool().predicate(x => x === false);
	const { errors: [predicateError] } = schema.validate(true, ROOT);

	assert.is(predicateError.type, ERROR_TYPES.PREDICATE);
	assert.is(predicateError.path, ROOT);
});

test('All methods should enable chaining', assert => {
	const schema = bool().required().not(false).predicate(x => x);

	assert.is(typeof schema.validate, 'function');
});
