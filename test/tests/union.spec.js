import test from 'ava';
import { union, string, number, bool, array, ERROR_TYPES } from '../../';
import { shouldReturnErrors, shouldNotReturnErrors } from '../helpers';

test('UnionSchema.type: should return concatenation of all possible types', assert => {
	const schema = union(number(), string(), bool());

	assert.is(schema.type, [number().type, string().type, bool().type].join('|'));
});

test('UnionSchema.validateType(): should return false for values that are not of one of the listed types', assert => {
	const schema = union(string(), number());
	const values = [null, undefined, true, {}, [], () => 1];

	for (const v of values) {
		assert.false(schema.validateType(v));
	}
});

test('UnionSchema.validateType(): should return true for values that are of at least one of the listed types', assert => {
	const schema = union(number(), bool());
	const values = [1, true, false, 0, new Number(10), new Boolean(true)];

	const allAreTrue = values.every(v => schema.validateType(v));

	assert.true(allAreTrue);
});

test('.validate() does not return errors when no type of the union matches when .optional() has been called', assert => {
	const schema = union(number(), bool()).optional();
	const notNumbersOrBools = [NaN, Infinity, {}, [], () => true, null, undefined];

	shouldNotReturnErrors(assert, schema, notNumbersOrBools);
});

test('.validate() returns errors when .optional() has NOT been called', assert => {
	const schema = union(number(), bool());
	const notNumbersOrBools = [NaN, Infinity, {}, [], () => true, null, undefined];

	shouldReturnErrors(assert, schema, notNumbersOrBools, { type: ERROR_TYPES.TYPE });
});

test('.validate() does not return errors when at least one of the schema types match the value', assert => {
	const schema = union(string(), array(number().integer()));
	const values = ['zdrkp', new String('jesuisstring'), [], [1, 2], [new Number(0), 3], new Array()];

	shouldNotReturnErrors(assert, schema, values);
});

test('.validate() returns errors when the values satisfies the conditions of no schema', assert => {
	const schema = union(string().minlength(5), number().integer());
	// expected errors are of type range error for too short strings and argument errors for floating point numbers
	const shortStrings = ['js', '', new String('1')];
	const floats = [1.5, -0.5, new Number(2.5)];

	shouldReturnErrors(assert, schema, shortStrings, { type: ERROR_TYPES.RANGE });
	shouldReturnErrors(assert, schema, floats, { type: ERROR_TYPES.ARGUMENT });
});
