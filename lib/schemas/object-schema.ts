import { IValidationError } from '../contracts';
import { createCompositeError, createError, ERROR_TYPES } from '../errors';
import * as is from '../is';
import BaseSchema from './base-schema';
import StringSchema from './string-schema';
import valid from './valid-schema';

export const name = 'object';

const typeName = 'object';

/**
 * Provides validation for objects. Can be used to
 * create validation schemas for arbitarily deeply nested
 * objects.
 *
 * @export
 * @class ObjectSchema
 * @extends {BaseSchema}
 */
export default class ObjectSchema<TValues = any> extends BaseSchema<object> {
	private _state: {
		subschema: { [id: string]: BaseSchema<TValues> };
		allowFunctions: boolean;
		allowArrays: boolean;
		keysSchema: BaseSchema<string>;
		valuesSchema: BaseSchema<TValues>;
	};

	/**
	 * Creates an instance of ObjectSchema.
	 * Accepts an object, whose keys are schemas themselves.
	 * The schemas on those keys will be used to validate values on the same
	 * keys in validated values.
	 * @param {{ [id: string]: BaseSchema }} subschema Object schema whose keys have schemas as their values.
	 * @memberof ObjectSchema
	 *
	 * @example
	 * object({
	 *     name: string().minlength(3).required(),
	 *     age: number().min(0).integer().required()
	 * }).required();
	 */
	public constructor(subschema: { [id: string]: BaseSchema<TValues> }) {
		super();
		this._state = {
			allowArrays: false,
			allowFunctions: false,
			keysSchema: valid,
			subschema: subschema || {},
			valuesSchema: valid,
		};
	}

	/**
	 * Returns 'object'.
	 *
	 * @readonly
	 * @memberof ObjectSchema
	 */
	public get type() {
		return typeName;
	}

	/**
	 * Returns true for everything that is an object, except for Arrays and Functions.
	 * {null} is not considered of type object.
	 * This behaviour can be changed through the allowArrays() and allowFunctions() methods.
	 * @see ObjectSchema.allowArray()
	 * @see ObjectSchema.allowFunctions()
	 *
	 * @param {*} value The value that will be type checked.
	 * @returns {boolean}
	 * @memberof ObjectSchema
	 *
	 * @example
	 * object().validateType({}); // fine
	 * object().validateType([]); // error
	 * object().validateType(() => {}); // error
	 * object().validateType(new String('5')); // error
	 * object().validateType(new Number(5)); // error
	 */
	public validateType(value: any): value is object {
		const valueIsArray = is.Array(value);
		const valueIsFunction = is.Function(value);

		return is.Obj(value)
			|| (this._state.allowArrays && valueIsArray)
			|| (this._state.allowFunctions && valueIsFunction);
	}

	/**
	 * Array will be considered of type object.
	 *
	 * @returns {this}
	 * @memberof ObjectSchema
	 *
	 * @example
	 * object().allowArrays().required().validate([1, 2, 3]); // fine
	 */
	public allowArrays() {
		this._state.allowArrays = true;

		return this;
	}

	/**
	 * Functions will be considered of type object.
	 *
	 * @returns {this}
	 * @memberof ObjectSchema
	 *
	 * @example
	 * object().allowFunctions.required().validate(() => {}); // fine
	 */
	public allowFunctions() {
		this._state.allowFunctions = true;

		return this;
	}

	public keys(keysSchema: StringSchema) {
		if (!(keysSchema instanceof StringSchema)) {
			throw new TypeError('Schema for object keys must be a StringSchema');
		}

		this._state.keysSchema = keysSchema;

		return this;
	}

	public values(valuesSchema: BaseSchema<TValues>) {
		if (!(valuesSchema instanceof BaseSchema)) {
			throw new TypeError('Schema for object values must be a schema instance');
		}

		this._state.valuesSchema = valuesSchema;

		return this;
	}
	public validate(value: any, path = '', currentErrors?: IValidationError[]) {
		if (!this.validateType(value)) {
			if (this._required) {
				const typeError = {
					corrected: this.validateValueWithCorrectType({}, path).corrected,
					errors: [createError(ERROR_TYPES.TYPE, `Expected type ${this.type} but got ${typeof value}`, path)],
					errorsCount: 1,
				};

				if (currentErrors) {
					currentErrors.push(typeError.errors[0]);
				}

				return typeError;
			}

			return { errorsCount: 0, errors: [], corrected: value };
		}

		return this.validateValueWithCorrectType(value, path);
	}

	protected validateValueWithCorrectType(value: any, path?: string) {
		const errorsMap = Object.create(null);
		const correctedObj: any = {};
		let currentErrorsCount = 0;

		/* tslint:disable forin */
		for (const key in this._state.subschema) {
			const {
				errors,
				errorsCount,
				corrected: correctedValue,
			} = this._state.subschema[key].validate(value[key], path ? path + '.' + key : key);
			currentErrorsCount += errorsCount;
			errorsMap[key] = errors;
			correctedObj[key] = correctedValue;
		}

		const correctedKeys: string[] = [];
		const { valuesSchema, keysSchema } = this._state;
		for (const key in value) {
			const errorsForPath: IValidationError[] = [];

			const correctedKey = keysSchema.validate(key, key, errorsForPath).corrected;
			const correctedValue = valuesSchema.validate(value[key], key, errorsForPath).corrected;

			if (!errorsForPath.length) {
				continue;
			}

			correctedObj[correctedKey] = correctedValue;
			if (correctedKey !== key) {
				correctedKeys.push(key);
			}

			currentErrorsCount += errorsForPath.length;
			if (errorsMap[key]) {
				errorsForPath.push(errorsMap[key]);
			}

			errorsMap[key] = createCompositeError(`${path}.${key}`, errorsForPath);
		}
		/* tslint:enable forin */

		const corrected = { ...value, ...correctedObj };
		correctedKeys.forEach(key => delete corrected[key]);

		return {
			corrected,
			errors: errorsMap,
			errorsCount: currentErrorsCount,
		};
	}
}
