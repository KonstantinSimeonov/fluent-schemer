'use strict';

module.exports = BaseSchema => class EnumerationSchema extends BaseSchema {
    constructor(...values) {
        super();
        this._allowedValues = values;

        this.pushValidationFn((value, path) => {
            const index = this._allowedValues.indexOf(value);
            if (index === -1) {
                return { type: 'argument', msg: `Expected one of ${this._allowedValues} but got ${value}`, path };
            }
        });
    }

    validateType() {
        return true;
    }
}