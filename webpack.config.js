'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development',
	is_dev = NODE_ENV === 'development',
	webpack = require('webpack'),
	path = require('path'),

	nib = require('nib'),

	HtmlWebpackPlugin = require('html-webpack-plugin'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	// eslintpath = path.join(__dirname, '.eslintrc'),
	PreloadPlugin = require('./webpack.html.preloader'),
	$ = require("jquery")
	//PathRewriterPlugin = require('webpack-path-rewriter'),
	// CopyWebpackPlugin = require('copy-webpack-plugin')
	;

// Use ProvidePlugin for resolve globals
// http://stackoverflow.com/questions/28969861/managing-jquery-plugin-dependency-in-webpack

module.exports = {

	context: __dirname,

	entry: {
		main: "./assets/scripts/application.js",
		// styles: "./assets/styles/application.styl"
	},

	stylus: {
		use: [
			nib()
		],
		import: ['~nib/lib/nib/index.styl']
	},

	resolve: {
		modulesDirectories: [
			"node_modules",
			"bower_components"
		],
		extensions: ["", ".js", ".styl", '.html']
	},

	output: {
		path:__dirname + "/build",
		publicPath: "/",
		filename: is_dev? "sector.js" : "assets/[name]-[hash].js",
		chunkFilename: is_dev ? "sector.js" : "assets/[name]-[hash].js",
		// library: 'SECTOR'
	},

	module:  {
		loaders:[
			// {
			// 	test: /\.js$/,
			// 	loader: 'babel?presets[]=es2015'
			// },
			{
				test: /\.styl$/,
				loader: ExtractTextPlugin.extract('style', 'css!stylus?paths=bower_components/bootstrap3-stylus/styl/&sourceMap&linenos&&resolve url')
			},
			{
				test: /\.html$/,
				loader: 'raw!php-loader'
			},
			{
				test: /.(png|jpg|jpeg|gif|svg)$/,
				//loader: 'url?name=[name]-[hash].[ext]&limit=4000'
				loader: 'file?name=[path][name]-[hash].[ext]'
			},
			{
				test: /.(eot|ttf|otf|woff$|woff2$)$/,
				//loader: 'url?name=[name]-[hash].[ext]&limit=4000'
				loader: 'file?name=[path][name]-[hash].[ext]'
			}
		],
		noParse: /\.min\.js/
	},

	watch: is_dev,
	watchOptions: {
		aggregateTimeout: 100
	},

	//devtool: is_dev ? "inline-source-map" : "source-map",
	devtool: "source-map",

	plugins: [
		// Reference: https://github.com/ampedandwired/html-webpack-plugin
		// Render index.html
		new HtmlWebpackPlugin({
			template: './index.html',
			inject: 'body'
		}),
		new HtmlWebpackPlugin({
			filename: 'space/index.html',
			template: './space/index.html',
			inject: 'body'
		}),
		new HtmlWebpackPlugin({
			filename: '90/index.html',
			template: './90/index.html',
			inject: 'body'
		}),
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
		}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
		// Reference: https://github.com/webpack/extract-text-webpack-plugin
		// Extract css files
		// Disabled when in test mode or not in build mode
		new ExtractTextPlugin('assets/[name]-[hash].css', {
			allChunks: true,
			disable: is_dev
		})
		//,
		//new webpack.DefinePlugin({"process.env": {NODE_ENV: process.env.NODE_ENV }})
	]

};

if (!is_dev) {
	module.exports.plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				drop_console: true,
				unsafe: true
			}
		})
		//,
		//new PathRewriterPlugin()
		//,
		// Copy assets from the public folder
		// Reference: https://github.com/kevlened/copy-webpack-plugin
		//new CopyWebpackPlugin([{
		//	from: __dirname + '/build'
		//}])
	);
} else {
	module.exports.plugins.push(
		new PreloadPlugin({options: ''})
	);
}