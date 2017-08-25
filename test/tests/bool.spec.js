import { expect } from 'chai';
import { bool, ERROR_TYPES } from '../../';
import { shouldReturnErrors, shouldNotReturnErrors } from '../helpers';

const ROOT = 'boolvalue';

describe('BoolSchema individual methods', () => {
	describe('get type(): ', () => {
		it('returns "bool"', () => expect(bool().type).to.equal('bool'))
	});

	describe('.validateType(): ', () => {
		it('returns true for true and false', () => {
			const schema = bool();

			expect(schema.validateType(true)).to.equal(true);
			expect(schema.validateType(false)).to.equal(true);
		});

		it('returns false for all other values', () => {
			const schema = bool();
			const values = [{}, [], [1], null, undefined, NaN, Infinity, 1, 0, '', 'plamyche', Function, Symbol, 'true', 'false'];

			const falseForAll = values.every(v => !schema.validateType(v));

			expect(falseForAll).to.equal(true);
		});
	});

	describe('.validate(): ', () => {
		it('returns errors for values not of strict boolean type when .required() has been called', () => {
			const schema = bool().required();
			const values = [{}, [], [1], null, undefined, NaN, Infinity, 1, 0, '', 'plamyche', Function, Symbol, 'true', 'false'];

			shouldReturnErrors(schema, values, { type: ERROR_TYPES.TYPE });
		});

		it('does not return errors for values of other types when required has not been called', () => {
			const schema = bool();
			const values = [{}, [], [1], null, undefined, NaN, Infinity, 1, 0, '', 'plamyche', Function, Symbol, 'true', 'false'];

			shouldNotReturnErrors(schema, values);
		});

		it('does not return errors for strict bool values, regardless of required or not', () => {
			const schema = bool();
			shouldNotReturnErrors(schema, [true, false]);
			schema.required();
			shouldNotReturnErrors(schema, [true, false]);
		});
	});

	describe('.predicate(): ', () => {
		it('returns error of type predicate when predicate is not fulfilled', () => {
			const schema = bool().predicate(x => x === false);
			const { errors: [predicateError] } = schema.validate(true, ROOT);

			expect(predicateError.type).to.equal(ERROR_TYPES.PREDICATE);
			expect(predicateError.path).to.equal(ROOT);
		});

		it('does not return error when predicate is fulfilled', () => {
			const schema = bool().predicate(x => x === false);

			shouldNotReturnErrors(schema, [false]);
		});
	});
});

describe('BoolSchema method combinations', () => {
	it('All methods should enable chaining', () => {
		const schema = bool().required().not(false).predicate(x => x);

		expect(schema.validate).to.be.a('function');
	});

	it('.not() and .required() should cause .validate() to return their respective errors when used together', () => {
		const schema = bool().required().not(true);

		const { errors: [notError] } = schema.validate(true, ROOT);

		expect(notError.type).to.equal(ERROR_TYPES.ARGUMENT);
		expect(notError.path).to.equal(ROOT);

		const notBools = [NaN, 1, 0, {}, [], null, undefined, '', 'pesho i petya pisali .net'];

		shouldReturnErrors(schema, notBools, { type: ERROR_TYPES.TYPE });
	});
});
