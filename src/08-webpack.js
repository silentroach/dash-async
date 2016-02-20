const path = require('path');

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = (documentsPath, callback) => {
	webpack({
		stats: {
			colors: true
		},
		entry: path.resolve(__dirname, 'bundle', 'index.js'),
		output: {
			path: documentsPath,
			filename: 'bundle.js'
		},
		module: {
			loaders: [
				{
					test: /\.css$/,
					loader: ExtractTextPlugin.extract(
						'style-loader', 'css-loader'
					)
				}
			]
		},
		plugins: [
			new ExtractTextPlugin('bundle.css'),
			new webpack.optimize.UglifyJsPlugin({
				mangle: { screw_ie8: true },
				compressor: {
					screw_ie8: true,
					warnings: false
				}
			})
		]
	}, callback);
};