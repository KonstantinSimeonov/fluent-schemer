'use strict';

module.exports = (BaseSchema, _) => class BoolSchema extends BaseSchema {

    get type() {
        return 'bool';
    }

    validateType(value) {
        return (typeof value === 'boolean') || (value instanceof Boolean);
    }
}