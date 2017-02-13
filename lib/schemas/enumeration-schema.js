'use strict';

(function (module) {
    module.exports = (BaseSchema, {createError, ERROR_TYPES}) => class EnumerationSchema extends BaseSchema {
        constructor(...args) {
            super();

            if (args.length === 1 && typeof args[0] === 'object') {
                this._allowedValues = Object.keys(args[0]).map(key => args[0][key]);
            } else {
                this._allowedValues = args;
            }

            this.pushValidationFn((value, path) => {
                const index = this._allowedValues.indexOf(value);
                if (index === -1) {
                    return createError(ERROR_TYPES.ARGUMENT, `Expected one of ${this._allowedValues} but got ${value}`, path);
                }
            });
        }

        validateType() {
            return true;
        }
    };
})(typeof module === 'undefined' ? window.FluentSchemer.enumeration = {} : module);
