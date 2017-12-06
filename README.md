# fluent-schemer

<a href='https://david-dm.org/KonstantinSimeonov/fluent-schemer'><img src='https://img.shields.io/david/KonstantinSimeonov/fluent-schemer.svg'></a>
[![devDependencies Status](https://david-dm.org/KonstantinSimeonov/fluent-schemer/dev-status.svg)](https://david-dm.org/KonstantinSimeonov/fluent-schemer?type=dev)
<a href='https://travis-ci.org/KonstantinSimeonov/fluent-schemer'><img src='https://travis-ci.org/KonstantinSimeonov/fluent-schemer.svg?branch=master' alt='Coverage Status' /></a> <a href='https://coveralls.io/github/KonstantinSimeonov/fluent-schemer'><img src='https://coveralls.io/repos/github/KonstantinSimeonov/fluent-schemer/badge.svg' alt='Coverage Status' /></a>

```js
const librarySchema = object({
	dependenciesCount: number().min(0).max(10).integer().optional(),
	name: string().minlength(2).maxlength(10),
	testCoverage: number().min(0).max(100).optional(),
	lastCommitDate: date().after(new Date(new Date().setMonth(new Date().getMonth() - 1))),
	contributors: array(
		object({
			username: string().minlength(5),
			email: string().pattern(/\S+@\S+\.\S+/)
		})
	),
	issues: array(string()),
	activelyMaintained: bool(),
	license: enumeration('MIT', 'BSD', 'GPL')
});

const { errorCounts, errors } = librarySchema.validate(someLibraryRecord);
```

## Incoming:
- **serialization/deserialization from/to JSON**
- **flow libdefs** on flow-typed

Aims to provide declarative, expressive and elegant approach to validation, while providing an intuitive, easy-to-use api.

## It's cool, because
- it **fully embraces ES2015** features such as classes, fat arrow functions, mixins, destructuring statements, modules
- has **typescript type definitions** - v2.0 comes with typings for enhanced development experience
- has **flow libdefs**, which will soon be available on flow-typed
- **easy to use and pick up**, write a little code for a lot of common validation logic
- has a **fluent, readable and declarative** api
- **umd compliant** - use in node/browser, with commonjs, umd, script tags, harmony modules, whatever
- **no production dependencies**, small codebase
- helps developers **get rid of imperative code, long if-else's** and writing boring validations all over again
- **promotes code reuse** - easily share code between modules, between clients, servers and across projects
- easy to extends with custom schemas
- **statically type checked** with typescript, checked for correctness with a bunch of **unit tests**
- **throws errors when rubbish arguments are provided** to schema methods, instead of failing silently

## It will be cool, because
- every script, that is part of the validator, will eventually be thoroughly unit tested
- documentation with detailed examples for many combinations and use cases incoming!
- async validation for large arrays/objects is planned

### Running the tests

```
yarn build && yarn lint && yarn test
```

### Examples

Examples can be found in the [docs](./docs), in the source code and in the tests.

## [Documentation](./docs/QUICKSTART.md)
