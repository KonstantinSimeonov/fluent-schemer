'use strict';

module.exports = BaseSchema => class ArraySchema extends BaseSchema {

    constructor(subschema) {
        super();
        this.subschema = subschema.required();
    }

    get type() {
        return this._typestring || (this._typestring = `array<${this.subschema.type}>`);
    }

    validateType(value) {
        return Array.isArray(value) && value.every(x => this.subschema.validateType(x));
    }

    minlength(length) {
        this._minlength = value => value.length >= length;
        return this;
    }

    maxlength(length) {
        this._maxlength = value => value.length <= length;
        return this;
    }

    validateValueWithCorrectType(value, path, errors) {
        for(let i = 0, len = value.length; i < len; i += 1) {
            this.subschema.validate(value[i], path + `[${i}]`, errors)
        }
    }

}