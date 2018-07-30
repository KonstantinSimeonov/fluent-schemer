import test from 'ava';
import { string, bool, number, object, enumeration, ERROR_TYPES } from '../../';
import { shouldNotReturnErrors } from '../helpers';

test('ObjectSchema.type should return "object"', assert => {
	assert.is(object().type, 'object');
});

test('ObjectSchema.validateType(): should return true for objects that are not arrays and functions', assert => {
	assert.is(object().validateType({}), true);
	assert.is(object().validateType(Object.create(null)), true);
});

test('ObjectSchema.validateType(): should return false for arrays and functions', assert => {
	assert.is(object().validateType([]), false);
	assert.is(object().validateType(() => { }), false);
});

test('ObjectSchema.validateType(): should return true for arrays when .allowArrays() has been called', assert => {
	assert.is(object().allowArrays().validateType([]), true);
});

test('ObjectSchema.validate(): should return true for functions when .allowFunctions() has been called', assert => {
	assert.is(object().allowFunctions().validateType(() => { }), true);
});

test('Should return errors for invalid keys of expected type', assert => {
	const personSchema = object({
		name: string().minlength(3).maxlength(10).optional(),
		age: number().min(0).max(100).optional(),
		isStudent: bool()
	});
	const invalidPerson = {
		name: '1',
		age: -1
	};

	const {
            errors: {
                name: [nameError],
		age: [ageError],
		isStudent: [isStudentError]
            }
        } = personSchema.validate(invalidPerson, 'person');

	assert.is(nameError.type, ERROR_TYPES.RANGE);
	assert.is(ageError.type, ERROR_TYPES.RANGE);
	assert.is(isStudentError.type, ERROR_TYPES.TYPE);
});

test('Should return errors for keys with invalid values when .optional() has NOT been called on the subschemas', assert => {
	const softwareProjectSchema = object({
		mainLang: string(),
		loc: number(),
		size: number(),
		isPrivate: bool()
	});

	const invalidProject = {
		mainLang: null,
		loc: NaN,
		size: '10'
	};

	const {
            errors: {
                mainLang: [mainLangError],
		loc: [locError],
		size: [sizeError],
		isPrivate: [isPrivateError]
            }
        } = softwareProjectSchema.validate(invalidProject, 'gosho');

	assert.is(isPrivateError.type, ERROR_TYPES.TYPE);
	assert.is(locError.type, ERROR_TYPES.TYPE);
	assert.is(mainLangError.type, ERROR_TYPES.TYPE);
	assert.is(sizeError.type, ERROR_TYPES.TYPE);
});

test('Should return errors for keys with invalid values but of correct type when .optional() has been called', assert => {
	const postSchema = object({
		id: string().pattern(/^[0-9]{10}$/i).optional(),
		likesCount: number().integer().optional(),
		content: string().minlength(5).optional()
	});

	const invalidPost = {
		id: 'aaaaaaaaa',
		likesCount: -1.5,
		content: 'aa'
	};

	const {
			errors: {
			content: [contentError],
			id: [idError],
			likesCount: [likesCountError]
		}
	} = postSchema.validate(invalidPost, 'post');

	assert.is(contentError.path, 'post.content');
	assert.is(contentError.type, ERROR_TYPES.RANGE);

	assert.is(idError.path, 'post.id');
	assert.is(idError.type, ERROR_TYPES.ARGUMENT);

	assert.is(likesCountError.path, 'post.likesCount');
	assert.is(likesCountError.type, ERROR_TYPES.ARGUMENT);
});

test('Should not return errors for valid keys', assert => {
	const personSchema = object({
		name: string().minlength(3).maxlength(10),
		age: number().min(0).max(100),
		isStudent: bool()
	});
	const pencho = {
		name: 'pencho',
		age: 5,
		isStudent: false
	};

	shouldNotReturnErrors(assert, personSchema, [pencho]);
});

