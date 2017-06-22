function arrayTests(expect, getFluentSchemer, testTemplates) {
	const { shouldReturnErrors, shouldNotReturnErrors } = testTemplates;
	const schemas = getFluentSchemer().createInstance().schemas;
	const { array, string, number, bool, object } = schemas;
	const { ERROR_TYPES } = getFluentSchemer().errorsFactory;

	function typeGetterTest(type) {
		it(`returns array<${type}> type for subschema of type ${type}`, () => {
			const schema = array(schemas[type]());
			expect(schema.type).to.equal(`array<${type}>`);
		});
	}

	function validateTypeTest(subschemaType, arrayToValidate, valid = true) {
		const validStr = valid.toString();

		it(`returns "${validStr}" for array<${subschemaType}> when array contains only values of type ${subschemaType}`, () => {
			const typedArraySchema = array(schemas[subschemaType]());
			const isValidArray = typedArraySchema.validateType(arrayToValidate);
			expect(isValidArray).to.be[validStr];
		});
	}

	describe('ArraySchema', () => {
		describe('get type():', () => {
			Object.keys(schemas).filter(x => x !== 'array' && x !== 'union').forEach(typeGetterTest);

			it('returns array<any> for untyped array', () => {
				expect(array().type).to.equal('array<any>');
			});
		});

		describe('validateType(): ', () => {
			it('returns "true" for untyped array with values of distinct types', () => {
				const schema = array(),
					values = [[1, 2, 3], ['adf', true, {}], [null, undefined, []]];

				const allValid = values.every(untyped => schema.validateType(untyped));

				expect(allValid).to.equal(true);
			});

			it('returns "true" for empty array', () => {
				expect(array(bool()).validateType([])).to.equal(true);
			});

			validateTypeTest('string', ['a', 'spica', 'huffman', 'beer', new String('fire')]);
			validateTypeTest('bool', [true, false, new Boolean(true)]);
			validateTypeTest('number', [1, 2, 3, 4, 10, -20, new Number(10), new Number(0)]);
			validateTypeTest('object', [{}, { zdr: 'kp' }]);

			it('returns `false` for arrays with values of invalid types', () => {
				const invalidStrings = [null, 1, NaN, {}, [], () => 1, true, undefined];
				for (const invalidStr of invalidStrings) {
					expect(array(string()).validateType([invalidStr])).to.equal(false);
				}

				const invalidBools = [null, undefined, 1, 0, '', 'sdf', {}, [], () => true];
				for (const invalidB of invalidBools) {
					expect(array(bool()).validateType([invalidB])).to.equal(false);
				}

				const invalidNumber = [null, undefined, NaN, Infinity, '', '10', [], {}, () => 10, false];
				for (const invalidNum of invalidNumber) {
					expect(array(number()).validateType([invalidNum])).to.equal(false);
				}

				const invalidObjects = [1, 2, [], () => { }, 'dsf', true];
				for (const invalidObj of invalidObjects) {
					expect(array(object()).validateType([invalidObj])).to.equal(false);
				}
			});
		});

		describe('required():', () => {
			it('validation returns error when value is not an array', () => {
				const schema = array(string()).required(),
					notArrays = [1, 2, 0, {}, { length: 1 }, () => 1, 'dsfsdf'];

				shouldReturnErrors(schema, notArrays, { type: ERROR_TYPES.TYPE });
			});

			it('validation doesn`t return errors when array is present and has values of valid type', () => {
				const schema = array(number()),
					numberArrays = [[1, 2, 0, 10], [new Number(10), 5, new Number(0)]];

				shouldNotReturnErrors(schema, numberArrays[0]);
				shouldNotReturnErrors(schema, numberArrays[1]);
			});
		});

		describe('minlength():', () => {
			it('validation returns range error for too arrays with length < minlength', () => {
				const schema = array().minlength(5),
					values = [[], ['a', 'tedi'], ['steven', 'kon', 'beer', 'coding'], ['kyci the mermaid']];

				shouldReturnErrors(schema, values, { type: ERROR_TYPES.RANGE });
			});
		});

		describe('maxlength():', () => {
			it('validation returns range error for arrays with length > maxlength', () => {
				const schema = array().maxlength(2),
					values = [[1, 2, 3], ['sdgfds', 'sdgfdg', 'errere', null], [true, false, true, false, true], [[], [], []]];

				shouldReturnErrors(schema, values, { type: ERROR_TYPES.RANGE });
			});
		});

		describe('withLength():', () => {
			it('validation returns errors for arrays with different length', () => {
				const schema = array().withLength(3),
					values = [[1, 2], [], [1, 2, 3, 4]];

				shouldReturnErrors(schema, values, { type: ERROR_TYPES.RANGE });
			});

			it('validation doesn`t return errors for arrays with same length', () => {
				const schema = array().withLength(3),
					values = [[1, 2, 6], ['a', 'b', 'gosho'], [null, undefined, 'stamat']];

				shouldNotReturnErrors(schema, values);
			});
		});

		describe('distinct():', () => {
			it('validation returns error for arrays with duplicate values', () => {
				const schema = array().distinct(),
					object = {},
					values = [[1, 1, 2, 3, 4, 5], ['a', 'b', 'c', 'gosho', 'd', 'gosho'], [true, true], [object, 1, 2, object]];

				shouldReturnErrors(schema, values, { type: ERROR_TYPES.ARGUMENT });
			});

			it('validation doesn`t return error for arrays with distinct values', () => {
				const schema = array().distinct(),
					values = [[1, 2, 3], ['a', 'b', 'gosho'], [{}, {}]];

				shouldNotReturnErrors(schema, values);
			});
		});

		describe('validate():', () => {
			it('returns error for first invalid value only', () => {
				const schema = array(number().integer()).required(),
					values = [1, 2, 0, new Number(5), new Number(1.10), new Number(2.5)];

				const { errors } = schema.validate(values, 'nums');
				expect(errors.length).to.equal(1);

				const [err] = errors;

				expect(err.path).to.equal('nums[4]');
				expect(err.type).to.equal(ERROR_TYPES.ARGUMENT);
			});
		});
	});

	describe('method combinations', () => {
		it('All methods should enable chaining', () => {
			const schema = array(number()).withLength(5).required().distinct().predicate(x => true);

			expect(schema.validate).to.be.a('function');
		});
	});

	describe('using subschemas', () => {
		it('returns errors when nested schema doesnt match values', () => {
			const schema = array(array()).required(),
				values = [[1, 2], ['dfdf'], [{ length: 1 }]];

			shouldReturnErrors(schema, values, { type: ERROR_TYPES.TYPE });
		});

		it('returns errors for multiple levels of nesting', () => {
			const schema = array(array(array(number()))).required(),
				values = [
					[[['asadd', 23]]],
					[[1, 2, 3]],
					[9, 10, -5]
				];

			shouldReturnErrors(schema, values, { type: ERROR_TYPES.TYPE });
		});

		it('returns type errors for valid level of nesting but invalid type of values', () => {
			const schema = array(array(array(bool()))).required(),
				values = [
					[[[0, 1]]],
					[[['true']]],
					[[[null]]],
					[[[undefined]]]
				];

			shouldReturnErrors(schema, values, { type: ERROR_TYPES.TYPE });
		});

		it('returns errors for array of objects', () => {
			const schema = array(object({ name: string().required() })).required(),
				values = [
					null,
					undefined,
					{},
					{ name: 1 },
					{ name: null }
				];

			shouldReturnErrors(schema, values, { type: ERROR_TYPES.TYPE });
		});

		it('doesn`t return errors for an array of valid objects', () => {
			const schema = array(object({ name: string().required() })).required(),
				values = [
					[{ name: 'gosho' }],
					[{ name: 'tedi' }],
					[{ name: 'kyci' }],
					[{ name: 'bychveto' }]
				];

			shouldNotReturnErrors(schema, values);
		});
	});
}


if (typeof module !== 'undefined' && module.exports) {
	module.exports = arrayTests;
}
