'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');

module.exports = {
  entry: "./assets/scripts/main.js",
  output: {
    path: "./assets/scripts/",
    filename: "build.js"
  },

  watch: NODE_ENV == "development",

  watchOptions: {
    aggregateTimeout: 100
    // задержка перед сборкой после изменений
  },

  devtool: NODE_ENV == 'development' ? "chip-inline-module-source-map" : null,

  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV)
    })
  ],

  module: {
    loader: [{
      test: /\.js$/,
      loader: 'babel?presets[]=es2015'
    }]
  }
};
