# `ArraySchema` **extends** `BaseSchema`

`ArraySchema` is exported under the default name `array`. It is used to validate native array values.
Array-like objects are currently not considered valid arrays. Validation for generic arrays is also available.
Below are examples of validation schemas for array<string>, array<array<int>> and array<any>. Any validation errors are returned as an array of error objects.

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

- Untyped arrays:
    - The types of the values in the array are not validated

```js
const freeSlotsSchema = array().minlength(2).maxlength(10).required();

console.log(freeSlotsSchema.validate([1, null, 10]));
console.log(freeSlotsSchema.validate(['hello']));
```