# fluent-schemer changelog

## 31.03.2017 - UMD compliance
- _Notes:_
    - codebase is re-written using ES2015 harmony modules (`import`, `export`)
    - the codebase is built into a bundle that complies with UMD
    - bundling is now done via webpack instead of gulp
    - tests now run on the built codebase
    - nothing has been removed from the public API