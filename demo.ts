import { number, bool, array, string, date, enumeration, object, union } from './lib/create-instance';

const age = number().integer().min(10).required();
const name = string().minlength(5).maxlength(10).required();
const stuff = object({
	birthDate: date().after('1/1/2017').required(),
	name,
	age
}).required();
