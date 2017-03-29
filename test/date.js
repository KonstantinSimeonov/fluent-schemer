/* globals it, describe */

'use strict';

const { expect } = require('chai'),
    { shouldReturnErrors, shouldNotReturnErrors } = require('../helpers/test-templates'),
    { date } = require('../lib').createInstance().schemas,
    ERROR_TYPES = require('../lib/errors').ERROR_TYPES;

describe('DateSchema individual methods', () => {
    it('DateSchema.type: should return date', () => {
        expect(date().type).to.equal('date');
    });

    describe('.validateType()', () => {
        it('should return true for date objects with valid date value', () => {
            const schema = date(),
                dates = ['01/31/1000', '01/01/1000', '05/16/1994'],
                trueForAll = dates.every(date => schema.validateType(new Date(date)));

            expect(trueForAll).to.equal(true);
        });

        it('should return false for date objects with invalid inner date value', () => {
            const schema = date(),
                invalidDates = ['date', 'gosho', '13/13/1333', NaN, undefined];

            for (const invalidDateString of invalidDates) {
                expect(schema.validateType(new Date(invalidDateString))).to.equal(false);
            }
        });
    });

    describe('.required()', () => {
        it('.validate() should return errors when .required() has been called and values are not date objects or date objects with valid dates', () => {
            const schema = date().required(),
                notDateObjects = ['hi im string', 123, null, undefined, NaN, {}, [], Date],
                invalidDates = ['13/13/1333', 'sdfsd', undefined].map(dstr => new Date(dstr));

            shouldReturnErrors(schema, notDateObjects.concat(invalidDates), { type: ERROR_TYPES.TYPE });
        });

        it('.validate() should not return errors when .required() has not been called and values are not date objects or date objects with valid dates', () => {
            const schema = date(),
                notDateObjects = ['hi im string', 123, null, undefined, NaN, {}, [], Date],
                invalidDates = ['13/13/1333', 'sdfsd', undefined].map(dstr => new Date(dstr));

            shouldNotReturnErrors(schema, notDateObjects.concat(invalidDates));
        });
    });

    describe('.before()', () => {
        it('should throw error when value that is not of type date object or has invalid date', () => {
            const notDates = ['azsymgosho', new Date('abv'), {}, [], Date];

            for (const notDate of notDates) {
                expect(() => date().before(notDate)).to.throw(Error);
            }
        });

        it('should throw error when called more than once even with valid parameters', () => {
            expect(() => date().before('11/11/2016').before('05/05/2000')).to.throw(Error);
        });

        it('.validate() should return errors for dates after the provided date value', () => {
            const schema = date().before(new Date('05/16/1994')),
                dates = [new Date('05/17/1994'), new Date(1994, 5, 16, 0, 0, 1), new Date('12/12/2017')];

            shouldReturnErrors(schema, dates, { type: ERROR_TYPES.RANGE });
        });

        it('.validate() should not return errors for dates before or equal to the provided date value when date object is provided', () => {
            const schema = date().before('02/02/2016'),
                dates = [new Date('02/01/2016'), new Date('10/10/1999')];

            shouldNotReturnErrors(schema, dates);
        });

        it('.validate() should not return errors for dates before or equal to the provided date value when string date is provided', () => {
            const schema = date().before('02/02/2016'),
                dates = ['02/01/2016', '10/10/1999'];

            shouldNotReturnErrors(schema, dates);
        });
    });

    describe('.after()', () => {
        it('should throw error when value that is not of type date object or has invalid date', () => {
            const notDates = ['azsymgosho', new Date('abv'), {}, [], Date];

            for (const notDate of notDates) {
                expect(() => date().after(notDate)).to.throw(Error);
            }
        });

        it('should throw error when called more than once even with valid parameters', () => {
            expect(() => date().after('11/11/2016').after('05/05/2000')).to.throw(Error);
        });

        it('.validate() should return errors for values before the provided date value', () => {
            const schema = date().after(new Date('11/16/2000')),
                dates = ['10/29/2000', '11/14/2000', '11/17/1999'].map(dStr => new Date(dStr));

            shouldReturnErrors(schema, dates, { type: ERROR_TYPES.RANGE });
        });

        it('.validate() should not return errors for values after than or equal to the provided date value when date objects are provided', () => {
            const schema = date().after(new Date('01/14/2017')),
                laterDates = ['02/14/2017', '02/15/2017', new Date(2017, 1, 14, 23, 59, 59)].map(d => new Date(d));

            shouldNotReturnErrors(schema, laterDates);
        });

        it('.validate() should not return errors for values after than or equal to the provided date value when date strings are provided', () => {
            const schema = date().after(new Date('01/14/2017')),
                laterDates = ['02/14/2017', '02/15/2017'];

            shouldNotReturnErrors(schema, laterDates);
        });
    });

    describe('.monthBetween()', () => {
        it('should throw when at least one of the provided arguments is an invalid number', () => {
            const nanPairs = [[1, null], [true, false], ['sdf', {}], ['11', 11]];

            for (const np of nanPairs) {
                expect(() => date().monthBetween(...np)).to.throw(Error);
            }
        });

        it('should throw when called more than once, even with valid arguments', () => {
            expect(() => date().monthBetween(1, 5).monthBetween(2, 6)).to.throw(Error);
        });

        it('.validate() should return errors for values whose month value is not in the provided range when start is LESS than end', () => {
            const schema = date().monthBetween(3, 7),
                dates = ['01/01/1000', '02/02/1000', '03/10/2016', '09/02/2016'].map(x => new Date(x));

            shouldReturnErrors(schema, dates, { type: ERROR_TYPES.RANGE });
        });

        it('.validate() should return errors for values whose month value is not in the provided range when start is GREATER than end', () => {
            const schema = date().monthBetween(10, 1),
                dates = [3, 4, 5, 6, 7, 8, 9].map((m, i) => new Date(`0${m}/10/2010`)).concat([new Date('10/12/2017')]);

            shouldReturnErrors(schema, dates, { type: ERROR_TYPES.RANGE });
        });

        it('.validate() should not return errors for months in the provided range when start is LESS than end', () => {
            const schema = date().monthBetween(0, 5),
                dates = [1, 2, 3, 4, 5, 6].map((m, i) => new Date(`0${m}/0${i}/2001`));

            shouldNotReturnErrors(schema, dates);
        });

        it('.validate() should not return errors for values whose month value is in the provided range when start is GREATER than end', () => {
            const schema = date().monthBetween(8, 1),
                dates = ['10', '11', '12', '01'].map(monthStr => new Date(`${monthStr}/25/1898`));

            shouldNotReturnErrors(schema, dates);
        });
    });

    describe('.dateBetween()', () => {
        it('should throw when at least one of the provided arguments is an invalid number', () => {
            const nanPairs = [[1, null], [true, false], ['sdf', {}], ['11', 11]];

            for (const np of nanPairs) {
                expect(() => date().dateBetween(...np)).to.throw(Error);
            }
        });

        it('should throw when called more than once, even with valid arguments', () => {
            expect(() => date().dateBetween(1, 30).dateBetween(2, 10)).to.throw(Error);
        });

        it('.validate() should return errors for dates whose day of month value is not in the provided range when start is LESS than end', () => {
            const schema = date().dateBetween(5, 15),
                dates = [0, 1, 2, 3, 4, 16, 17, 18, 19, 30].map(day => new Date(2017, 3, day));

            shouldReturnErrors(schema, dates, { type: ERROR_TYPES.RANGE });
        });

        it('.validate() should return errors for dates whose values are not in the provided range when start is GREATER than end', () => {
            const schema = date().dateBetween(15, 5),
                dates = Array.from({ length: 15 - 6 }).map((_, i) => i + 6).map(day => new Date(2010, 5, day));

            shouldReturnErrors(schema, dates, { type: ERROR_TYPES.RANGE });
        });

        it('.validate() should not return errors with date values with valid days when start is LESS than end', () => {
            const schema = date().dateBetween(20, 30),
                dates = Array.from({ length: 30 - 20 }).map((_, i) => new Date(1777, 2, i + 20));

            shouldNotReturnErrors(schema, dates);
        });

        it('.validate() should not return errors with date values with valid days when start is GREATER than end', () => {
            const schema = date().dateBetween(20, 10),
                dates = [20, 25, 30, 0, 1, 5, 10].map(d => new Date(1999, 10, d));

            shouldNotReturnErrors(schema, dates);
        });

    });

    describe('.hourBetween()', () => {
        it('should throw when at least one of the provided arguments is an invalid number', () => {
            const nanPairs = [[1, null], [true, false], ['sdf', {}], ['11', 11]];

            for (const np of nanPairs) {
                expect(() => date().hourBetween(...np)).to.throw(Error);
            }
        });

        it('should throw when called more than once, even with valid arguments', () => {
            expect(() => date().hourBetween(1, 23).hourBetween(0, 10)).to.throw(Error);
        });

        it('.validate() should return errors for dates whose hour of day value is not in the provided range when start is LESS than end', () => {
            const schema = date().hourBetween(5, 21),
                dates = [0, 1, 2, 3, 4, 22, 23].map(hour => new Date(2017, 3, 3, hour));

            shouldReturnErrors(schema, dates, { type: ERROR_TYPES.RANGE });
        });

        it('.validate() should return errors for dates whose values are not in the provided range when start is GREATER than end', () => {
            const schema = date().hourBetween(15, 5),
                dates = Array.from({ length: 9 }).map((_, i) => i + 6).map(hour => new Date(2010, 5, 7, hour));

            shouldReturnErrors(schema, dates, { type: ERROR_TYPES.RANGE });
        });

        it('.validate() should not return errors with date values with valid days when start is LESS than end', () => {
            const schema = date().hourBetween(11, 18),
                dates = Array.from({ length: 6 }).map((_, i) => new Date(1777, 2, 20, i + 12));

            shouldNotReturnErrors(schema, dates);
        });

        it('.validate() should not return errors with date values with valid days when start is GREATER than end', () => {
            const schema = date().hourBetween(20, 10),
                dates = [21, 22, 23, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(hour => new Date(1999, 10, 7, hour));

            shouldNotReturnErrors(schema, dates);
        });
    });

});
