export default function (defaultBaseSchema, defaultErrorsFactory, schemaClassFactories) {
    return function createInstance(options) {
        options = options || {};

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

        const BaseSchema = options.BaseSchema || defaultBaseSchema,
            types = schemaClassFactories.filter(filterFn),
            errorFactory = options.errorFactory || defaultErrorsFactory,
            schemas = {};

        function _extendWith(schemaName, schemaClassFactoryFunction) {
            const SchemaClass = schemaClassFactoryFunction(BaseSchema, errorFactory);

            schemas[schemaName] = function (...args) {
                return new SchemaClass(...args);
            };

            return this;
        }

        types.forEach(schemaClassFactory => _extendWith(schemaClassFactory.name, schemaClassFactory.factory));

        return {
            get schemas() {
                return schemas;
            },

            extendWith(schemaName, schemaFactory) {
                return _extendWith.call(this, schemaName, schemaFactory);
            }
        };
    };
}
