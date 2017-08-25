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

export default class StringSchema extends BaseSchema {
	private _state: TStringSchemaState;

	constructor() {
		super();
		this._state = {};
	}

	public get type() {
		return typeName;
	}

	public validateType(value: any) {
		return is.String(value);
	}

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
