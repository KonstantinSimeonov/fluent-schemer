'use strict';

module.exports = class BaseSchema {
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
                return { type: 'predicate', msg: 'Value failed predicate', path };
            }
        });

        return this;
    }

    validate(value, path, errors) {

        errors = errors || [];

        if (!this.validateType(value)) {
            if (this._required) {
                errors.push({ type: 'type', msg: `Expected type ${this.type} but got ${typeof value}`, path });
            }

        } else {
            this.validateValueWithCorrectType(value, path, errors);
        }

        return errors;
    }

    validateValueWithCorrectType(value, path, errors) {
        for (let i = 0, len = this.validationFunctions.length; i < len; i += 1) {
            const err = this.validationFunctions[i](value, path);

            if (err) {
                errors.push(err);
            }
        }
    }
}