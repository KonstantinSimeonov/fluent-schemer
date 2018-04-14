import test from 'ava';
import { string, ERROR_TYPES } from '../../';
import { shouldReturnErrors, shouldNotReturnErrors } from '../helpers';

const ROOT = 'root';

test('StringSchema.type should return string', assert => {
	assert.is(string().type, 'string');
});

test('StringSchema.validateType(): should return true for primitive strings and string objects', assert => {
	const primitives = ['1', '', 'sdfsdf', '324jn'];
	const stringObjects = primitives.map(str => new String(str));
	const schema = string();

	const allAreStrings = primitives.concat(stringObjects).every(str => schema.validateType(str));

	assert.true(allAreStrings);
});

test('.validate() returns errors with invalid types when .optional() has NOT been called', assert => {

	const schema = string();
	const values = [true, {}, 10, [], null, undefined];

	shouldReturnErrors(assert, schema, values, { type: ERROR_TYPES.TYPE });
});

test('.validate() does NOT return errors with invalid types when .optional() has been called', assert => {
	const schema = string().optional();
	const invalidTypeValues = [true, {}, 10, null, [], undefined];

	shouldNotReturnErrors(assert, schema, invalidTypeValues);
});

test('.validate() does NOT return errors with valid strings when .optional() has NOT been called', assert => {
	const schema = string();
	const stringValues = ['', 'gosho', new String('10'), new String(10)];

	shouldNotReturnErrors(assert, schema, stringValues);
});

test('.minlength().validate() returns range error for too short string', assert => {
	const schema = string().minlength(5);
	const tooShortStrings = ['a', '', 'b', 'ivan', 'pe'];

	shouldReturnErrors(assert, schema, tooShortStrings, { type: ERROR_TYPES.RANGE });
});

test('.minlength().validate() does not return errors for strings with at least minlength length', assert => {
	const schema = string().minlength(10);
	const validStrings = ['kalata shte hodi na fitnes', 'petya e iskreno i nepodkupno parche', 'tedi lyje, mami i obicha da tancuva'];

	shouldNotReturnErrors(assert, schema, validStrings);
});

test('.maxlength().validate() return serrors for strings with more than allowed length', assert => {
	const schema = string().maxlength(8);
	const tooLongStrings = [
		'iskam si shala, inache shte te obesya',
		'6al 6al 6al 6al',
		'4ao 4ao 4ao 4ao s tvoya 6al 6al 6al 6al 6al',
		'here iz a test',
		'gosho tosho pesho shosho rosho'
	];

	shouldReturnErrors(assert, schema, tooLongStrings, { type: ERROR_TYPES.RANGE });
});

test('.maxlength().validate() does not return errors for strings with less than or equal to allowed length', assert => {
	const schema = string().maxlength(5);
	const validStrings = ['', '1', 'gg', 'ooo', 'four', 'gosho'];

	shouldNotReturnErrors(assert, schema, validStrings);
});

test('.pattern().validate() returns errors for strings that do not match the provided regexp', assert => {
	const schema = string().pattern(/^[a-z]{5,10}$/i);
	const invalidStrings = ['abc', 'gg', 'kot', 'tedi pish-e i krad-e i lyj-e i mam-i i zaplashv-a i gled-a lo6o', 'testtesttest'];

	shouldReturnErrors(assert, schema, invalidStrings, { type: ERROR_TYPES.ARGUMENT });
});

test('.pattern().validate() does not return errors for strings that match the provided regexp', assert => {
	const schema = string().pattern(/^[a-z]{5,10}$/i);
	const validStrings = ['Goshko', 'TEODORA', 'petya', 'chieftain', 'viktor', 'cykuchev'];

	shouldNotReturnErrors(assert, schema, validStrings);
});

test('All methods should enable chaining', assert => {
	const schema = string()
		.optional()
		.minlength(10)
		.maxlength(20)
		.pattern(/^[a-z]{5}$/i)
		.predicate(x => x !== 'test');

	assert.is(typeof schema.validate, 'function');
});

test('.minlength(), .maxlength(), .optional() should return errors together with invalid strings', assert => {
	const schema = string()
		.minlength(7)
		.maxlength(14)
		.predicate(value => value.startsWith('cyki'));

	const invalidValues = ['tedi', 'gosho', new String('spica'), 'konsko pecheno sys shal', new String('konsko pecheno bez shal'), 'horsehorsehorsehorse'];

	const validationErrors = invalidValues
		.forEach(val => {
			const errorsArray = schema.validate(val, ROOT).errors;
			assert.is(errorsArray.filter(err => (err.type === ERROR_TYPES.RANGE) && (err.path === ROOT)).length, 1);
			assert.is(errorsArray.filter(err => (err.type === ERROR_TYPES.PREDICATE) && (err.path === ROOT)).length, 1);
		});
});

test('methods should return type error when validating value of incorrect type', assert => {
	const schema = string()
		.minlength(10)
		.maxlength(20)
		.pattern(/^[0-9]+$/i)
		.predicate(v => v);

	const root = 'arrayValue';
	const notStrings = [null, undefined, { prop: 'somevalue' }, ['lol'], 10, new Number(3), () => null, /testregexp/g];

	notStrings
		.map(v => schema.validate(v, root).errors)
		.forEach(errorsArray => {
			assert.is(errorsArray.length, 1);

			const [err] = errorsArray;

			assert.is(err.path, root);
			assert.is(err.type, ERROR_TYPES.TYPE);

			return err;
		});
});

test('methods should not return errors when .optional() has been called', assert => {
	const schema = string()
		.minlength(10)
		.maxlength(20)
		.pattern(/^[0-9]+$/i)
		.predicate(v => v)
		.optional();

	const notStrings = [null, undefined, false, {}, [], String];

	shouldNotReturnErrors(assert, schema, notStrings);
});

test('methods should not return errors for valid strings', assert => {
	const schema = string()
		.minlength(2)
		.maxlength(6)
		.pattern(/^[0-9]+$/i)
		.predicate(v => v[0] === '0');

	const validValues = ['012', '00', '001122', new String('01283')];

	shouldNotReturnErrors(assert, schema, validValues);
});
