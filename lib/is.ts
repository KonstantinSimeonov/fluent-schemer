function createIs<T>(type: string): (value: any) => value is T {
	const typeName = type[0].toUpperCase() + type.substr(1);
	return (value: any): value is T => Object.prototype.toString.call(value) === `[object ${typeName}]`;
}

export const Obj = createIs<object>('object');
export const String = createIs<string>('string');
export const Number = createIs<number>('number');
export const Bool = createIs<boolean>('boolean');
export const Null = createIs<null>('number');
export const Undefined = createIs<undefined>('undefined');
export const RegExp = createIs<RegExp>('regExp');
export const Date = createIs<Date>('date');
export const Array = createIs<Array<any>>('array');
export const Function = createIs<Function>('function');
export const NullOrUndefined = (value: any): value is (null | undefined) => Null(value) || Undefined(value);