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

import createBaseSchemaClass from './base-schema';
import createBoolSchemaClass from './bool-schema';
import createArraySchemaClass from './array-schema';
import createEnumerationSchemaClass from './enumeration-schema';
import createNumberSchemaClass from './number-schema';
import createObjectSchemaClass from './object-schema';
import createStringSchemaClass from './string-schema';
import createUnionSchemaClass from './union-schema';

export const schemas = {
    createConcreteSchemaClassFunctions: [
        createBoolSchemaClass,
        createArraySchemaClass,
        createEnumerationSchemaClass,
        createNumberSchemaClass,
        createObjectSchemaClass,
        createStringSchemaClass,
        createUnionSchemaClass
    ],
    createBaseSchemaClass
};
