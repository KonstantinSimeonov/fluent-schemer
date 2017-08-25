# fluent-schemer changelog

## 25.08.2017 - Throw errors on rubbish arguments, few internal changes
- _Notes_:
	- schema methods like `.min`, `.max`, `.minlength`, `.maxlength`, `.before`, `.hourBetween` and other will throw `TypeError`s, when their arguments do not make sense
		- i.e. `NaN` is passed where a valid number is required, negative numbers are passed where positive are expected
	- removed eslint, introduced basic tslint config
	- made tslint pre-commit a git hook

## 08.08.2017 - Typescript, public API simplified
- _Notes_:
	- entire codebase rewritten in Typescript
	- users can no longer plug in their own base schema
	- users can no longer select which schemas will be available runtime on the FluentSchemer object
	- users no longer need to call FluentSchemer.createInstance().andsoon, all schemas are part of the default exports
	- exports of the `error` module are also exported in index.js
	- Typescript type definitions are available
	- DateSchema is mostly behaving correctly

## 31.03.2017 - UMD compliance
- _Notes:_
    - codebase is re-written using ES2015 harmony modules (`import`, `export`)
    - the codebase is built into a bundle that complies with UMD
    - bundling is now done via webpack instead of gulp
    - tests now run on the built codebase
    - nothing has been removed from the public API