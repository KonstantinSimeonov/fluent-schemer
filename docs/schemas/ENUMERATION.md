# `EnumerationSchema` **extends** `BaseSchema`

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
