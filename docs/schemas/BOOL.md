# `BoolSchema` **extends** `BaseSchema` 

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
