// const fs = require('fs');

// module.exports = () => fs.readdirSync(__dirname)
//                                     .filter(fileName => {
//                                         const name = fileName.split('-')[0];

//                                         return name !== 'base' && name !== 'index.js';
//                                     })
//                                     .map(fileName => {
//                                         const schemaName = fileName.split('-').shift(),
//                                             SchemaClassFactory = require(__dirname + '/' + fileName);

//                                         return {
//                                             name: schemaName,
//                                             Schema: SchemaClassFactory
//                                         };
//                                     });

import * as BaseSchemaClassFactory from './base-schema';
import * as BoolSchemaClassFactory from './bool-schema';
import * as ArraySchemaClassFactory from './array-schema';
import * as EnumerationSchemaClassFactory from './enumeration-schema';
import * as NumberSchemaClassFactory from './number-schema';
import * as ObjectSchemaClassFactory from './object-schema';
import * as StringSchemaClassFactory from './string-schema';
import * as UnionSchemaClassFactory from './union-schema';

export const schemas = {
    ConcreteSchemaClassFactories: [
        BoolSchemaClassFactory,
        ArraySchemaClassFactory,
        EnumerationSchemaClassFactory,
        NumberSchemaClassFactory,
        ObjectSchemaClassFactory,
        StringSchemaClassFactory,
        UnionSchemaClassFactory
    ],
    BaseSchemaClassFactory
};
