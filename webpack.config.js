'use strict';

const webpackUglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = [
    {
        entry: './lib/index.js',
        output: {
            path: `${__dirname}/dist`,
            filename: 'fluent-schemer.js',
            library: 'FluentSchemer',
            libraryTarget: 'umd'
        }
    },
    {
        entry: './lib/index.js',
        module: {
            loaders: [
                { test: /\.js$/, loader: 'babel-loader', query: { presets: ['es2015'] }, exclude: /(node_modules|bower_components)/, },
            ]
        },
        output: {
            path: `${__dirname}/dist`,
            filename: 'fluent-schemer.es5.min.js',
            library: 'FluentSchemer',
            libraryTarget: 'umd'
        },
        plugins: [
            new webpackUglifyJsPlugin({
                cacheFolder: `${__dirname}/webpack_cached/`,
                debug: true,
                minimize: true,
                sourceMap: false,
                output: {
                    comments: false
                },
                compressor: {
                    warnings: false
                }
            }),
        ]
    }
]