'use strict';

(function (module) {

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
            if (value === null) {
                return false;
            }

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

        validateValueWithCorrectType(value, path) {
            const errorsMap = Object.create(null);

            let currentErrorsCount = 0;

            for (const key in this.subschema) {
                const {errors, errorsCount} = this.subschema[key].validate(value[key], path ? path + '.' + key : key);
                currentErrorsCount += errorsCount;
                errorsMap[key] = errors;
            }

            return {errors: errorsMap, errorsCount: currentErrorsCount};
        }
    };
})(typeof module === 'undefined' ? window.FluentSchemer.object = {} : module);
