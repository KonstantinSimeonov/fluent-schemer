// import { expect } from 'chai';
import test from 'ava';
import { date, ERROR_TYPES } from '../../';
import { shouldReturnErrors, shouldNotReturnErrors } from '../helpers';

const toDate = id => new Date(id);

test('returns "date"', assert => {
	assert.is(date().type, 'date');
});

test('date().validateType() returns "true" for date objects with valid date value', assert => {
	const dates = ['01/31/1000', '01/01/1000', '05/16/1994'];
	const allAreValid = dates.every(validDate => date().validateType(new Date(validDate)));

	assert.true(allAreValid);
});

test('returns "false" for date objects with invalid inner date value', assert => {
	const invalidDates = ['date', 'gosho', '13/13/1333', NaN, undefined].map(d => new Date(d));
	const hasSomeValid = invalidDates.some(invDate => date().validateType(invDate));

	assert.false(hasSomeValid);
});

test('date().validate() returns errors when .optional() has NOT been called and values are not date objects or date objects with valid dates', assert => {
	const schema = date();
	const notDateObjects = ['hi im string', 123, null, undefined, NaN, {}, [], Date];
	const invalidDates = ['13/13/1333', 'sdfsd', undefined].map(dstr => new Date(dstr));

	shouldReturnErrors(assert, schema, notDateObjects.concat(invalidDates), { type: ERROR_TYPES.TYPE });
});

test('date().validate() doesn`t return errors when .optional() has been called and values are not date objects or date objects with valid dates', assert => {
	const schema = date().optional();
	const notDateObjects = ['hi im string', 123, null, undefined, NaN, {}, [], Date];
	const invalidDates = ['13/13/1333', 'sdfsd', undefined].map(dstr => new Date(dstr));

	shouldNotReturnErrors(assert, schema, notDateObjects.concat(invalidDates));
});

test('.before() throws TypeError when value that is not of type date object or has invalid date', assert => {
	const notDates = ['azsymgosho', new Date('abv'), {}, [], Date];

	for (const notDate of notDates) {
		assert.throws(() => date().before(notDate), TypeError);
	}
});

test('.before() throws error when called more than once even with valid parameters', assert => {
	assert.throws(() => date().before('11/11/2016').before('05/05/2000'), Error);
});

test('.before() returns errors for dates after the provided date value', assert => {
	const schema = date().before(new Date('05/16/1994'));
	const dates = [new Date('05/17/1994'), new Date(1994, 5, 16, 0, 0, 1), new Date('12/12/2017')];

	shouldReturnErrors(assert, schema, dates, { type: ERROR_TYPES.RANGE });
});

test('.before() doesn`t return errors for dates before or equal to the provided date value when date object is provided', assert => {
	const schema = date().before('02/02/2016');
	const dates = [new Date('02/01/2016'), new Date('10/10/1999')];

	shouldNotReturnErrors(assert, schema, dates);
});

test('.before() doesn`t return errors for dates before or equal to the provided date value when string date is provided', assert => {
	const schema = date().before('02/02/2016');
	const dates = ['02/01/2016', '10/10/1999'].map(toDate);

	shouldNotReturnErrors(assert, schema, dates);
});

test('.after() throws TypeError when value that is not of type date object or has invalid date', assert => {
	const notDates = ['azsymgosho', new Date('abv'), {}, [], Date];

	for (const notDate of notDates) {
		assert.throws(() => date().after(notDate), TypeError);
	}
});

test('.after() throws error when called more than once even with valid parameters', assert => {
	assert.throws(() => date().after('11/11/2016').after('05/05/2000'), Error);
});

test('.after() returns errors for values before the provided date value', assert => {
	const schema = date().after(new Date('11/16/2000'));
	const dates = ['10/29/2000', '11/14/2000', '11/17/1999'].map(toDate);

	shouldReturnErrors(assert, schema, dates, { type: ERROR_TYPES.RANGE });
});

test('.after() doesn`t return errors for values after than or equal to the provided date value when date objects are provided', assert => {
	const schema = date().after(new Date('01/14/2017'));
	const laterDates = ['02/14/2017', '02/15/2017', new Date(2017, 1, 14, 23, 59, 59)].map(toDate);

	shouldNotReturnErrors(assert, schema, laterDates);
});

