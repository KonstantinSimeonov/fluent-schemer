// @flow

import { array, date, object, number, string, union } from 'fluent-schemer';

date()
	.after(new Date().setMonth(1))
	.before(new Date())
	.optional();

array(date()).minlength(6).distinct().maxlength(33).optional();
array();

number().predicate((x: number) => x % 2 === 1);

object({
	name: string().pattern(/whatever_who_cares/),
	age: number().allowNaN().allowInfinity().integer().optional() // just for type checks
});

date().after('1/1/1111', '10/10/1111');

// $ExpectError
date().before('1/1/1111', '10/10/1111');

// $ExpectError
date().weekdayBetween(5);

// $ExpectError
number().predicate((id: string) => id);

// $ExpectError
number().precision('5');

// $ExpectError
number().max({});

// $ExpectError
number().min();

// $ExpectError
string().minlength('10');

// $ExpectError
string().pattern('3424');

// $ExpectError
union(string(), 'asdf');

// $ExpectError
object({
	name: string(),
	age: {}
});

// $ExpectError
object([string()]);
// $ExpectError
object(string());

// $ExpectError
array({
	name: string()
});
