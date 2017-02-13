'use strict';

const fs = require('fs');

module.exports = () => fs.readdirSync(__dirname)
                                    .filter(fileName => {
                                        const name = fileName.split('-')[0];

                                        return name !== 'base' && name !== 'index.js';
                                    })
                                    .map(fileName => {
                                        const schemaName = fileName.split('-').shift(),
                                            SchemaClass = require(__dirname + '/' + fileName);

                                        return {
                                            name: schemaName,
                                            Schema: SchemaClass
                                        };
                                    });
