'use strict';

(function (module) {
    module.exports = function (BaseSchema, { createError, ERROR_TYPES }) {

        /**
         * Template function for validating date components like year, month, day, hour, minute, second.
         * Takes start and end value of an date schema instance and validates the value component against those values.
         * If start < end, validates whether the value component is between start and end.
         * If start > end, validates whether the value component is NOT between start and end.
         * Internal function for the module, meant to be partial applied when implementing methods like hourBetween and yearBetween
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
                return 'date';
            }

            validateType(value) {
                return (value instanceof Date) && !Number.isNaN(value.getTime());
            }

            before(...args) {
                if (typeof this._before === 'undefined') {
                    this.pushValidationFn((value, path) => {
                        if (value >= this._before) {
                            return createError(ERROR_TYPES.RANGE, `Expected date before ${this._before} but got ${value}`, path);
                        }
                    });
                }

                this._before = new Date(...args);

                return this;
            }

            after(...args) {
                if (typeof this._after === 'undefined') {
                    this.pushValidationFn((value, path) => {
                        if (value <= this._after) {
                            return createError(ERROR_TYPES.RANGE, `Expected date after ${this._after} but got ${value}`, path);
                        }
                    });
                }

                this._after = new Date(...args);

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
                if (typeof (this._startDate && this._endDate) === 'undefined') {
                    this.pushValidationFn(validateDateTimeRange.bind(null, this, 'Date'));
                }

                this._startDate = new Date(start);
                this._endDate = new Date(end);

                return this;
            }

            monthBetween(start, end) {
                if (typeof (this._startMonth && this._endMonth) === 'undefined') {
                    this.pushValidationFn(validateDateTimeRange.bind(null, this, 'Month'));
                }

                this._startMonth = new Date(start);
                this._endMonth = new Date(end);

                return this;
            }

            hourBetween(start, end) {
                if (typeof (this._startHours && this._endHours) === 'undefined') {
                    this.pushValidationFn(validateDateTimeRange.bind(null, this, 'Hours'))
                }

                this._startHours = new Date(start);
                this._endHours = new Date(end);
            }
        };
    };
})(typeof module === 'undefined' ? window.FluentSchemer.date = {} : module);
