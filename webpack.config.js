const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.jsx*$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.s*css$/, loaders: ['style-loader', 'css-loader', 'sass-loader'], exclude: /node_modules/ }
    ]
  },
  devServer: {
    publicPath: "/",
    contentBase: "./dist"
  }
}
