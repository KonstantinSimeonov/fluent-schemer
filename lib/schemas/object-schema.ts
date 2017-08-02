import { createError, ERROR_TYPES } from '../errors';
import BaseSchema from './base-schema';

import * as is from '../is';

export const name = 'object';

const typeName = 'object';

export default class ObjectSchema extends BaseSchema {
	private subschema: { [id: string]: BaseSchema }
	private _allowFunctions: boolean
	private _allowArrays: boolean

	public constructor(subschema: { [id: string]: BaseSchema }) {
		super();
		this.subschema = subschema || {};
		this._allowFunctions = false;
		this._allowArrays = false;
	}

	public get type() {
		return typeName;
	}

	public validateType(value) {
		const valueIsArray = is.array(value),
			valueIsFunction = is.function(value);

		return is.object(value)
			|| (this._allowArrays && valueIsArray)
			|| (this._allowFunctions && valueIsFunction);
	}

	public allowArrays() {
		this._allowArrays = true;

		return this;
	}

	public allowFunctions() {
		this._allowFunctions = true;

		return this;
	}

	protected validateValueWithCorrectType(value, path?: string) {
		const errorsMap = Object.create(null);

		let currentErrorsCount = 0;

		for (const key in this.subschema) {
			const { errors, errorsCount } = this.subschema[key].validate(value[key], path ? path + '.' + key : key);
			currentErrorsCount += errorsCount;
			errorsMap[key] = errors;
		}

		return { errors: errorsMap, errorsCount: currentErrorsCount };
	}
}
