# `BoolSchema` **extends** `BaseSchema` 

`BoolSchema` is exported by the default name of `bool`. Currently offers the only functionality of validating whether a value is strictly boolean. Any validation errors are returned as an array of error objects.

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
