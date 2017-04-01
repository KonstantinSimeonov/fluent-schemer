# `EnumerationSchema` **extends** `BaseSchema`

`EnumerationSchema` is exported under the default name `enumeration`. Provides validation whether a value is contained in a predefined set of values. Work with everything that is a javascript value. Supports creating enumerations from parameters, from an array or from an object's values. Any validation errors are returned as an array of error objects.

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

- Create an enumeration schema from an array of values:

```js
const schemerInstance = require('./fluent-schemer').createInstance(),
    { enumeration } = schemerInstance.schemas;

const namesEnum = ['Penka', 'John', 'Travolta', 'ShiShi'],
    schema = enumeration(...namesEnum);

console.log(schema.validate('Hodor'));
console.log(schema.validate('Travolta'));
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

const values = [1, 2, 5, 42];

for(const v of values) {
    const { errors } = schema.validate(v);
    console.log(`Errors for ${v}:`);
    console.log(JSON.stringify(errors, null, 4));
    console.log('\n\n');
}
```
