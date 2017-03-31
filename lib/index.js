'use strict';

// const defaultTypesFactory = require('./schemas'),
//     defaultErrorsFactory = require('./errors'),
//     defaultBaseSchema = require('./schemas/base-schema')(defaultErrorsFactory),
//     getCreateInstanceFunction = require('./create-instance');

import { schemas } from './schemas/index';
import * as defaultErrorsFactory from './errors.js';
import getCreateInstanceFunction from './create-instance';

const defaultBaseSchema = schemas.createBaseSchemaClass(defaultErrorsFactory);

export const createInstance = getCreateInstanceFunction(defaultBaseSchema, defaultErrorsFactory, schemas.createConcreteSchemaClassFunctions);
export const errorsFactory = defaultErrorsFactory;