test('Should not return errors for keys that have value of invalid type but are optional', assert => {
	const animalSchema = object({
		breed: string().minlength(2).maxlength(10).optional(),
		weightKg: number().min(0).optional(),
		carnivore: bool().optional()
	});

	const funkyAnimals = [
		{ breed: 101, weightKg: 'doge', carnivore: 'nahman' },
		{ breed: null, weightKg: 'tosho' },
	];

	shouldNotReturnErrors(assert, animalSchema, funkyAnimals);
});

test('Nested object schemas should also return errors for invalid values', assert => {
	const compilerSchema = object({
		lang: object({
			name: string().minlength(1),
			crossPlatform: bool(),
			version: number().min(0)
		}),
		name: string().minlength(1)
	});

	const invalidCompiler = {
		name: 'Pesho',
		lang: {
			name: '',
			crossPlatform: 10,
			version: '39393'
		}
	};

	const {
            errors: {
                lang: {
                    name: [nameError],
		crossPlatform: [crossPlatformError],
		version: [versionError]
                }
            }
        } = compilerSchema.validate(invalidCompiler, 'compiler');

	assert.is(crossPlatformError.path, 'compiler.lang.crossPlatform');
	assert.is(crossPlatformError.type, ERROR_TYPES.TYPE);

	assert.is(nameError.path, 'compiler.lang.name');
	assert.is(nameError.type, ERROR_TYPES.RANGE);

	assert.is(versionError.path, 'compiler.lang.version');
	assert.is(versionError.type, ERROR_TYPES.TYPE);
});

test('Nesting should return error and not crash when the nested object is not present on the actual value', assert => {
	const schema = object({
		options: object({ opt: bool() })
	});

	const invalidObj = {};
	const { errors: { options: errors } } = schema.validate(invalidObj, 'obj');

	assert.is(errors.length, 1);

	const [error] = errors;

	assert.is(error.type, ERROR_TYPES.TYPE);
	assert.is(error.path, 'obj.options');
});

test('Nesting should not return errors when the nested schema is optional', assert => {
	const schema = object({
		options: object({ opts: string() }).optional()
	});

	shouldNotReturnErrors(assert, schema, [{}]);
});

test('object().keys() throws when argument is not a string schema', assert => {
	assert.throws(() => object().keys({}), TypeError);
	assert.throws(() => object.keys(number().min(0)), TypeError);
});

[
	[string().pattern(/^[a-z]$/), { h: 4, o: 10, r: 1, s: 7, e: 9 }],
	[enumeration('gosho', 'pesho'), { gosho: 1, pesho: [] }]
].forEach(
	([keySchema, input]) => test(`object.keys() returns no errors when object keys matches ${keySchema.type} schema`, assert => {
		const { errorsCount } = object().keys(keySchema).validate(input);
		assert.is(errorsCount, 0);
	})
);

test('object.keys() returns errors when object keys do not match provided schema', assert => {
	const idontcare = object().keys(string().maxlength(5));

	const somethingMap = {
		ivan: true,
		penka: false,
		dmitriy: true,
		kostya: false
	};

	const { errorsCount, errors } = idontcare.validate(somethingMap);
	assert.is(errorsCount, 2);
});

test('object().values() throws when argument is not a string schema', assert => {
	assert.throws(() => object().values({}), TypeError);
});

test('object.values() returns no errors when object values match provided schema', assert => {
	const alphabetMapSchema = object().values(number().integer());
	const letterOccurrences = {
		h: 4,
		o: 10,
		r: 1,
		s: 7,
		e: 9
	};

	const { errorsCount, errors } = alphabetMapSchema.validate(letterOccurrences);

	assert.is(errorsCount, 0);
});

test('object.values() returns errors when object values do not match provided schema', assert => {
	const idontcare = object().values(number().integer());

	const somethingMap = {
		penka: false,
		ivan: 1.5,
		dmitriy: 'pesho',
		kostya: 5
	};

	const { errorsCount, errors } = idontcare.validate(somethingMap);
	assert.is(errorsCount, 3);
});
