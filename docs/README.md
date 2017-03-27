# How does the whole thing work?

Every schema allows a validation of a concrete type - current supported types are `number`, `string`, `bool`, `array`, `object`, `enumeration` and `union`.
Each schema defines validation rules that can be added to the schema by calling a method. For readable and concise syntax, those methods provide chaining.
Schemas can be used individually or in conjunction - for an example, one could write `number().min(10)` or `array(number().min(10))`. The former will provide a
validate whether a number is larger than or equal to 10, while the latter will validate whether an array contains only numbers larger or equal to than 10. The 
validation feedback is returned in the form of a plain old javascript object that contains two keys: 

- **errorsCount** - how many errors have occurred during the validation process
- **errors** - plain javascript object, the keys of which are errors reports
    - error reports can be arrays of errors, or javascript object for errors from an object schema

```js
{ 
    errorsCount: 4,
    errors: { 
        name: [
                ValidationError {
                    type: 'type',
                    message: 'Expected type string but got object',
                    path: 'name'
                }
        ],
        age: [ 
                ValidationError {
                    type: 'argument',
                    message: 'Expected integer number but got -10.5',
                    path: 'age' 
                },
                ValidationError {
                    type: 'range',
                    message: 'Expected value greater than or equal to 0 but got -10.5',
                    path: 'age' 
                }
        ],
        skill: {
            title: [
                ValidationError {
                    type: 'type',
                    message: 'Expected type string but got number',
                    path: 'skill.title'
                }
            ]
        } 
    }
}
```

If the feedback array is empty, that means no errors occurred and the passed value is valid.

Schemas are defined as functions that accept dependencies(currently a function that creates errors and a map of error types) and return ES6 classes. There is the `BaseSchema` class that packs all the common functionality in it, such as `.required()`, 
`.not()`, `.validate()`, `.predicate()`. The `BaseSchema` is meant to be inherited in order to create a concrete validation schema - such as the `StringSchema` or the `NumberSchema`.
Each schema extends the `BaseSchema` with it's own methods - for example `StringSchema.minlength()` allows to set a minimum length for a string value.
The concrete schemas should also implement the abstract method `.validateType()` - validate whether a passed value is of the desired type and `.type` - returns the type of the schema as a string.
Also, `BaseSchema.validateWithCorrectType()` validates a value which is known to be of the expected type. This method can be overriden when needed - `ObjectSchema` overrides this method to provide schema nesting.

# Usage

- **Node.js**

```js
const schemerInstance = require('./fluent-schemer').createInstance(),
    { string, number, object, bool, array, union, enumeration } = schemerInstance.schemas;
```

- **Browser**
    - execute the command `npm run build`. A successful build will generate the `browser-build` folder in the root directory.
    - index.html:
    ```html
        <script src="./node_modules/fluent-schemer/browser-build/all.min.js"></script>
    ```
    - in your code:
    ```js
        const schemerInstance = window.FluentSchemer.createInstance(),
            { number, object, bool, array } = schemerInstance.schemas;
    ```

- **ES5**
    - after running `npm run build`, a folder named `es5-build` will appear. The folder has the same structure as `lib`, only the scripts are transpiled to es5.
    ```js
        var schemerInstance = require('./node_modules/fluent-schemer/es5-build').createInstance(),
            string = schemerInstance.schemas.string,
            number = schemerInstance.schemas.number;
    ```

- **Running the tests**
    - Running the tests is as simple as running `npm install && npm test`
    - Reports go into the `coverage` folder as html :)

# Extending

Introduction of new schemas is trivial - a new `schemaname-schema.js` needs to be created in the `schema` folder. The new script file should exports a mixin like that:

```js
'use strict';

(function (module) {
    module.exports = (BaseSchema, errors) => {
        const { 
            createError, // function that accepts a type, a message and a path and returns an error object
            ERROR_TYPES // supported error types
        } = errors;

        return class CustomSchema extends BaseSchema {
            // implementation
        }
    }
})(typeof module === 'undefined' ? window.FluentSchemer['yourSchemaName'] = {} : module);
```

