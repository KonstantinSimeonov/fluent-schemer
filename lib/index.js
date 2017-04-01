import { schemas } from './schemas/index';
import * as defaultErrorsFactory from './errors.js';
import getCreateInstanceFunction from './create-instance';

const defaultBaseSchema = schemas.BaseSchemaClassFactory.factory(defaultErrorsFactory);
export const createInstance = getCreateInstanceFunction(defaultBaseSchema, defaultErrorsFactory, schemas.ConcreteSchemaClassFactories);
export const errorsFactory = defaultErrorsFactory;
