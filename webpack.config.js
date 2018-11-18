const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.s*css$/, loaders: ['style-loader', 'css-loader', 'sass-loader'], exclude: /node_modules/ }
    ]
  },
  devServer: {
    publicPath: "/",
    contentBase: "./dist"
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
    // new webpack.optimize.UglifyJsPlugin({minimize: true})
  ]
}
