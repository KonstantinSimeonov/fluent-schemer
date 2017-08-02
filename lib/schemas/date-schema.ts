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

function getDateComponent(componentName: keyof Date, dateInstance: Date): number {
	switch(componentName) {
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

function betweenValidation(start: number, end: number, ranges: { [key: string]: number }, name: string) {
	if (!is.Undefined(start && end)) {
		throw new Error(`Cannot set start and end for ${name} twice on a single DateSchema instance`);
	}

	if (!validateRangeBound(start) || !validateRangeBound(end)) {
		throw new RangeError(`Expected sane integer numbers for start and end of ${name}, but got ${start} and ${end}`);
	}

	ranges['_start' + name] = start;
	ranges['_end' + name] = end;

	return (value: any, path: string) => {
		const rstart = ranges['_start' + name];
		const rend = ranges['_end' + name];
		const valueNumber = value['get' + name]();

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

	private state: DateSchemaState

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
	public before(...dateConstructorArgs) {
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
	public after(...dateConstructorArgs) {
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
	 * @param {number} start
	 * @param {number} end
	 * @returns {DateSchema}
	 */
	public dateBetween(start: number, end: number) {
		const validation = betweenValidation(start, end, this.state.ranges, 'Date');
		this.pushValidationFn(validation);

		return this;
	}

	public monthBetween(start: number, end: number) {
		if (!is.Undefined(this._startMonth || this._endMonth)) {
			throw new Error('Cannot set an month between on a date schema instance twice');
		}

		if (!validateRangeBound(start) || !validateRangeBound(end)) {
			throw new TypeError(`Expected sane integer numbers for monthBetween, but got ${start} and ${end}`);
		}

		this.pushValidationFn(validateDateTimeRange.bind(null, this, 'getMonth'));
		this._startMonth = start;
		this._endMonth = end;

		return this;
	}

	public hourBetween(start: number, end: number) {
		if (!is.Undefined(this._startHours || this._endHours)) {
			throw new Error('Cannot set an hour between on a date schema instance twice');
		}

		if (!validateRangeBound(start) || !validateRangeBound(end)) {
			throw new TypeError(`Expected sane integer numbers for hourBetween, but got ${start} and ${end}`);
		}

		this.pushValidationFn(validateDateTimeRange.bind(null, this, 'getHours'));
		this._startHours = start;
		this._endHours = end;

		return this;
	}

	public weekdayBetween(start: number, end: number) {
		if (!is.Undefined(this._startDay || this._endDay)) {
			throw new Error('Cannot set weekday between on a date schema instance twice');
		}

		if (!validateRangeBound(start) || !validateRangeBound(end)) {
			throw new TypeError(`Expected sane integer numbers for weekdayBetween, but got ${start} and ${end}`);
		}

		this.pushValidationFn((value, path) => validateDateTimeRange(this._startDay, this._endDay, 'getDay', value, path));
		this._startDay = start;
		this._endDay = end;

		return this;
	}

	public minutesBetween(start: number, end: number) {
		if (!is.Undefined(this._startMinutes || this._endMinutes)) {
			throw new Error('Cannot set minute between on a date schema instance twice');
		}

		if (!validateRangeBound(start) || !validateRangeBound(end)) {
			throw new TypeError(`Expected sane integer numbers for minutesBetween, but got ${start} and ${end}`);
		}

		this.pushValidationFn(validateDateTimeRange.bind(null, this, 'getMinutes'));
		this._startMinutes = start;
		this._endMinutes = end;

		return this;
	}

	public secondsBetween(start: number, end: number) {
		if (!is.Undefined(this._startSeconds || this._endSeconds)) {
			throw new Error('Cannot set second between on a date schema instance twice');
		}

		if (!validateRangeBound(start) || !validateRangeBound(end)) {
			throw new TypeError(`Expected sane integer numbers for secondsBetween, but got ${start} and ${end}`);
		}

		this.pushValidationFn(validateDateTimeRange.bind(null, this, 'getSeconds'));
		this._startSeconds = start;
		this._endSeconds = end;

		return this;
	}
};
