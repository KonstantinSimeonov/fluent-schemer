const fs = require('fs');
const { expect } = require('chai');
const getFluentSchemer = () => require('../dist/fluent-schemer');
const testTemplates = require('../helpers/test-templates')(expect);

fs.readdirSync(`${__dirname}/tests`).forEach(tfn => {
	const testFn = require(`${__dirname}/tests/${tfn}`);
	testFn(expect, getFluentSchemer, testTemplates);
});
