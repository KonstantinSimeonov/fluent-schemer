'use strict';

(function (FluentSchemer) {

    const {base: {exports: createBaseSchema}} = FluentSchemer,
        {errors: {exports: defaultErrorsFactory}} = FluentSchemer,
        defaultBaseSchema = createBaseSchema(defaultErrorsFactory);

    function defaultTypesFactory() {
        const types = [];

        for (const key in FluentSchemer) {
            // TODO: unmaintainable, error-prone, should fix #fragileMethodologies
            if (key === 'base' || key === 'errors' || key === 'createInstance') {
                continue;
            }

            types.push({
                name: key,
                Schema: FluentSchemer[key].exports
            });
        }

        return types;
    }

    FluentSchemer.createInstance = FluentSchemer.createInstance.exports(defaultBaseSchema, defaultErrorsFactory, defaultTypesFactory);
})(window.FluentSchemer);
