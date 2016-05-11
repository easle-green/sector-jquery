'use strict';

var NODE_ENV = process.env.NODE_ENV || 'development';
var webpack = require('webpack');

module.exports = {
  entry: "./assets/scripts/main",
  output: {
    path: "./assets/scripts/",
    filename: "build.js"
  },
  watch: NODE_ENV === 'development',
  watchOptions: {
    aggregateTimeout: 100
  },
  devtool: NODE_ENV === 'development' ? "source-map" : null,
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    }),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV)
    })
  ],
  module: {
    loaders: [
      { test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader" }
    ]
  }
};
