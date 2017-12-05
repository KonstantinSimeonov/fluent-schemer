const path = require('path');
const webpack = require('webpack');

const BUILD_DIR = path.resolve(__dirname, 'dist');

const baseConfig = {
	devtool: 'source-map',
	entry: path.resolve(__dirname, 'index.ts'),
	resolve: {
		extensions: ['.ts', '.js']
	}
};

const es6Config = Object.assign({}, baseConfig, {
	output: {
		filename: 'index.js',
		path: BUILD_DIR,
		library: 'fluent-schemer',
		libraryTarget: 'umd'
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader'
			}
		]
	},
	plugins: [
		new webpack.WatchIgnorePlugin([BUILD_DIR])		
	]
});

const es5MinConfig = Object.assign({}, baseConfig, {
	output: {
		filename: 'index.es5.min.js',
		path: BUILD_DIR,
		library: 'fluent-schemer',
		libraryTarget: 'umd',
		sourceMapFilename: 'index.es5.min.js.map'
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
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.WatchIgnorePlugin([BUILD_DIR])
	]
});

module.exports = [es5MinConfig, es6Config];
