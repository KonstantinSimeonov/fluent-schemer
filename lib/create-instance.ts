import BaseSchema from './schemas/base-schema';
import BoolSchema from './schemas/bool-schema';
import ArraySchema from './schemas/array-schema';
import EnumerationSchema from './schemas/enumeration-schema';
import NumberSchema from './schemas/number-schema';
import ObjectSchema from './schemas/object-schema';
import StringSchema from './schemas/string-schema';
import UnionSchema from './schemas/union-schema';
import DateSchema from './schemas/date-schema';

export const string = () => new StringSchema;
export const number = () => new NumberSchema;
export const bool = () => new BoolSchema;
export const date = () => new DateSchema;
export const array = (subschema: BaseSchema) => new ArraySchema(subschema);
export const enumeration = (...values: any[]) => new EnumerationSchema(...values);
export const object = (subschema: { [id: string]: BaseSchema }) => new ObjectSchema(subschema);
export const union = (...subschemas: BaseSchema[]) => new UnionSchema(...subschemas);
