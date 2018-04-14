# `NumberSchema` **extends** `BaseSchema` 

`NumberSchema` is aliased under the name `number`. Primitive number values or `Number` objects are the only values that are considered valid numbers. `NaN` and `Infinity` are considered invalid by default. This can be overwritten. Provides validations for ranges(min, max), whether a number is an integer. Also provides validations for safe integers. Any validation errors are returned as an array of error objects.

| schema-specific methods                   | explanation                                                 |
|:----------------------------------------- |:----------------------------------------------------------- |
| validateType(value)                       | `true` for primitive/boxed numbers that are not `NaN` or `Infinity`.<br> Configurable using .allowNaN() and .allowInfinity() |
| min(number)                               | set a minimal possible value for the schema                                                                                  |
| max(number)                               | set a maximal possible value for the schema                                                                                  |
| integer()                                 | value should be an integer                                                                                                   |
| precision(number)                         | set a maximal difference value which is used to compare floating point numbers                                               |
| safeInteger()                             | value must be a between -(2<sup>53</sup> - 1) inclusive to 2<sup>53</sup> - 1                                                |
| allowNaN()                                | `NaN` will be considered a valid number in .validateType()                                                                   |
| allowInfinity()                           | `Infinity` will be considered a valid number in .validateType()                                                              |

## Validate a number value that should represent a person's age:

```js
const { number } = require('fluent-schemer');

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

- Output:

```js
// 1
[]
// 20
[]
// 200 is too large
[ValidationError {
	type: 'range',
	message: 'Expected value less than or equal to 100 but got 200',
	path: ''
} ]
// -5 is too small
[ValidationError {
	type: 'range',
	message: 'Expected value greater than or equal to 0 but got -5',
	path: ''
} ]
// 3.4 is not an integer
[ValidationError {
	type: 'argument',
		message: 'Expected integer number but got 3.4',
			path: ''
} ]
// NaN is not valid number unless .allowNaN() has been called
[ValidationError {
	type: 'type',
	message: 'Expected type number but got number',
	path: ''
}]
```

## Using `.allowNaN()` and `.allowInfinity()`:

```js
import { number } from 'fluent-schemer';

const num = number().required().allowNaN().allowInfinity();

console.log(num.validate(5).errors);
console.log(num.validate('5').errors);
console.log(num.validate(NaN).errors);
console.log(num.validate(Infinity).errors);
```

- Output:

```js
[]
[ ValidationError {
	type: 'type',
	message: 'Expected type number but got string',
	path: ''
} ]
[]
[]
```
