export function dfs(root, cb) {
	if (Array.isArray(root)) {
		for (const value of root) {
			cb(value);
		}
	} else {
		for (const key in root) {
			dfs(root[key], cb);
		}
	}
}

export const shouldReturnErrors = (test, schema, values, options = {}) => {
	const expectedType = options.type;
	const root = options.root || 'root';
	const expectedPath = options.path || root;

	for (const val of values) {
		const errorsArray = [];
		dfs(schema.validate(val, root).errors, err => errorsArray.push(err));
		test.is(errorsArray.length, 1);
		const [err] = errorsArray;

		test.is(err.path, expectedPath);
		test.is(err.type, expectedType);
	}
}

export function shouldNotReturnErrors(test, schema, values) {
	values.forEach(val => test.is(schema.validate(val).errorsCount, 0));
}
