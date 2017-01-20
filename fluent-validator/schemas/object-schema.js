'use strict';

module.exports = BaseSchema => class ObjectSchema extends BaseSchema {

    constructor(subschema) {
        super();
        this.subschema = subschema;
    }

    get type() {
        return 'object';
    }

    validateType(value) {
        return (typeof value === 'object')
            && !(this._allowArrays ^ Array.isArray(value))
            && !(this._allowFunctions ^ (value instanceof Function));
    }

    allowArrays() {
        this._allowArrays = true;
        return this;
    }

    allowFunctions() {
        this._allowFunctions = true;
        return this;
    }

    validateValueWithCorrectType(value, path) {
        const errors = [];

        Object
            .keys(this.subschema)
            .map(key => this.subschema[key].validate(value[key], path + '.' + key))
            .forEach(errs => errors.push(...errs));

        return errors;
    }
}