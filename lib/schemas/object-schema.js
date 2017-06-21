import is from '../is';

export const name = 'object';

const typeName = 'object';

export const factory = function (BaseSchema) {
    return class ObjectSchema extends BaseSchema {
        constructor(subschema) {
            super();
            this.subschema = subschema || {};
            this._allowFunctions = false;
            this._allowArrays = false;
        }

        get type() {
            return typeName;
        }

        validateType(value) {
            const valueIsArray = is.array(value),
                valueIsFunction = is.function(value);

            return is.object(value)
                || (this._allowArrays && valueIsArray)
                || (this._allowFunctions && valueIsFunction);
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
                const { errors, errorsCount } = this.subschema[key].validate(value[key], path ? path + '.' + key : key);
                currentErrorsCount += errorsCount;
                errorsMap[key] = errors;
            }

            return { errors: errorsMap, errorsCount: currentErrorsCount };
        }
    };
};
