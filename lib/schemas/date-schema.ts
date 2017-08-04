import { IValidationError } from '../contracts';
import { createError, ERROR_TYPES } from '../errors';
import BaseSchema from './base-schema';

import * as is from '../is';
console.warn('Warning: DateSchema is still experimental! API changes are possible. Use cautiously in production.');

export const name = 'date';

function validateRangeBound(bound: any): boolean {
	return is.Number(bound) && !Number.isNaN(bound);
}

const typeName = 'date';

function isInRange(start: number, end: number, value: number) {
	if (start < end) {
		return (value < start || end < value);
	} else {
		return (end < value && value < start);
	}
}

/**
 * This function is here because typescript is stupid and doesn't understand javascript types and has not compile time templating.
 * 
 * @param {keyof Date} componentName 
 * @param {Date} dateInstance 
 * @returns {number} 
 */
function getDateComponent(componentName: keyof Date, dateInstance: Date): number {
	switch (componentName) {
		case 'getSeconds':
		case 'getMinutes':
		case 'getHours':
		case 'getDay':
		case 'getMonth':
		case 'getDate':
		case 'getFullYear':
			return dateInstance[componentName]();
		default:
			throw new Error('Should never happen in production.');
	}
}

function betweenValidation(
	start: number,
	end: number,
	ranges: { [key: string]: number },
	componentName: keyof Date
) {
	const name = componentName.replace(/get/, '').toLowerCase();

	if (!is.Undefined(start && end)) {
		throw new Error(`Cannot set start and end for ${name} twice on a single DateSchema instance`);
	}

	if (!validateRangeBound(start) || !validateRangeBound(end)) {
		throw new RangeError(`Expected sane integer numbers for start and end of ${name}, but got ${start} and ${end}`);
	}

	ranges['_start' + name] = start;
	ranges['_end' + name] = end;

	return (value: Date, path: string) => {
		const rstart = ranges['_start' + name];
		const rend = ranges['_end' + name];
		const valueNumber = getDateComponent(componentName, value);

		if (!isInRange(rstart, rend, valueNumber)) {
			return createError(ERROR_TYPES.RANGE, `Expected ${name} to be in range ${start}:${end} but got ${value}`, path);
		}
	}
}

type DateSchemaState = {
	_before: Date
	_after: Date
	ranges: { [key: string]: number }
}

export default class DateSchema extends BaseSchema {
	protected validationFunctions: Array<((value: Date, path: string) => IValidationError)>;
	private state: DateSchemaState;

	public get type() {
		return typeName;
	}

	/**
	 * Validate whether the provided value is a Date object. Only date objects with valid time are considered valid dates.
	 * @param {any} value - The value to be checked for type Date.
	 * @returns {Boolean}
	 */
	public validateType(value: any): value is Date {
		return is.Date(value) && !Number.isNaN(value.getTime());
	}

	/**
	 * Introduce a before validation to the schema instance - every date equal to or after the provided will be considered invalid.
	 * @param {any} dateConstructorArgs - Arguments that you will typically pass to the Date constructor. 
	 * @returns {DateSchema} - Returns the current DateSchema instance to enable chaining.
	 */
	public before<T>(...dateConstructorArgs: Array<T>) {
		if (!is.Undefined(this.state._before)) {
			throw new Error('Cannot set before date twice for a date schema instance');
		}

		const beforeDate = new Date(...dateConstructorArgs);

		if (!this.validateType(beforeDate)) {
			throw new TypeError(`The value provided to .before() is not a valid date string or object ${dateConstructorArgs}`);
		}

		const { state } = this;

		state._before = beforeDate;

		this.pushValidationFn((value, path) => {
			if (value >= state._before) {
				return createError(ERROR_TYPES.RANGE, `Expected date before ${state._before} but got ${value}`, path);
			}
		});

		return this;
	}

	/**
	 * Introduce an after validation to the schema instance - every date equal to or before the provided will be considered invalid.
	 * @param {any} dateConstructorArgs - Arguments that you will typically pass to the Date constructor. 
	 * @returns {DateSchema} - Returns the current DateSchema instance to enable chaining.
	 */
	public after<T>(...dateConstructorArgs: Array<T>) {
		if (!is.Undefined(this.state._after)) {
			throw new Error('Cannot set after date twice for a date schema instance');
		}

		const afterDate = new Date(...dateConstructorArgs);

		if (!this.validateType(afterDate)) {
			throw new TypeError(`The value provided to .after() is not a valid date string or object ${dateConstructorArgs}`);
		}

		const { state } = this;

		state._after = afterDate;

		this.pushValidationFn((value, path) => {
			if (value <= state._after) {
				return createError(ERROR_TYPES.RANGE, `Expected date after ${state._after} but got ${value}`, path);
			}
		});

		return this;
	}

	/**
	 * Set validation for range on date in month.
	 * If start < end, value will be validated against the range [start, end]
	 * If start > end, value will be validated against the ranges [0, start] and [end, 31]
	 */
	public dateBetween(start: number, end: number) {
		this.pushValidationFn(
			betweenValidation(start, end, this.state.ranges, 'getDate')
		);

		return this;
	}

	public monthBetween(start: number, end: number) {
		this.pushValidationFn(
			betweenValidation(start, end, this.state.ranges, 'getMonth')
		);

		return this;
	}

	public hourBetween(start: number, end: number) {
		this.pushValidationFn(
			betweenValidation(start, end, this.state.ranges, 'getHours')
		);

		return this;
	}

	public weekdayBetween(start: number, end: number) {
		this.pushValidationFn(
			betweenValidation(start, end, this.state.ranges, 'getDay')
		);

		return this;
	}

	public minutesBetween(start: number, end: number) {
		this.pushValidationFn(
			betweenValidation(start, end, this.state.ranges, 'getMinutes')
		);

		return this;
	}

	public secondsBetween(start: number, end: number) {
		this.pushValidationFn(
			betweenValidation(start, end, this.state.ranges, 'getSeconds')
		);

		return this;
	}
};
