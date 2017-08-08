const path = require('path');
const webpack = require('webpack');

const BUILD_DIR = path.resolve(__dirname, 'dist');

const es6Config = {
	devtool: 'source-map',
	entry: path.resolve(__dirname, 'index.ts'),
	output: {
		filename: 'index.js',
		path: BUILD_DIR,
		library: 'fluent-schemer',
		libraryTarget: 'umd'
	},
	resolve: {
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

const es5MinConfig = {
	devtool: 'source-map',
	entry: path.resolve(__dirname, 'index.ts'),
	output: {
		filename: 'index.es5.min.js',
		path: BUILD_DIR,
		library: 'fluent-schemer',
		libraryTarget: 'umd',
		sourceMapFilename: 'index.es5.min.js.map'
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: [
					'babel-loader',
					'ts-loader'
				]
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': 'production'
		}),
		new webpack.optimize.UglifyJsPlugin()
	]
};

module.exports = [es5MinConfig, es6Config];
