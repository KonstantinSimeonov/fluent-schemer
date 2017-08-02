import { IErrorFeedback } from '../contracts';
import { createError, ERROR_TYPES } from '../errors';
import BaseSchema from './base-schema';
import * as is from '../is';

export const name = 'array';

export default class ArraySchema extends BaseSchema {
	private _typestring: string
	private subschema: BaseSchema
	private _minlength: number
	private _maxlength: number
	private _hasMinLength: boolean
	private _hasMaxLength: boolean

	public constructor(subschema: BaseSchema) {
		super();
		if (subschema instanceof BaseSchema) {
			this.subschema = subschema.required();
		}
	}

	public get type() {
		if (!this._typestring) {
			this._typestring = this.subschema ? `array<${this.subschema.type}>` : `array<any>`;
		}

		return this._typestring;
	}

	public validateType(value: any): value is any[] {
		return is.Array(value) && (!this.subschema || value.every((x: any) => this.subschema.validateType(x)));
	}

	public minlength(length: number) {
		if (ArraySchema._isValidArrayLength(length)) {
			this._minlength = length;
			this._hasMinLength = true;
		}

		return this;
	}

	public maxlength(length: number) {
		if (ArraySchema._isValidArrayLength(length)) {
			this._maxlength = length;
			this._hasMaxLength = true;
		}

		return this;
	}

	public withLength(length: number) {
		return this.minlength(length).maxlength(length);
	}

	public distinct() {
		this.pushValidationFn((value, path) => {
			if (value.length !== new Set(value).size) {
				return createError(ERROR_TYPES.ARGUMENT, `Expected values in ${value} to be distinct`, path);
			}
		});

		return this;
	}

	protected validateValueWithCorrectType(value: any, path: string): IErrorFeedback {
		const { errors } = super.validateValueWithCorrectType(value, path);

		if (this._hasMinLength && (value.length < this._minlength)) {
			const minLengthError = createError(ERROR_TYPES.RANGE, `Expected an ${this.type} with length at least ${this._minlength} but got length ${value.length}`, path);
			errors.push(minLengthError);

			return { errors, errorsCount: errors.length };
		}

		if (this._hasMaxLength && (value.length > this._maxlength)) {
			const maxLengthError = createError(ERROR_TYPES.RANGE, `Expected an ${this.type} with length at most ${this._maxlength} but got length ${value.length}`, path);
			errors.push(maxLengthError);

			return { errors, errorsCount: errors.length };
		}

		if (!this.subschema) {
			return { errors, errorsCount: errors.length };
		}

		for (let i = 0, len = value.length; i < len; i += 1) {
			const { errors: subErrors, errorsCount } = this.subschema.validate(value[i], path + '[' + i + ']', errors);

			if (errorsCount > 0) {

				if (Array.isArray(subErrors)) {
					errors.push(...subErrors);
				} else {
					errors.push(subErrors);
				}

				return { errors, errorsCount: errors.length };
			}
		}

		return { errors, errorsCount: errors.length };
	}

	private static _isValidArrayLength(value: any) {
		return !isNaN(value) && (value >= 0) && isFinite(value);
	}
}
