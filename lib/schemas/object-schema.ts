import * as is from '../is';
import BaseSchema from './base-schema';

export const name = 'object';

const typeName = 'object';

type TObjectSchemaState = {
	subschema: { [id: string]: BaseSchema };
	allowFunctions: boolean;
	allowArrays: boolean;
};

/**
 * Provides validation for objects. Can be used to
 * create validation schemas for arbitarily deeply nested
 * objects.
 *
 * @export
 * @class ObjectSchema
 * @extends {BaseSchema}
 */
export default class ObjectSchema extends BaseSchema {
	private _state: TObjectSchemaState;

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
	public constructor(subschema: { [id: string]: BaseSchema }) {
		super();
		this._state = {
			allowArrays: false,
			allowFunctions: false,
			subschema: subschema || {},
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
	public validateType(value: any) {
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

	protected validateValueWithCorrectType(value: any, path?: string) {
		const errorsMap = Object.create(null);

		let currentErrorsCount = 0;

		/* tslint:disable forin */
		for (const key in this._state.subschema) {
			const { errors, errorsCount } = this._state.subschema[key].validate(value[key], path ? path + '.' + key : key);
			currentErrorsCount += errorsCount;
			errorsMap[key] = errors;
		}
		/* tslint:enable forin */

		return { errors: errorsMap, errorsCount: currentErrorsCount };
	}
}
