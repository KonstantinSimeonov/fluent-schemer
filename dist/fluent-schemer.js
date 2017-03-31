(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["FluentSchemer"] = factory();
	else
		root["FluentSchemer"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function (defaultBaseSchema, defaultErrorsFactory, concreteSchemaClassFactories) {
    return function createInstance(options) {
        options = options || {};

        let filterFn;

        if (Array.isArray(options.exclude)) {
            const excludes = options.exclude.reduce((map, name) => (map[name] = true, map), Object.create(null));
            filterFn = type => !excludes[type.name];
        } else if (Array.isArray(options.include)) {
            const includes = options.include.reduce((map, name) => (map[name] = true, map), Object.create(null));
            filterFn = type => includes[type.name];
        } else {
            filterFn = () => true;
        }

        const BaseSchema = options.BaseSchema || defaultBaseSchema,
            types = concreteSchemaClassFactories.filter(filterFn),
            errorFactory = options.errorFactory || defaultErrorsFactory,
            schemas = {};

        function _extendWith(schemaClassFactoryFunction) {
            const SchemaClass = schemaClassFactoryFunction(BaseSchema, errorFactory),
                schemaClassName = schemaClassFactoryFunction.name;

            schemas[schemaClassName] = function (...args) {
                return new SchemaClass(...args);
            };

            return this;
        }

        types.forEach(_extendWith);

        return {
            get schemas() {
                return schemas;
            },

            extendWith(schemaFactory) {
                return _extendWith.call(this, schemaFactory);
            }
        };
    };
});


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
class ValidationError {
    constructor(type, message, path) {
        this.type = type;
        this.message = message;
        this.path = path;
    }
}

const ERROR_TYPES = Object.freeze({
    'RANGE': 'range',
    'ARGUMENT': 'argument',
    'TYPE': 'type',
    'PREDICATE': 'predicate'
});
/* harmony export (immutable) */ __webpack_exports__["ERROR_TYPES"] = ERROR_TYPES;


const createError = (type, message, path) => new ValidationError(type, message, path)
/* harmony export (immutable) */ __webpack_exports__["createError"] = createError;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base_schema__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bool_schema__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__array_schema__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__enumeration_schema__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__number_schema__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__object_schema__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__string_schema__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__union_schema__ = __webpack_require__(11);
// const fs = require('fs');

// module.exports = () => fs.readdirSync(__dirname)
//                                     .filter(fileName => {
//                                         const name = fileName.split('-')[0];

//                                         return name !== 'base' && name !== 'index.js';
//                                     })
//                                     .map(fileName => {
//                                         const schemaName = fileName.split('-').shift(),
//                                             SchemaClass = require(__dirname + '/' + fileName);

//                                         return {
//                                             name: schemaName,
//                                             Schema: SchemaClass
//                                         };
//                                     });










const schemas = {
    createConcreteSchemaClassFunctions: [
        __WEBPACK_IMPORTED_MODULE_1__bool_schema__["a" /* default */],
        __WEBPACK_IMPORTED_MODULE_2__array_schema__["a" /* default */],
        __WEBPACK_IMPORTED_MODULE_3__enumeration_schema__["a" /* default */],
        __WEBPACK_IMPORTED_MODULE_4__number_schema__["a" /* default */],
        __WEBPACK_IMPORTED_MODULE_5__object_schema__["a" /* default */],
        __WEBPACK_IMPORTED_MODULE_6__string_schema__["a" /* default */],
        __WEBPACK_IMPORTED_MODULE_7__union_schema__["a" /* default */]
    ],
    createBaseSchemaClass: __WEBPACK_IMPORTED_MODULE_0__base_schema__["a" /* default */]
};
/* harmony export (immutable) */ __webpack_exports__["a"] = schemas;



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__schemas_index__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__errors_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__create_instance__ = __webpack_require__(0);


// const defaultTypesFactory = require('./schemas'),
//     defaultErrorsFactory = require('./errors'),
//     defaultBaseSchema = require('./schemas/base-schema')(defaultErrorsFactory),
//     getCreateInstanceFunction = require('./create-instance');





const defaultBaseSchema = __WEBPACK_IMPORTED_MODULE_0__schemas_index__["a" /* schemas */].createBaseSchemaClass(__WEBPACK_IMPORTED_MODULE_1__errors_js__);

const createInstance = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__create_instance__["a" /* default */])(defaultBaseSchema, __WEBPACK_IMPORTED_MODULE_1__errors_js__, __WEBPACK_IMPORTED_MODULE_0__schemas_index__["a" /* schemas */].createConcreteSchemaClassFunctions);
/* harmony export (immutable) */ __webpack_exports__["createInstance"] = createInstance;

