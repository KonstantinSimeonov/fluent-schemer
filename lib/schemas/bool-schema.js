import is from '../is';

export const name = 'bool';

const typeName = 'boolean';

export const factory = function (BaseSchema) {
	return class BoolSchema extends BaseSchema {
		get type() {
			return typeName;
		}

		validateType(value) {
			return is.boolean(value);
		}
	};
};
