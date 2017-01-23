# How does the whole thing work?

Schemas are defined as ES6 classes. There is the `BaseSchema` class that packs all the common functionality in it, such as `.required()`, 
`.not()`, `.validate()`. The `BaseSchema` is meant to be inherited in order to create a concrete validation schema - such as the `StringSchema` or the `NumberSchema`.
Each schema extends the `BaseSchema` with it's own methods - for example `StringSchema.minlength()` allows to set a minimum length for a string value.
The concrete schemas should also implement `.validateType()` - validate whether a passed value is of the desired type and `.type` - returns the type of the schema as a string.
Also, `BaseSchema.validateWithCorrectType` can be overriden when needed - `ObjectSchema` overrides this method to provide schema nesting.

# Usage
To use the validator in code, the following snippet is enough:

```js
const { string, number, object, bool, array, union, enumeration } = require('./fluent-validator');
```

This will load `./fluent-validator/index.js`. This file exports all the schemas and a function that allows for new schemas to be dynamically added.
The concrete schemas are defined as mixins that accept a base schema, create a class that extends it and returns the class. That way a different base schema can be used, if needed.
Also, introduction of new schemas is trivial - a new `schemaname-schema.js` needs to be created in the `schema` folder. This file should exports a mixin like that:

```js
module.exports = BaseSchema => class CustomSchema extends BaseSchema {
    // implementation
}
```

# Schemas examples

Every schema supports `.not()`, `.required()`, `.predicate()` and `.validate()`.

## StringSchema

```js
const { string } = require('./fluent-validator').schemas;

const testSchema = string() // create a blank StringSchema
                .required() // the value must be a string
                .minlength(5) // validate wether the length of an input string is at least 5
                .maxlength(10) // validate wether the length of an input string is at most 10
                .pattern(/^[a-z]+$/i) // validate wether the input string matches a regular expression
                .predicate(str => str !== 'javascript') // use a custom function to validate an input string
                .not('c#', 'java', 'c++'); // the input value shouldn't be one of the passed values

const someString = 'testtest42';

// .validate(value, valueName) will return an array of validation errors
// if the array is empty, no validation errors occured
const validationErrors = testSchema.validate(someString, 'someString');

if(validationErrors.length) {
    console.log(validationErrors);
} else {
    console.log('No validation errors!');
}
```

## NumbersSchema

```js
const { number } = require('./fluent-validator').schemas,

const ageSchema = number() // blank number schema
                    .required() // the input value must be a number, excluding NaN and Infinity
                    .min(0) // the input value must be at least 0
                    .max(100) // the input value must be at most 100
                    .integer(); // the input value must be an integer

const ages = [1, 20, 200, -5, 3.4, NaN];

for(let a of ages) {
    console.log(ageSchema.validate(a, 'age'));
}
```

## BoolSchema

```js
const { bool } = require('./fluent-validator').schemas;

const boolSchema = bool().required(); // input values should be either true or false

const values = [true, false, '', 'true', null];

for(let v of values) {
    console.log(boolSchema.validate(v, 'value'));
}
```

## ArraySchema

```js
const { string, array } = require('./fluent-validator').schemas;

const nameArraySchema = array(string().pattern(/^[a-z]{2,20}$/i)) // input array should contain strictly strings that match the regular expression
                            .required();

const names = ['george', 'ivan', 'todor', '', 'tom1', null, 10];

console.log(nameArraySchema.validate(names, 'names'));
```

## ObjectSchema

```js
const { string, number, bool, object } = require('./fluent-validator').schemas;

const studentSchema = object({
    /**
    * the object schema can be used with other schemas
    * the object() function accepts an object whose keys have other schemas as values
    * the values on the same keys will be validated on the input objects
    */
    name: string()
            .required()
            .pattern(/^[A-Z][a-z]{1,20}$/),
    age: number()
            .required()
            .min(0)
            .max(120)
            .integer(),
    skills: array(string().minlength(3).maxlength(30))
                .required()
                .maxlength(20),
    cat: object({
                    breed: string().required(),
                    name: string().required()
                })
                .required()
});

const student = {
    name: 'Penka',
    age: 133,
    skills: ['studying', 'programming', 5],
    cat: {
        name: 'tom'
    }
};

const validationErrors = studentSchema.validate(student, 'student');

console.log(validationErrors);
```