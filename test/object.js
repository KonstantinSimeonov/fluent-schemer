'use strict';

const { expect } = require('chai'),
    { shouldReturnErrors, shouldNotReturnErrors } = require('../helpers/test-templates'),
    BaseSchema = require('../fluent-validator/schemas/base-schema'),
    ObjectSchema = require('../fluent-validator/schemas/object-schema')(BaseSchema);