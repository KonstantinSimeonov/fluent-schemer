import { expect } from 'chai';
import { union, string, number, bool, array, ERROR_TYPES } from '../../';
import { shouldReturnErrors, shouldNotReturnErrors } from '../helpers';

describe('UnionSchema individual methods', () => {
	describe('get type(): ', () => {
		it('UnionSchema.type: should return concatenation of all possible types', () => {
			const schema = union(number(), string(), bool());

			expect(schema.type).to.equal([number().type, string().type, bool().type].join('|'));
		});
	});

	describe('.vadlidateType(): ', () => {
		it('UnionSchema.validateType(): should return false for values that are not of one of the listed types', () => {
			const schema = union(string(), number()).required();
			const values = [null, undefined, true, {}, [], () => 1];

			for (const v of values) {
				expect(schema.validateType(v)).to.equal(false);
			}
		});

		it('UnionSchema.validateType(): should return true for values that are of at least one of the listed types', () => {
			const schema = union(number(), bool()).required();
			const values = [1, true, false, 0, new Number(10), new Boolean(true)];

			const allAreTrue = values.every(v => schema.validateType(v));

			expect(allAreTrue).to.equal(true);
		});

	});

	describe('.required(): ', () => {
		it('.validate() does not return errors when no type of the union matches when .required() has not been called', () => {
			const schema = union(number(), bool());
			const notNumbersOrBools = [NaN, Infinity, {}, [], () => true, null, undefined];

			shouldNotReturnErrors(schema, notNumbersOrBools);
		});

		it('.validate() returns errors when .required() been called', () => {
			const schema = union(number(), bool()).required();
			const notNumbersOrBools = [NaN, Infinity, {}, [], () => true, null, undefined];

			shouldReturnErrors(schema, notNumbersOrBools, { type: ERROR_TYPES.TYPE });
		});
	});

	describe('.validate(): ', () => {
		it('does not return errors when at least one of the schema types match the value', () => {
			const schema = union(string(), array(number().integer())).required();
			const values = ['zdrkp', new String('jesuisstring'), [], [1, 2], [new Number(0), 3], new Array()];

			shouldNotReturnErrors(schema, values);
		});

		it('returns errors when the values satisfies the conditions of no schema', () => {
			const schema = union(string().minlength(5), number().integer()).required();
			// expected errors are of type range error for too short strings and argument errors for floating point numbers
			const shortStrings = ['js', '', new String('1')];
			const floats = [1.5, -0.5, new Number(2.5)];

			shouldReturnErrors(schema, shortStrings, { type: ERROR_TYPES.RANGE });
			shouldReturnErrors(schema, floats, { type: ERROR_TYPES.ARGUMENT });
		});
	});
});
