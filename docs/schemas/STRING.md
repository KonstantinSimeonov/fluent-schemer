# `StringSchema` **extends** `BaseSchema`

`StringSchema` is aliased as `string`. Only primitive string values and `String` objects are considered valid strings. Provides validation for string length and validation by a given regular expression. Any validation errors are returned as an array of error objects.

| schema-specific methods            | explanation                                                  |
|:---------------------------------- |:------------------------------------------------------------ |
| validateType(value)                | returns `true` if value is primitive string or object string |
| minlength(number)                  | sets a minimum length to the schema                          |
| maxlength(number)                  | sets a maximum length to the schema                          |
| pattern(Regexp)                    | sets a regexp to test values against                         |

```js
const { string } = require('fluent-schemer');

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
	path: ''
} ]
*/
```
