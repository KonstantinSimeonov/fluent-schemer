import { createError, ERROR_TYPES } from '../errors';
import BaseSchema from './base-schema';

import * as is from '../is';

export const name = 'string';

const typeName = 'string';

export default class StringSchema extends BaseSchema {
	public get type() {
		return typeName;
	}

	public validateType(value: any) {
		return is.String(value);
	}

	public minlength(length: number) {
		this.pushValidationFn((value, path) => {
			if (value.length < length) {
				return createError(ERROR_TYPES.RANGE, `Expected string with length at least ${length} but got ${value}`, path);
			}
		});

		return this;
	}

	public maxlength(length: number) {
		this.pushValidationFn((value, path) => {
			if (value.length > length) {
				return createError(ERROR_TYPES.RANGE, `Expected string with length at most ${length} but got ${value}`, path);
			}
		});

		return this;
	}

	public pattern(regexp: RegExp) {
		this.pushValidationFn((value, path) => {
			if (!regexp.test(value)) {
				return createError(ERROR_TYPES.ARGUMENT, `Expected ${value} to match pattern but it did not`, path);
			}
		});

		return this;
	}
}
