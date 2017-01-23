'use strict';

module.exports = BaseSchema => class UnionSchema extends BaseSchema {

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
    validateValueWithCorrectType(value, path) {
        const errors = [];

        for(const schema of this.subschemas) {
            const schemaErrors = schema.validate(value, path);
            
            if(!schemaErrors.length) {
                return [];
            }

            errors.push(...schemaErrors);
        }

        return errors;
    }
}