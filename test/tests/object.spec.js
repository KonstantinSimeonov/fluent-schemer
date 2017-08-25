import { expect } from 'chai';
import { string, bool, number, object, ERROR_TYPES } from '../../';
import { shouldNotReturnErrors } from '../helpers';

describe('ObjectSchema keys', () => {
	it('ObjectSchema.type should return "object"', () => {
		expect(object().type).to.equal('object');
	});

	it('ObjectSchema.validateType(): should return true for objects that are not arrays and functions', () => {
		expect(object().validateType({})).to.equal(true);
		expect(object().validateType(Object.create(null))).to.equal(true);
	});

	it('ObjectSchema.validateType(): should return false for arrays and functions', () => {
		expect(object().validateType([])).to.equal(false);
		expect(object().validateType(() => { })).to.equal(false);
	});

	it('ObjectSchema.validateType(): should return true for arrays when .allowArrays() has been called', () => {
		expect(object().allowArrays().validateType([])).to.equal(true);
	});

	it('ObjectSchema.validate(): should return true for functions when .allowFunctions() has been called', () => {
		expect(object().allowFunctions().validateType(() => { })).to.equal(true);
	});

	it('Should return errors for invalid keys of expected type', () => {
		const personSchema = object({
			name: string().minlength(3).maxlength(10),
			age: number().min(0).max(100),
			isStudent: bool().required()
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

		expect(nameError.type).to.equal(ERROR_TYPES.RANGE);
		expect(ageError.type).to.equal(ERROR_TYPES.RANGE);
		expect(isStudentError.type).to.equal(ERROR_TYPES.TYPE);
	});

	it('Should return errors for keys with invalid values when .required() has been called on the subschemas', () => {
		const softwareProjectSchema = object({
			mainLang: string().required(),
			loc: number().required(),
			size: number().required(),
			isPrivate: bool().required()
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

		expect(isPrivateError.type).to.equal(ERROR_TYPES.TYPE);
		expect(locError.type).to.equal(ERROR_TYPES.TYPE);
		expect(mainLangError.type).to.equal(ERROR_TYPES.TYPE);
		expect(sizeError.type).to.equal(ERROR_TYPES.TYPE);
	});

	it('Should return errors for keys with invalid values but of correct type when .required() has not been called', () => {
		const postSchema = object({
			id: string().pattern(/^[0-9]{10}$/i),
			likesCount: number().integer(),
			content: string().minlength(5)
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

		expect(contentError.path).to.equal('post.content');
		expect(contentError.type).to.equal(ERROR_TYPES.RANGE);

		expect(idError.path).to.equal('post.id');
		expect(idError.type).to.equal(ERROR_TYPES.ARGUMENT);

		expect(likesCountError.path).to.equal('post.likesCount');
		expect(likesCountError.type).to.equal(ERROR_TYPES.ARGUMENT);
	});

	it('Should not return errors for valid keys', () => {
		const personSchema = object({
			name: string().minlength(3).maxlength(10),
			age: number().min(0).max(100),
			isStudent: bool().required()
		});
		const pencho = {
			name: 'pencho',
			age: 5,
			isStudent: false
		};

		shouldNotReturnErrors(personSchema, [pencho]);
	});

	it('Should not return errors for keys that have value of invalid type but are not required', () => {
		const animalSchema = object({
			breed: string().minlength(2).maxlength(10),
			weightKg: number().min(0),
			carnivore: bool()
		});

		const funkyAnimals = [
			{ breed: 101, weightKg: 'doge', carnivore: 'nahman' },
			{ breed: null, weightKg: 'tosho' },
		];

		shouldNotReturnErrors(animalSchema, funkyAnimals);
	});
});

describe('ObjectSchema nesting', () => {
	it('Nested object schemas should also return errors for invalid values', () => {
		const compilerSchema = object({
			lang: object({
				name: string().minlength(1).required(),
				crossPlatform: bool().required(),
				version: number().min(0).required()
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

		expect(crossPlatformError.path).to.equal('compiler.lang.crossPlatform');
		expect(crossPlatformError.type).to.equal(ERROR_TYPES.TYPE);

		expect(nameError.path).to.equal('compiler.lang.name');
		expect(nameError.type).to.equal(ERROR_TYPES.RANGE);

		expect(versionError.path).to.equal('compiler.lang.version');
		expect(versionError.type).to.equal(ERROR_TYPES.TYPE);
	});

	it('Nesting should return error and not crash when the nested object is not present on the actual value', () => {
		const schema = object({
			options: object({ opt: bool() }).required()
		});

		const invalidObj = {};
		const { errors: { options: errors } } = schema.validate(invalidObj, 'obj');

		expect(errors.length).to.equal(1);

		const [error] = errors;

		expect(error.type).to.equal(ERROR_TYPES.TYPE);
		expect(error.path).to.equal('obj.options');
	});

	it('Nesting should not return errors when the nested schema is not required', () => {
		const schema = object({
			options: object({ opts: string() })
		});

		shouldNotReturnErrors(schema, [{}, null]);
	});
});
