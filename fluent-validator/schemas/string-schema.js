'use strict';

module.exports = BaseSchema => class StringSchema extends BaseSchema {

    get type() {
        return 'string';
    }

    validateType(value) {
        return (typeof value === 'string') || (value instanceof String);
    }

    minlength(length) {

        this.pushValidationFn((value, path) => {
            if (value.length < length) {
                return { type: 'range', msg: `Expected string with length at least ${length} but got ${value}`, path };
            }
        });

        return this;
    }

    maxlength(length) {

        this.pushValidationFn((value, path) => {
            if (value.length > length) {
                return { type: 'range', msg: `Expected string with length at most ${length} but got ${value}`, path };
            }
        });

        return this;
    }

    pattern(regexp) {

        this.pushValidationFn((value, path) => {
            if (!regexp.test(value)) {
                return { type: 'argument', msg: `Expected ${value} to match pattern but it did not`, path };
            }
        });

        return this;
    }
}