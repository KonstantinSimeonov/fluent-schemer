import { IValidationError } from '../contracts';
import BaseSchema from './base-schema';

export const name = 'union';

type TUnionSchemaState = {
	subschemas: BaseSchema[];
	typestring?: string;
};

/**
 * Provides validation for union types.
 *
 * @export
 * @class UnionSchema
 * @extends {BaseSchema}
 */
export default class UnionSchema extends BaseSchema {
	private _state: TUnionSchemaState;

	/**
	 * Creates an instance of UnionSchema.
	 * @param {...BaseSchema[]} subschemas Schemas that will be used to validate for the individual types of the union.
	 * @memberof UnionSchema
	 *
	 * @example
	 * // values must be either numbers or numerical strings
	 * const numerical = union(number(), string().pattern(/^\d+$/));
	 *
	 * const canDoMathsWith = union(bool(), number(), string().pattern(/^\d+$/));
	 * canDoMathsWith.validate(false); // fine
	 * canDoMathsWith.validate(5); // fine
	 * canDoMathsWith.validate('5'); // fine
	 * canDoMathsWith.validate('42asd'); // error
	 */
	public constructor(...subschemas: BaseSchema[]) {
		super();

		this._state = { subschemas: subschemas.map(x => x.required()) };
	}

	/**
	 * Returns 'union<subschema[1].type|subschema[2].type|...|subschema[n].type>'
	 *
	 * @readonly
	 * @memberof UnionSchema
	 */
	public get type() {
		return this._state.typestring
				|| (this._state.typestring = this._state.subschemas.map(schema => schema.type).join('|'));
	}

	/**
	 * Validates whether the passed value is of the union type defined by the current subschemas.
	 * If the value passes the type checks for ANY of the subschemas, it is considered a part of the union.
	 *
	 * @param {*} value The value that will be type checked.
	 * @returns {this}
	 * @memberof UnionSchema
	 *
	 * @example
	 * const canDoMathsWith = union(bool(), number(), string());
	 * canDoMathsWith.validate(false); // fine
	 * canDoMathsWith.validate(5); // fine
	 * canDoMathsWith.validate('5'); // fine
	 * canDoMathsWith.validate({}); // error
	 */
	public validateType(value: any) {
		return this._state.subschemas.findIndex(schema => schema.validateType(value)) !== -1;
	}

	protected validateValueWithCorrectType(value: any, path?: string) {
		const errors: IValidationError[] = [];
		const unionErrors: IValidationError[] = [];

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
