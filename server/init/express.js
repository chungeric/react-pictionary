const path = require('path');
const bodyParser = require('body-parser');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('../../webpack.config.js');

module.exports = (app) => {
  app.set('port', (process.env.PORT || 3000));
  app.use(webpackDevMiddleware(webpack(webpackConfig)));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('public', 'index.html'));
  });
};
