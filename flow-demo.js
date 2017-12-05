// @flow

import { array, date, object, number, string } from 'fluent-schemer';

// OK
const d = date().after(new Date().setMonth(1));
const a = array(d).minlength(6);
const person = object({
	name: string().pattern(/whatever_who_cares/),
	age: number().allowNaN().allowInfinity().integer().optional() // just for type checks
});

// ERROR
date().after('1/1/1111', '10/10/1111');
number().precision('5').aintthere();
object([string()]);
object(string());
array({
	name: string()
});
