'use strict';

(function (module) {
    module.exports = function (BaseSchema, { createError, ERROR_TYPES }) {
        return class DateSchema extends BaseSchema {
            get type() {
                return 'date';
            }

            validateType(value) {
                return (value instanceof Date) && !Number.isNaN(value.getTime());
            }

            before(date) {
                if (typeof this._before === 'undefined') {
                    this.pushValidationFn((value, path) => {
                        if (value >= date) {
                            return createError(ERROR_TYPES.RANGE, `Expected date before ${this._before} but got ${value}`, path);
                        }
                    });
                }

                this._before = date;

                return this;
            }

            after(date) {
                if (typeof this._after === 'undefined') {
                    this.pushValidationFn((value, path) => {
                        if (value <= this._after) {
                            return createError(ERROR_TYPES.RANGE, `Expected date after ${this._after} but got ${value}`, path);
                        }
                    });
                }

                this._after = date;

                return this;
            }

            /**
             * Set validation for range on date in month.
             * If start < end, value will be validated against the range [start, end].
             * If start > end, value will be validated against the ranges [0, start] and [end, 31]
             * @param {number} start 
             * @param {number} end 
             * @returns {DateSchema}
             */
            dateBetween(start, end) {
                if (typeof (this._dayStart && this._dayEnd) === 'undefined') {
                    this.pushValidationFn((value, path) => {
                        const dayNumber = value.getDate();
                        if (start < end) {
                            if (dayNumber < this._dayStart || this._dayEnd < dayNumber) {
                                return createError(ERROR_TYPES.RANGE, `Expected a date with month between ${this._dayStart} and ${this._dayEnd} but got ${value}`, path);
                            }
                        } else {
                            if (this._dayEnd < dayNumber && dayNumber < this._dayStart) {
                                return createError(ERROR_TYPES.RANGE, `Expected a date with month between ${this._dayStart} and ${this._dayEnd} but got ${value}`, path);
                            }
                        }
                    });
                }

                this._dayStart = start;
                this._dayEnd = end;

                return this;
            }

            monthBetween(start, end) {
                if (typeof (this._monthStart && this._monthEnd) === 'undefined') {
                    this.pushValidationFn((value, path) => {
                        const monthNumber = value.getMonth();
                        if (start < end) {
                            if (monthNumber < this._monthStart || this._monthEnd < monthNumber) {
                                return createError(ERROR_TYPES.RANGE, `Expected a date with month between ${this._monthStart} and ${this._monthEnd} but got ${value}`, path);
                            }
                        } else {
                            if (this._monthEnd < monthNumber && monthNumber < this._monthStart) {
                                return createError(ERROR_TYPES.RANGE, `Expected a date with month between ${this._monthStart} and ${this._monthEnd} but got ${value}`, path);
                            }
                        }
                    });
                }

                this._monthStart = start;
                this._monthEnd = end;

                return this;
            }
        };
    };
})(typeof module === 'undefined' ? window.FluentSchemer.date = {} : module);
