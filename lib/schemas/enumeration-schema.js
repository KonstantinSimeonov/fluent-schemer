export const name = 'enumeration';

const typeName = 'enumeration';

export const factory = function (BaseSchema, { createError, ERROR_TYPES }) {
    return class EnumerationSchema extends BaseSchema {
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

		get type() {
			return typeName;
		}

        validateType() {
            return true;
        }
    };
};
