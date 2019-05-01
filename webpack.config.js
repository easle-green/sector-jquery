'use strict';

const webpack = require('webpack'),
    path = require('path'),

    nib = require('nib'),

    HtmlWebpackPlugin = require('html-webpack-plugin')
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
        filename: "[name].js",
        chunkFilename: "[name].js"
    },

    module: {
        loaders: [
            {
                test: /\.styl$/,
                loader: 'style!css!stylus?paths=bower_components/bootstrap3-stylus/styl/&sourceMap&linenos&&resolve url'
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
            },
            {
                test: /\.html$/,
                loader: 'raw!php-loader'
            }
            // {
            //     test: /jquery-mousewheel/,
            //     loader: "imports?define=>false&this=>window"
            // }
        ],
        noParse: /\.min\.js/
    },

    aggregateTimeout: 300,
    poll: 1000,
    ignored: /node_modules/,
    ignore: /node_modules/,

    devServer: {
        contentBase: __dirname,
        compress: false,
        port: 9100,
        hot: true,
        overlay: true,
        aggregateTimeout: 300,
        poll: 1000,
        ignored: /node_modules/,
        watchOptions: {
            aggregateTimeout: 300,
            ignored: /node_modules/,
            poll: 1000
        }
    },

    devtool: "source-map",

    plugins: [
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
        new webpack.optimize.OccurenceOrderPlugin()
    ]

};
