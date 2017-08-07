import BaseSchema from './lib/schemas/base-schema';
import BoolSchema from './lib/schemas/bool-schema';
import ArraySchema from './lib/schemas/array-schema';
import EnumerationSchema from './lib/schemas/enumeration-schema';
import NumberSchema from './lib/schemas/number-schema';
import ObjectSchema from './lib/schemas/object-schema';
import StringSchema from './lib/schemas/string-schema';
import UnionSchema from './lib/schemas/union-schema';
import DateSchema from './lib/schemas/date-schema';

export const string = () => new StringSchema;
export const number = () => new NumberSchema;
export const bool = () => new BoolSchema;
export const date = () => new DateSchema;
export const array = (subschema: BaseSchema) => new ArraySchema(subschema);
export const enumeration = (...values: any[]) => new EnumerationSchema(...values);
export const object = (subschema: { [id: string]: BaseSchema }) => new ObjectSchema(subschema);
export const union = (...subschemas: BaseSchema[]) => new UnionSchema(...subschemas);

export * from './lib/errors';