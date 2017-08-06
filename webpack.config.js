const path = require('path');
const webpack = require('webpack');

module.exports = {
	devtool: 'source-map',
	entry: path.resolve(__dirname, 'lib', 'index.ts'),
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname),
		library: 'fluent-schemer',
		libraryTarget: 'umd'
	},
	resolve: {
		alias: {
			'@schemas': path.resolve(__dirname, 'lib', 'schemas'),
		},
		extensions: ['.ts', '.js']
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader'
			}
		]
	}
};
