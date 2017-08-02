import { createError, ERROR_TYPES } from '../errors';
import BaseSchema from './base-schema';

import * as is from '../is';

export const name = 'number';

const typeName = 'number';

export default class NumberSchema extends BaseSchema {
	private _precision: number
	private _minvalue: number
	private _maxvalue: number
	private _nanAllowed: boolean
	private _infinityAllowed: boolean

	public constructor() {
		super();
		this._precision = 0;
	}

	public get type() {
		return typeName;
	}

	public validateType(value: any): value is number {
		return is.Number(value)
			&& (this._nanAllowed || !isNaN(value))
			&& (this._infinityAllowed || isFinite(value) || isNaN(value));
	}

	public precision(allowedDiff: number) {
		this._precision = allowedDiff;

		return this;
	}

	public allowNaN() {
		this._nanAllowed = true;

		return this;
	}

	public allowInfinity() {
		this._infinityAllowed = true;

		return this;
	}

	public safeInteger() {
		const newMin = Math.max(this._minvalue || -Number.MAX_SAFE_INTEGER, -Number.MAX_SAFE_INTEGER),
			newMax = Math.min(this._maxvalue || Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);

		return this.min(newMin).max(newMax);
	}

	public min(minvalue: number) {
		if (is.Undefined(this._minvalue)) {
			this.pushValidationFn((value, path) => {
				if (value < this._minvalue) {
					return createError(ERROR_TYPES.RANGE, `Expected value greater than or equal to ${minvalue} but got ${value}`, path);
				}
			});
		}

		this._minvalue = minvalue;

		return this;
	}

	public max(maxvalue: number) {
		if (is.Undefined(this._maxvalue)) {
			this.pushValidationFn((value, path) => {
				if (value > maxvalue) {
					return createError(ERROR_TYPES.RANGE, `Expected value less than or equal to ${maxvalue} but got ${value}`, path);
				}
			});
		}

		this._maxvalue = maxvalue;

		return this;
	}

	public integer() {
		this.pushValidationFn((value, path) => {
			if (!Number.isInteger(value + 0)) {
				return createError(ERROR_TYPES.ARGUMENT, `Expected integer number but got ${value}`, path);
			}
		});

		return this;
	}

	protected areEqual(firstValue: number, secondValue: number) {
		const diff = Math.abs(firstValue - secondValue);

		return diff <= this._precision;
	}
}
