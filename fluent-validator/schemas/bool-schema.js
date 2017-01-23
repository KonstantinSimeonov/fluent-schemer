'use strict';

module.exports = BaseSchema => class BoolSchema extends BaseSchema {

    get type() {
        return 'bool';
    }

    validateType(value) {
        return (typeof value === 'boolean') || (value instanceof Boolean);
    }
}