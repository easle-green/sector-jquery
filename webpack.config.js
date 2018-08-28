'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development',
    is_dev = NODE_ENV === 'development',
    webpack = require('webpack'),
    path = require('path'),

    nib = require('nib'),

    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin')
    // eslintpath = path.join(__dirname, '.eslintrc'),
    //PathRewriterPlugin = require('webpack-path-rewriter'),
    //CopyWebpackPlugin = require('copy-webpack-plugin')
;

// Use ProvidePlugin for resolve globals
// http://stackoverflow.com/questions/28969861/managing-jquery-plugin-dependency-in-webpack

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
        filename: is_dev ? "[name].js" : "assets/[name]-[hash].js",
        chunkFilename: is_dev ? "[name].js" : "assets/[name]-[hash].js"
    },

    module: {
        loaders: [
            {
                test: /\.styl$/,
                loader: is_dev ?
                    'style!css!stylus?paths=bower_components/bootstrap3-stylus/styl/&sourceMap&linenos&&resolve url'
                    : ExtractTextPlugin.extract('style', 'css!stylus?paths=bower_components/bootstrap3-stylus/styl/&sourceMap&linenos&&resolve url')
            },
            {
                test: /\.css$/,
                loader: 'style!css'
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

    devServer: is_dev ? {
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
    } : false,

    devtool: is_dev ? "source-map" : "hidden-source-map",

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

if ( is_dev ) {
    module.exports.module.loaders.push(
        {
            test: /\.html$/,
            loader: 'raw!php-loader'
        }
    );
}

if (!is_dev) {
    module.exports.plugins.push(
        new ExtractTextPlugin('assets/[name]-[hash].css', {
            allChunks: true,
            disable: is_dev
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
    );
}