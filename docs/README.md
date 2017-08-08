# How does the whole thing work?

Every schema allows a validation of a concrete type - current supported types are `number`, `string`, `bool`, `array`, `object`, `enumeration` and `union`.
Each schema defines validation rules that can be added to the schema by calling a method. For readable and concise syntax, those methods provide chaining.
Schemas can be used individually or in conjunction - for an example, one could write `number().min(10)` or `array(number().min(10))`. The former will provide a
validate whether a number is larger than or equal to 10, while the latter will validate whether an array contains only numbers larger or equal to than 10. The 
validation feedback is returned in the form of a plain old javascript object that contains two keys: 

- **errorsCount** - how many errors have occurred during the validation process
- **errors** - plain javascript object, the keys of which are errors reports
    - error reports can be arrays of errors, or javascript object for errors from an object schema

```js
{ 
    errorsCount: 4,
    errors: { 
        name: [
                ValidationError {
                    type: 'type',
                    message: 'Expected type string but got object',
                    path: 'name'
                }
        ],
        age: [ 
                ValidationError {
                    type: 'argument',
                    message: 'Expected integer number but got -10.5',
                    path: 'age' 
                },
                ValidationError {
                    type: 'range',
                    message: 'Expected value greater than or equal to 0 but got -10.5',
                    path: 'age' 
                }
        ],
        skill: {
            title: [
                ValidationError {
                    type: 'type',
                    message: 'Expected type string but got number',
                    path: 'skill.title'
                }
            ]
        } 
    }
}
```

If the feedback array is empty, that means no errors occurred and the passed value is valid.
