'use strict';

(function (module) {
    module.exports = function (BaseSchema) {
        return class BoolSchema extends BaseSchema {

            get type() {
                return 'bool';
            }

            validateType(value) {
                return (typeof value === 'boolean') || (value instanceof Boolean);
            }
        };
    };
    
})(typeof module === 'undefined' ? window.FluentSchemer.bool = {} : module);
