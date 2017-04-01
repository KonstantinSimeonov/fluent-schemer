# How to get going in a minute

## Download via npm or bower
`npm install fluent-schemer`

or

`bower install fluent-schemer`

## Set it up in your code

### Node.js

- ES2015
```js
const FluentSchemer = require('fluent-schemer'),
    validator = FluentSchemer.createInstance(),
    { number, string, bool, object, array } = validator.schemas;

const ageSchema = number().min(0).integer().required();

console.log(ageSchema.validate(-1.5));
```

- ES5
```js
var FluentSchemer = require('path_to_modules/fluent-schemer/dist/fluent-schemer.es5'),
    validator = FluentSchemer.createInstance(),
    number = validator.schemas.number;

var ageSchema = number().min(0).integer().required();

console.log(ageSchema.validate(-1.5));
```

### Browser
```html
<script src="path_to_modules/fluent-schemer/dist/fluent-schemer.es5.min.js"></script>
```

```js
const validator = window.FluentSchemer.createInstance(),
    { number, string, bool, object, array } = validator.schemas;

const ageSchema = number().min(0).integer().required();

console.log(ageSchema.validate(-1.5));
```

### ES2015 (Harmony) modules
```js
import * as FluentSchemer from 'fluent-schemer';

const validator = FluentSchemer.createInstance(),
    { number, string, bool, object, array } = validator.schemas;

const ageSchema = number().min(0).integer().required();

console.log(ageSchema.validate(-1.5));
```

## Start declaring and validating - [docs & examples]('./schemas')