'use strict';

module.exports = ({ createError, ERROR_TYPES }) => class BaseSchema {
    constructor() {
        this.validationFunctions = [];
    }

    /**
     * Adds a validation callback to the validations to be performed on a value passed to .validate()
     * @param {function} validationFn
     */
    pushValidationFn(validationFn) {
        this.validationFunctions.push(validationFn);
    }

    /**
     * Values validated with this schema must match the schema type. Other types are not allowed by default.
     * @returns {BaseSchema}
     */
    required() {
        this._required = true;
        return this;
    }

    /**
     * Specify a predicate that will be used to validate the values.
     * @param {function} predicateFn
     * @returns {BaseSchema}
     */
    predicate(predicateFn) {
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
     * @returns {BaseSchema}
     */
    not(...values) {
        this.pushValidationFn((value, path) => {
            const index = values.findIndex(element => this.areEqual(value, element));
            
            if (index !== -1) {
                return createError(ERROR_TYPES.ARGUMENT, `Expected value to not equal ${values[index]} but it did`, path);
            }
        });

        return this;
    }

    /**
     * Virtual method that is used to compare two values for equality in .not(). Can be overriden in child classes.
     * @returns {Boolean}
     */
    areEqual(firstValue, secondValue) {
        return firstValue === secondValue;
    }

    /**
     * Synchronously validates whether a value satisfies the validation rules in the schema instance.
     * @param {any} value - The value to validate.
     * @param {string} path - The key of the value to validate.
     * @param {?[]} errors - Optional error array to push possible validation errors to.
     */
    validate(value, path, errors) {

        errors = errors || [];

        if (!this.validateType(value)) {
            if (this._required) {
                const typeError = createError(ERROR_TYPES.TYPE, `Expected type ${this.type} but got ${typeof value}`, path);
                errors.push(typeError);
                // errors.push({ type: 'type', msg: `Expected type ${this.type} but got ${typeof value}`, path });
            }

        } else {
            this.validateValueWithCorrectType(value, path, errors);
        }

        return errors;
    }

    /**
     * Virtual method that synchronously validates whether a value,
     * which is known to be of a type matching the current schema's type,
     * satisfies the validation rules in the schema. Can be overriden in child classes.
     * @param {any} value - The value of matching type to validate.
     * @param {string} path - The key of the value to validate.
     * @param {?[]} errors - Options error array to push possible validation errors to.
     */
    validateValueWithCorrectType(value, path, errors) {
        errors = errors || [];

        for (let i = 0, len = this.validationFunctions.length; i < len; i += 1) {
            const err = this.validationFunctions[i](value, path);

            if (err) {
                errors.push(err);
            }
        }

        return errors;
    }

    validateAsync(value, path) {
        if (!this.validateType(value)) {
            if (this._required) {
                const typeError = createError(ERROR_TYPES.TYPE, `Expected type ${this.type} but got ${typeof value}`, path);
                return Promise.resolve([ typeError ]);
            }

            Promise.resolve([]);

        } else {
            return this._validateAsync(value, path);
        }
    }

    _validateAsync(value, path) {
        return Promise.all(this.validateValueWithCorrectType(value, path));
    }
}