import is from '../is';

export const name = 'array';

export const factory = function (BaseSchema, { createError, ERROR_TYPES }) {
	return class ArraySchema extends BaseSchema {
		constructor(subschema) {
			super();
			if (subschema instanceof BaseSchema) {
				this.subschema = subschema.required();
			}
		}

		get type() {
			if (!this._typestring) {
				this._typestring = this.subschema ? `array<${this.subschema.type}>` : `array<any>`;
			}

			return this._typestring;
		}

		validateType(value) {
			return is.array(value) && (!this.subschema || value.every(x => this.subschema.validateType(x)));
		}

		minlength(length) {
			if (this._isValidArrayLength(length)) {
				this._minlength = length;
				this._hasMinLength = true;
			}

			return this;
		}

		maxlength(length) {
			if (this._isValidArrayLength(length)) {
				this._maxlength = length;
				this._hasMaxLength = true;
			}

			return this;
		}

		validateValueWithCorrectType(value, path) {
			const errors = [];

			if (this._hasMinLength && (value.length < this._minlength)) {
				const minLengthError = createError(ERROR_TYPES.RANGE, `Expected an ${this.type} with length at least ${this._minlength} but got length ${value.length}`, path);
				errors.push(minLengthError);

				return { errors, errorsCount: errors.length };
			}

			if (this._hasMaxLength && (value.length > this._maxlength)) {
				const maxLengthError = createError(ERROR_TYPES.RANGE, `Expected an ${this.type} with length at most ${this._maxlength} but got length ${value.length}`, path);
				errors.push(maxLengthError);

				return { errors, errorsCount: errors.length };
			}

			if (!this.subschema) {
				return { errors, errorsCount: errors.length };
			}

			for (let i = 0, len = value.length; i < len; i += 1) {
				const { errors: subErrors, errorsCount } = this.subschema.validate(value[i], path + `[${i}]`, errors);

				if (errorsCount > 0) {

					if (Array.isArray(subErrors)) {
						errors.push(...subErrors);
					} else {
						errors.push(subErrors);
					}

					return { errors, errorsCount: errors.length };
				}
			}

			return { errors, errorsCount: errors.length };
		}

		_isValidArrayLength(value) {
			return !isNaN(value) && (value >= 0) && isFinite(value);
		}
	};
};
