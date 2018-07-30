import { createError, ERROR_TYPES } from '../errors';
import BaseSchema from './base-schema';

import * as is from '../is';

export const name = 'number';

const typeName = 'number';

/**
 * Provides type checking for numbers, min/max, integer and safe integer validations.
 *
 * @export
 * @class NumberSchema
 * @extends {BaseSchema}
 */
export default class NumberSchema extends BaseSchema<number> {
	private _precision: number;
	private _minvalue: number;
	private _maxvalue: number;
	private _nanAllowed: boolean;
	private _infinityAllowed: boolean;

	/**
	 * Creates an instance of NumberSchema.
	 * @memberof NumberSchema
	 */
	public constructor() {
		super();
		this._precision = 0;
	}

	/**
	 * Returns 'number'.
	 *
	 * @readonly
	 * @memberof NumberSchema
	 */
	public get type() {
		return typeName;
	}

	/**
	 * Validate whether a value is a number.
	 * Primitive numbers and Number objects are considered of
	 * type number, unless their value is NaN, Infinity or -Infinity.
	 * Strings are NOT considered valid numbers, even if they are numerical.
	 *
	 * This behaviour can be changed by invoking the .allowNaN() and
	 * allowInfinity() methods.
	 * @see NumberSchema.allowNaN()
	 * @see NumberSchema.allowInfinity()
	 *
	 * @param {*} value The value to be type checked.
	 * @returns {value is number} Whether the value is a number.
	 * @memberof NumberSchema
	 */
	public validateType(value: any): value is number {
		return is.Numeric(value)
			&& (this._nanAllowed || !isNaN(value))
			&& (this._infinityAllowed || isFinite(value) || isNaN(value));
	}

	/**
	 * Set a precision that will be used for comparison between numbers by the schema,
	 * for an example by .not().
	 *
	 * @param {number} allowedDiff The largest possible difference between two numbers that would be considered equal.
	 * @returns {this}
	 * @memberof NumberSchema
	 *
	 * @example
	 * number().not(1, 2, 3).validate(2.0001); // no error
	 * number().precision(0.0000001).not(1, 2, 3).validate(2.0001); // error
	 */
	public precision(allowedDiff: number) {
		if (Number.isNaN(+allowedDiff) || allowedDiff < 0) {
			throw new TypeError(`Expected allowedDiff to be a valid positive number but got ${allowedDiff}`);
		}

		this._precision = allowedDiff;

		return this;
	}

	/**
	 * NaN is considered of type number.
	 *
	 * @returns {this}
	 * @memberof NumberSchema
	 *
	 * @example
	 * number().allowNaN().validateType(NaN); // true
	 */
	public allowNaN() {
		this._nanAllowed = true;

		return this;
	}

	/**
	 * +/- Infinity is considered of type number.
	 *
	 * @returns {this}
	 * @memberof NumberSchema
	 *
	 * @example
	 * number().allowInfinity().validateType(Infinity); // true
	 */
	public allowInfinity() {
		this._infinityAllowed = true;

		return this;
	}

	/**
	 * Validated numbers must be in the range of [-Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER
	 *
	 * @returns {this}
	 * @memberof NumberSchema
	 *
	 * @example
	 * number().safeInteger().validate(Number.MAX_SAFE_INTEGER + 10); // error
	 */
	public safeInteger() {
		const newMin = Math.max(this._minvalue || -Number.MAX_SAFE_INTEGER, -Number.MAX_SAFE_INTEGER);
		const newMax = Math.min(this._maxvalue || Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);

		return this.min(newMin).max(newMax);
	}

	/**
	 * Specify a minimal allowed numeric value for the validated values.
	 *
	 * @throws {TypeError} If the provided minimal value is not of type number or NaN.
	 * @param {number} minvalue Minimal value for the validated values.
	 * @returns {this}
	 * @memberof NumberSchema
	 *
	 * @example
	 * number().min('asfsdf'); // throws
	 * number().min(5).validate(2); // error
	 */
	public min(minvalue: number) {
		if (!is.StrictNumber(minvalue)) {
			throw new TypeError(`Expected a valid number as minimal value, but got ${minvalue}`);
		}

		if (is.Undefined(this._minvalue)) {
			this.pushValidationFn((value: number, path: string) => {
				if (value < this._minvalue) {
					return createError(
						ERROR_TYPES.RANGE,
						`Expected value greater than or equal to ${minvalue} but got ${value}`,
						path,
					);
				}
			});
		}

		this._minvalue = minvalue;

		return this;
	}

	/**
	 * Specify a maximal value for the validated values.
	 *
	 * @throws {TypeError} If the provided maximum is not of type number or is NaN.
	 * @param {number} maxvalue The maximal allowed value.
	 * @returns {this}
	 * @memberof NumberSchema
	 *
	 * @example
	 * number().max('faceroll'); // throws
	 * number().max(100).validate(300); // error
	 */
	public max(maxvalue: number) {
		if (!is.StrictNumber(maxvalue)) {
			throw new TypeError(`Expected a valid number as minimal value, but got ${maxvalue}`);
		}

		if (is.Undefined(this._maxvalue)) {
			this.pushValidationFn((value, path) => {
				if (value > maxvalue) {
					return createError(
						ERROR_TYPES.RANGE,
						`Expected value less than or equal to ${maxvalue} but got ${value}`,
						path,
					);
				}
			});
		}

		this._maxvalue = maxvalue;

		return this;
	}

	/**
	 * Validated values must be integers.
	 *
	 * @returns {this}
	 * @memberof NumberSchema
	 *
	 * @example
	 * number().integer().validate(5.05); // error
	 * number().integer().validate(5); // fine
	 */
	public integer() {
		return this.pushValidationFn((value: number, path: string) =>
			Number.isInteger(value + 0)
				? undefined
				:  createError(
					ERROR_TYPES.ARGUMENT,
					`Expected integer number but got ${value}`,
					path,
				),
		);
	}

	protected areEqual(firstValue: number, secondValue: number) {
		const diff = Math.abs(firstValue - secondValue);

		return diff <= this._precision;
	}
}
