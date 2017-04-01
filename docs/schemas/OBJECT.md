# `ObjectSchema` **extends** `BaseSchema` 

`ObjectSchema` is aliased as `object`. Valid objects are anything that satisfies `typeof v === 'object'` and is neither a function nor an array. Provides recursive validation for objects - the object schema accepts a map of subschemas. When a value is being validated, it will have it's values validated by the schemas at the respective keys in the object schema. Object schemas can be nested as desired. Validation errors are return in a map - each key hold the errors that occurred for it's value.

- **NOTES**
    - recursive types are not yet supported, but are a planned feature

| schema-specific methods | explanation |
|:-----------------------:|:-----------:|
| -                       | -           |

- Validate an object that represents a student's info:

```js
const schemerInstance = require('./fluent-schemer').createInstance(),
    { string, number, bool, object, array } = schemerInstance.schemas;

const studentSchema = object({
    /**
    * the object schema can be used with other schemas
    * the object() function accepts an object whose keys have other schemas as values
    * the values on the same keys will be validated on the input objects
    */
    name: string()
            .required()
            .pattern(/^[A-Z][a-z]{1,20}$/),
    age: number()
            .required()
            .min(0)
            .max(120)
            .integer(),
    skills: array(string().minlength(3).maxlength(30))
                .required()
                .maxlength(20),
    cat: object({
                    breed: string().required(),
                    name: string().required()
                })
                .required()
});

const student = {
    name: 'Penka',
    age: 133,
    skills: ['studying', 'programming', 5],
    cat: {
        name: 'tom'
    }
};

/**
 * leverage destructuring statements in order
 * to easily extract errors from the error report
 */
const {
    errorsCount,
    errors: { 
        age: ageErrors,
        skills: skillErrors,
        cat: {
            breed: breedErrors
        }
     }
} = studentSchema.validate(student);

console.log(ageErrors);
console.log(skillErrors)
console.log(breedErrors);
```
