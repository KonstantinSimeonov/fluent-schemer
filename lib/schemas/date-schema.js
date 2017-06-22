import is from '../is';
console.warn('Warning: DateSchema is still experimental! API changes are possible. Use cautiously in production.');

export const name = 'date';

function validateRangeBound(bound) {
	return is.number(bound) && !Number.isNaN(bound);
}

const typeName = 'date';

export const factory = function (BaseSchema, { createError, ERROR_TYPES }) {
	/**
	 * Template function for validating date components like year, month, day, hour, minute, second.
	 * Takes start and end value of an date schema instance and validates the value component against those values.
	 * If start < end, validates whether the value component is between start and end.
	 * If start > end, validates whether the value component is NOT between start and end.
	 * Internal function for the module, meant to be partial applied when implementing methods like hourBetween and yearBetween.
	 * @param {DateSchema} dateSchemaInstance
	 * @param {string} timeName 
	 * @param {Date} dateObject 
	 * @param {string} path
	 */
	function validateDateTimeRange(dateSchemaInstance, timeName, dateObject, path) {
		const start = dateSchemaInstance['_start' + timeName],
			end = dateSchemaInstance['_end' + timeName],
			valueNumber = dateObject['get' + timeName]();

		if (start < end) {
			if (valueNumber < start || end < valueNumber) {
				return createError(ERROR_TYPES.RANGE, `Expected a date object with ${timeName} between ${start} and ${end} but got ${dateObject}`, path);
			}
		} else {
			if (end < valueNumber && valueNumber < start) {
				return createError(ERROR_TYPES.RANGE, `Expected a date object with ${timeName} between ${start} and ${end} but got ${dateObject}`, path);
			}
		}
	}

	return class DateSchema extends BaseSchema {
		get type() {
			return typeName;
		}

		/**
		 * Validate whether the provided value is a Date object. Only date objects with valid time are considered valid dates.
		 * @param {any} value - The value to be checked for type Date.
		 * @returns {Boolean}
		 */
		validateType(value) {
			return is.date(value) && !Number.isNaN(value.getTime());
		}

		/**
		 * Introduce a before validation to the schema instance - every date equal to or after the provided will be considered invalid.
		 * @param {any} dateConstructorArgs - Arguments that you will typically pass to the Date constructor. 
		 * @returns {DateSchema} - Returns the current DateSchema instance to enable chaining.
		 */
		before(...dateConstructorArgs) {
			if (!is.undefined(this._before)) {
				throw new Error('Cannot set before date twice for a date schema instance');
			}

			const beforeDate = new Date(...dateConstructorArgs);

			if (!this.validateType(beforeDate)) {
				throw new TypeError(`The value provided to .before() is not a valid date string or object ${dateConstructorArgs}`);
			}

			this._before = beforeDate;

			this.pushValidationFn((value, path) => {
				if (value >= this._before) {
					return createError(ERROR_TYPES.RANGE, `Expected date before ${this._before} but got ${value}`, path);
				}
			});

			return this;
		}

		/**
		 * Introduce an after validation to the schema instance - every date equal to or before the provided will be considered invalid.
		 * @param {any} dateConstructorArgs - Arguments that you will typically pass to the Date constructor. 
		 * @returns {DateSchema} - Returns the current DateSchema instance to enable chaining.
		 */
		after(...dateConstructorArgs) {
			if (!is.undefined(this._after)) {
				throw new Error('Cannot set after date twice for a date schema instance');
			}

			const afterDate = new Date(...dateConstructorArgs);

			if (!this.validateType(afterDate)) {
				throw new TypeError(`The value provided to .after() is not a valid date string or object ${dateConstructorArgs}`);
			}

			this._after = afterDate;

			this.pushValidationFn((value, path) => {
				if (value <= this._after) {
					return createError(ERROR_TYPES.RANGE, `Expected date after ${this._after} but got ${value}`, path);
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
		dateBetween(start, end) {
			if (!is.undefined(this._startDate || this._endDate)) {
				throw new Error('Cannot set an date between on a date schema instance twice');
			}

			if (!validateRangeBound(start) || !validateRangeBound(end)) {
				throw new TypeError(`Expected sane integer numbers for dateBetween, but got ${start} and ${end}`);
			}

			this.pushValidationFn(validateDateTimeRange.bind(null, this, 'Date'));
			this._startDate = start;
			this._endDate = end;

			return this;
		}

		monthBetween(start, end) {
			if (!is.undefined(this._startMonth || this._endMonth)) {
				throw new Error('Cannot set an month between on a date schema instance twice');
			}

			if (!validateRangeBound(start) || !validateRangeBound(end)) {
				throw new TypeError(`Expected sane integer numbers for monthBetween, but got ${start} and ${end}`);
			}

			this.pushValidationFn(validateDateTimeRange.bind(null, this, 'Month'));
			this._startMonth = start;
			this._endMonth = end;

			return this;
		}

		hourBetween(start, end) {
			if (!is.undefined(this._startHours || this._endHours)) {
				throw new Error('Cannot set an hour between on a date schema instance twice');
			}

			if (!validateRangeBound(start) || !validateRangeBound(end)) {
				throw new TypeError(`Expected sane integer numbers for hourBetween, but got ${start} and ${end}`);
			}

			this.pushValidationFn(validateDateTimeRange.bind(null, this, 'Hours'));
			this._startHours = start;
			this._endHours = end;

			return this;
		}

		weekdayBetween(start, end) {
			if (!is.undefined(this._startDay || this._endDay)) {
				throw new Error('Cannot set weekday between on a date schema instance twice');
			}

			if (!validateRangeBound(start) || !validateRangeBound(end)) {
				throw new TypeError(`Expected sane integer numbers for weekdayBetween, but got ${start} and ${end}`);
			}

			this.pushValidationFn(validateDateTimeRange.bind(null, this, 'Day'));
			this._startDay = start;
			this._endDay = end;

			return this;
		}

		minutesBetween(start, end) {
			if (!is.undefined(this._startMinutes || this._endMinutes)) {
				throw new Error('Cannot set minute between on a date schema instance twice');
			}

			if (!validateRangeBound(start) || !validateRangeBound(end)) {
				throw new TypeError(`Expected sane integer numbers for minutesBetween, but got ${start} and ${end}`);
			}

			this.pushValidationFn(validateDateTimeRange.bind(null, this, 'Minutes'));
			this._startMinutes = start;
			this._endMinutes = end;

			return this;
		}

		secondsBetween(start, end) {
			if (!is.undefined(this._startSeconds || this._endSeconds)) {
				throw new Error('Cannot set second between on a date schema instance twice');
			}

			if (!validateRangeBound(start) || !validateRangeBound(end)) {
				throw new TypeError(`Expected sane integer numbers for secondsBetween, but got ${start} and ${end}`);
			}

			this.pushValidationFn(validateDateTimeRange.bind(null, this, 'Seconds'));
			this._startSeconds = start;
			this._endSeconds = end;

			return this;
		}
	};
};