test('.after() doesn`t return errors for values after than or equal to the provided date value when date strings are provided', assert => {
	const schema = date().after(new Date('01/14/2017'));
	const laterDates = ['02/14/2017', '02/15/2017'].map(toDate);

	shouldNotReturnErrors(assert, schema, laterDates);
});

test('.monthBetween() throws TypeError when at least one of the provided arguments is an invalid number', assert => {
	const nanPairs = [[1, null], [true, false], ['sdf', {}], ['11', 11]];

	for (const np of nanPairs) {
		assert.throws(() => date().monthBetween(...np), TypeError);
	}
});

test('.monthBetween() throws when called more than once, even with valid arguments', assert => {
	assert.throws(() => date().monthBetween(1, 5).monthBetween(2, 6), Error);
});

test('.monthBetween() validation returns errors for values whose month value is not in the provided range when start is LESS than end', assert => {
	const schema = date().monthBetween(3, 7);
	const dates = ['01/01/1000', '02/02/1000', '03/10/2016', '09/02/2016'].map(toDate);

	shouldReturnErrors(assert, schema, dates, { type: ERROR_TYPES.RANGE });
});

test('.monthBetween() validation returns errors for values whose month value is not in the provided range when start is GREATER than end', assert => {
	const schema = date().monthBetween(10, 1);
	const dates = [3, 4, 5, 6, 7, 8, 9].map((m, i) => new Date(`0${m}/10/2010`)).concat([new Date('10/12/2017')]);

	shouldReturnErrors(assert, schema, dates, { type: ERROR_TYPES.RANGE });
});

test('.monthBetween() validation doesn`t return errors for months in the provided range when start is LESS than end', assert => {
	const schema = date().monthBetween(0, 5);
	const dates = [1, 2, 3, 4, 5, 6].map((m, i) => new Date(`0${m}/0${i + 1}/2001`));

	shouldNotReturnErrors(assert, schema, dates);
});

test('.monthBetween() validation doesn`t return errors for values whose month value is in the provided range when start is GREATER than end', assert => {
	const schema = date().monthBetween(8, 1);
	const dates = ['10', '11', '12', '01'].map(monthStr => new Date(`${monthStr}/25/1898`));

	shouldNotReturnErrors(assert, schema, dates);
});

test('.dateBetween() throws TypeError when at least one of the provided arguments is an invalid number', assert => {
	const nanPairs = [[1, null], [true, false], ['sdf', {}], ['11', 11]];

	for (const np of nanPairs) {
		assert.throws(() => date().dateBetween(...np), TypeError);
	}
});

test('.dateBetween() throws Error when called more than once, even with valid arguments', assert => {
	assert.throws(() => date().dateBetween(1, 30).dateBetween(2, 10), Error);
});

test('.dateBetween()  validation returns errors for dates whose day of month value is not in the provided range when start is LESS than end', assert => {
	const schema = date().dateBetween(5, 15);
	const dates = [0, 1, 2, 3, 4, 16, 17, 18, 19, 30].map(day => new Date(2017, 3, day));

	shouldReturnErrors(assert, schema, dates, { type: ERROR_TYPES.RANGE });
});

test('.dateBetween()  validation returns errors for dates whose values are not in the provided range when start is GREATER than end', assert => {
	const schema = date().dateBetween(15, 5);
	const dates = Array.from({ length: 15 - 6 }).map((_, i) => i + 6).map(day => new Date(2010, 5, day));

	shouldReturnErrors(assert, schema, dates, { type: ERROR_TYPES.RANGE });
});

test('.dateBetween()  validation doesn`t return errors with date values with valid days when start is LESS than end', assert => {
	const schema = date().dateBetween(20, 30);
	const dates = Array.from({ length: 30 - 20 }).map((_, i) => new Date(1777, 2, i + 20));

	shouldNotReturnErrors(assert, schema, dates);
});

