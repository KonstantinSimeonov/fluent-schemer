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
            if(!predicateFn(value)) {
                return { type: 'predicate', msg: 'Value failed predicate', path };
            }
        });

        return this;
    }

    validate(value, path) {

        if(!this.validateType(value)) {
            return (this._required ? [{ type: 'type', msg: `Expected type ${this.type} but got ${typeof value}`, path }] : []);
        }

        return this.validateValueWithCorrectType(value, path);
    }

    validateValueWithCorrectType(value, path) {
        return this.validationFunctions
                                .map(fn => fn(value, path))
                                .filter(error => error);
    }
}