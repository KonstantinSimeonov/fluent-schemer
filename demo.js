'use strict';

const validation = require('./fluent-validator')(),
    { string, number, object, array, union, enumeration, bool } = validation.schemas,
    { validate } = validation;

const schema = object({
    name: string().minlength(5).predicate(value => value !== 'ivan'),
    age: number().min(1).integer(),
    money: number().max(100),
    skill: object({
        title: string(),
        level: number().min(1).max(10).integer()
    })
        .required(),
    weapons: array(string()).required(),
    friends: union(array(string()), string()).required(),
    gosho: number().required().not(1, 2, 3),
    education: enumeration('none', 'some', 'many'),
    isStudent: bool().required(),
});

const value = {
    name: 'toshkata',
    age: 1,
    money: 100,
    weapons: ['strimg'],
    friends: 'dsf',
    skill: {
        title: 'stealing scarfs',
        level: 5
    },
    gosho: 1,
    education: 'kaun',
    isStudent: 'notabool'
};

// const err = schema.validateAsync(value, 'value');

// err.then(x => console.log(x));

// console.log(schema.validate(value, 'value'));

const nested = array(array()).required();

const val = [1];

console.log(nested.validate(val, 'arr'));