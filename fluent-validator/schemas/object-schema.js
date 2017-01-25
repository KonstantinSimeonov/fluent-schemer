'use strict';

function isFunction(value) {
    return (typeof value === 'function') || (value instanceof Function);
}

module.exports = BaseSchema => class ObjectSchema extends BaseSchema {

    constructor(subschema) {
        super();
        this.subschema = subschema || {};
        this._allowFunctions = false;
        this._allowArrays = false;
    }

    get type() {
        return 'object';
    }

    validateType(value) {
        const valueType = typeof value,
            valueIsArray = Array.isArray(value),
            valueIsFunction = isFunction(value);

        return (valueType === 'object' || valueType === 'function')
                && (this._allowArrays && valueIsArray || !valueIsArray)
                && (this._allowFunctions && valueIsFunction || !valueIsFunction);
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
        errors = errors || [];

        for (const key in this.subschema) {
            this.subschema[key].validate(value[key], path + '.' + key, errors);
        }

        return errors;
    }

    _validateAsync(value, path) {
        const errorPromises = Object
            .keys(this.subschema)
            .map(key => this.subschema[key].validateAsync(value[key], path + '.' + key));

        return Promise
            .all(errorPromises)
            .then(arrays => {
                const flattened = [];

                for (let i = 0, len = arrays.length; i < len; i += 1) {
                    for (let j = 0, innerLen = arrays[i].length; j < innerLen; j += 1) {
                        flattened.push(arrays[i][j]);
                    }
                }

                return flattened;
            })
    }
}