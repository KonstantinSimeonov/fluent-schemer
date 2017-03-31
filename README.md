# fluent-schemer

<a href='https://travis-ci.org/KonstantinSimeonov/fluent-schemer'><img src='https://travis-ci.org/KonstantinSimeonov/fluent-schemer.svg?branch=master' alt='Coverage Status' /></a> <a href='https://coveralls.io/github/KonstantinSimeonov/fluent-schemer'><img src='https://coveralls.io/repos/github/KonstantinSimeonov/fluent-schemer/badge.svg' alt='Coverage Status' /></a>


Aims to provide declarative, expressive and elegant approach to validation, while providing an intuitive, easy-to-use api.

## It's cool, because
- it fully embraces ES2015 features such as classes, fat arrow functions, mixins, destructuring statements
- has a fluent, readable and declarative api
- no production dependencies - using `fluent-schemer` does not tie you to any other packages
- helps developers get rid of long if-else code blocks
- helps developers reuse validation logic
- extending the validator with a new schema either statically or dynamically is trivial
- the codebase is small - having a problem or just curious? Reading the source code won't be time consuming :)

## It will be cool, because
- every script, that is part of the validator, will eventually be thoroughly unit tested
- will be configurable - the ability to plug in your own base classes, error factories or other options is a priority feature
- documentation with detailed examples for many combinations and use cases incoming!
- synchronous validation is already provided, async validation with ES2015 promises coming soon

## Planned features/wishful thinking

| features                                                   | state                                    |
|:----------------------------------------------------------:|:----------------------------------------:|
| DateSchema                                                 | under construction                       |
| Async api                                                  | under construction                       |
| Better support for recursive types                         | not started                              |
| ES5 build                                                  | **done**                                 |
| Browser build                                              | **available, still under construction**  |
| Build-time tree shaking for browser build                  | not started                              |
| Typescript type definition                                 | not confirmed                            |
| Immutable schemas                                          | not started                              |
| Throw errors on rubbish arguments passed to schema methods | not started                              |
| UMD compliance                                             | under construction                       |

### Running the tests

```
npm install
npm test
```

### Examples

Examples can be found in the [docs](./docs).

## [Documentation](./docs)
## [Task list](./TODOS.md)