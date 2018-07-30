import { IValidationError } from '../contracts';
import BaseSchema from './base-schema';

export const name = 'union';

/**
 * Provides validation for union types.
 *
 * @export
 * @class UnionSchema
 * @extends {BaseSchema}
 */
export default class UnionSchema extends BaseSchema<any> {
	private _state: {
		subschemas: Array<BaseSchema<any>>;
		typestring?: string;
	};

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
	public constructor(...subschemas: Array<BaseSchema<any>>) {
		super();

		this._state = { subschemas };
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
	public validateType(value: any): value is any {
		return this._state.subschemas.findIndex(schema => schema.validateType(value)) !== -1;
	}

	protected validateValueWithCorrectType(value: any, path?: string) {
		const errors: IValidationError[] = [];

		for (const schema of this._state.subschemas) {
			const { errors: schemaErrors, errorsCount } = schema.validate(value, path);

			if (!errorsCount) {
				return { errors: [], errorsCount: 0, corrected: value };
			}

			if (Array.isArray(schemaErrors)) {
				errors.push(...schemaErrors);
			} else {
				errors.push(schemaErrors);
			}
		}

		return {
			corrected: errors.length ? this._defaultExpr(value) : value,
			errors,
			errorsCount: errors.length,
		};
	}
}