const errorsFactory = __WEBPACK_IMPORTED_MODULE_1__errors_js__;
/* harmony export (immutable) */ __webpack_exports__["errorsFactory"] = errorsFactory;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = array;
function array(BaseSchema, { createError, ERROR_TYPES }) {
    return class ArraySchema extends BaseSchema {

        constructor(subschema) {
            super();
            if (subschema instanceof BaseSchema) {
                this.subschema = subschema.required();
            }
        }

        get type() {

            if (!this._typestring) {
                this._typestring = this.subschema ? `array<${this.subschema.type}>` : `array<any>`;
            }

            return this._typestring;
        }

        validateType(value) {
            return Array.isArray(value) && (!this.subschema || value.every(x => this.subschema.validateType(x)));
        }

        minlength(length) {

            if (this._isValidArrayLength(length)) {
                this._minlength = length;
                this._hasMinLength = true;
            }

            return this;
        }

        maxlength(length) {

            if (this._isValidArrayLength(length)) {
                this._maxlength = length;
                this._hasMaxLength = true;
            }

            return this;
        }

        validateValueWithCorrectType(value, path) {

            const errors = [];

            if (this._hasMinLength && (value.length < this._minlength)) {
                const minLengthError = createError(ERROR_TYPES.RANGE, `Expected an ${this.type} with length at least ${this._minlength} but got length ${value.length}`, path);
                errors.push(minLengthError);

                return { errors, errorsCount: errors.length };
            }

            if (this._hasMaxLength && (value.length > this._maxlength)) {
                const maxLengthError = createError(ERROR_TYPES.RANGE, `Expected an ${this.type} with length at most ${this._maxlength} but got length ${value.length}`, path);
                errors.push(maxLengthError);

                return { errors, errorsCount: errors.length };
            }

            if (!this.subschema) {
                return { errors, errorsCount: errors.length };
            }

            for (let i = 0, len = value.length; i < len; i += 1) {
                const { errors: subErrors, errorsCount } = this.subschema.validate(value[i], path + `[${i}]`, errors);

                if (errorsCount > 0) {

                    if (Array.isArray(subErrors)) {
                        errors.push(...subErrors);
                    } else {
                        errors.push(subErrors);
                    }

                    return { errors, errorsCount: errors.length };
                }
            }

            return { errors, errorsCount: errors.length };
        }

        _isValidArrayLength(value) {
            return !isNaN(value) && (value >= 0) && isFinite(value);
        }
    };
};

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = base;
function base({ createError, ERROR_TYPES }) {
    return class BaseSchema {
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
                    return createError(ERROR_TYPES.PREDICATE, 'Value failed predicate', path);
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
                    return createError(ERROR_TYPES.ARGUMENT, `Expected value to not equal ${values[index]} but it did`, path);
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
        validate(value, path = '') {

            if (!this.validateType(value)) {
                if (this._required) {
                    return {
                        errorsCount: 1,
                        errors: [createError(ERROR_TYPES.TYPE, `Expected type ${this.type} but got ${typeof value}`, path)]
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
        validateValueWithCorrectType(value, path) {
            const errors = [];

            for (let i = 0, len = this.validationFunctions.length; i < len; i += 1) {
                const err = this.validationFunctions[i](value, path);

                if (err) {
                    errors.push(err);
                }
            }

            return { errors, errorsCount: errors.length };
        }
    };
}


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = bool;
function bool(BaseSchema) {
    return class BoolSchema extends BaseSchema {

        get type() {
            return 'bool';
        }

        validateType(value) {
            return (typeof value === 'boolean') || (value instanceof Boolean);
        }
    };
}


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = enumeration;
function enumeration(BaseSchema, { createError, ERROR_TYPES }) {
    return class EnumerationSchema extends BaseSchema {
        constructor(...args) {
            super();

            if (args.length === 1 && typeof args[0] === 'object') {
                this._allowedValues = Object.keys(args[0]).map(key => args[0][key]);
            } else {
                this._allowedValues = args;
            }

            this.pushValidationFn((value, path) => {
                const index = this._allowedValues.indexOf(value);
                if (index === -1) {
                    return createError(ERROR_TYPES.ARGUMENT, `Expected one of ${this._allowedValues} but got ${value}`, path);
                }
            });
        }

        validateType() {
            return true;
        }
    };
}


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = number;
function number(BaseSchema, { createError, ERROR_TYPES }) {
    return class NumberSchema extends BaseSchema {

        constructor() {
            super();
            this._precision = 0;
        }

        get type() {
            return 'number';
        }

        validateType(value) {
            return ((typeof value === 'number') || (value instanceof Number))
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
            const newMin = Math.max(this._minvalue || -Number.MAX_SAFE_INTEGER, -Number.MAX_SAFE_INTEGER),
                newMax = Math.min(this._maxvalue || Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);

            return this.min(newMin).max(newMax);
        }

        min(minvalue) {
            if (typeof this._minvalue === 'undefined') {
                this.pushValidationFn((value, path) => {
                    if (value < this._minvalue) {

                        return createError(ERROR_TYPES.RANGE, `Expected value greater than or equal to ${minvalue} but got ${value}`, path);
                    }
                });
            }

            this._minvalue = minvalue;

            return this;
        }

        max(maxvalue) {
            if (typeof this._maxvalue === 'undefined') {
                this.pushValidationFn((value, path) => {
                    if (value > maxvalue) {
                        return createError(ERROR_TYPES.RANGE, `Expected value less than or equal to ${maxvalue} but got ${value}`, path);
                    }
                });
            }

            this._maxvalue = maxvalue;

            return this;
        }

        integer() {

            this.pushValidationFn((value, path) => {
                if (!Number.isInteger(value + 0)) {
                    return createError(ERROR_TYPES.ARGUMENT, `Expected integer number but got ${value}`, path);
                }
            });

            return this;
        }

        areEqual(firstValue, secondValue) {
            const diff = Math.abs(firstValue - secondValue);

            return diff <= this._precision;
        }
    };
}


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = object;
function isFunction(value) {
    return (typeof value === 'function') || (value instanceof Function);
}

function object(BaseSchema) {
    return class ObjectSchema extends BaseSchema {

        constructor(subschema) {
            super();
            this.subschema = subschema || {};
            this._allowFunctions = false;
            this._allowArrays = false;
        }

        get type() {
            return 'object';
        }

        validateType(value) {
            if (value === null) {
                return false;
            }

            const valueType = typeof value,
                valueIsArray = Array.isArray(value),
                valueIsFunction = isFunction(value);

            return (valueType === 'object' || valueType === 'function')
                && (this._allowArrays && valueIsArray || !valueIsArray)
                && (this._allowFunctions && valueIsFunction || !valueIsFunction);
        }

        allowArrays() {
            this._allowArrays = true;

            return this;
        }

        allowFunctions() {
            this._allowFunctions = true;

            return this;
        }

        validateValueWithCorrectType(value, path) {
            const errorsMap = Object.create(null);

            let currentErrorsCount = 0;

            for (const key in this.subschema) {
                const { errors, errorsCount } = this.subschema[key].validate(value[key], path ? path + '.' + key : key);
                currentErrorsCount += errorsCount;
                errorsMap[key] = errors;
            }

            return { errors: errorsMap, errorsCount: currentErrorsCount };
        }
    };
}


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = string;
function string(BaseSchema, { createError, ERROR_TYPES }) {
    return class StringSchema extends BaseSchema {

        get type() {
            return 'string';
        }

        validateType(value) {
            return (typeof value === 'string') || (value instanceof String);
        }

        minlength(length) {

            this.pushValidationFn((value, path) => {
                if (value.length < length) {
                    return createError(ERROR_TYPES.RANGE, `Expected string with length at least ${length} but got ${value}`, path);
                }
            });

            return this;
        }

        maxlength(length) {

            this.pushValidationFn((value, path) => {
                if (value.length > length) {
                    return createError(ERROR_TYPES.RANGE, `Expected string with length at most ${length} but got ${value}`, path);
                }
            });

            return this;
        }

        pattern(regexp) {

            this.pushValidationFn((value, path) => {
                if (!regexp.test(value)) {
                    return createError(ERROR_TYPES.ARGUMENT, `Expected ${value} to match pattern but it did not`, path);
                }
            });

            return this;
        }
    };
}


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = union;
function union(BaseSchema) {
    return class UnionSchema extends BaseSchema {

        constructor(...subschemas) {
            super();

            this.subschemas = subschemas.map(x => x.required());
        }

        get type() {
            return this._typestring || (this._typestring = this.subschemas.map(schema => schema.type).join('|'));
        }

        validateType(value) {
            return this.subschemas.findIndex(schema => schema.validateType(value)) !== -1;
        }

        // TODO: async api doesn't work
        // TODO: refactor
        // TODO: improve performance, currently .validateType() is executed twice
        validateValueWithCorrectType(value, path) {
            const errors = [],
                unionErrors = [];

            for (const schema of this.subschemas) {

                if (!schema.validateType(value)) {
                    continue;
                }

                const { errors: schemaErrors, errorsCount } = schema.validate(value, path);

                if (!errorsCount) {
                    return { errors: [], errorsCount: 0 };
                }

                if (Array.isArray(schemaErrors)) {
                    unionErrors.push(...schemaErrors);
                } else {
                    unionErrors.push(schemaErrors);
                }
            }

            errors.push(...unionErrors);

            return { errors, errorsCount: errors.length };
        }
    };
}


/***/ })
/******/ ]);
});