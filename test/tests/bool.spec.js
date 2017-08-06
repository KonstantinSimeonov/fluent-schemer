function boolTests(expect, fluentSchemer, testTemplates) {
	const ROOT = 'boolvalue',
		{ shouldReturnErrors, shouldNotReturnErrors } = testTemplates,
		{ bool } = fluentSchemer,
		{ ERROR_TYPES } = fluentSchemer;

	describe('BoolSchema individual methods', () => {
		it('BoolSchema.validateType(): should return true for true and false', () => {
			const schema = bool();

			expect(schema.validateType(true)).to.equal(true);
			expect(schema.validateType(false)).to.equal(true);
		});

		it('BoolSchema.validateType(): should return false for all other values', () => {
			const schema = bool(),
				values = [{}, [], [1], null, undefined, NaN, Infinity, 1, 0, '', 'plamyche', Function, Symbol, 'true', 'false'];

			const falseForAll = values.every(v => !schema.validateType(v));

			expect(falseForAll).to.equal(true);
		});

		it('BoolSchema.validate(): should return errors for values not of strict boolean type when .required() has been called', () => {
			const schema = bool().required(),
				values = [{}, [], [1], null, undefined, NaN, Infinity, 1, 0, '', 'plamyche', Function, Symbol, 'true', 'false'];

			shouldReturnErrors(schema, values, { type: ERROR_TYPES.TYPE });
		});

		it('BoolSchema.validate(): should not return errors for values of other types when required has not been called', () => {
			const schema = bool(),
				values = [{}, [], [1], null, undefined, NaN, Infinity, 1, 0, '', 'plamyche', Function, Symbol, 'true', 'false'];

			shouldNotReturnErrors(schema, values);
		});

		it('BoolSchema.validate(): should not return errors for strict bool values, regardless of required or not', () => {
			const schema = bool();

			shouldNotReturnErrors(schema, [true, false]);

			schema.required();

			shouldNotReturnErrors(schema, [true, false]);
		});

		it('BoolSchema.predicate(): .validate() should return error of type predicate when predicate is not fulfilled', () => {
			const schema = bool().predicate(x => x === false);

			const { errors: [predicateError] } = schema.validate(true, ROOT);

			expect(predicateError.type).to.equal(ERROR_TYPES.PREDICATE);
			expect(predicateError.path).to.equal(ROOT);
		});

		it('BoolSchema.predicate(): .validate() should not return error when predicate is fulfilled', () => {
			const schema = bool().predicate(x => x === false);

			shouldNotReturnErrors(schema, [false]);
		});
	});

	describe('BoolSchema method combinations', () => {
		it('All methods should enable chaining', () => {
			const schema = bool().required().not(false).predicate(x => x);

			expect(schema.validate).to.be.a('function');
		});

		it('NumberSchema .not() and .required() should cause .validate() to return their respective errors when used together', () => {
			const schema = bool().required().not(true);

			const { errors: [notError] } = schema.validate(true, ROOT);

			expect(notError.type).to.equal(ERROR_TYPES.ARGUMENT);
			expect(notError.path).to.equal(ROOT);

			const notBools = [NaN, 1, 0, {}, [], null, undefined, '', 'pesho i petya pisali .net'];

			shouldReturnErrors(schema, notBools, { type: ERROR_TYPES.TYPE });
		});
	});
}

if (typeof module !== 'undefined' && module.exports) {
	module.exports = boolTests;
}
