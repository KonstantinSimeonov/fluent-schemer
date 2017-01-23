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
        
        if(this._isValidArrayLength(length)) {
            this._minlength = length;
            this._hasMinLength = true;
        }

        return this;
    }

    maxlength(length) {
        
        if(this._isValidArrayLength(length)) {
            this._maxlength = length;
            this._hasMaxLength = true;
        }

        return this;
    }

    validateValueWithCorrectType(value, path, errors) {

        if (this._hasMinLength && value.length < this._minlength) {
            errors.push({ msg: `Expected an ${this.type} with length at least ${this._minlength} but got length ${value.length}`, path });
            return;
        }

        if (this._hasMinLength && value.length > this._maxlength) {
            errors.push({ msg: `Expected an ${this.type} with length at most ${this._maxlength} but got length ${value.length}` });
            return;
        }

        const currentErrorsCount = errors.length;

        for (let i = 0, len = value.length; i < len; i += 1) {
            this.subschema.validate(value[i], path + `[${i}]`, errors);

            if (errors.length > currentErrorsCount) {
                return;
            }
        }
    }

    _isValidArrayLength(value) {
        return !isNaN(value) && (value >= 0) && isFinite(value);
    }
}