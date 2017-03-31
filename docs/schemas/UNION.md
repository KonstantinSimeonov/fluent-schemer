# `UnionSchema` **extends** `BaseSchema`

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
