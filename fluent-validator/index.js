'use strict';

const defaultTypesFactory = require('./schemas'),
    defaultErrorsFactory = require('./errors'),
    defaultBaseSchema = require('./schemas/base-schema')(defaultErrorsFactory);

module.exports = options => {
    options = options || {};

    const BaseSchema = options.BaseSchema || defaultBaseSchema,
        include = options.include || /.*/,
        types = defaultTypesFactory(BaseSchema).filter(type => include.test(type.name)),
        errorFactory = options.errorFactory || defaultErrorsFactory,
        schemas = {};

    function _extendWith(name, schemaFactory) {
        const Schema = schemaFactory(BaseSchema, errorFactory);

        schemas[name] = function (...args) {
            return new Schema(...args);
        };

        return this;
    }

    types.forEach(t => _extendWith(t.name, t.Schema));

    return {
        get schemas() {
            return schemas;
        },

        extendWith(name, schemaFactory) {
            return _extendWith.call(this, name, schemaFactory);
        }
    }
}
