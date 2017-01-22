# fluent-validator

![](https://travis-ci.org/KonstantinSimeonov/fluent-validator.svg?branch=master)

Aims to provide declarative, expressive and elegant approach to validation, while providing an intuitive, easy-to-use api.

### Examples

- Validate a string

```js
const playerName = 'tim';
const playerNameSchema = string().minlength(4).maxlength(10).required();
const validationErrors = playerNameSchema.validate(playerName, 'playerName');
```

- Validate a number

```js
const level = -1.5;
const skillLevelSchema = number().min(0).max(10).integer();
const validationErrors = skillLevelSchema.validate(level, 'skillLevel');
```

- Validate an object

```js
const person = { name: 'george', age: -5 };
const personSchema = object({
    name: string().required().pattern(/^[a-z]{2,20}$/i),
    age: number().required().min(0).max(150).integer()
});
const validationErrors = personSchema.validate(person, 'personObject');
```