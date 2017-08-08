# `UnionSchema` **extends** `BaseSchema`

`UnionSchema` is aliased as `union`. Allows creation of union type schemas - for example, a union<string|number> is a value that is either a string or a number value. A union validation is considered successful and will not return errors when at least one of the union's subschemas matches the value that is being validated. Any validation errors are returned as an array of error objects.

| schema-specific methods | explanation |
|:-----------------------:|:-----------:|
| -                       | -           |

## Sample union<string|object>:

```js
import { string } from 'fluent-schemer';

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

- Sample union<bool|number|array>:

```js
import { string } from 'fluent-schemer';

const schema = union(
						number().min(0),
						bool(),
						array().minlength(3)
					).required();
```
