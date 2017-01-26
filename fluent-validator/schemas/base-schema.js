'use strict';

module.exports = ({ createError, ERROR_TYPES }) => class BaseSchema {
    constructor() {
        this.validationFunctions = [];
    }

    pushValidationFn(validationFn) {
        this.validationFunctions.push(validationFn);
    }

    required() {
        this._required = true;
        return this;
    }

    predicate(predicateFn) {
        this.pushValidationFn((value, path) => {
            if (!predicateFn(value)) {
                return createError(ERROR_TYPES.PREDICATE, 'Value failed predicate', path);
            }
        });

        return this;
    }

    not(...values) {
        this.pushValidationFn((value, path) => {
            const index = values.findIndex(element => this.areEqual(value, element));
            
            if (index !== -1) {
                return createError(ERROR_TYPES.ARGUMENT, `Expected value to not equal ${values[index]} but it did`, path);
                // return { type: 'argument', msg: `Expected value to not equal ${values[index]} but it did`, path };
            }
        });

        return this;
    }

    areEqual(firstValue, secondValue) {
        return firstValue === secondValue;
    }

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