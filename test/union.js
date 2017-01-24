'use strict';

const { expect } = require('chai'),
    { shouldReturnErrors, shouldNotReturnErrors } = require('../helpers/test-templates'),
    BaseSchema = require('../fluent-validator/schemas/base-schema'),
    UnionSchema = require('../fluent-validator/schemas/union-schema')(BaseSchema);