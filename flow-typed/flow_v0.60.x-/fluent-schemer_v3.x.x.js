// @flow

declare module 'fluent-schemer' {
	declare type ObjectMap<TValue> = {
		[id: string]: TValue;
	};

	declare export var ERROR_TYPES: {
		ARGUMENT: 'argument',
		PREDICATE: 'predicate',
		RANGE: 'range',
		TYPE: 'type',
	};

	declare export type IValidationError = {
		type: string;
		message: string;
		path: string;
	};

	declare export type IErrorFeedback = {
		errors: IValidationError[];
		errorsCount: number;
	};
	
	declare export class BaseSchema {
		validationFunctions(value: any, path: string): IValidationError[];
		validateType(value: any): boolean;
		optional(): this;
		not(...values: any[]): this;
		validate(value: any, path?: string, currentErrors?: IValidationError[]): IErrorFeedback;
		areEqual(firstValue: any, secondValue: any): boolean;
		validateValueWithCorrectType(value: any, path: string, currentErrors?: IValidationError[]): IErrorFeedback;
	}

	declare export class BoolSchema extends BaseSchema {
		type: 'bool';
	}

	declare export class ArraySchema extends BaseSchema {
		type: string;
		minlength(length: number): this;
		maxlength(length: number): this;
		withLength(length: number): this;
		distinct(): this;
	}

	declare export class DateSchema extends BaseSchema {
		type: 'date';
		predicate(predicateFn: (value: Date) => boolean): this;
		before(dateString: string): this;
		before(date: Date): this;
		before(year: number, month?: number, day?: number, hours?: number, minutes?: number, seconds?: number, milliseconds?: number): this;
		after(dateString: string): this;
		after(date: Date): this;
		after(year: number, month?: number, day?: number, hours?: number, minutes?: number, seconds?: number, milliseconds?: number): this;
		dateBetween(start: number, end: number): this;
		monthBetween(start: number, end: number): this;
		hourBetween(start: number, end: number): this;
		weekdayBetween(start: number, end: number): this;
		minutesBetween(start: number, end: number): this;
		secondsBetween(start: number, end: number): this;
	}

	declare export class EnumerationSchema extends BaseSchema {
		type: 'enumeration';
		validateType(value: any): boolean;
		predicate(predicateFn: (value: any) => boolean): this;
	}

	declare export class NumberSchema extends BaseSchema {
		type: 'number';
		precision(allowedDiff: number): this;
		allowNaN(): this;
		allowInfinity(): this;
		integer(): this;
		min(value: number): this;
		max(value: number): this;
		predicate(predicateFn: (value: number) => boolean): this;
	}

	declare export class ObjectSchema extends BaseSchema {
		type: 'object';
		allowArrays(): this;
		allowFunctions(): this;
		predicate(predicateFn: (value: Object) => boolean): this;
	}

	declare export class StringSchema extends BaseSchema {
		type: 'string';
		minlength(length: number): this;
		maxlength(length: number): this;
		pattern(regexp: RegExp): this;
		predicate(predicateFn: (value: string) => boolean): this;
	}

	declare export class UnionSchema extends BaseSchema {
		type: string;
		predicate(predicateFn: (value: any) => boolean): this;
	}

	declare export function enumeration(...args: any[]): EnumerationSchema;
	declare export function enumeration(enumMap: Object): EnumerationSchema;
	declare export function union(...subschemas: BaseSchema[]): UnionSchema;
	declare export function string(): StringSchema;
	declare export function number(): NumberSchema;
	declare export function object(subschemasMap: ObjectMap<BaseSchema>): ObjectSchema;
	declare export function bool(): BoolSchema;
	declare export function array(subschema?: BaseSchema): ArraySchema;
	declare export function date(): DateSchema;
}
