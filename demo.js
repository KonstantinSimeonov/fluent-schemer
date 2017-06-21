'use strict';

const FluentSchemer = require('./dist/fluent-schemer').createInstance(),
	{ string, number, object, array, union, enumeration, bool } = FluentSchemer.schemas;
const c = { name: 1 };
const schema = object({
	test: array(object({ name: string().required() })),
	name: string().minlength(5).predicate(value => value !== 'ivan'),
	age: number().min(1).integer(),
	money: number().max(100),
	skill: object({
		title: string().required(),
		level: number().min(1).max(10).integer().required()
	})
		.required(),
	weapons: array(string()).required(),
	friends: union(array(string()), string()).required(),
	gosho: number().required().not(1, 2, 3),
	education: enumeration('none', 'some', 'many'),
	isStudent: bool().required(),
});

const value = {
	test: [{ name: 5 }],
	name: 'gyz',
	age: 1,
	money: 100,
	weapons: [null],
	friends: 'dsf',
	skill: {
		title: [],
		level: {}
	},
	gosho: 1,
	education: 'some',
	isStudent: 'true'
};

const { errors, errorsCount } = schema.validate(value);

if (errorsCount) {
	console.log(errors);
}

// const err = schema.validateAsync(value, 'value');

// err.then(x => console.log(x));

// const { errors } = schema.validate(value);

// console.log(errors);

// const nested = array(array()).required();

// const val = [1];

// console.log(nested.validate(val, 'arr'));

// const sch = object();

// sch.subschema = {
//     v: number().integer().required(),
//     left: sch,
//     right: sch
// };

// const root = {
//     v: 3,
//     left: { v: 5 },
//     right: { v: 6, left: { v: 'dsfs' } }
// };

// console.log(sch.validate(root, 'root'));

// const v = require('./es5').createInstance().schemas,
// string1 = v.string,
// number2 = v.number;

// console.log(string1(), number2());