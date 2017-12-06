import { createError, ERROR_TYPES } from '../errors';
import * as is from '../is';
import BaseSchema from './base-schema';

export const name = 'string';

const typeName = 'string';

type TStringSchemaState = {
	minlength?: number;
	maxlength?: number;
	pattern?: RegExp
};

/**
 * Provides type checking for strings and validations for min/max string length and regexp matching.
 *
 * @export
 * @class StringSchema
 * @extends {BaseSchema}
 */
export default class StringSchema extends BaseSchema<string> {
	private _state: TStringSchemaState;

	/**
	 * Creates an instance of StringSchema.
	 * @memberof StringSchema
	 */
	constructor() {
		super();
		this._state = {};
	}

	/**
	 * Returns 'string'
	 * @readonly
	 * @memberof StringSchema
	 */
	public get type() {
		return typeName;
	}

	/**
	 * Every primitive string and String object is considered of type string.
	 *
	 * @param {*} value The value that will be type checked.
	 * @returns {boolean}
	 * @memberof StringSchema
	 */
	public validateType(value: any): value is string {
		return is.String(value);
	}

	/**
	 * Specify a minimal string length.
	 *
	 * @throws {TypeError} If the provided value is not numerical or is NaN, negative of Infinite.
	 * @param {number} length The minimal allowed length.
	 * @returns {this}
	 * @memberof StringSchema
	 */
	public minlength(length: number) {
		if (!is.ValidLength(length)) {
			throw new TypeError(`Expected finite positive number as minimal string length, but got ${length}`);
		}

		if (!is.Undefined(this._state.minlength)) {
			throw new Error('Cannot set minlength twice for a number schema instance');
		}

		this._state.minlength = length;

		this.pushValidationFn((value: string, path: string) => {
			if (!is.Undefined(this._state.minlength) && this._state.minlength > value.length) {
				return createError(
					ERROR_TYPES.RANGE,
					`Expected string with length at least ${this._state.minlength} but got ${value.length}`,
					path,
				);
			}
		});

		return this;
	}

	/**
	 * Specify a maximal string length.
	 *
	 * @throws {TypeError} If the provided value is not numerical or is NaN, negative of Infinite.
	 * @param {number} length The maximal allowed length.
	 * @returns {this}
	 * @memberof StringSchema
	 */
	public maxlength(length: number) {
		if (!is.ValidLength(length)) {
			throw new TypeError(`Expected finite positive number as minimal string length, but got ${length}`);
		}

		if (!is.Undefined(this._state.maxlength)) {
			throw new Error('Cannot set maxlength twice for a number schema instance');
		}

		this._state.maxlength = length;

		this.pushValidationFn((value: string, path: string) => {
			if (!is.Undefined(this._state.maxlength) && this._state.maxlength < value.length) {
				return createError(
					ERROR_TYPES.RANGE,
					`Expected string with length at most ${this._state.minlength} but got ${value.length}`,
					path,
				);
			}
		});

		return this;
	}

	/**
	 * Specify a javascript regular expression to match against values.
	 * If regexp.test(value) succeeds, it is assumed that the value matches the pattern.
	 * String literals cannot be passed as patterns.
	 *
	 * @throws {TypeError} If the provided value is not of type regular expressions.
	 * @param {RegExp} regexp The regular expression that will be used to test the values.
	 * @returns {this}
	 * @memberof StringSchema
	 */
	public pattern(regexp: RegExp) {
		if (!is.RegExp(regexp)) {
			throw new TypeError(`Expected regular expression as pattern, but got value of type ${typeof regexp}`);
		}

		if (!is.Undefined(this._state.pattern)) {
			throw new Error('Cannot set maxlength twice for a number schema instance');
		}

		this._state.pattern = regexp;

		this.pushValidationFn((value: string, path: string) => {
			if (!is.Undefined(this._state.pattern) && !this._state.pattern.test(value)) {
				return createError(
					ERROR_TYPES.ARGUMENT,
					`Expected ${value} to match pattern but it did not`,
					path,
				);
			}
		});

		return this;
	}
}
