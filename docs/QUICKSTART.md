# How to get going in a minute

## Download via npm/bower/yarn
`npm install fluent-schemer`

`bower install fluent-schemer`

`yarn add fluent-schemer`

## Set it up in your code

### Node.js

- ES2015
```js
import { number } from 'fluent-schemer';

const ageSchema = number().min(0).integer().required();

console.log(ageSchema.validate(-1.5));
```

- ES5
```js
const { string } = require('fluent-schemer');

var ageSchema = number().min(0).integer().required();

console.log(ageSchema.validate(-1.5));
```

### Browser
```html
<script src="path_to_modules/fluent-schemer/dist/index.es5.min.js"></script>
```

```js
const { number } = window.FluentSchemer;

const ageSchema = number().min(0).integer().required();

console.log(ageSchema.validate(-1.5));
```

### ES2015 (Harmony) modules
```js
import { number, string, bool, object, array } from 'fluent-schemer';

const ageSchema = number().min(0).integer().required();

console.log(ageSchema.validate(-1.5));
```

## Start declaring and validating - [docs & examples](./schemas)