# Schemas

Every schema that extends `BaseSchema` supports `.not()`, `.required()`, `.predicate()`, `.validate()`, `.validateWithCorrectType()`.

| method                     | explanation                                                                             |
|:-------------------------- |:--------------------------------------------------------------------------------------- |
| not(v1, v2, v3, ...)       | values must not be equal to v1, v2, v3, ...                                             |
| required()                 | values must be of the type of the schema - *Schema.validateType(value) must return true |
| predicate((value) => bool) | values must return true for the specified predicate function                            |

## `StringSchema` **extends** `BaseSchema` 

| schema-specific methods            | explanation                                                  |
|:---------------------------------- |:------------------------------------------------------------ |
| validateType(value)                | returns `true` if value is primitive string or object string |
| minlength(number)                  | sets a minimum length to the schema                          |
| maxlength(number)                  | sets a maximum length to the schema                          |
| pattern(Regexp)                    | sets a regexp to test values against                         |

```js
const { string } = require('./fluent-schemer').createInstance().schemas;

const testSchema = string() // create a blank StringSchema
                .required() // the value must be a string
                .minlength(5) // validate wether the length of an input string is at least 5
                .maxlength(10) // validate wether the length of an input string is at most 10
                .pattern(/^[a-z]+$/i) // validate wether the input string matches a regular expression
                .predicate(str => str !== 'javascript') // use a custom function to validate an input string
                .not('c#', 'java', 'c++'); // the input value shouldn't be one of the passed values

const someString = 'testtest42';

const { errors, errorsCount } = testSchema.validate(someString);

console.log(errorsCount); // 1
console.log(errors);
/* [ ValidationError {
    type: 'argument',
    message: 'Expected testtest42 to match pattern but it did not',
    path: '' } ]
*/
```

## `NumberSchema` **extends** `BaseSchema` 

| schema-specific methods                   | explanation                                                                                                                                                          |
|:----------------------------------------- |:-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| validateType(value)                       | returns `true` is the value is a primitive or object number and is not `NaN` or `Infinity`.<br> This behaviour can be changed using .allowNaN() and .allowInfinity() |
| min(number)                               | set a minimal possible value for the schema                                                                                                                          |
| max(number)                               | set a maximal possible value for the schema                                                                                                                          |
| integer()                                 | value should be an integer                                                                                                                                           |
| precision(number)                         | set a maximal difference value which is used to compare floating point numbers                                                                                       |
| safeInteger()                             | value must be a between -(2<sup>53</sup> - 1) inclusive to 2<sup>53</sup> - 1                                                                                        |
| allowNaN()                                | `NaN` will be considered a valid number in .validateType()                                                                                                           |
| allowInfinity()                           | `Infinity` will be considered a valid number in .validateType()                                                                                                      |

- Validate a number value that should represent a person's age:

```js
const schemerInstance = require('./fluent-schemer').createInstance(),
    { number } = schemerInstance.schemas;

const ageSchema = number() // blank number schema
                    .required() // the input value must be a number, excluding NaN and Infinity
                    .min(0) // the input value must be at least 0
                    .max(100) // the input value must be at most 100
                    .integer(); // the input value must be an integer

const ages = [1, 20, 200, -5, 3.4, NaN];

for(let a of ages) {
    const { errors } = ageSchema.validate(a);
    console.log(errors);
}
```

## `BoolSchema` **extends** `BaseSchema` 

| schema-specific methods | explanation |
|:-----------------------:|:-----------:|
| -                       | -           |

