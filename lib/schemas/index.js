import * as BaseSchemaClassFactory from './base-schema';
import * as BoolSchemaClassFactory from './bool-schema';
import * as ArraySchemaClassFactory from './array-schema';
import * as EnumerationSchemaClassFactory from './enumeration-schema';
import * as NumberSchemaClassFactory from './number-schema';
import * as ObjectSchemaClassFactory from './object-schema';
import * as StringSchemaClassFactory from './string-schema';
import * as UnionSchemaClassFactory from './union-schema';
import * as DateSchemaClassFactory from './date-schema';

export const schemas = {
	ConcreteSchemaClassFactories: [
		BoolSchemaClassFactory,
		ArraySchemaClassFactory,
		EnumerationSchemaClassFactory,
		NumberSchemaClassFactory,
		ObjectSchemaClassFactory,
		StringSchemaClassFactory,
		UnionSchemaClassFactory,
		DateSchemaClassFactory
	],
	BaseSchemaClassFactory
};
