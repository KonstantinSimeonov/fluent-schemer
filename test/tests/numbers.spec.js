import test from 'ava';
import { number, ERROR_TYPES } from '../../';
import { shouldReturnErrors, shouldNotReturnErrors } from '../helpers';

test('.type returns "number"', assert => assert.is(number().type, 'number'));

test('.validateType(): returns false for all NaN values, Infinity and values that are not of type "number"', assert => {
	const nans = [NaN, '1', '', {}, [], Infinity, null, undefined];
	const schema = number();
	const somePassedValidation = nans.some(nan => schema.validateType(nan));

	assert.false(somePassedValidation);
});
test('.validateType(): returns true for NaN when .allowNaN() is called', assert => {
	assert.true(number().allowNaN().validateType(NaN));
});

test('.validateType(): returns true for Infinity when .allowInfinity() is called', assert => {
	assert.true(number().allowInfinity().validateType(Infinity));
});

test('.validateType(): returns false for values of other type even when .allowNaN() has been called', assert => {
	const notNumbers = ['1', {}, Function, [], true, null, undefined];
	const schema = number().allowNaN();
	const allAreNotNumbers = notNumbers.every(nan => !schema.validateType(nan));

	assert.true(allAreNotNumbers);
});

test('.validateType(): returns true for primitive numbers and Number objects', assert => {
	const primitiveNumbers = [0, 1, -5, Number.MAX_SAFE_INTEGER, Number.MAX_VALUE, 0x12A, 0b110, 0o127];
	const numberObjects = primitiveNumbers.map(n => new Number(n));
	const schema = number();

	const allAreNumbers = primitiveNumbers.concat(numberObjects).every(n => schema.validateType(n));
	assert.true(allAreNumbers);
});

test('number().validate() returns errors with invalid types when .optional() has NOT been called', assert => {
	const schema = number();
	const NaNValues = [true, NaN, {}, [], 'kalata', null, undefined, Infinity];

	shouldReturnErrors(assert, schema, NaNValues, { type: ERROR_TYPES.TYPE });
});

test('number().validate() does not return errors when .optional() has been called', assert => {
	const schema = number().optional();
	const NaNValues = [true, NaN, {}, [], 'kalata', null, undefined, Infinity];

	shouldNotReturnErrors(assert, schema, NaNValues);
});

test('number().validate() does not return errors with valid numbers and .optional() has NOT been called', assert => {
	const schema = number();
	const validNumbers = [1, new Number(2), new Number(0), -3, 0, -23929229, new Number('-2')];

	shouldNotReturnErrors(assert, schema, validNumbers);
});

test('number().not(): returns errors regardless of wether a value is primitive or wrapped in object', assert => {
	const schema = number().not(1, 5, -10);
	const invalidValues = [1, 5, -10].map(n => new Number(n));

	shouldReturnErrors(assert, schema, invalidValues, { type: ERROR_TYPES.ARGUMENT });
});

test('.min() throws with strings that are numeric', assert => {
	assert.throws(() => number().min('6'), TypeError);
});

test('.min() throws with NaN', assert => {
	assert.throws(() => number().min(NaN), TypeError);
});

test('.min().validate() returns errors for values below the passed minimal value', assert => {
	const schema = number().min(10);
	const smallNumbers = [1, 2, -5, 0, new Number(9), new Number(-3), 9];

	shouldReturnErrors(assert, schema, smallNumbers, { type: ERROR_TYPES.RANGE });
});

test('.min().validate() does not return errors for values in correct range', assert => {
	const schema = number().min(-10);
	const numbers = [-10, -9, -5, new Number(-4), 0, new Number(0), 20];

	shouldNotReturnErrors(assert, schema, numbers);
});

test('.max() throws with strings that are numeric', assert => {
	assert.throws(() => number().max('6'), TypeError);
});

test('.max() throws with NaN', assert => {
	assert.throws(() => number().max(NaN), TypeError);
});

test('.max().validate() returns errors for values greater than the maximum', assert => {
	const schema = number().max(30);
	const greaterNumbers = [new Number(40), 40, 44, 100, Number.MAX_SAFE_INTEGER];

	shouldReturnErrors(assert, schema, greaterNumbers, { type: ERROR_TYPES.RANGE });
});

test('.max().validate() does not return errors for values lesser than or equal to the maximum', assert => {
	const schema = number().max(5);
	const validNumbers = [5, new Number(5), new Number(-3), new Number(0), 4, -11, 0, -4];

	shouldNotReturnErrors(assert, schema, validNumbers);
});

test('.integer().validate() returns errors for floating point numbers', assert => {
	const schema = number().integer();
	const floats = [5.1, 3.4, -1.5, new Number(5.1), new Number(-3.14), new Number(0.5)];

	shouldReturnErrors(assert, schema, floats, { type: ERROR_TYPES.ARGUMENT });
});

