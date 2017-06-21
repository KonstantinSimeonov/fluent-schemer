function createIs(type) {
	const typeName = type[0].toUpperCase() + type.substr(1);

	return value => Object.prototype.toString.call(value) === `[object ${typeName}]`;
}

const types = [
	'object',
	'string',
	'number',
	'boolean',
	'function',
	'regexp',
	'date',
	'null',
	'undefined'
];

const is = types
			.map(type => ({ [type]: createIs(type) }))
			.concat([{ array: Array.isArray }])
			.reduce((object, current) => Object.assign(object, current), {});

export default is;
