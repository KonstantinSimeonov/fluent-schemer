const fs = require('fs');
const { expect } = require('chai');
const fluentSchemer = require('../index.js');
const testTemplates = require('../helpers/test-templates')(expect);


// fs.readdirSync(`${__dirname}/tests`).forEach(tfn => {
// 	const testFn = require(`${__dirname}/tests/${tfn}`);
// 	testFn(expect, fluentSchemer, testTemplates);
// });

require('./tests/date.spec')(expect, fluentSchemer, testTemplates);