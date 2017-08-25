import { expect } from 'chai';
import { number, ERROR_TYPES } from '../../';
import { shouldReturnErrors, shouldNotReturnErrors } from '../helpers';

describe('NumberSchema individual methods', () => {
	describe('get type():', () => {
		it('returns "number"', () => expect(number().type).to.equal('number'));
	});

	describe('.validateType():', () => {

		it('.validateType(): returns false for all NaN values, Infinity and values that are not of type "number"', () => {
			const nans = [NaN, '1', '', {}, [], Infinity, null, undefined];
			const schema = number();
			const allAreFalse = nans.every(nan => !schema.validateType(nan));

			expect(allAreFalse).to.equal(true);
		});
		it('.validateType(): returns true for NaN when .allowNaN() is called', () => {
			expect(number().allowNaN().validateType(NaN)).to.equal(true);
		});

		it('.validateType(): returns true for Infinity when .allowInfinity() is called', () => {
			expect(number().allowInfinity().validateType(Infinity)).to.equal(true);
		});

		it('.validateType(): returns false for values of other type even when .allowNaN() has been called', () => {
			const notNumbers = ['1', {}, Function, [], true, null, undefined];
			const schema = number().allowNaN();
			const allAreNotNumbers = notNumbers.every(nan => !schema.validateType(nan));

			expect(allAreNotNumbers).to.equal(true);
		});

		it('.validateType(): returns true for primitive numbers and Number objects', () => {
			const primitiveNumbers = [0, 1, -5, Number.MAX_SAFE_INTEGER, Number.MAX_VALUE, 0x12A, 0b110, 0o127];
			const numberObjects = primitiveNumbers.map(n => new Number(n));
			const schema = number();

			const allAreNumbers = primitiveNumbers.concat(numberObjects).every(n => schema.validateType(n));
			expect(allAreNumbers).to.be.true;
		});

	});

	describe('.required():', () => {
		it('.required(): .validate() returns errors with invalid types when .required() has been called', () => {
			const schema = number().required();
			const NaNValues = [true, NaN, {}, [], 'kalata', null, undefined, Infinity];

			shouldReturnErrors(schema, NaNValues, { type: ERROR_TYPES.TYPE });
		});

		it('.required(): .validate() does not return errors when .required() has not been called', () => {
			const schema = number();
			const NaNValues = [true, NaN, {}, [], 'kalata', null, undefined, Infinity];

			shouldNotReturnErrors(schema, NaNValues);
		});

		it('.required(): .validate() does not return errors with valid numbers and .required() has been called', () => {
			const schema = number().required();
			const validNumbers = [1, new Number(2), new Number(0), -3, 0, -23929229, new Number('-2')];

			shouldNotReturnErrors(schema, validNumbers);
		});
	});

	describe('.not():', () => {
		it('.not(): returns errors regardless of wether a value is primitive or wrapped in object', () => {
			const schema = number().not(1, 5, -10);
			const invalidValues = [1, 5, -10].map(n => new Number(n));

			shouldReturnErrors(schema, invalidValues, { type: ERROR_TYPES.ARGUMENT });
		});
	});

	describe('.min():', () => {
		it('throws with strings that are numeric', () => {
			expect(() => number().min('6')).to.throw(TypeError);
		});

		it('throws with NaN', () => {
			expect(() => number().min(NaN)).to.throw(TypeError);
		});

		it('.min(): .validate() returns errors for values below the passed minimal value', () => {
			const schema = number().min(10);
			const smallNumbers = [1, 2, -5, 0, new Number(9), new Number(-3), 9];

			shouldReturnErrors(schema, smallNumbers, { type: ERROR_TYPES.RANGE });
		});

		it('.min(): .validate() does not return errors for values in correct range', () => {
			const schema = number().min(-10);
			const numbers = [-10, -9, -5, new Number(-4), 0, new Number(0), 20];

			shouldNotReturnErrors(schema, numbers);
		});
	});

	describe('.max():', () => {
		it('throws with strings that are numeric', () => {
			expect(() => number().max('6')).to.throw(TypeError);
		});

		it('throws with NaN', () => {
			expect(() => number().max(NaN)).to.throw(TypeError);
		});

		it('.max(): .validate() returns errors for values greater than the maximum', () => {
			const schema = number().max(30);
			const greaterNumbers = [new Number(40), 40, 44, 100, Number.MAX_SAFE_INTEGER];

			shouldReturnErrors(schema, greaterNumbers, { type: ERROR_TYPES.RANGE });
		});

		it('.max(): .validate() does not return errors for values lesser than or equal to the maximum', () => {
			const schema = number().max(5);
			const validNumbers = [5, new Number(5), new Number(-3), new Number(0), 4, -11, 0, -4];

			shouldNotReturnErrors(schema, validNumbers);
		});
	});

	describe('.integer():', () => {
		it('.integer(): .validate() returns errors for floating point numbers', () => {
			const schema = number().integer();
			const floats = [5.1, 3.4, -1.5, new Number(5.1), new Number(-3.14), new Number(0.5)];

			shouldReturnErrors(schema, floats, { type: ERROR_TYPES.ARGUMENT });
		});

		it('.integer(): .validate() does not return errors for integer numbers', () => {
			const schema = number().integer();
			const integers = [-10, 10, Number.MAX_SAFE_INTEGER, new Number(5), new Number(1.0), new Number(-2.0)];

			shouldNotReturnErrors(schema, integers);
		});
	});

	describe('.safeInteger():', () => {
		it('.safeInteger(): .validate() returns errors for unsafe integers', () => {
			const schema = number().safeInteger();
			const unsafeInts = [4, 6, 8]
				.map(x => x + Number.MAX_SAFE_INTEGER)
				.concat([-4, -6, -8].map(x => x - Number.MAX_SAFE_INTEGER));

			shouldReturnErrors(schema, unsafeInts, { type: ERROR_TYPES.RANGE });
		});

		it('.safeInteger(): .validate() keeps values from .min() and .max() if they are safe', () => {
			const schema = number().min(-33).max(33).safeInteger();
			const values = [-35, 35];

			shouldReturnErrors(schema, values, { type: ERROR_TYPES.RANGE });
		});
	});
});

