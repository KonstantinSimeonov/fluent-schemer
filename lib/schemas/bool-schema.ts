import * as is from '../is';
import BaseSchema from './base-schema';

export const name = 'bool';

const typeName = 'bool';

/**
 * Provide validation for boolean values.
 * Pretty much provides only type checking.
 * @export
 * @class BoolSchema
 * @extends {BaseSchema}
 */
export default class BoolSchema extends BaseSchema {

	/**
	 * Returns 'bool'.
	 * @readonly
	 * @type {string}
	 * @memberof BoolSchema
	 */
	public get type(): string {
		return typeName;
	}

	/**
	 * Returns true when a value is either true, false or a Boolean object.
	 * Otherwise returns false.
	 * @param {*} value The value to be validated.
	 * @returns {value is boolean} Whether the value is a valid bool.
	 * @memberof BoolSchema
	 *
	 * @example
	 * bool().validateType(true); // true
	 * bool().validateType(false); // true
	 * bool().validateType(new Boolean(5)); // true
	 * bool().validateType(nul;); // false
	 */
	public validateType(value: any): value is boolean {
		return is.Bool(value);
	}
}
