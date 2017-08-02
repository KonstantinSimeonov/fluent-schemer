import BaseSchema from './base-schema';
import * as is from '../is';

export const name = 'bool';

const typeName = 'bool';

export default class BoolSchema extends BaseSchema {
	public get type(): string {
		return typeName;
	}

	public validateType(value: any): value is boolean {
		return is.Bool(value);
	}
}
