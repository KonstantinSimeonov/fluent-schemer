import { expect } from 'chai';

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

export function shouldReturnErrors(schema, values, options = {}) {
	const expectedType = options.type;
	const root = options.root || 'root';
	const expectedPath = options.path || root;

	for (const val of values) {
		const errorsArray = [];
		dfs(schema.validate(val, root).errors, err => errorsArray.push(err));
		expect(errorsArray.length).to.equal(1);
		const [err] = errorsArray;

		expect(err.path).to.equal(expectedPath);
		expect(err.type).to.equal(expectedType);
	}
}

export function shouldNotReturnErrors(schema, values) {
	values.forEach(val => expect(schema.validate(val).errorsCount).to.equal(0));
}
