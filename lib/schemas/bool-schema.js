import is from '../is';

export const name = 'bool';

export const factory = function (BaseSchema) {
    return class BoolSchema extends BaseSchema {
        get type() {
            return 'bool';
        }

        validateType(value) {
            return is.boolean(value);
        }
    };
};
