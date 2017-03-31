'use strict';

module.exports = {
    entry: './lib/index.js',
    output: {
        path: `${__dirname}/dist`,
        filename: 'fluent-schemer.js',
        library: 'FluentSchemer',
        libraryTarget: 'umd'
    }
};