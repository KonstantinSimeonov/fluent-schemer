'use strict';

module.exports = (BaseSchema, { createError, ERROR_TYPES }) => class EnumerationSchema extends BaseSchema {
    constructor(...values) {
        super();
        this._allowedValues = values;

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
}