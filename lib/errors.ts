export class ValidationError {
	public type: string
	public message: string
	public path: string

	constructor(type: string, message: string, path: string) {
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

export const createError = (type: string, message: string, path: string) => new ValidationError(type, message, path);
