'use strict';

const fs = require('fs'),
    { expect } = require('chai'),
    getFluentSchemer = () => require('../dist/fluent-schemer'),
    testTemplates = require('../helpers/test-templates')(expect);


fs.readdirSync(`${__dirname}/tests`).forEach(tfn => {
    const testFn = require(`${__dirname}/tests/${tfn}`);

    testFn(expect, getFluentSchemer, testTemplates);
});
