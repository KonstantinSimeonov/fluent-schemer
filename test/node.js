'use strict';

const fs = require('fs'),
    { expect } = require('chai'),
    getFluentSchemer = () => require('../dist/fluent-schemer'),
    testTemplates = require('../helpers/test-templates');

fs.readdirSync(__dirname).filter(fn => fn !== 'node.js').forEach(tfn => {
    const testFn = require(`${__dirname}/${tfn}`);

    testFn(expect, getFluentSchemer, testTemplates);
});