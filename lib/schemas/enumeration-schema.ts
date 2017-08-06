import { createError, ERROR_TYPES } from '../errors';
import BaseSchema from './base-schema';

export const name = 'enumeration';

const typeName = 'enumeration';

type EnumerationSchemaState = {
	allowedValues: any[]
};

export default class EnumerationSchema extends BaseSchema {
	private _state: EnumerationSchemaState;

	public constructor(...args: any[]) {
		super();

		const isMapEnum = args.length === 1 && typeof args[0] === 'object';

		this._state = {
			allowedValues: isMapEnum ? Object.keys(args[0]).map(key => args[0][key]) : args
		};

		this.pushValidationFn((value, path) => {
			const index = this._state.allowedValues.indexOf(value);
			if (index === -1) {
				return createError(ERROR_TYPES.ARGUMENT, `Expected one of ${this._state.allowedValues} but got ${value}`, path);
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
