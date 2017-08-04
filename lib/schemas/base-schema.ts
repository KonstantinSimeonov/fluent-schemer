import { createError, ERROR_TYPES } from '../errors';
import { IValidationError, IErrorFeedback } from '../contracts';

export const name = 'base';

export default abstract class BaseSchema {
	public abstract validateType(value: any): boolean
	public abstract get type(): string
	protected validationFunctions: Array<(value: any, path: string) => IValidationError|undefined>
	private _required: boolean

	public constructor() {
		this.validationFunctions = [];
	}

	/**
	 * Adds a validation callback to the validations to be performed on a value passed to .validate()
	 * @param {function} validationFn
	 */
	protected pushValidationFn(validationFn: (value: any, path: string) => IValidationError|undefined) {
		this.validationFunctions.push(validationFn);
	}


	/**
	 * Values validated with this schema must match the schema type. Other types are not allowed by default.
	 * @returns {BaseSchema} - The current instance of the BaseSchema.
	 */
	public required() {
		this._required = true;

		return this;
	}

	/**
	 * Specify a predicate that will be used to validate the values.
	 * @param {function} predicateFn
	 * @returns {BaseSchema} - The current instance of the BaseSchema.
	 */
	public predicate(predicateFn: (value: any) => boolean) {
		this.pushValidationFn((value, path) => {
			if (!predicateFn(value)) {
				return createError(ERROR_TYPES.PREDICATE, 'Value failed predicate', path);
			}
		});

		return this;
	}

	/**
	 * Specify a set of values that are not valid.
	 * @param {Array.<any>} values
	 * @returns {BaseSchema} - The current instance of the BaseSchema.
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
	 * Virtual method that is used to compare two values for equality in .not(). Can be overridden in child classes.
	 * @returns {Boolean} - Returns true if the two values are equal, otherwise returns false.
	 */
	protected areEqual(firstValue: any, secondValue: any) {
		return firstValue === secondValue;
	}

	/**
	 * Synchronously validates whether a value satisfies the validation rules in the schema instance.
	 * @param {any} value - The value to validate.
	 * @param {string} path - The key of the value to validate.
	 * @param {?[]} errors - Optional error array to push possible validation errors to.
	 */
	public validate(value: any, path = '', currentErrors?: IValidationError[]): IErrorFeedback {
		if (!this.validateType(value)) {
			if (this._required) {
				return {
					errorsCount: 1,
					errors: [createError(ERROR_TYPES.TYPE, `Expected type ${this.type} but got ${typeof value}`, path)]
				};
			}

			return { errorsCount: 0, errors: [] };
		}

		return this.validateValueWithCorrectType(value, path);
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
		const errors = [];

		for (let i = 0, len = this.validationFunctions.length; i < len; i += 1) {
			const err = this.validationFunctions[i](value, path);

			if (err) {
				errors.push(err);
			}
		}

		return { errors, errorsCount: errors.length };
	}
}
