import ArraySchema from './lib/schemas/array-schema';
import BaseSchema from './lib/schemas/base-schema';
import BoolSchema from './lib/schemas/bool-schema';
import DateSchema from './lib/schemas/date-schema';
import EnumerationSchema from './lib/schemas/enumeration-schema';
import NumberSchema from './lib/schemas/number-schema';
import ObjectSchema from './lib/schemas/object-schema';
import StringSchema from './lib/schemas/string-schema';
import UnionSchema from './lib/schemas/union-schema';

/**
 * Creates an instance of StringSchema.
 * @returns {StringSchema}
 *
 * @example
 * string()
 *     .minlength(2)
 *     .maxlength(20)
 *     .pattern(/\.js$/)
 *     .required();
 */
export const string = () => new StringSchema;

/**
 * Creates an instance of NumberSchema.
 * @returns {NumberSchema}
 *
 * @example
 * number()
 *     .min(-5)
 *     .max(40)
 *     .integer();
 *
 * number()
 *     .integer()
 *     .safeInteger()
 *     .allowNaN()
 *     .required();
 *
 * number()
 *     .precision(0.0001)
 *     .not(-1, 0, 1);
 */
export const number = () => new NumberSchema;

/**
 * Creates an instance of BoolSchema.
 * @returns {BoolSchema}
 *
 * @example
 * bool();
 */
export const bool = () => new BoolSchema;

/**
 * Creates an instance of DateSchema.
 * @returns {DateSchema}
 *
 * @example
 * date()
 *    .before('5/1/2005')
 *    .after('1/1/1999')
 *    .required();
 *    .dateBetween(0, 15)
 *    .monthBetween(2, 6)
 *    .weekdayBetween(5, 3) // outside of [3, 5]
 *    .hourBetween(12, 2) // outside if [2, 12]
 *    .minuteBetween(20, 40)
 *    .secondBetween(0, 10);
 */
export const date = () => new DateSchema;

/**
 * Creates an instance of ArraySchema.
 * @param {BaseSchema} [subschema] - Specify a schema which is used to validate the elements of an array.
 *
 * @example
 * // array of positive numbers
 * array(number().min(0))
 *
 * @example
 * // untyped array
 * array().minlength(5)
 */
export const array = (subschema?: BaseSchema) => new ArraySchema(subschema);

/**
 * Creates an instance of EnumerationSchema by a collection of whitelisted values.
 * Whitelisted values will be kept in a set, which would prevent automatic garbage collection.
 * @param {...any[]} args Either comma-separated whitelist values or an object, whose values will be whitelisted.
 *
 * @example
 * // both declarations below are equivalent:
 *
 * const triState = enumeration(null, true, false);
 * const triStateFromMap = enumeration({
 *     unknown: null,
 *     true: true,
 *     false: false
 * });
 */
export const enumeration = (...values: any[]) => new EnumerationSchema(...values);

/**
 * Creates an instance of ObjectSchema.
 * Accepts an object, whose keys are schemas themselves.
 * The schemas on those keys will be used to validate values on the same
 * keys in validated values.
 * @param {{ [id: string]: BaseSchema }} subschema Object schema whose keys have schemas as their values.
 *
 * @example
 * object({
 *     name: string().minlength(3).required(),
 *     age: number().min(0).integer().required()
 * }).required();
 */
export const object = (subschema: { [id: string]: BaseSchema }) => new ObjectSchema(subschema);

/**
 * Creates an instance of UnionSchema.
 * @param {...BaseSchema[]} subschemas Schemas that will be used to validate for the individual types of the union.
 *
 * @example
 * // values must be either numbers or numerical strings
 * const numerical = union(number(), string().pattern(/^\d+$/));
 *
 * const canDoMathsWith = union(bool(), number(), string().pattern(/^\d+$/));
 * canDoMathsWith.validate(false); // fine
 * canDoMathsWith.validate(5); // fine
 * canDoMathsWith.validate('5'); // fine
 * canDoMathsWith.validate('42asd'); // error
 */
export const union = (...subschemas: BaseSchema[]) => new UnionSchema(...subschemas);

export * from './lib/errors';