```js
const schemerInstance = require('./fluent-schemer').createInstance(),
    { bool } = schemerInstance.schemas;

// input values should be either true or false
const boolSchema = bool().required();

const values = [true, false, '', 'true', null];

for(let v of values) {
    const { errors, errorsCount } = boolSchema.validate(v);
    
    if(errorsCount) {
        console.log(`Errors occured for ${v}: ${JSON.stringify(errors, null, 4)}`);
    } else {
        console.log(`No errors occured for ${v}`);
    }
}
```

## `ArraySchema` **extends** `BaseSchema` 

| schema-specific methods                 | explanation                                   |
|:--------------------------------------- |:--------------------------------------------- |
| minlength(number)                       | set a minimum array length of the schema      |
| maxlength(number)                       | set a maximum array length of the schema      |

- Validate an array of names:

```js
const schemerInstance = require('./fluent-schemer').createInstance(),
    { string, array } = schemerInstance.schemas;

// input array should contain strictly strings that match the regular expression
const nameArraySchema = array(string().pattern(/^[a-z]{2,20}$/i))
                            .required();

const names = ['george', 'ivan', 'todor', '', 'tom1', null, 10];

console.log(JSON.stringify(nameArraySchema.validate(names), null, 4));
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

console.log(matrixSchema.validate(matrix));
console.log(matrixSchema.validate(matrix2));
console.log(matrixSchema.validate(matrix3));
```

## `ObjectSchema` **extends** `BaseSchema` 

- **NOTES**
    - recursive types are not yet supported, but are a planned feature

| schema-specific methods | explanation |
|:-----------------------:|:-----------:|
| -                       | -           |

- Validate an object that represents a student's info:

```js
const schemerInstance = require('./fluent-schemer').createInstance(),
    { string, number, bool, object, array } = schemerInstance.schemas;

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

/**
 * leverage destructuring statements in order
 * to easily extract errors from the error report
 */
const {
    errorsCount,
    errors: { 
        age: ageErrors,
        skills: skillErrors,
        cat: {
            breed: breedErrors
        }
     }
} = studentSchema.validate(student);

console.log(ageErrors);
console.log(skillErrors)
console.log(breedErrors);
```

## `UnionSchema` **extends** `BaseSchema`

Allows creation of union types - for example, a union<string|number> is a value that is either a string or a number value.

| schema-specific methods | explanation |
|:-----------------------:|:-----------:|
| -                       | -           |

```js
const schemerInstance = require('./fluent-schemer').createInstance(),
    { string, object, union } = schemerInstance.schemas;

const schema = union(
                        string().minlength(5),
                        object({ name: string().minlength(10) })
                    )
                    .required();

const values = ['ivancho', { name: 'ivancho' }, 'dsf', null, { name: 'kyci' }];

for(const v of values) {
    console.log(schema.validate(v));
}
```

## `EnumerationSchema` **extends** `BaseSchema`

| schema-specific methods | explanation |
|:-----------------------:|:-----------:|
| -                       | -           |

- Passing the allowed values as parameters:

```js
const schemerInstance = require('./fluent-schemer').createInstance(),
    { enumeration } = schemerInstance.schemas;

const schema = enumeration(1, 2, 4, 8, 16);

const values = [1, 2, 5, 10, null, undefined, 33];

for(const v of values) {
    const { errors } = schema.validate(v);
    console.log(`Errors for ${v}:`);
    console.log(JSON.stringify(v, null, 4));
    console.log('\n\n');
}
```

- Passing the allowed values from the keys of an object:

```js
const { enumeration } = require('./fluent-schemer')().schemas;

const someEnum = {
    FLAG1: 1,
    FLAG2: 2,
    FLAG10: 1024
}

const schema = enumeration(someEnum); // is the same as calling enumeration(1, 2, 1024)

const values = [1, 2, 5, 10, null, undefined, 33, 42];

for(const v of values) {
    const { errors } = schema.validate(v);
    console.log(`Errors for ${v}:`);
    console.log(JSON.stringify(errors, null, 4));
    console.log('\n\n');
}
```
