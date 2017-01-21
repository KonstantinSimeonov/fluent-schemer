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
            && (this._allowArrays !== Array.isArray(value))
            && (this._allowFunctions !== (value instanceof Function));
    }

    allowArrays() {
        this._allowArrays = true;
        return this;
    }

    allowFunctions() {
        this._allowFunctions = true;
        return this;
    }

    validateValueWithCorrectType(value, path, errors) {
        for(const key in this.subschema) {
            this.subschema[key].validate(value[key], path + '.' + key, errors);
        }
    }
}