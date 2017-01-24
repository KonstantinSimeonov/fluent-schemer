'use strict';

const { expect } = require('chai'),
    { shouldReturnErrors, shouldNotReturnErrors } = require('../helpers/test-templates'),
    BaseSchema = require('../fluent-validator/schemas/base-schema'),
    EnumerationSchema = require('../fluent-validator/schemas/enumeration-schema')(BaseSchema);