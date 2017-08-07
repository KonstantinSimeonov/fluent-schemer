(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["fluent-schemer"] = factory();
	else
		root["fluent-schemer"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = __webpack_require__(1);
exports.name = 'base';
class BaseSchema {
    constructor() {
        this.validationFunctions = [];
    }
    /**
     * Adds a validation callback to the validations to be performed on a value passed to .validate()
     * @param {function} validationFn
     */
    pushValidationFn(validationFn) {
        this.validationFunctions.push(validationFn);
    }
    /**
     * Values validated with this schema must match the schema type. Other types are not allowed by default.
     * @returns {BaseSchema} - The current instance of the BaseSchema.
     */
    required() {
        this._required = true;
        return this;
    }
    /**
     * Specify a predicate that will be used to validate the values.
     * @param {function} predicateFn
     * @returns {BaseSchema} - The current instance of the BaseSchema.
     */
    predicate(predicateFn) {
        this.pushValidationFn((value, path) => {
            if (!predicateFn(value)) {
                return errors_1.createError(errors_1.ERROR_TYPES.PREDICATE, 'Value failed predicate', path);
            }
        });
        return this;
    }
    /**
     * Specify a set of values that are not valid.
     * @param {Array.<any>} values
     * @returns {BaseSchema} - The current instance of the BaseSchema.
     */
    not(...values) {
        this.pushValidationFn((value, path) => {
            const index = values.findIndex(element => this.areEqual(value, element));
            if (index !== -1) {
                return errors_1.createError(errors_1.ERROR_TYPES.ARGUMENT, `Expected value to not equal ${values[index]} but it did`, path);
            }
        });
        return this;
    }
    /**
     * Virtual method that is used to compare two values for equality in .not(). Can be overridden in child classes.
     * @returns {Boolean} - Returns true if the two values are equal, otherwise returns false.
     */
    areEqual(firstValue, secondValue) {
        return firstValue === secondValue;
    }
    /**
     * Synchronously validates whether a value satisfies the validation rules in the schema instance.
     * @param {any} value - The value to validate.
     * @param {string} path - The key of the value to validate.
     * @param {?[]} errors - Optional error array to push possible validation errors to.
     */
    validate(value, path = '', currentErrors) {
        if (!this.validateType(value)) {
            if (this._required) {
                return {
                    errorsCount: 1,
                    errors: [errors_1.createError(errors_1.ERROR_TYPES.TYPE, `Expected type ${this.type} but got ${typeof value}`, path)]
                };
            }
            return { errorsCount: 0, errors: [] };
        }
        return this.validateValueWithCorrectType(value, path);
    }
    /**
     * Virtual method that synchronously validates whether a value,
     * which is known to be of a type matching the current schema's type,
     * satisfies the validation rules in the schema. Can be overridden in child classes.
     * @param {any} value - The value of matching type to validate.
     * @param {string} path - The key of the value to validate.
     * @param {?[]} errors - Options error array to push possible validation errors to.
     */
    validateValueWithCorrectType(value, path, currentErrors) {
        const errors = [];
        for (let i = 0, len = this.validationFunctions.length; i < len; i += 1) {
            const err = this.validationFunctions[i](value, path);
            if (err) {
                errors.push(err);
            }
        }
        return { errors, errorsCount: errors.length };
    }
}
exports.default = BaseSchema;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class ValidationError {
    constructor(type, message, path) {
        this.type = type;
        this.message = message;
        this.path = path;
    }
}
exports.ValidationError = ValidationError;
exports.ERROR_TYPES = Object.freeze({
    'RANGE': 'range',
    'ARGUMENT': 'argument',
    'TYPE': 'type',
    'PREDICATE': 'predicate'
});
exports.createError = (type, message, path) => new ValidationError(type, message, path);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function createIs(type) {
    const typeName = type[0].toUpperCase() + type.substr(1);
    return (value) => Object.prototype.toString.call(value) === `[object ${typeName}]`;
}
exports.Obj = createIs('object');
exports.String = createIs('string');
exports.Number = createIs('number');
exports.Bool = createIs('boolean');
exports.Null = createIs('number');
exports.Undefined = createIs('undefined');
exports.RegExp = createIs('regExp');
exports.Date = createIs('date');
exports.Array = createIs('array');
exports.Function = createIs('function');
exports.NullOrUndefined = (value) => exports.Null(value) || exports.Undefined(value);


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = __webpack_require__(1);
const base_schema_1 = __webpack_require__(0);
const is = __webpack_require__(2);
exports.name = 'array';
class ArraySchema extends base_schema_1.default {
    constructor(subschema) {
        super();
        if (!is.NullOrUndefined(subschema)) {
            this._state = { subschema: subschema.required(), minlength: 0, maxlength: Infinity };
        }
        else {
            this._state = { minlength: 0, maxlength: Infinity };
        }
    }
    get type() {
        if (!this._state.typestring) {
            this._state.typestring = this._state.subschema ? `array<${this._state.subschema.type}>` : `array<any>`;
        }
        return this._state.typestring;
    }
    validateType(value) {
        return is.Array(value) && (is.NullOrUndefined(this._state.subschema) || value.every((x) => this._state.subschema.validateType(x)));
    }
    minlength(length) {
        if (ArraySchema._isValidArrayLength(length)) {
            this._state.minlength = length;
            this._state.hasMinLength = true;
        }
        return this;
    }
    maxlength(length) {
        if (ArraySchema._isValidArrayLength(length)) {
            this._state.maxlength = length;
            this._state.hasMaxLength = true;
        }
        return this;
    }
    withLength(length) {
        return this.minlength(length).maxlength(length);
    }
    distinct() {
        this.pushValidationFn((value, path) => {
            if (value.length !== new Set(value).size) {
                return errors_1.createError(errors_1.ERROR_TYPES.ARGUMENT, `Expected values in ${value} to be distinct`, path);
            }
        });
        return this;
    }
    validateValueWithCorrectType(value, path) {
        const { errors } = super.validateValueWithCorrectType(value, path);
        if (this._state.hasMinLength && (value.length < this._state.minlength)) {
            const minLengthError = errors_1.createError(errors_1.ERROR_TYPES.RANGE, `Expected an ${this.type} with length at least ${this._state.minlength} but got length ${value.length}`, path);
            errors.push(minLengthError);
            return { errors, errorsCount: errors.length };
        }
        if (this._state.hasMaxLength && (value.length > this._state.maxlength)) {
            const maxLengthError = errors_1.createError(errors_1.ERROR_TYPES.RANGE, `Expected an ${this.type} with length at most ${this._state.maxlength} but got length ${value.length}`, path);
            errors.push(maxLengthError);
            return { errors, errorsCount: errors.length };
        }
        if (!this._state.subschema) {
            return { errors, errorsCount: errors.length };
        }
        for (let i = 0, len = value.length; i < len; i += 1) {
            const { errors: subErrors, errorsCount } = this._state.subschema.validate(value[i], path + '[' + i + ']', errors);
            if (errorsCount > 0) {
                if (Array.isArray(subErrors)) {
                    errors.push(...subErrors);
                }
                else {
                    errors.push(subErrors);
                }
                return { errors, errorsCount: errors.length };
            }
        }
        return { errors, errorsCount: errors.length };
    }
    static _isValidArrayLength(value) {
        return !isNaN(value) && (value >= 0) && isFinite(value);
    }
}
exports.default = ArraySchema;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const base_schema_1 = __webpack_require__(0);
const is = __webpack_require__(2);
exports.name = 'bool';
const typeName = 'bool';
class BoolSchema extends base_schema_1.default {
    get type() {
        return typeName;
    }
    validateType(value) {
        return is.Bool(value);
    }
}
exports.default = BoolSchema;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = __webpack_require__(1);
const base_schema_1 = __webpack_require__(0);
const is = __webpack_require__(2);
console.warn('Warning: DateSchema is still experimental! API changes are possible. Use cautiously in production.');
exports.name = 'date';
function validateInteger(bound) {
    return Number.isInteger(bound);
}
const typeName = 'date';
function isInRange(start, end, value) {
    if (start < end) {
        return (start <= value) && (value <= end);
    }
    else {
        return (value <= end) || (start <= value);
    }
}
/**
 * This function is here because typescript is stupid and doesn't understand javascript types and has not compile time templating.
 *
 * @param {keyof Date} componentName
 * @param {Date} dateInstance
 * @returns {number}
 */
function getDateComponent(componentName, dateInstance) {
    switch (componentName) {
        case 'getSeconds':
        case 'getMinutes':
        case 'getHours':
        case 'getDay':
        case 'getMonth':
        case 'getDate':
        case 'getFullYear':
            return dateInstance[componentName]();
        default:
            throw new Error('Should never happen in production.');
    }
}
function betweenValidation(start, end, ranges, componentName) {
    const name = componentName.replace(/get/, '');
    if (!is.Undefined(ranges['_start' + name] && ranges['_end' + name])) {
        throw new Error(`Cannot set start and end for ${name} twice on a single DateSchema instance`);
    }
    if (!validateInteger(start) || !validateInteger(end)) {
        throw new TypeError(`Expected integer numbers for start and end of ${name}, but got ${start} and ${end}`);
    }
    ranges['_start' + name] = start;
    ranges['_end' + name] = end;
    return (value, path) => {
        const rstart = ranges['_start' + name];
        const rend = ranges['_end' + name];
        const valueNumber = getDateComponent(componentName, value);
        if (!isInRange(rstart, rend, valueNumber)) {
            return errors_1.createError(errors_1.ERROR_TYPES.RANGE, `Expected ${name} to be in range ${start}:${end} but got ${value}`, path);
        }
    };
}
class DateSchema extends base_schema_1.default {
    constructor() {
        super();
        this._state = { ranges: {} };
    }
    get type() {
        return typeName;
    }
    /**
     * Validate whether the provided value is a Date object. Only date objects with valid time are considered valid dates.
     * @param {any} value - The value to be checked for type Date.
     * @returns {Boolean}
     */
    validateType(value) {
        return is.Date(value) && !Number.isNaN(value.getTime());
    }
    /**
     * Introduce a before validation to the schema instance - every date equal to or after the provided will be considered invalid.
     * @param {any} dateConstructorArgs - Arguments that you will typically pass to the Date constructor.
     * @returns {DateSchema} - Returns the current DateSchema instance to enable chaining.
     */
    before(...dateConstructorArgs) {
        if (!is.Undefined(this._state._before)) {
            throw new Error('Cannot set before date twice for a date schema instance');
        }
        const beforeDate = new Date(...dateConstructorArgs);
        if (!this.validateType(beforeDate)) {
            throw new TypeError(`The value provided to .before() is not a valid date string or object ${dateConstructorArgs}`);
        }
        const { _state } = this;
        _state._before = beforeDate;
        this.pushValidationFn((value, path) => {
            if (!is.NullOrUndefined(_state._before) && value >= _state._before) {
                return errors_1.createError(errors_1.ERROR_TYPES.RANGE, `Expected date before ${_state._before} but got ${value}`, path);
            }
        });
        return this;
    }
    /**
     * Introduce an after validation to the schema instance - every date equal to or before the provided will be considered invalid.
     * @param {any} dateConstructorArgs - Arguments that you will typically pass to the Date constructor.
     * @returns {DateSchema} - Returns the current DateSchema instance to enable chaining.
     */
    after(...dateConstructorArgs) {
        if (!is.Undefined(this._state._after)) {
            throw new Error('Cannot set after date twice for a date schema instance');
        }
        const afterDate = new Date(...dateConstructorArgs);
        if (!this.validateType(afterDate)) {
            throw new TypeError(`The value provided to .after() is not a valid date string or object ${dateConstructorArgs}`);
        }
        const { _state } = this;
        _state._after = afterDate;
        this.pushValidationFn((value, path) => {
            if (!is.NullOrUndefined(_state._after) && value <= _state._after) {
                return errors_1.createError(errors_1.ERROR_TYPES.RANGE, `Expected date after ${_state._after} but got ${value}`, path);
            }
        });
        return this;
    }
    /**
     * Set validation for range on date in month.
     * If start < end, value will be validated against the range [start, end]
     * If start > end, value will be validated against the ranges [0, start] and [end, 31]
     */
    dateBetween(start, end) {
        this.pushValidationFn(betweenValidation(start, end, this._state.ranges, 'getDate'));
        return this;
    }
    monthBetween(start, end) {
        this.pushValidationFn(betweenValidation(start, end, this._state.ranges, 'getMonth'));
        return this;
    }
    hourBetween(start, end) {
        this.pushValidationFn(betweenValidation(start, end, this._state.ranges, 'getHours'));
        return this;
    }
    weekdayBetween(start, end) {
        this.pushValidationFn(betweenValidation(start, end, this._state.ranges, 'getDay'));
        return this;
    }
    minutesBetween(start, end) {
        this.pushValidationFn(betweenValidation(start, end, this._state.ranges, 'getMinutes'));
        return this;
    }
    secondsBetween(start, end) {
        this.pushValidationFn(betweenValidation(start, end, this._state.ranges, 'getSeconds'));
        return this;
    }
}
exports.default = DateSchema;
;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = __webpack_require__(1);
const base_schema_1 = __webpack_require__(0);
exports.name = 'enumeration';
const typeName = 'enumeration';
class EnumerationSchema extends base_schema_1.default {
    constructor(...args) {
        super();
        const isMapEnum = args.length === 1 && typeof args[0] === 'object';
        this._state = {
            allowedValues: isMapEnum ? Object.keys(args[0]).map(key => args[0][key]) : args
        };
        this.pushValidationFn((value, path) => {
            const index = this._state.allowedValues.indexOf(value);
            if (index === -1) {
                return errors_1.createError(errors_1.ERROR_TYPES.ARGUMENT, `Expected one of ${this._state.allowedValues} but got ${value}`, path);
            }
        });
    }
    get type() {
        return typeName;
    }
    validateType() {
        return true;
    }
}
exports.default = EnumerationSchema;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = __webpack_require__(1);
const base_schema_1 = __webpack_require__(0);
const is = __webpack_require__(2);
exports.name = 'number';
const typeName = 'number';
class NumberSchema extends base_schema_1.default {
    constructor() {
        super();
        this._precision = 0;
    }
    get type() {
        return typeName;
    }
    validateType(value) {
        return is.Number(value)
            && (this._nanAllowed || !isNaN(value))
            && (this._infinityAllowed || isFinite(value) || isNaN(value));
    }
    precision(allowedDiff) {
        this._precision = allowedDiff;
        return this;
    }
    allowNaN() {
        this._nanAllowed = true;
        return this;
    }
    allowInfinity() {
        this._infinityAllowed = true;
        return this;
    }
    safeInteger() {
        const newMin = Math.max(this._minvalue || -Number.MAX_SAFE_INTEGER, -Number.MAX_SAFE_INTEGER), newMax = Math.min(this._maxvalue || Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
        return this.min(newMin).max(newMax);
    }
    min(minvalue) {
        if (is.Undefined(this._minvalue)) {
            this.pushValidationFn((value, path) => {
                if (value < this._minvalue) {
                    return errors_1.createError(errors_1.ERROR_TYPES.RANGE, `Expected value greater than or equal to ${minvalue} but got ${value}`, path);
                }
            });
        }
        this._minvalue = minvalue;
        return this;
    }
    max(maxvalue) {
        if (is.Undefined(this._maxvalue)) {
            this.pushValidationFn((value, path) => {
                if (value > maxvalue) {
                    return errors_1.createError(errors_1.ERROR_TYPES.RANGE, `Expected value less than or equal to ${maxvalue} but got ${value}`, path);
                }
            });
        }
        this._maxvalue = maxvalue;
        return this;
    }
    integer() {
        this.pushValidationFn((value, path) => {
            if (!Number.isInteger(value + 0)) {
                return errors_1.createError(errors_1.ERROR_TYPES.ARGUMENT, `Expected integer number but got ${value}`, path);
            }
        });
        return this;
    }
    areEqual(firstValue, secondValue) {
        const diff = Math.abs(firstValue - secondValue);
        return diff <= this._precision;
    }
}
exports.default = NumberSchema;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const base_schema_1 = __webpack_require__(0);
const is = __webpack_require__(2);
exports.name = 'object';
const typeName = 'object';
class ObjectSchema extends base_schema_1.default {
    constructor(subschema) {
        super();
        this._state = {
            subschema: subschema || {},
            allowFunctions: false,
            allowArrays: false
        };
    }
    get type() {
        return typeName;
    }
    validateType(value) {
        const valueIsArray = is.Array(value);
        const valueIsFunction = is.Function(value);
        return is.Obj(value)
            || (this._state.allowArrays && valueIsArray)
            || (this._state.allowFunctions && valueIsFunction);
    }
    allowArrays() {
        this._state.allowArrays = true;
        return this;
    }
    allowFunctions() {
        this._state.allowFunctions = true;
        return this;
    }
    validateValueWithCorrectType(value, path) {
        const errorsMap = Object.create(null);
        let currentErrorsCount = 0;
        for (const key in this._state.subschema) {
            const { errors, errorsCount } = this._state.subschema[key].validate(value[key], path ? path + '.' + key : key);
            currentErrorsCount += errorsCount;
            errorsMap[key] = errors;
        }
        return { errors: errorsMap, errorsCount: currentErrorsCount };
    }
}
exports.default = ObjectSchema;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = __webpack_require__(1);
const base_schema_1 = __webpack_require__(0);
const is = __webpack_require__(2);
exports.name = 'string';
const typeName = 'string';
class StringSchema extends base_schema_1.default {
    constructor() {
        super();
        this._state = {};
    }
    get type() {
        return typeName;
    }
    validateType(value) {
        return is.String(value);
    }
    minlength(length) {
        if (!is.Undefined(this._state.minlength)) {
            throw new Error('Cannot set minlength twice for a number schema instance');
        }
        this._state.minlength = length;
        this.pushValidationFn((value, path) => {
            if (!is.Undefined(this._state.minlength) && this._state.minlength > value.length) {
                return errors_1.createError(errors_1.ERROR_TYPES.RANGE, `Expected string with length at least ${this._state.minlength} but got ${value.length}`, path);
            }
        });
        return this;
    }
    maxlength(length) {
        if (!is.Undefined(this._state.maxlength)) {
            throw new Error('Cannot set maxlength twice for a number schema instance');
        }
        this._state.maxlength = length;
        this.pushValidationFn((value, path) => {
            if (!is.Undefined(this._state.maxlength) && this._state.maxlength < value.length) {
                return errors_1.createError(errors_1.ERROR_TYPES.RANGE, `Expected string with length at most ${this._state.minlength} but got ${value.length}`, path);
            }
        });
        return this;
    }
    pattern(regexp) {
        if (!is.Undefined(this._state.pattern)) {
            throw new Error('Cannot set maxlength twice for a number schema instance');
        }
        this._state.pattern = regexp;
        this.pushValidationFn((value, path) => {
            if (!is.Undefined(this._state.pattern) && !this._state.pattern.test(value)) {
                return errors_1.createError(errors_1.ERROR_TYPES.ARGUMENT, `Expected ${value} to match pattern but it did not`, path);
            }
        });
        return this;
    }
}
exports.default = StringSchema;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const base_schema_1 = __webpack_require__(0);
exports.name = 'union';
class UnionSchema extends base_schema_1.default {
    constructor(...subschemas) {
        super();
        this._state = { subschemas: subschemas.map(x => x.required()) };
    }
    get type() {
        return this._state.typestring || (this._state.typestring = this._state.subschemas.map(schema => schema.type).join('|'));
    }
    validateType(value) {
        return this._state.subschemas.findIndex(schema => schema.validateType(value)) !== -1;
    }
    // TODO: refactor
    // TODO: improve performance, currently .validateType() is executed twice
    validateValueWithCorrectType(value, path) {
        const errors = [], unionErrors = [];
        for (const schema of this._state.subschemas) {
            if (!schema.validateType(value)) {
                continue;
            }
            const { errors: schemaErrors, errorsCount } = schema.validate(value, path);
            if (!errorsCount) {
                return { errors: [], errorsCount: 0 };
            }
            if (Array.isArray(schemaErrors)) {
                unionErrors.push(...schemaErrors);
            }
            else {
                unionErrors.push(schemaErrors);
            }
        }
        errors.push(...unionErrors);
        return { errors, errorsCount: errors.length };
    }
}
exports.default = UnionSchema;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const bool_schema_1 = __webpack_require__(4);
const array_schema_1 = __webpack_require__(3);
const enumeration_schema_1 = __webpack_require__(6);
const number_schema_1 = __webpack_require__(7);
const object_schema_1 = __webpack_require__(8);
const string_schema_1 = __webpack_require__(9);
const union_schema_1 = __webpack_require__(10);
const date_schema_1 = __webpack_require__(5);
exports.string = () => new string_schema_1.default;
exports.number = () => new number_schema_1.default;
exports.bool = () => new bool_schema_1.default;
exports.date = () => new date_schema_1.default;
exports.array = (subschema) => new array_schema_1.default(subschema);
exports.enumeration = (...values) => new enumeration_schema_1.default(...values);
exports.object = (subschema) => new object_schema_1.default(subschema);
exports.union = (...subschemas) => new union_schema_1.default(...subschemas);
__export(__webpack_require__(1));


/***/ })
/******/ ]);
});
//# sourceMappingURL=index.js.map