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

export const shouldReturnErrors = (assert, schema, values, options = {}) => {
	const expectedType = options.type;
	const root = options.root || 'root';
	const expectedPath = options.path || root;

	for (const val of values) {
		const errorsArray = [];
		dfs(schema.validate(val, root).errors, err => errorsArray.push(err));
		assert.is(errorsArray.length, 1);
		const [err] = errorsArray;

		assert.is(err.path, expectedPath);
		assert.is(err.type, expectedType);
	}
}

export function shouldNotReturnErrors(assert, schema, values) {
	values.forEach(val => assert.is(schema.validate(val).errorsCount, 0));
}
