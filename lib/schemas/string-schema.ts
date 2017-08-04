import { createError, ERROR_TYPES } from '../errors';
import BaseSchema from './base-schema';
import * as is from '../is';

export const name = 'string';

const typeName = 'string';

type StringSchemaState = {
	minlength: number;
	maxlength: number;
	pattern: RegExp
};

export default class StringSchema extends BaseSchema {
	private _state: StringSchemaState;

	public get type() {
		return typeName;
	}

	public validateType(value: any) {
		return is.String(value);
	}

	public minlength(length: number) {
		if (!is.Undefined(this._state.minlength)) {
			throw new Error('Cannot set minlength twice for a number schema instance');
		}

		this._state.minlength = length;

		this.pushValidationFn((value, path) => {
			if (this._state.minlength < length) {
				return createError(ERROR_TYPES.RANGE, `Expected string with length at least ${length} but got ${value}`, path);
			}
		});

		return this;
	}

	public maxlength(length: number) {
		if (!is.Undefined(this._state.minlength)) {
			throw new Error('Cannot set maxlength twice for a number schema instance');
		}

		this._state.maxlength = length;

		this.pushValidationFn((value, path) => {
			if (this._state.maxlength > length) {
				return createError(ERROR_TYPES.RANGE, `Expected string with length at most ${length} but got ${value}`, path);
			}
		});

		return this;
	}

	public pattern(regexp: RegExp) {
		if (!is.Undefined(this._state.minlength)) {
			throw new Error('Cannot set maxlength twice for a number schema instance');
		}

		this._state.pattern = regexp;

		this.pushValidationFn((value, path) => {
			if (!this._state.pattern.test(value)) {
				return createError(ERROR_TYPES.ARGUMENT, `Expected ${value} to match pattern but it did not`, path);
			}
		});

		return this;
	}
}