test('.dateBetween() validation doesn`t return errors with date values with valid days when start is GREATER than end', assert => {
	const schema = date().dateBetween(20, 10);
	const dates = [20, 25, 30, 0, 1, 5, 10].map(d => new Date(1999, 10, d));

	shouldNotReturnErrors(assert, schema, dates);
});

test('.hourBetween() throws TypeError when at least one of the provided arguments is an invalid number', assert => {
	const nanPairs = [[1, null], [true, false], ['sdf', {}], ['11', 11]];

	for (const np of nanPairs) {
		assert.throws(() => date().hourBetween(...np), TypeError);
	}
});

test('.hourBetween() throws Error when called more than once, even with valid arguments', assert => {
	assert.throws(() => date().hourBetween(1, 23).hourBetween(0, 10), Error);
});

test('.hourBetween() validation returns errors for dates whose hour of day value is not in the provided range when start is LESS than end', assert => {
	const schema = date().hourBetween(5, 21);
	const dates = [0, 1, 2, 3, 4, 22, 23].map(hour => new Date(2017, 3, 3, hour));

	shouldReturnErrors(assert, schema, dates, { type: ERROR_TYPES.RANGE });
});

test('.hourBetween() validation returns errors for dates whose values are not in the provided range when start is GREATER than end', assert => {
	const schema = date().hourBetween(15, 5);
	const dates = Array.from({ length: 9 }).map((_, i) => i + 6).map(hour => new Date(2010, 5, 7, hour));

	shouldReturnErrors(assert, schema, dates, { type: ERROR_TYPES.RANGE });
});

test('.hourBetween() validation doesn`t return errors with date values with valid days when start is LESS than end', assert => {
	const schema = date().hourBetween(11, 18);
	const dates = Array.from({ length: 6 }).map((_, i) => new Date(1777, 2, 20, i + 12));

	shouldNotReturnErrors(assert, schema, dates);
});

