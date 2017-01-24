'use strict';

const { expect } = require('chai'),
    { shouldReturnErrors, shouldNotReturnErrors } = require('../helpers/test-templates'),
    BaseSchema = require('../fluent-validator/schemas/base-schema'),
    ArraySchema = require('../fluent-validator/schemas/array-schema')(BaseSchema);