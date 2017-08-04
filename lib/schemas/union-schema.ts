import BaseSchema from './base-schema';
import { IValidationError } from '../contracts';

export const name = 'union';

type UnionSchemaState = {
	subschemas: Array<BaseSchema>;
	typestring: string
};

export default class UnionSchema extends BaseSchema {
	private _state: UnionSchemaState;

	public constructor(...subschemas: Array<BaseSchema>) {
		super();

		this._state.subschemas = subschemas.map(x => x.required());
	}

	public get type() {
		return this._state.typestring || (this._state.typestring = this._state.subschemas.map(schema => schema.type).join('|'));
	}

	public validateType(value: any) {
		return this._state.subschemas.findIndex(schema => schema.validateType(value)) !== -1;
	}

	// TODO: refactor
	// TODO: improve performance, currently .validateType() is executed twice
	protected validateValueWithCorrectType(value: any, path?: string) {
		const errors: IValidationError[] = [],
			unionErrors: IValidationError[] = [];

		for (const schema of this._state.subschemas) {

			if (!schema.validateType(value)) {
				continue;
			}

			const { errors: schemaErrors, errorsCount } = schema.validate(value, path);

			if (!errorsCount) {
				return { errors: [], errorsCount: 0 };
			}

			if (Array.isArray(schemaErrors)) {
				unionErrors.push(...schemaErrors);
			} else {
				unionErrors.push(schemaErrors);
			}
		}

		errors.push(...unionErrors);

		return { errors, errorsCount: errors.length };
	}
}
