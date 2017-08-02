import { createError, ERROR_TYPES } from '../errors';
import BaseSchema from './base-schema';

import { IValidationError } from '../contracts';

export const name = 'union';

export default class UnionSchema extends BaseSchema {
	private subschemas: BaseSchema[]
	private _typestring: string

	public constructor(...subschemas: BaseSchema[]) {
		super();

		this.subschemas = subschemas.map(x => x.required());
	}

	public get type() {
		return this._typestring || (this._typestring = this.subschemas.map(schema => schema.type).join('|'));
	}

	public validateType(value: any) {
		return this.subschemas.findIndex(schema => schema.validateType(value)) !== -1;
	}

	// TODO: async api doesn't work
	// TODO: refactor
	// TODO: improve performance, currently .validateType() is executed twice
	protected validateValueWithCorrectType(value, path?: string) {
		const errors: IValidationError[] = [],
			unionErrors: IValidationError[] = [];

		for (const schema of this.subschemas) {

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
