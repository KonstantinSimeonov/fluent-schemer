'use strict';

const defaultTypesFactory = require('./schemas'),
    defaultErrorsFactory = require('./errors'),
    defaultBaseSchema = require('./schemas/base-schema')(defaultErrorsFactory),
    getCreateInstanceFunction = require('./create-instance');

module.exports = {
    createInstance: getCreateInstanceFunction(defaultBaseSchema, defaultErrorsFactory, defaultTypesFactory)
};
