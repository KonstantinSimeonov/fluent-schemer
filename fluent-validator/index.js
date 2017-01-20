'use strict';

const defaultBaseSchema = require('./schemas/base-schema'),
    defaultTypesFactory = require('./schemas');

module.exports = options => {
    options = options || {};

    const BaseSchema = options.BaseSchema || defaultBaseSchema,
        include = options.include || /.*/,
        types = defaultTypesFactory(BaseSchema).filter(type => include.test(type.name)),
        schemas = {};

    function _extendWith(name, schemaFactory) {
        const Schema = schemaFactory(BaseSchema);

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