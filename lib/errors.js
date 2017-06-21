class ValidationError {
	constructor(type, message, path) {
		this.type = type;
		this.message = message;
		this.path = path;
	}
}

export const ERROR_TYPES = Object.freeze({
	'RANGE': 'range',
	'ARGUMENT': 'argument',
	'TYPE': 'type',
	'PREDICATE': 'predicate'
});

export const createError = (type, message, path) => new ValidationError(type, message, path);
