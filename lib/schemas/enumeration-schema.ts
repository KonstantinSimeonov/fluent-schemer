import { createError, ERROR_TYPES } from '../errors';
import BaseSchema from './base-schema';

export const name = 'enumeration';

const typeName = 'enumeration';

export default class EnumerationSchema extends BaseSchema {
	private _allowedValues: any[]

	public constructor(...args: any[]) {
		super();

		if (args.length === 1 && typeof args[0] === 'object') {
			this._allowedValues = Object.keys(args[0]).map(key => args[0][key]);
		} else {
			this._allowedValues = args;
		}

		super.pushValidationFn((value, path) => {
			const index = this._allowedValues.indexOf(value);
			if (index === -1) {
				return createError(ERROR_TYPES.ARGUMENT, `Expected one of ${this._allowedValues} but got ${value}`, path);
			}
		});
	}

	public get type(): string {
		return typeName;
	}

	public validateType(): boolean {
		return true;
	}
}
