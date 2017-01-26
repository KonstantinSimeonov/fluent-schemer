'use strict';

module.exports = (BaseSchema, { createError, ERROR_TYPES }) => class NumberSchema extends BaseSchema {

    constructor() {
        super();
        this._precision = 0;
    }

    get type() {
        return 'number';
    }

    validateType(value) {
        return ((typeof value === 'number') || (value instanceof Number))
            && (this._nanAllowed || !isNaN(value))
            && (this._infinityAllowed || isFinite(value) || isNaN(value));
    }

    precision(allowedDiff) {
        this._precision = allowedDiff;
        return this;
    }

    allowNaN() {
        this._nanAllowed = true;
        return this;
    }

    allowInfinity() {
        this._infinityAllowed = true;
        return this;
    }

    safeInteger() {
        return this.max(Number.MIN_SAFE_INTEGER).min(-Number.MIN_SAFE_INTEGER);
    }

    min(minvalue) {

        this.pushValidationFn((value, path) => {
            if (value < minvalue) {
                return createError(ERROR_TYPES.RANGE, `Expected value greater than or equal to ${minvalue} but got ${value}`, path);
            }
        })

        return this;
    }

    max(maxvalue) {

        this.pushValidationFn((value, path) => {
            if (value > maxvalue) {
                return createError(ERROR_TYPES.RANGE, `Expected value less than or equal to ${maxvalue} but got ${value}`,path);
            }
        })

        return this;
    }

    integer() {

        this.pushValidationFn((value, path) => {
            if (!Number.isInteger(value + 0)) {
                return createError(ERROR_TYPES.ARGUMENT, `Expected integer number but got ${value}`, path);
            }
        });

        return this;
    }

    areEqual(firstValue, secondValue) {
        const diff = Math.abs(firstValue - secondValue);
        return diff <= this._precision;
    }
};