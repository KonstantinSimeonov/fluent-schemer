'use strict';

const validation = require('./fluent-validator')(),
    { string, number, object, array, union } = validation.schemas,
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
    friends: union(array(string()), string()).required()
});

const value = {
    name: 'toshkata',
    age: 1.5,
    money: 2000,
    weapons: [1, 2, 'strimg'],
    friends: [333],
    skill: {
        title: 'stealing scarfs',
        level: 9999
    }
};

const err = schema.validateAsync(value, 'value');

err.then(x => console.log(x));

console.log(schema.validate(value, 'value'));