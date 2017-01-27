# How does the whole thing work?

Every schema allows a validation of a concrete type - current supported types are `number`, `string`, `bool`, `array`, `object`, `enumeration` and `union`.
Each schema defines validation rules that can be added to the schema by calling a method. For readable and concise syntax, those methods provide chaining.
Schemas can be used individualy or in conjunction - for an example, one could write `number().min(10)` or `array(number().min(10))`. The former will provide a
validate whether a number is larger than or equal to 10, while the latter will validate whether an array contains only numbers larger or equal to than 10. The 
validation feedback is returned in the form of an array of validation error objects, like that:

```js
[
    ValidationError {
    type: 'type',
    message: 'Expected type array<number> but got object',
    path: 'obj.numbers' },

    ValidationError {
    type: 'type',
    message: 'Expected type string but got bool',
    path: 'obj.someProperty' }
]
```

If the feedback array is empty, that means no errors occured and the passed value is valid.

Schemas are defined as functions that accept dependencies(current a function that creates errors and a map of error types) and return ES6 classes. There is the `BaseSchema` class that packs all the common functionality in it, such as `.required()`, 
`.not()`, `.validate()`, `.predicate()`. The `BaseSchema` is meant to be inherited in order to create a concrete validation schema - such as the `StringSchema` or the `NumberSchema`.
Each schema extends the `BaseSchema` with it's own methods - for example `StringSchema.minlength()` allows to set a minimum length for a string value.
The concrete schemas should also implement the abstract method `.validateType()` - validate whether a passed value is of the desired type and `.type` - returns the type of the schema as a string.
Also, `BaseSchema.validateWithCorrectType()` validates a value which is known to be of the expected type. This method can be overriden when needed - `ObjectSchema` overrides this method to provide schema nesting.

# Usage
To use the validator in code, the following snippet is enough:

```js
const { string, number, object, bool, array, union, enumeration } = require('./fluent-validator')().schemas;
```

This will load `./fluent-validator/index.js`. This file exports all the schemas and a function that allows for new schemas to be dynamically added.
The concrete schemas are defined as mixins that accept a base schema, create a class that extends it and returns the class. That way a different base schema can be used, if needed.
Also, introduction of new schemas is trivial - a new `schemaname-schema.js` needs to be created in the `schema` folder. This file should exports a mixin like that:

```js
module.exports = BaseSchema => class CustomSchema extends BaseSchema {
    // implementation
}
```

# Schemas

Every schema that extends `BaseSchema` supports `.not()`, `.required()`, `.predicate()`, `.validate()`, `.validateWithCorrectType()`.

| method                     | explanation                                                                             |
|:-------------------------- |:--------------------------------------------------------------------------------------- |
| not(v1, v2, v3, ...)       | values must not be equal to v1, v2, v3, ...                                             |
| required()                 | values must be of the type of the schema - *Schema.validateType(value) must return true |
| predicate((value) => bool) | values must return true for the specified predicate function                            |

## `StringSchema` **extends** `BaseSchema` 

| schema-specific methods            | explanation                                  |
|:---------------------------------- |:-------------------------------------------- |
| minlength(number)                  | sets a minimum length to the schema          |
| maxlength(number)                  | sets a maximum length to the schema          |
| pattern(Regexp)                    | sets a regexp to test values against         |

```js
const { string } = require('./fluent-validator')().schemas;

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

## `NumbersSchema` **extends** `BaseSchema` 

| schema-specific methods                   | explanation                                                                    |
|:----------------------------------------- |:------------------------------------------------------------------------------ |
| min(number)                               | set a minimal possible value for the schema                                    |
| max(number)                               | set a maximal possible value for the schema                                    |
| integer()                                 | value should be an integer                                                     |
| precision(number)                         | set a maximal difference value which is used to compare floating point numbers |
| safeInteger()[`not working properly`]     | value must be a between -(2<sup>53</sup> - 1) inclusive to 2<sup>53</sup> - 1  |

- Validate a number value that should represent a person's age:

```js
const { number } = require('./fluent-validator')().schemas,

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

## `BoolSchema` **extends** `BaseSchema` 

| schema-specific methods | explanation |
|:-----------------------:|:-----------:|
| -                       | -           |

```js
const { bool } = require('./fluent-validator')().schemas;

// input values should be either true or false
const boolSchema = bool().required();

const values = [true, false, '', 'true', null];

for(let v of values) {
    console.log(boolSchema.validate(v, 'value'));
}
```

## `ArraySchema` **extends** `BaseSchema` 

| schema-specific methods                 | explanation                                   |
|:--------------------------------------- |:--------------------------------------------- |
| minlength(number)                       | set a minimum array length of the schema      |
| maxlength(number)                       | set a maximum array length of the schema      |

- Validate an array of names:

```js
const { string, array } = require('./fluent-validator').schemas;

// input array should contain strictly strings that match the regular expression
const nameArraySchema = array(string().pattern(/^[a-z]{2,20}$/i))
                            .required();

const names = ['george', 'ivan', 'todor', '', 'tom1', null, 10];

console.log(nameArraySchema.validate(names, 'names'));
```

- Integer matrix validation:

```js
const matrixSchema = array(array(number().integer()));

const matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
],
    matrix2 = null,
    matrix3 = [
        [1, 2, 3],
        ['not number']
    ];

console.log(matrixSchema.validate(matrix, 'matrix'));
console.log(matrixSchema.validate(matrix2, 'matrix2'));
console.log(matrixSchema.validate(matrix3, 'matrix3'));
```

## `ObjectSchema` **extends** `BaseSchema` 

- **NOTES**
    - recursive types are not yet supported, but are a planned feature

| schema-specific methods | explanation |
|:-----------------------:|:-----------:|
| -                       | -           |

- Validate an object that represents a student's info:

```js
const { string, number, bool, object } = require('./fluent-validator')().schemas;

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