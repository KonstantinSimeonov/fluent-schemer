export const name = 'string';

export const factory = function (BaseSchema, { createError, ERROR_TYPES }) {
    return class StringSchema extends BaseSchema {

        get type() {
            return 'string';
        }

        validateType(value) {
            return (typeof value === 'string') || (value instanceof String);
        }

        minlength(length) {

            this.pushValidationFn((value, path) => {
                if (value.length < length) {
                    return createError(ERROR_TYPES.RANGE, `Expected string with length at least ${length} but got ${value}`, path);
                }
            });

            return this;
        }

        maxlength(length) {

            this.pushValidationFn((value, path) => {
                if (value.length > length) {
                    return createError(ERROR_TYPES.RANGE, `Expected string with length at most ${length} but got ${value}`, path);
                }
            });

            return this;
        }

        pattern(regexp) {

            this.pushValidationFn((value, path) => {
                if (!regexp.test(value)) {
                    return createError(ERROR_TYPES.ARGUMENT, `Expected ${value} to match pattern but it did not`, path);
                }
            });

            return this;
        }
    };
}
