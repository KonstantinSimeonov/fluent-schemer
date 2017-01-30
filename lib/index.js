'use strict';

const defaultTypesFactory = require('./schemas'),
    defaultErrorsFactory = require('./errors'),
    defaultBaseSchema = require('./schemas/base-schema')(defaultErrorsFactory);

module.exports = options => {
    options = options || {};

    const BaseSchema = options.BaseSchema || defaultBaseSchema;

    let filterFn;

    if (Array.isArray(options.exclude)) {
        const excludes = options.exclude.reduce((map, name) => (map[name] = true, map), Object.create(null));
        filterFn = type => !excludes[type.name];
    } else if (Array.isArray(options.include)) {
        const includes = options.include.reduce((map, name) => (map[name] = true, map), Object.create(null));
        filterFn = type => includes[type.name];
    } else {
        filterFn = () => true;
    }

    const types = defaultTypesFactory(BaseSchema).filter(filterFn),
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
