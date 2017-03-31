export const name = 'union';

export const factory = function (BaseSchema) {
    return class UnionSchema extends BaseSchema {

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

        // TODO: async api doesn't work
        // TODO: refactor
        // TODO: improve performance, currently .validateType() is executed twice
        validateValueWithCorrectType(value, path) {
            const errors = [],
                unionErrors = [];

            for (const schema of this.subschemas) {

                if (!schema.validateType(value)) {
                    continue;
                }

                const { errors: schemaErrors, errorsCount } = schema.validate(value, path);

                if (!errorsCount) {
                    return { errors: [], errorsCount: 0 };
                }

                if (Array.isArray(schemaErrors)) {
                    unionErrors.push(...schemaErrors);
                } else {
                    unionErrors.push(schemaErrors);
                }
            }

            errors.push(...unionErrors);

            return { errors, errorsCount: errors.length };
        }
    };
}
