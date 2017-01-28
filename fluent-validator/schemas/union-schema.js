'use strict';

module.exports = (BaseSchema, { createError, ERROR_TYPES }) => class UnionSchema extends BaseSchema {

    constructor(...subschemas) {
        super();
        
        this.subschemas = subschemas.map(x => x.required());
    }

    get type() {
        return this._typestring || (this._typestring = this.subschemas.map(schema => schema.type).join('|'));
    }

    validateType(value) {
        return this.subschemas.findIndex(schema => schema.validateType(value)) !== -1;
    }

    // TODO: async api doesnt work
    // TODO: refactor
    // TODO: improve performance, currently .validateType() is executed twice
    validateValueWithCorrectType(value, path, errors) {
        const unionErrors = [];

        for(const schema of this.subschemas) {
            
            if(!schema.validateType(value)) {
                continue;
            }

            const schemaErrors = schema.validate(value, path);

            if(!schemaErrors.length) {
                return [];
            }

            unionErrors.push(...schemaErrors);
        }

        errors.push(...unionErrors);

        return errors;
    }
}