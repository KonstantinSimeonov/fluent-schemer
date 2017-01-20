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

    validateValueWithCorrectType(value, path) {
        const errors = [];
        value
            .map((element, index) => this.subschema.validate(element, path + `[${index}]`))
            .forEach(errorArray => errors.push(...errorArray));

        return errors;
    }

}