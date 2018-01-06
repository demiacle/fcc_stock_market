const path = require('path');
const webpack = require('webpack')

module.exports = {
  entry: {
    entry: './src/javascripts/entry.js',
    vendor: [
    'chart.js',
    'pikaday'
    ]
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        // TODO use babel loader after dev
        loader: 'eslint-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name:'vendor',
      minChunks: Infinity
    })
  ]
};