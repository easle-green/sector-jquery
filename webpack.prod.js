'use strict';

const webpack = require('webpack'),
    path = require('path'),

    nib = require('nib'),

    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin')
    //PathRewriterPlugin = require('webpack-path-rewriter'),
    //CopyWebpackPlugin = require('copy-webpack-plugin')
;

module.exports = {

    context: __dirname,

    entry: {
        main: "./assets/scripts/application.js",
        stat: "./assets/scripts/track.js"
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
        path: __dirname + "/build",
        publicPath: "/",
        filename: "assets/[name]-[hash].js",
        chunkFilename: "assets/[name]-[hash].js"
    },

    module: {
        loaders: [
            {
                test: /\.styl$/,
                loader: ExtractTextPlugin.extract('style', 'css!stylus?paths=bower_components/bootstrap3-stylus/styl/&sourceMap&linenos&&resolve url')
            },
            {
                test: /\.css$/,
                loader: 'style!css'
            },
            {
                test: /\.json$/,
                loader: 'json'
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

    aggregateTimeout: 300,
    poll: 1000,
    ignored: /node_modules/,
    ignore: /node_modules/,

    devtool: "hidden-source-map",

    plugins: [
        /*
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
        new HtmlWebpackPlugin({
            filename: 'nota/index.html',
            template: './nota/index.html',
            inject: 'body'
        }),
        */
        new webpack.optimize.OccurenceOrderPlugin(),
        new ExtractTextPlugin('assets/[name]-[hash].css', {
            allChunks: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true,
                unsafe: true,
                dead_code: true,
                unused: true
            }
        }),
        new webpack.optimize.DedupePlugin()
        //,
        //new PathRewriterPlugin()
        //,
        // Copy assets from the public folder
        // Reference: https://github.com/kevlened/copy-webpack-plugin
        //new CopyWebpackPlugin([{
        //	from: __dirname + '/build'
        //}])
    ]

};
