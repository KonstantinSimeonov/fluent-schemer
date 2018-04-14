import { createError, ERROR_TYPES } from '../errors';
import BaseSchema from './base-schema';

export const name = 'enumeration';

const typeName = 'enumeration';

type TEnumerationSchemaState = {
	allowedValues: Set<any>;
};

/**
 * Provides validation whether a specific value belongs to a set of whitelisted values.
 *
 * @export
 * @class EnumerationSchema
 * @extends {BaseSchema}
 */
export default class EnumerationSchema extends BaseSchema {
	private _state: TEnumerationSchemaState;

	/**
	 * Creates an instance of EnumerationSchema by a collection of whitelisted values.
	 * Whitelisted values will be kept in a set, which would prevent automatic garbage collection.
	 * @param {...any[]} args Either comma-separated whitelist values or an object, whose values will be whitelisted.
	 * @memberof EnumerationSchema
	 *
	 * @example
	 * // both declarations below are equivalent:
	 *
	 * const triState = enumeration(null, true, false);
	 * const triStateFromMap = enumeration({
	 *     unknown: null,
	 *     true: true,
	 *     false: false
	 * });
	 */
	public constructor(...args: any[]) {
		super();

		const isMapEnum = args.length === 1 && typeof args[0] === 'object';

		this._state = {
			allowedValues: new Set(isMapEnum ? Object.keys(args[0]).map(key => args[0][key]) : args),
		};

		this.pushValidationFn((value, path) => {
			if (!this._state.allowedValues.has(value)) {
				return createError(
					ERROR_TYPES.ARGUMENT,
					`Expected one of ${this._state.allowedValues} but got ${value}`,
					path,
				);
			}
		});
	}

	/**
	 * Returns 'enumeration'.
	 *
	 * @readonly
	 * @type {string}
	 * @memberof EnumerationSchema
	 */
	public get type(): string {
		return typeName;
	}

	/**
	 * Always returns true.
	 *
	 * @returns {boolean}
	 * @memberof EnumerationSchema
	 */
	public validateType(): boolean {
		return true;
	}
}
