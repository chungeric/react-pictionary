const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.s*css$/, loaders: ['style-loader', 'css-loader', 'sass-loader'], exclude: /node_modules/ },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    publicPath: '/',
    contentBase: './public',
    // historyApiFallback: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // new webpack.optimize.UglifyJsPlugin({minimize: true})
  ],
};
