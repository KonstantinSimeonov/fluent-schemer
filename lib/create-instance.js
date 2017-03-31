export default function (defaultBaseSchema, defaultErrorsFactory, concreteSchemaClassFactories) {
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
            types = concreteSchemaClassFactories.filter(filterFn),
            errorFactory = options.errorFactory || defaultErrorsFactory,
            schemas = {};

        function _extendWith(schemaClassFactoryFunction) {
            const SchemaClass = schemaClassFactoryFunction(BaseSchema, errorFactory),
                schemaClassName = schemaClassFactoryFunction.name;

            schemas[schemaClassName] = function (...args) {
                return new SchemaClass(...args);
            };

            return this;
        }

        types.forEach(_extendWith);

        return {
            get schemas() {
                return schemas;
            },

            extendWith(schemaFactory) {
                return _extendWith.call(this, schemaFactory);
            }
        };
    };
}
