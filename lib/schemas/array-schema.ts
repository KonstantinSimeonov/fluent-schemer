import { IErrorFeedback } from '../contracts';
import { createError, ERROR_TYPES } from '../errors';
import * as is from '../is';
import BaseSchema from './base-schema';

export const name = 'array';

/**
 * Provides array validations for min/max array length, distinct elements.
 * Elements can also be validated with a subschema.
 * @export
 * @class ArraySchema
 * @extends {BaseSchema}
 */
export default class ArraySchema<TInner> extends BaseSchema<TInner[]> {
	private _state: {
		typestring?: string;
		subschema?: BaseSchema<TInner>;
		minlength: number;
		maxlength: number;
		hasMinLength?: boolean;
		hasMaxLength?: boolean;
	};

	/**
	 * Creates an instance of ArraySchema.
	 * @param {BaseSchema} [subschema] - Specify a schema which is used to validate the elements of an array.
	 * @memberof ArraySchema
	 *
	 * @example
	 * // array of positive numbers
	 * array(number().min(0))
	 *
	 * @example
	 * // untyped array
	 * array().minlength(5)
	 */
	public constructor(subschema?: BaseSchema<TInner>) {
		super();
		if (!is.NullOrUndefined(subschema)) {
			this._state = { subschema, minlength: 0, maxlength: Infinity };
		} else {
			this._state = { minlength: 0, maxlength: Infinity };
		}
	}

	public get type() {
		if (!this._state.typestring) {
			this._state.typestring = this._state.subschema ? `array<${this._state.subschema.type}>` : `array<any>`;
		}

		return this._state.typestring;
	}

	public validateType(value: any): value is TInner[] {
		return is.Array(value)
			&& (is.NullOrUndefined(this._state.subschema) || value.every((x: any) => this.validateElementsType(x)));
	}

	public minlength(length: number) {
		if (!is.ValidLength(length)) {
			throw new TypeError(`Expected a finite number larger than 0 as an array length but got ${length}`);
		}

		this._state.minlength = length;
		this._state.hasMinLength = true;

		return this;
	}

	public maxlength(length: number) {
		if (!is.ValidLength(length)) {
			throw new TypeError(`Expected a finite number larger than 0 as an array length but got ${length}`);
		}

		this._state.maxlength = length;
		this._state.hasMaxLength = true;

		return this;
	}

	public withLength(length: number) {
		return this.minlength(length).maxlength(length);
	}

	public distinct() {
		this.pushValidationFn((value: TInner[], path: string) => {
			if (value.length !== new Set(value).size) {
				return createError(ERROR_TYPES.ARGUMENT, `Expected values in ${value} to be distinct`, path);
			}
		});

		return this;
	}

	protected validateValueWithCorrectType(value: TInner[], path: string): IErrorFeedback<TInner[]> {
		const { errors } = super.validateValueWithCorrectType(value, path);
		const feedback = () => ({
			corrected: errors.length ? this._defaultExpr(value) : value,
			errors,
			errorsCount: errors.length,
		});

		if (this._state.hasMinLength && (value.length < this._state.minlength)) {
			const minLengthError = createError(
				ERROR_TYPES.RANGE,
				`Expected an ${this.type} with length at least ${this._state.minlength} but got length ${value.length}`,
				path,
			);

			errors.push(minLengthError);

			return feedback();
		}

		if (this._state.hasMaxLength && (value.length > this._state.maxlength)) {
			const maxLengthError = createError(
				ERROR_TYPES.RANGE,
				`Expected an ${this.type} with length at most ${this._state.maxlength} but got length ${value.length}`,
				path,
			);

			errors.push(maxLengthError);

			return feedback();
		}

		if (!this._state.subschema) {
			return feedback();
		}

		for (let i = 0, len = value.length; i < len; i += 1) {
			const { errors: subErrors, errorsCount } = this._state.subschema.validate(value[i], path + '[' + i + ']');

			if (errorsCount > 0) {
				if (Array.isArray(subErrors)) {
					errors.push(...subErrors);
				} else {
					errors.push(subErrors);
				}

				return feedback();
			}
		}

		return feedback();
	}

	private validateElementsType(value: any): value is TInner {
		if (!this._state.subschema) {
			return true;
		}

		return this._state.subschema.validateType(value);
	}
}
