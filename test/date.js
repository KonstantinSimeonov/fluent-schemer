const { expect } = require('chai'),
    { shouldReturnErrors, shouldNotReturnErrors } = require('../helpers/test-templates'),
    { date } = require('../lib').createInstance().schemas,
    ERROR_TYPES = require('../lib/errors').ERROR_TYPES;

describe('DateSchema individual methods', () => {
    it('DateSchema.type: should return date', () => {
        expect(date().type).to.equal('date');
    });

    it('DateSchema.validateType(): should return true for date objects with valid date value', () => {
        const schema = date(),
            dates = ['01/31/1000', '01/01/1000', '05/16/1994'];

        const trueForAll = dates.every(date => schema.validateType(new Date(date)));

        expect(trueForAll).to.equal(true);
    });

    it('DateSchema.validateType(): should return false for date objects with invalid inner date value', () => {
        const schema = date(),
            invalidDates = ['date', 'gosho', '13/13/1333', NaN, undefined];

        for (const invalidDateString of invalidDates) {
            expect(schema.validateType(new Date(invalidDateString))).to.equal(false);
        }
    });

    it('DateSchema.required(): .validate() should return errors when .required() has been called and values are not date objects or date objects with valid dates', () => {
        const schema = date().required(),
            notDateObjects = ['hi im string', 123, null, undefined, NaN, {}, [], Date],
            invalidDates = ['13/13/1333', 'sdfsd', undefined].map(dstr => new Date(dstr));

        shouldReturnErrors(schema, notDateObjects.concat(invalidDates), { type: ERROR_TYPES.TYPE });
    });

    it('DateSchema.required(): .validate() should not return errors when .required() has not been called and values are not date objects or date objects with valid dates', () => {
        const schema = date(),
            notDateObjects = ['hi im string', 123, null, undefined, NaN, {}, [], Date],
            invalidDates = ['13/13/1333', 'sdfsd', undefined].map(dstr => new Date(dstr));

        shouldNotReturnErrors(schema, notDateObjects.concat(invalidDates));
    });

    it('DateSchema.before(): .validate() should return errors for dates after the provided date value', () => {
        const schema = date().before(new Date('05/16/1994')),
            dates = [new Date('05/17/1994'), new Date(1994, 5, 16, 0, 0, 1), new Date('12/12/2017')];

        shouldReturnErrors(schema, dates, { type: ERROR_TYPES.RANGE });
    });

    it('DateSchema.before(): .validate() should not return errors for dates before or equal to the provided date value', () => {
        const schema = date().before(new Date('02/02/2016')),
            dates = [new Date('02/03/2016'), new Date('10/10/2020')];

        shouldNotReturnErrors(schema, dates);
    });

    it('DateSchema.after(): .validate() should return errors for values before the provided date value', () => {
        const schema = date().after(new Date('11/16/2000')),
            dates = ['10/29/2000', '11/14/2000', '11/17/1999'].map(dStr => new Date(dStr));

        shouldReturnErrors(schema, dates, { type: ERROR_TYPES.RANGE });
    });

    it('DateSchema.after(): .validate() should not return errors for values after than or equal to the provided date value', () => {
        const schema = date().after(new Date('01/14/2017')),
            laterDates = ['02/14/2017', '02/15/2017', new Date(2017, 1, 14, 23, 59, 59)].map(d => new Date(d));

        shouldNotReturnErrors(schema, laterDates);
    });
    
    it('DateSchema.monthBetween(): .validate() should return errors for values whose month value is not in the provided range when start is less than end', () => {
        const schema = date().monthBetween(3, 7),
            dates = ['01/01/1000', '02/02/1000', '03/10/2016', '09/02/2016'].map(x => new Date(x));

        shouldReturnErrors(schema, dates, { type: ERROR_TYPES.RANGE });
    });

    it('DateSchema.monthBetween(): .validate() should return errors for values whose month value is not in the provided range when start is greater than end', () => {
        const schema = date().monthBetween(10, 1),
            dates = [3, 4, 5, 6, 7, 8, 9].map((m, i) => new Date(`0${m}/10/2010`)).concat([new Date('10/12/2017')]);

        shouldReturnErrors(schema, dates, { type: ERROR_TYPES.RANGE });
    });

    it('DateSchema.monthBetween(): .validate() should not return errors for months in the provided range', () => {
        const schema = date().monthBetween(0, 5),
            dates = [1, 2, 3, 4, 5, 6].map((m, i) => new Date(`0${m}/0${i}/2001`));

        shouldNotReturnErrors(schema, dates);
    });

    it('DateSchema.monthBetween(): .validate() should not return errors for values whose month value is in the provided range when start is greater than end', () => {
        const schema = date().monthBetween(8, 1),
            dates = ['10', '11', '12', '01'].map(monthStr => new Date(`${monthStr}/25/1898`));

        shouldNotReturnErrors(schema, dates);
    });

    it('DateSchema.dateBetween(): .validate() should return errors for dates whose day of month value is not in the provided range when start is less than end', () => {
        const schema = date().dateBetween(5, 15),
            dates = [0, 1, 2, 3, 4, 16, 17, 18, 19, 30].map(day => new Date(2017, 03, day));

        shouldReturnErrors(schema, dates, { type: ERROR_TYPES.RANGE });
    });

    it('DateSchema.dateBetween(): .validate() should return errors for dates whose values are not in the provided range when start is greater than end', () => {
        const schema = date().dateBetween(15, 5),
            dates = Array.from({ length: 15 - 6 }).map((_, i) => i + 6).map(day => new Date(2010, 5, day));

        shouldReturnErrors(schema, dates, { type: ERROR_TYPES.RANGE });
    });

    it('DateSchema.dateBetween(): .validate() should not return errors with date values with valid days when start is less than end', () => {
        const schema = date().dateBetween(20, 30),
            dates = Array.from({ length: 30 - 20 }).map((_, i) => new Date(1777, 2, i + 20));

        shouldNotReturnErrors(schema, dates);
    });

    it('DateSchema.dateBetween(): .validate() should not return errors with date values with valid days when start is greater than end', () => {
        const schema = date().dateBetween(20, 10),
            dates = [ 20, 25, 30, 0, 1, 5, 10 ].map(d => new Date(1999, 10, d));

        shouldNotReturnErrors(schema, dates);
    });
});