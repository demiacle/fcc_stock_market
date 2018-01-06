const path = require('path');

module.exports = {
  entry: './src/javascripts/entry.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public')
  }
};