test('.hourBetween() validation doesn`t return errors with date values with valid days when start is GREATER than end', assert => {
	const schema = date().hourBetween(20, 10);
	const dates = [21, 22, 23, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(hour => new Date(1999, 10, 7, hour));

	shouldNotReturnErrors(assert, schema, dates);
});

test('weekdayBetween() throws TypeError when at least one of the provided arguments is an invalid number', assert => {
	const nanPairs = [[1, null], [true, false], ['sdf', {}], ['11', 11]];

	for (const np of nanPairs) {
		assert.throws(() => date().weekdayBetween(...np), TypeError);
	}
});

test('weekdayBetween() throws Error when called more than once, even with valid arguments', assert => {
	assert.throws(() => date().weekdayBetween(1, 4).weekdayBetween(3, 5), Error);
});

test('weekdayBetween() validation returns errors for dates whose hour of day value is not in the provided range when start is LESS than end', assert => {
	const schema = date().weekdayBetween(3, 6);
	const dates = ['04/23/2017', '04/24/2017', '04/25/2017', '04/30/2017', '05/01/2017'].map(d => new Date(d));
	shouldReturnErrors(assert, schema, dates, { type: ERROR_TYPES.RANGE });
});

test('weekdayBetween() validation returns errors for dates whose values are not in the provided range when start is GREATER than end', assert => {
	const schema = date().weekdayBetween(4, 1);
	const dates = ['05/23/2017', '05/24/2017'].map(d => new Date(d));

	shouldReturnErrors(assert, schema, dates, { type: ERROR_TYPES.RANGE });
});

test('weekdayBetween() validation doesn`t return errors with date values with valid days when start is LESS than end', assert => {
	const schema = date().weekdayBetween(2, 6);
	const dates = [26, 27, 28, 29].map(date => new Date(`04/${date}/2017`));

	shouldNotReturnErrors(assert, schema, dates);
});

test('weekdayBetween() validation doesn`t return errors with date values with valid days when start is GREATER than end', assert => {
	const schema = date().weekdayBetween(5, 2);
	const dates = [20, 21, 22].map(date => new Date(`05/${date}/2017`));

	shouldNotReturnErrors(assert, schema, dates);
});

test('minutesBetween() throws TypeError when at least one of the provided arguments is an invalid number', assert => {
	const nanPairs = [[1, null], [true, false], ['sdf', {}], ['11', 11]];

	for (const np of nanPairs) {
		assert.throws(() => date().minutesBetween(...np), TypeError);
	}
});

test('minutesBetween() throws Error when called more than once, even with valid arguments', assert => {
	assert.throws(() => date().minutesBetween(5, 20).minutesBetween(30, 50), Error);
});

test('minutesBetween() validation returns errors for dates whose minute value is not in the provided range when start is LESS than end', assert => {
	const schema = date().minutesBetween(33, 40);
	const dates = [new Date(2017, 1, 1, 1, 23), new Date(1999, 11, 11, 11, 1), new Date(2020, 11, 11, 1, 50)];
	shouldReturnErrors(assert, schema, dates, { type: ERROR_TYPES.RANGE });
});

test('minutesBetween() validation returns errors for dates whose minute values are not in the provided range when start is GREATER than end', assert => {
	const schema = date().minutesBetween(20, 10);
	const dates = [new Date(2017, 1, 1, 1, 11), new Date(1999, 11, 11, 11, 15), new Date(2020, 11, 11, 1, 19)].map(d => new Date(d));

	shouldReturnErrors(assert, schema, dates, { type: ERROR_TYPES.RANGE });
});

test('minutesBetween() validation doesn`t return errors with date values with valid days when start is LESS than end', assert => {
	const schema = date().minutesBetween(0, 20);
	const dates = [10, 11, 15, 3, 6, 2, 1].map(minutes => new Date(2017, 4, 5, 6, minutes));

	shouldNotReturnErrors(assert, schema, dates);
});

test('minutesBetween() validation doesn`t return errors with date values with valid minutes when start is GREATER than end', assert => {
	const schema = date().minutesBetween(55, 30);
	const dates = [10, 15, 0, 58].map(minutes => new Date(2017, 4, 5, 6, minutes));

	shouldNotReturnErrors(assert, schema, dates);
});

test('secondsBetween() throws TypeError when at least one of the provided arguments is an invalid number', assert => {
	const nanPairs = [[1, null], [true, false], ['sdf', {}], ['11', 11]];

	for (const np of nanPairs) {
		assert.throws(() => date().secondsBetween(...np), TypeError);
	}
});

test('secondsBetween() throws Error when called more than once, even with valid arguments', assert => {
	assert.throws(() => date().secondsBetween(5, 20).secondsBetween(30, 50), Error);
});

test('secondsBetween() validation returns errors for dates whose seconds value is not in the provided range when start is LESS than end', assert => {
	const schema = date().secondsBetween(33, 40);
	const dates = [new Date(2017, 1, 1, 1, 1, 23), new Date(1999, 11, 11, 11, 11, 1), new Date(2020, 11, 11, 1, 11, 50)];
	shouldReturnErrors(assert, schema, dates, { type: ERROR_TYPES.RANGE });
});

test('secondsBetween() validation returns errors for dates whose seconds value are not in the provided range when start is GREATER than end', assert => {
	const schema = date().secondsBetween(20, 10);
	const dates = [new Date(2017, 1, 1, 1, 1, 11), new Date(1999, 11, 11, 11, 1, 15), new Date(2020, 11, 11, 1, 1, 19)].map(d => new Date(d));

	shouldReturnErrors(assert, schema, dates, { type: ERROR_TYPES.RANGE });
});

test('secondsBetween() validation doesn`t return errors with date values with valid days when start is LESS than end', assert => {
	const schema = date().secondsBetween(0, 20);
	const dates = [10, 11, 15, 3, 6, 2, 1].map(seconds => new Date(2017, 4, 5, 6, 1, seconds));

	shouldNotReturnErrors(assert, schema, dates);
});

test('secondsBetween() validation doesn`t return errors with date values with valid seconds when start is GREATER than end', assert => {
	const schema = date().secondsBetween(55, 30);
	const dates = [10, 15, 0, 58].map(seconds => new Date(2017, 4, 5, 6, 1, seconds));

	shouldNotReturnErrors(assert, schema, dates);
});

