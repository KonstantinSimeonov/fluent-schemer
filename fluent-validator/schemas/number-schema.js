'use strict';

module.exports = BaseSchema => class NumberSchema extends BaseSchema {

    get type() {
        return 'number';
    }

    validateType(value) {
        return (typeof value === 'number' || value instanceof Number) 
                && !isNaN(value) 
                && isFinite(value);
    }

    min(minvalue) {

        this.pushValidationFn((value, path) => {
            if (value < minvalue) {
                return { type: 'range', msg: `Expected value greater than or equal to ${minvalue} but got ${value}`, path };
            }
        })

        return this;
    }

    max(maxvalue) {

        this.pushValidationFn((value, path) => {
            if (value > maxvalue) {
                return { type: 'range', msg: `Expected value less than or equal to ${maxvalue} but got ${value}`, path };
            }
        })

        return this;
    }

    integer() {

        this.pushValidationFn((value, path) => {
            if ((value | 0) !== value) {
                return { type: 'argument', msg: `Expected integer number but got ${value}`, path };
            }
        });

        return this;
    }
};