describe('NumberSchema method combinations', () => {
	it('All methods should enable chaining', () => {
		const schema = number()
			.required()
			.min(5)
			.max(10)
			.allowNaN()
			.allowInfinity()
			.not(5.2);

		expect(schema.validate).to.be.a('function');
	});

	it('.min(): should not return errors for NaN when .allowNaN() has been called', () => {
		const schema = number().allowNaN().min(5);
		const { errorsCount } = schema.validate(NaN, 'tears');

		expect(errorsCount).to.equal(0);
	});

	it('.max(): should not return errors for NaN when .allowNaN() has been called', () => {
		const schema = number().allowNaN().max(5);
		const { errorsCount } = schema.validate(NaN, 'tears');

		expect(errorsCount).to.equal(0);
	});

	it(' .min() .max() .required() .integer() should return errors for invalid numbers', () => {
		const schema = number()
			.required()
			.min(-5)
			.max(5)
			.integer();

		// test with value greater than max
		const { errors: errorsWithGreaterThanMax } = schema.validate(10.5, 'value');

		const rangeErrorGreater = errorsWithGreaterThanMax.find(err => err.type === ERROR_TYPES.RANGE),
			argumentErrorsGreater = errorsWithGreaterThanMax.find(err => err.type === ERROR_TYPES.ARGUMENT);

		expect(rangeErrorGreater.path).to.equal('value');
		expect(argumentErrorsGreater.path).to.equal('value');

		// test with value lesser than min
		const { errors: errorsWithLessThanMin } = schema.validate(-5.2, 'value');

		const rangeErrorLesser = errorsWithLessThanMin.find(err => err.type === ERROR_TYPES.RANGE),
			argumentErrorsLesser = errorsWithLessThanMin.find(err => err.type === ERROR_TYPES.ARGUMENT);

		expect(rangeErrorLesser.path).to.equal('value');
		expect(argumentErrorsLesser.path).to.equal('value');
	});

	it('.not() should return errors when diff is less than specified precision via .precision()', () => {
		const schema = number()
			.not(1.0001, 2.5111, 3.0002)
			.precision(0.0001);

		const numbers = [1.00005, 2.51108, 3.00021];
		const numberObjects = numbers.map(n => new Number(n));

		shouldReturnErrors(schema, numbers.concat(numberObjects), { type: ERROR_TYPES.ARGUMENT });
	});

	it('.not() should not return errors when diff is more than specified precision via .precision()', () => {
		const schema = number()
			.not(1.0001, 2.5111, 3.0002)
			.precision(0.000001);

		const numbers = [1.00005, 2.51108, 3.00021],
			numberObjects = numbers.map(n => new Number(n));

		shouldNotReturnErrors(schema, numbers.concat(numberObjects));
	});

	it('.min() .max() .required() .not() should return errors for invalid values', () => {
		const schema = number()
			.required()
			.min(-10)
			.max(0)
			.not(-5, -3, -1);

		shouldReturnErrors(schema, [-15, -16, 1], { type: ERROR_TYPES.RANGE });
		shouldReturnErrors(schema, [-5, -3, -1], { type: ERROR_TYPES.ARGUMENT });
		shouldReturnErrors(schema, [null, {}, '', NaN], { type: ERROR_TYPES.TYPE });
	});

	it('.min() .max() .required() .integer() should not return errors for valid values', () => {
		const schema = number()
			.required()
			.min(-30)
			.max(30)
			.integer();
		const validPrimitiveNumbers = [-30, 15, 0, 1, 5, 30];
		const validNumberObjects = validPrimitiveNumbers.map(n => new Number(n));

		shouldNotReturnErrors(schema, validPrimitiveNumbers.concat(validNumberObjects));
	});
});
