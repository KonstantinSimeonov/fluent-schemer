'use strict';

(function (module) {
    module.exports = function (BaseSchema, { createError, ERROR_TYPES }) {

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

        function validateRangeBound(bound) {
            return (bound instanceof Number || typeof bound === 'number') && !Number.isNaN(bound);
        }

        return class DateSchema extends BaseSchema {
            get type() {
                return 'date';
            }

            /**
             * Validate whether the provided value is a Date object. Only date objects with valid time are considered valid dates.
             * @param {any} value - The value to be checked for type Date.
             * @returns {Boolean}
             */
            validateType(value) {
                return (value instanceof Date) && !Number.isNaN(value.getTime());
            }

            /**
             * Introduce a before validation to the schema instance - every date equal to or after the provided will be considered invalid.
             * @param {any} dateConstructorArgs - Arguments that you will typically pass to the Date constructor. 
             * @returns {DateSchema} - Returns the current DateSchema instance to enable chaining.
             */
            before(...dateConstructorArgs) {
                if (typeof this._before !== 'undefined') {
                    throw new Error('Cannot set before date twice for a date schema instance');
                }

                const beforeDate = new Date(...dateConstructorArgs);

                if (!this.validateType(beforeDate)) {
                    throw new Error(`The value provided to .before() is not a valid date string or object ${dateConstructorArgs}`);
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
                if (typeof this._after !== 'undefined') {
                    throw new Error('Cannot set after date twice for a date schema instance');
                }

                const afterDate = new Date(...dateConstructorArgs);

                if (!this.validateType(afterDate)) {
                    throw new Error(`The value provided to .after() is not a valid date string or object ${dateConstructorArgs}`);
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
                if (typeof (this._startDate && this._endDate) !== 'undefined') {
                    throw new Error('Cannot set an date between on a date schema instance twice');
                }

                if (!validateRangeBound(start) || !validateRangeBound(end)) {
                    throw new Error(`Expected sane integer numbers for .dateBetween() method, but got ${start} and ${end}`);
                }

                this.pushValidationFn(validateDateTimeRange.bind(null, this, 'Date'));
                this._startDate = start;
                this._endDate = end;

                return this;
            }

            monthBetween(start, end) {
                if (typeof (this._startMonth && this._endMonth) !== 'undefined') {
                    throw new Error('Cannot set an month between on a date schema instance twice');
                }

                if (!validateRangeBound(start) || !validateRangeBound(end)) {
                    throw new Error(`Expected sane integer numbers for .monthBetween() method, but got ${start} and ${end}`);
                }

                this.pushValidationFn(validateDateTimeRange.bind(null, this, 'Month'));
                this._startMonth = start;
                this._endMonth = end;

                return this;
            }

            hourBetween(start, end) {
                if (typeof (this._startHours && this._endHours) !== 'undefined') {
                    throw new Error('Cannot set an hour between on a date schema instance twice');
                }

                if (!validateRangeBound(start) || !validateRangeBound(end)) {
                    throw new Error(`Expected sane integer numbers for .hourBetween() method, but got ${start} and ${end}`);
                }

                this.pushValidationFn(validateDateTimeRange.bind(null, this, 'Hours'));
                this._startHours = start;
                this._endHours = end;

                return this;
            }
        };
    };
})(typeof module === 'undefined' ? window.FluentSchemer.date = {} : module);
