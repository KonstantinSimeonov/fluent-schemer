# `NumberSchema` **extends** `BaseSchema` 

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
