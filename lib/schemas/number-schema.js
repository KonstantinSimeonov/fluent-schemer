export const name = 'number';

export const factory = function (BaseSchema, { createError, ERROR_TYPES }) {
    return class NumberSchema extends BaseSchema {

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
            const newMin = Math.max(this._minvalue || -Number.MAX_SAFE_INTEGER, -Number.MAX_SAFE_INTEGER),
                newMax = Math.min(this._maxvalue || Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);

            return this.min(newMin).max(newMax);
        }

        min(minvalue) {
            if (typeof this._minvalue === 'undefined') {
                this.pushValidationFn((value, path) => {
                    if (value < this._minvalue) {

                        return createError(ERROR_TYPES.RANGE, `Expected value greater than or equal to ${minvalue} but got ${value}`, path);
                    }
                });
            }

            this._minvalue = minvalue;

            return this;
        }

        max(maxvalue) {
            if (typeof this._maxvalue === 'undefined') {
                this.pushValidationFn((value, path) => {
                    if (value > maxvalue) {
                        return createError(ERROR_TYPES.RANGE, `Expected value less than or equal to ${maxvalue} but got ${value}`, path);
                    }
                });
            }

            this._maxvalue = maxvalue;

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
}
