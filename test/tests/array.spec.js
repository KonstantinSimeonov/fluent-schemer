import test from 'ava';
import * as FluentSchemer from '../../';
import { shouldReturnErrors, shouldNotReturnErrors } from '../helpers';

const { array, string, number, object, bool, ERROR_TYPES } = FluentSchemer;

const validateTypeTest = (subschemaType, arrayToValidate, valid = true) => test(
	`array().validateType(): returns "${valid}" for array<${subschemaType}> with input ${arrayToValidate}`,
	assert => {
		const typedArraySchema = array(FluentSchemer[subschemaType]());
		const isValidArray = typedArraySchema.validateType(arrayToValidate);

		assert.is(isValidArray, valid);
	}
);

for (const type of ['bool', 'string', 'number', 'object']) {
	test(`array().type: returns array<${type}> type for subschema of type ${type}`, assert => {
		const schema = array(FluentSchemer[type]());

		assert.is(schema.type, `array<${type}>`);
	});
}

test('array().type: returns array<any> for untyped array', assert => {
	assert.is(array().type, 'array<any>');
});

test('array().validateType(): returns "true" for untyped array with values of distinct types', assert => {
	const schema = array();
	const values = [[1, 2, 3], ['adf', true, {}], [null, undefined, []]];
	const allValid = values.every(untyped => schema.validateType(untyped));

	assert.true(allValid);
});

test('array().validateType(): returns "true" for empty array', assert => {
	assert.true(array(bool()).validateType([]));
});

validateTypeTest('string', ['a', 'spica', 'huffman', 'beer', new String('fire')]);
validateTypeTest('string', [null, 1, NaN, {}, [], () => 1, true, undefined], false);

validateTypeTest('bool', [true, false, new Boolean(true)]);
validateTypeTest('bool', [null, undefined, 1, 0, '', 'sdf', {}, [], () => true], false);

validateTypeTest('number', [1, 2, 3, 4, 10, -20, new Number(10), new Number(0)]);
validateTypeTest('number', [null, undefined, NaN, Infinity, '', '10', [], {}, () => 10, false], false);

validateTypeTest('object', [{}, { zdr: 'kp' }]);
validateTypeTest('object', [1, 2, [], () => { }, 'dsf', true], false);

test('array().validate() returns error when value is not an array', assert => {
	const schema = array();
	const notArrays = [1, 2, 0, {}, { length: 1 }, () => 1, 'dsfsdf'];

	shouldReturnErrors(assert, schema, notArrays, { type: ERROR_TYPES.TYPE });
});

test('array().minlength() throws with negative numbers', assert => {
	assert.throws((() => array().minlength(-5)), TypeError);
});

test('array().minlength() throws with NaN', assert => {
	assert.throws(() => array().minlength(NaN), TypeError);
})

test(`array().minlength() throws with strings, even if they're numeric`, assert => {
	assert.throws(() => array().minlength('6'), TypeError);
	assert.throws(() => array().minlength('not even close brah'), TypeError);
});

test('array().minlength().validate() returns range error for too arrays with (length < minlength)', assert => {
	const schema = array().minlength(5);
	const values = [[], ['a', 'tedi'], ['steven', 'kon', 'beer', 'coding'], ['kyci the mermaid']];

	shouldReturnErrors(assert, schema, values, { type: ERROR_TYPES.RANGE });
});

test('array().maxlength() throws with negative numbers', assert => {
	assert.throws(() => array().maxlength(-5), TypeError);
});

test('array().maxlength() throws with strings that are numeric', assert => {
	assert.throws(() => array().maxlength('6'), TypeError);
});

test('array().maxlength() throws with NaN', assert => {
	assert.throws(() => array().maxlength(NaN), TypeError);
});

test('array().maxlength() validation returns range error for arrays with length > maxlength', assert => {
	const schema = array().maxlength(2);
	const values = [[1, 2, 3], ['sdgfds', 'sdgfdg', 'errere', null], [true, false, true, false, true], [[], [], []]];

	shouldReturnErrors(assert, schema, values, { type: ERROR_TYPES.RANGE });
});

