import { expect } from 'chai';
import { string, ERROR_TYPES } from '../../';
import { shouldReturnErrors, shouldNotReturnErrors } from '../helpers';

const ROOT = 'root';

describe('StringSchema individual methods', () => {
	describe('get type():', () => {
		it('StringSchema.type should return string', () => {
			expect(string().type).to.equal('string');
		});
	});

	describe('.validateType():', () => {
		it('StringSchema.validateType(): should return true for primitive strings and string objects', () => {
			const primitives = ['1', '', 'sdfsdf', '324jn'];
			const stringObjects = primitives.map(str => new String(str));
			const schema = string();

			const allAreStrings = primitives.concat(stringObjects).every(str => schema.validateType(str));

			expect(allAreStrings).to.equal(true);
		});
	});

	describe('.required():', () => {
		it('.validate() returns errors with invalid types when required has been called', () => {

			const schema = string().required();
			const values = [true, {}, 10, [], null, undefined];

			shouldReturnErrors(schema, values, { type: ERROR_TYPES.TYPE });
		});

		it('.validate() does not return errors with invalid types when no required has been called', () => {
			const schema = string();
			const invalidTypeValues = [true, {}, 10, null, [], undefined];

			shouldNotReturnErrors(schema, invalidTypeValues);
		});

		it('.validate() does not return errors with valid strings when required has been called', () => {
			const schema = string();
			const stringValues = ['', 'gosho', new String('10'), new String(10)];

			shouldNotReturnErrors(schema, stringValues);
		});
	});

	describe('.minlength():', () => {
		it('returns range error for too short string', () => {
			const schema = string().minlength(5);
			const tooShortStrings = ['a', '', 'b', 'ivan', 'pe'];

			shouldReturnErrors(schema, tooShortStrings, { type: ERROR_TYPES.RANGE });
		});

		it('does not return errors for strings with at least minlength length', () => {
			const schema = string().minlength(10);
			const validStrings = ['kalata shte hodi na fitnes', 'petya e iskreno i nepodkupno parche', 'tedi lyje, mami i obicha da tancuva'];

			shouldNotReturnErrors(schema, validStrings);
		});
	});

	describe('.maxlength(): ', () => {
		it('return serrors for strings with more than allowed length', () => {
			const schema = string().maxlength(8);
			const tooLongStrings = [
				'iskam si shala, inache shte te obesya',
				'6al 6al 6al 6al',
				'4ao 4ao 4ao 4ao s tvoya 6al 6al 6al 6al 6al',
				'here iz a test',
				'gosho tosho pesho shosho rosho'
			];

			shouldReturnErrors(schema, tooLongStrings, { type: ERROR_TYPES.RANGE });
		});

		it('does not return errors for strings with less than or equal to allowed length', () => {
			const schema = string().maxlength(5);
			const validStrings = ['', '1', 'gg', 'ooo', 'four', 'gosho'];

			shouldNotReturnErrors(schema, validStrings);
		});
	});

	describe('.pattern(): ', () => {
		it('returns errors for strings that do not match the provided regexp', () => {
			const schema = string().pattern(/^[a-z]{5,10}$/i);
			const invalidStrings = ['abc', 'gg', 'kot', 'tedi pish-e i krad-e i lyj-e i mam-i i zaplashv-a i gled-a lo6o', 'testtesttest'];

			shouldReturnErrors(schema, invalidStrings, { type: ERROR_TYPES.ARGUMENT });
		});

		it('does not return errors for strings that match the provided regexp', () => {
			const schema = string().pattern(/^[a-z]{5,10}$/i);
			const validStrings = ['Goshko', 'TEODORA', 'petya', 'chieftain', 'viktor', 'cykuchev'];

			shouldNotReturnErrors(schema, validStrings);
		});
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

		expect(schema.validate).to.be.a('function');
	});

	it('.minlength(), .maxlength(), .required() should return errors together with invalid strings', () => {
		const schema = string()
			.required()
			.minlength(7)
			.maxlength(14)
			.predicate(value => value.startsWith('cyki'));

		const invalidValues = ['tedi', 'gosho', new String('spica'), 'konsko pecheno sys shal', new String('konsko pecheno bez shal'), 'horsehorsehorsehorse'];

		const validationErrors = invalidValues
			.forEach(val => {
				const errorsArray = schema.validate(val, ROOT).errors;
				expect(errorsArray.filter(err => (err.type === ERROR_TYPES.RANGE) && (err.path === ROOT)).length).to.equal(1);
				expect(errorsArray.filter(err => (err.type === ERROR_TYPES.PREDICATE) && (err.path === ROOT)).length).to.equal(1);
			});

	});

	it('methods should return type error when validating value of incorrect type', () => {
		const schema = string()
			.minlength(10)
			.maxlength(20)
			.pattern(/^[0-9]+$/i)
			.predicate(v => v)
			.required();

		const root = 'arrayValue';
		const notStrings = [null, undefined, { prop: 'somevalue' }, ['lol'], 10, new Number(3), () => null, /testregexp/g];

		notStrings
			.map(v => schema.validate(v, root).errors)
			.forEach(errorsArray => {
				expect(errorsArray.length).to.equal(1);

				const [err] = errorsArray;

				expect(err.path).to.equal(root);
				expect(err.type).to.equal(ERROR_TYPES.TYPE);

				return err;
			});
	});

	it('methods should not return errors when .required() has not been called', () => {
		const schema = string()
			.minlength(10)
			.maxlength(20)
			.pattern(/^[0-9]+$/i)
			.predicate(v => v);

		const notStrings = [null, undefined, false, {}, [], String];

		shouldNotReturnErrors(schema, notStrings);
	});

	it('methods should not return errors for valid strings', () => {
		const schema = string()
			.required()
			.minlength(2)
			.maxlength(6)
			.pattern(/^[0-9]+$/i)
			.predicate(v => v[0] === '0');

		const validValues = ['012', '00', '001122', new String('01283')];

		shouldNotReturnErrors(schema, validValues);
	});
});
