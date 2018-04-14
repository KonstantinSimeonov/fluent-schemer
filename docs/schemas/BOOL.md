# `BoolSchema` **extends** `BaseSchema` 

`BoolSchema` is exported by the default name of `bool`. Currently offers the only functionality of validating whether a value is strictly boolean. Any validation errors are returned as an array of error objects.

| schema-specific methods | explanation |
|:-----------------------:|:-----------:|
| -                       | -           |

```js
const { bool } = require('fluent-schemer');

// input values should be either true or false
const boolSchema = bool().required();

const values = [true, false, '', 'true', null];

for (const val of values) {
	console.log(boolSchema.validate(val));
}
```