test('array().withLength(): throws with negative numbers', assert => {
	assert.throws(() => array().withLength(-5), TypeError);
});

test('array().withLength(): throws with strings that are numeric', assert => {
	assert.throws(() => array().withLength('6'), TypeError);
});

test('array().withLength(): throws with NaN', assert => {
	assert.throws(() => array().withLength(NaN), TypeError);
});

test('array().withLength(): validation returns errors for arrays with different length', assert => {
	const schema = array().withLength(3);
	const values = [[1, 2], [], [1, 2, 3, 4]];

	shouldReturnErrors(assert, schema, values, { type: ERROR_TYPES.RANGE });
});

test('array().withLength(): validation doesn`t return errors for arrays with same length', assert => {
	const schema = array().withLength(3);
	const values = [[1, 2, 6], ['a', 'b', 'gosho'], [null, undefined, 'stamat']];

	shouldNotReturnErrors(assert, schema, values);
});

test('array().distinct(): validation returns error for arrays with duplicate values', assert => {
	const schema = array().distinct();
	const object = {};
	const values = [[1, 1, 2, 3, 4, 5], ['a', 'b', 'c', 'gosho', 'd', 'gosho'], [true, true], [object, 1, 2, object]];

	shouldReturnErrors(assert, schema, values, { type: ERROR_TYPES.ARGUMENT });
});

test('array().distinct(): validation doesn`t return error for arrays with distinct values', assert => {
	const schema = array().distinct();
	const values = [[1, 2, 3], ['a', 'b', 'gosho'], [{}, {}]];

	shouldNotReturnErrors(assert, schema, values);
});

test('array().validate(): returns error for first invalid value only', assert => {
	const schema = array(number().integer());
	const values = [1, 2, 0, new Number(5), new Number(1.10), new Number(2.5)];

	const { errors } = schema.validate(values, 'nums');
	assert.is(errors.length, 1);

	const [err] = errors;

	assert.is(err.path, 'nums[4]');
	assert.is(err.type, ERROR_TYPES.ARGUMENT);
});

test('All methods should enable chaining', assert => {
	const schema = array(number()).withLength(5).distinct().predicate(x => true);

	assert.is(typeof schema.validate, 'function');
});

test('array().validate(): returns errors when nested schema doesnt match values', assert => {
	const schema = array(array());
	const values = [[1, 2], ['dfdf'], [{ length: 1 }]];

	shouldReturnErrors(assert, schema, values, { type: ERROR_TYPES.TYPE });
});

test('array().validate(): returns errors for multiple levels of nesting', assert => {
	const schema = array(array(array(number())));
	const values = [
		[[['asadd', 23]]],
		[[1, 2, 3]],
		[9, 10, -5]
	];

	shouldReturnErrors(assert, schema, values, { type: ERROR_TYPES.TYPE });
});

test('array().validate(): returns type errors for valid level of nesting but invalid type of values', assert => {
	const schema = array(array(array(bool())));
	const values = [
		[[[0, 1]]],
		[[['true']]],
		[[[null]]],
		[[[undefined]]]
	];

	shouldReturnErrors(assert, schema, values, { type: ERROR_TYPES.TYPE });
});

test('array().validate(): returns errors for array of objects', assert => {
	const schema = array(object({ name: string() }));
	const values = [
		null,
		undefined,
		{},
		{ name: 1 },
		{ name: null }
	];

	shouldReturnErrors(assert, schema, values, { type: ERROR_TYPES.TYPE });
});

test('array().validate(): doesn`t return errors for an array of valid objects', assert => {
	const schema = array(object({ name: string() }));
	const values = [
		[{ name: 'gosho' }],
		[{ name: 'tedi' }],
		[{ name: 'kyci' }],
		[{ name: 'bychveto' }]
	];

	shouldNotReturnErrors(assert, schema, values);
});
