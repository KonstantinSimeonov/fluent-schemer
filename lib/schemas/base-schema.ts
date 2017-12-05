import { IErrorFeedback, IValidationError } from '../contracts';
import { createError, ERROR_TYPES } from '../errors';
import * as is from '../is';

export const name = 'base';

/**
 * Base class for all schemas. Implements common functionality such as
 * marking a schema as required, attachment of predicates to schemas,
 * blacklisting values and validation steps. Meant to be extended, not
 * instantiated directly.
 * @exports
 */
export default abstract class BaseSchema {

	protected validationFunctions: Array<(value: any, path: string) => IValidationError | undefined>;
	private _required: boolean;

	/**
	 * Creates an instance of BaseSchema.
	 * @memberof BaseSchema
	 */
	public constructor() {
		this._required = true;
		this.validationFunctions = [];
	}

	/**
	 * Perform a type validation on the value.
	 * Used internally by the schemas, but could also be useful as individual method.
	 * Every schema provides an implementation.
	 * @abstract
	 * @param {*} value - The value that will be type checked.
	 * @returns {boolean} - Whether the value passed the type check.
	 * @memberof BaseSchema
	 *
	 * @example
	 * number().validateType('356'); // false
	 * string().validateType('356'); // true
	 * array(bool()).validateType([true, true, false, 0]); // false
	 */
	public abstract validateType(value: any): boolean;

	/**
	 * Return a string representation of the schemas's type.
	 * @readonly
	 * @abstract
	 * @type {string}
	 * @memberof BaseSchema
	 *
	 * @example
	 * string().type
	 * array().type
	 */
	public abstract get type(): string;

	/**
	 * If the value fails type validation, do not emit errors.
	 *
	 * @returns {this}
	 * @memberof BaseSchema
	 *
	 * @example
	 * const maybeNaturalNumber = number().min(1).optional();
	 * maybeNaturalNumber.validate(-5); // error, type is number, but min validation fails
	 * maybeNaturalNnumber.validate('-5'); // no errors, type validation does not pass
	 */
	public optional() {
		this._required = false;

		return this;
	}

	/**
	 * Specify a predicate that will be used to validate the values.
	 * @param {function} predicateFn
	 * @returns {this} - The current instance of the BaseSchema.
	 * @memberof BaseSchema
	 *
	 * @example
	 * // predicate for odd numbers
	 * number().predicate(n => n % 2 !== 0);
	 */
	public predicate(predicateFn: (value: any) => boolean) {
		if (!is.Function(predicateFn)) {
			throw new TypeError(`Expected function as predicate but got value of type ${typeof predicateFn}`);
		}

		this.pushValidationFn((value, path) => {
			if (!predicateFn(value)) {
				return createError(ERROR_TYPES.PREDICATE, 'Value failed predicate', path);
			}
		});

		return this;
	}

	/**
	 * Specify blacklisted values.
	 * @param {...any[]} values - The blacklisted values.
	 * @returns {this}
	 * @memberof BaseSchema
	 *
	 * @example
	 *
	 * // error, because 'ts' is blacklisted
	 * string().not('ts', 'c#', 'java').validate('ts');
	 */
	public not(...values: any[]) {
		this.pushValidationFn((value, path) => {
			const index = values.findIndex(element => this.areEqual(value, element));

			if (index !== -1) {
				return createError(ERROR_TYPES.ARGUMENT, `Expected value to not equal ${values[index]} but it did`, path);
			}
		});

		return this;
	}

	/**
	 * Validate whether the provided value matches the type and the set of rules specified
	 * by the current schema instance. For non-require'd schemas, failure of type validations will
	 * result in no errors, because the schema rules will not be evaluated. Require'd schemas
	 * will simply return type errors.
	 * @param {*} value - The value to validate.
	 * @param {string} [path='']
	 * @param {IValidationError[]} [currentErrors]
	 * @returns {IErrorFeedback}
	 * @memberof BaseSchema
	 */
	public validate(value: any, path = '', currentErrors?: IValidationError[]): IErrorFeedback {
		if (!this.validateType(value)) {
			if (this._required) {
				const typeError = {
					errors: [createError(ERROR_TYPES.TYPE, `Expected type ${this.type} but got ${typeof value}`, path)],
					errorsCount: 1,
				};

				if (currentErrors) {
					currentErrors.push(typeError.errors[0]);
				}

				return typeError;
			}

			return { errorsCount: 0, errors: [] };
		}

		return this.validateValueWithCorrectType(value, path, currentErrors);
	}

	/**
	 * Adds a validation callback to the validations to be performed on a value passed to .validate()
	 * @param {function} validationFn
	 */
	protected pushValidationFn(validationFn: (value: any, path: string) => IValidationError | undefined) {
		this.validationFunctions.push(validationFn);
	}

	/**
	 * Virtual method that is used to compare two values for equality in .not(). Can be overridden in child classes.
	 * @returns {Boolean} - Returns true if the two values are equal, otherwise returns false.
	 */
	protected areEqual(firstValue: any, secondValue: any) {
		return firstValue === secondValue;
	}

	/**
	 * Virtual method that synchronously validates whether a value,
	 * which is known to be of a type matching the current schema's type,
	 * satisfies the validation rules in the schema. Can be overridden in child classes.
	 * @param {any} value - The value of matching type to validate.
	 * @param {string} path - The key of the value to validate.
	 * @param {?[]} errors - Options error array to push possible validation errors to.
	 */
	protected validateValueWithCorrectType(value: any, path: string, currentErrors?: IValidationError[]): IErrorFeedback {
		const errors = currentErrors || [];

		for (let i = 0, len = this.validationFunctions.length; i < len; i += 1) {
			const err = this.validationFunctions[i](value, path);

			if (err) {
				errors.push(err);
			}
		}

		return { errors, errorsCount: errors.length };
	}
}
