# Schemas

Every schema that extends `BaseSchema` supports `.not()`, `.required()`, `.predicate()`, `.validate()`, `.validateWithCorrectType()`.

| method                     | explanation                                                                             |
|:-------------------------- |:--------------------------------------------------------------------------------------- |
| not(v1, v2, v3, ...)       | values must not be equal to v1, v2, v3, ...                                             |
| required()                 | values must be of the type of the schema - *Schema.validateType(value) must return true |
| predicate((value) => bool) | values must return true for the specified predicate function                            |

## List of available schemas
- [number](./NUMBER.md)
- [bool](./BOOL.md)
- [string](./STRING.md)
- [array](./ARRAY.md)
- [enumeration](./ENUMERATION.md)
- [object](./OBJECT.md)
- [union](./UNION.md)
