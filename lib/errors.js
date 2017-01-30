'use strict';

const ERROR_TYPES = Object.freeze({
    'RANGE': 'range',
    'ARGUMENT': 'argument',
    'TYPE': 'type',
    'PREDICATE': 'predicate'
});

class ValidationError {
    constructor(type, message, path) {
        this.type = type;
        this.message = message;
        this.path = path;
    }
}

module.exports = {
    ERROR_TYPES,
    createError: (type, message, path) => new ValidationError(type, message, path)
};