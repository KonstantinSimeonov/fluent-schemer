import * as is from '../is';
import BaseSchema from './base-schema';

export const name = 'object';

const typeName = 'object';

type TObjectSchemaState = {
	subschema: { [id: string]: BaseSchema };
	allowFunctions: boolean;
	allowArrays: boolean;
};

export default class ObjectSchema extends BaseSchema {
	private _state: TObjectSchemaState;

	public constructor(subschema: { [id: string]: BaseSchema }) {
		super();
		this._state = {
			allowArrays: false,
			allowFunctions: false,
			subschema: subschema || {},
		};
	}

	public get type() {
		return typeName;
	}

	public validateType(value: any) {
		const valueIsArray = is.Array(value);
		const valueIsFunction = is.Function(value);

		return is.Obj(value)
			|| (this._state.allowArrays && valueIsArray)
			|| (this._state.allowFunctions && valueIsFunction);
	}

	public allowArrays() {
		this._state.allowArrays = true;

		return this;
	}

	public allowFunctions() {
		this._state.allowFunctions = true;

		return this;
	}

	protected validateValueWithCorrectType(value: any, path?: string) {
		const errorsMap = Object.create(null);

		let currentErrorsCount = 0;

		/* tslint:disable forin */
		for (const key in this._state.subschema) {
			const { errors, errorsCount } = this._state.subschema[key].validate(value[key], path ? path + '.' + key : key);
			currentErrorsCount += errorsCount;
			errorsMap[key] = errors;
		}
		/* tslint:enable forin */

		return { errors: errorsMap, errorsCount: currentErrorsCount };
	}
}