test('.integer().validate() does not return errors for integer numbers', assert => {
	const schema = number().integer();
	const integers = [-10, 10, Number.MAX_SAFE_INTEGER, new Number(5), new Number(1.0), new Number(-2.0)];

	shouldNotReturnErrors(assert, schema, integers);
});

test('.safeInteger().validate() returns errors for unsafe integers', assert => {
	const schema = number().safeInteger();
	const unsafeInts = [4, 6, 8]
		.map(x => x + Number.MAX_SAFE_INTEGER)
		.concat([-4, -6, -8].map(x => x - Number.MAX_SAFE_INTEGER));

	shouldReturnErrors(assert, schema, unsafeInts, { type: ERROR_TYPES.RANGE });
});

test('.safeInteger().validate() keeps values from .min() and .max() if they are safe', assert => {
	const schema = number().min(-33).max(33).safeInteger();
	const values = [-35, 35];

	shouldReturnErrors(assert, schema, values, { type: ERROR_TYPES.RANGE });
});

test('All methods should enable chaining', assert => {
	const schema = number()
		.optional()
		.min(5)
		.max(10)
		.allowNaN()
		.allowInfinity()
		.not(5.2);

	assert.is(typeof schema.validate, 'function');
});

test('.min() should not return errors for NaN when .allowNaN() has been called', assert => {
	const schema = number().allowNaN().min(5);
	const { errorsCount } = schema.validate(NaN, 'tears');

	assert.is(errorsCount, 0);
});

test('.max() should not return errors for NaN when .allowNaN() has been called', assert => {
	const schema = number().allowNaN().max(5);
	const { errorsCount } = schema.validate(NaN, 'tears');

	assert.is(errorsCount, 0);
});

test(' .min() .max() .optional() .integer() should return errors for invalid numbers', assert => {
	const schema = number()
		.optional()
		.min(-5)
		.max(5)
		.integer();

	// test with value greater than max
	const { errors: errorsWithGreaterThanMax } = schema.validate(10.5, 'value');

	const rangeErrorGreater = errorsWithGreaterThanMax.find(err => err.type === ERROR_TYPES.RANGE),
		argumentErrorsGreater = errorsWithGreaterThanMax.find(err => err.type === ERROR_TYPES.ARGUMENT);

	assert.is(rangeErrorGreater.path, 'value');
	assert.is(argumentErrorsGreater.path, 'value');

	// test with value lesser than min
	const { errors: errorsWithLessThanMin } = schema.validate(-5.2, 'value');

	const rangeErrorLesser = errorsWithLessThanMin.find(err => err.type === ERROR_TYPES.RANGE),
		argumentErrorsLesser = errorsWithLessThanMin.find(err => err.type === ERROR_TYPES.ARGUMENT);

	assert.is(rangeErrorLesser.path, 'value');
	assert.is(argumentErrorsLesser.path, 'value');
});

test('.not() should return errors when diff is less than specified precision via .precision()', assert => {
	const schema = number()
		.not(1.0001, 2.5111, 3.0002)
		.precision(0.0001);

	const numbers = [1.00005, 2.51108, 3.00021];
	const numberObjects = numbers.map(n => new Number(n));

	shouldReturnErrors(assert, schema, numbers.concat(numberObjects), { type: ERROR_TYPES.ARGUMENT });
});

test('.not() should not return errors when diff is more than specified precision via .precision()', assert => {
	const schema = number()
		.not(1.0001, 2.5111, 3.0002)
		.precision(0.000001);

	const numbers = [1.00005, 2.51108, 3.00021],
		numberObjects = numbers.map(n => new Number(n));

	shouldNotReturnErrors(assert, schema, numbers.concat(numberObjects));
});

test('.min() .max() .not() should return errors for invalid values', assert => {
	const schema = number()
		.min(-10)
		.max(0)
		.not(-5, -3, -1);

	shouldReturnErrors(assert, schema, [-15, -16, 1], { type: ERROR_TYPES.RANGE });
	shouldReturnErrors(assert, schema, [-5, -3, -1], { type: ERROR_TYPES.ARGUMENT });
	shouldReturnErrors(assert, schema, [null, {}, '', NaN], { type: ERROR_TYPES.TYPE });
});

test('.min() .max() .optional() .integer() should not return errors for valid values', assert => {
	const schema = number()
		.optional()
		.min(-30)
		.max(30)
		.integer();
	const validPrimitiveNumbers = [-30, 15, 0, 1, 5, 30];
	const validNumberObjects = validPrimitiveNumbers.map(n => new Number(n));

	shouldNotReturnErrors(assert, schema, validPrimitiveNumbers.concat(validNumberObjects));
});
