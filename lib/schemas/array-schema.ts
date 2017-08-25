import { IErrorFeedback } from '../contracts';
import { createError, ERROR_TYPES } from '../errors';
import BaseSchema from './base-schema';
import * as is from '../is';

export const name = 'array';

type ArraySchemaState = {
	typestring?: string;
	subschema?: BaseSchema;
	minlength: number;
	maxlength: number;
	hasMinLength?: boolean;
	hasMaxLength?: boolean;
}

export default class ArraySchema extends BaseSchema {
	private _state: ArraySchemaState;

	public constructor(subschema: BaseSchema) {
		super();
		if (!is.NullOrUndefined(subschema)) {
			this._state = { subschema: subschema.required(), minlength: 0, maxlength: Infinity };
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

	public validateType(value: any): value is any[] {
		return is.Array(value) && (is.NullOrUndefined(this._state.subschema) || value.every((x: any) => this.validateElementsType(x)));
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
		this.pushValidationFn((value, path) => {
			if (value.length !== new Set(value).size) {
				return createError(ERROR_TYPES.ARGUMENT, `Expected values in ${value} to be distinct`, path);
			}
		});

		return this;
	}

	protected validateValueWithCorrectType(value: any, path: string): IErrorFeedback {
		const { errors } = super.validateValueWithCorrectType(value, path);

		if (this._state.hasMinLength && (value.length < this._state.minlength)) {
			const minLengthError = createError(ERROR_TYPES.RANGE, `Expected an ${this.type} with length at least ${this._state.minlength} but got length ${value.length}`, path);
			errors.push(minLengthError);

			return { errors, errorsCount: errors.length };
		}

		if (this._state.hasMaxLength && (value.length > this._state.maxlength)) {
			const maxLengthError = createError(ERROR_TYPES.RANGE, `Expected an ${this.type} with length at most ${this._state.maxlength} but got length ${value.length}`, path);
			errors.push(maxLengthError);

			return { errors, errorsCount: errors.length };
		}

		if (!this._state.subschema) {
			return { errors, errorsCount: errors.length };
		}

		for (let i = 0, len = value.length; i < len; i += 1) {
			const { errors: subErrors, errorsCount } = this._state.subschema.validate(value[i], path + '[' + i + ']', errors);

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

	private validateElementsType(value: any): boolean {
		if (!this._state.subschema) {
			return true;
		}

		return this._state.subschema.validateType(value);
	}
}
