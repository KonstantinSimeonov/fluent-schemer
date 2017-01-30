'use strict';

module.exports = (BaseSchema, { createError, ERROR_TYPES }) => class DateSchema extends BaseSchema {

    get type() {
        return 'date';
    }


    validateType(value) {
        return (value instanceof Date) && !isNaN(value.getTime());
    }

    /**
     * @param {number} start
     * @param {number} end
     * @returns {DateSchema}
     */
    dayBetween(start, end) {
        this._startDay = start;
        this._endDay = end;

        if (start < end) {
            this.pushValidationFn((value, path) => {
                if (value.getDate() < this._startDay || this._endDay < value.getDate()) {
                    return createError(ERROR_TYPES.RANGE, `Expect a day between ${start}-${end}, but got ${value.getDate()}`, path);
                }
            });
        }

        if (start > end) {
            this.pushValidationFn((value, path) => {
                if (this._endDay < value.getDate() && value.getDate() < this._startDay) {
                    return createError(ERROR_TYPES.RANGE, `Expect a day between ${end}-${start}, but got ${value.getDay()}`, path);
                }
            });
        }

        return this;
    }

    /**
     * @param {number} start
     * @param {number} end
     * @returns {DateSchema}
     */
    monthBetween(start, end) {
        this._startMonth = start;
        this._endMonth = end;

        if (typeof this._startMonth !== undefined) {
            if (start < end) {
                this.pushValidationFn((value, path) => {
                    
                    if (value.getMonth() < this._startMonth || this._endMonth < value.getMonth()) {
                        return createError(ERROR_TYPES.RANGE, `Expect a month between ${start}-${end}, but got ${value.getMonth()}`, path);
                    }
                });
            }

            if (end < start) {
                this.pushValidationFn((value, path) => {
                    if (this._endMonth < value.getMonth() && value.getMonth() < this._startMonth) {
                        return createError(ERROR_TYPES.RANGE, `Expect a month between ${end}-${start}, but got ${value.getMonth()}`, path);
                    }
                });
            }
        }

        return this;
    }

    /**
     * @param {Date} date
     * @returns {DateSchema}
     */
    before(date) {
        if (!this._before) {
            this.pushValidationFn((value, path) => {
                if (this._before < value.getTime()) {
                    return createError(ERROR_TYPES.RANGE, `Expect a date before ${value}, but got ${value}`, path);
                }
            });
        }

        this._before = date;

        return this;
    }

    /**
     * @param {Date} date
     * @returns {DateSchema}
     */
    after(date) {
        if (!this._after) {
            this.pushValidationFn((value, path) => {
                if (this._after.getTime() > value.getTime()) {
                    return createError(ERROR_TYPES.RANGE, `Expect a date after ${value}, but got ${value}`, path);
                }
            });
        }

        this._after = date;

        return this;
    }
}
