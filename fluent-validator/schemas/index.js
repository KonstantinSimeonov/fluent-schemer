'use strict';

const fs = require('fs');

const schemaRegexp = /[^base]\-schema\.js$/;

module.exports = () => fs.readdirSync(__dirname)
                                    .filter(fileName => schemaRegexp.test(fileName))
                                    .map(fileName => {
                                        const schemaName = fileName.split('-').shift(),
                                            SchemaClass = require(__dirname + '/' + fileName);

                                        return {
                                            name: schemaName,
                                            Schema: SchemaClass
                                        };
                                    });