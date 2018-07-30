export class ValidationError {
	public type: string;
	public message: string;
	public path: string;

	constructor(type: string, message: string, path: string) {
		this.type = type;
		this.message = message;
		this.path = path;
	}
}

export const ERROR_TYPES = Object.freeze({
	ARGUMENT: 'argument',
	COMPOSITE: 'composite',
	PREDICATE: 'predicate',
	RANGE: 'range',
	TYPE: 'type',
});

export class CompositeError extends ValidationError {
	public errors: ValidationError[];

	constructor(path: string, errors: ValidationError[]) {
		super(ERROR_TYPES.COMPOSITE, 'More than one error could have occurred for the provided path', path);
		this.errors = errors;
	}
}

export const createError = (type: string, message: string, path: string) => new ValidationError(type, message, path);
export const createCompositeError = (path: string, errors: ValidationError[]) => new CompositeError(path, errors);
