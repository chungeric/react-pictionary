const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.config.js');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '/dist')));
app.use(webpackDevMiddleware(webpack(webpackConfig)));
app.use(bodyParser.urlencoded({ extended: false }));

io.on('connection', (socket) => {
  console.log('connected');
  socket.broadcast.emit('connected', { sessionId: socket.client.id.slice(0,8) });

  socket.on('draw', ({ x, y, e }) => {
    socket.broadcast.emit('draw', { x, y, e });
  });
  socket.on('message-sent', ({message, sessionId}) => {
    socket.broadcast.emit('message-sent', {message, sessionId});
  });
});

server.listen(PORT, function(){
  console.log(`listening on port: ${PORT}`);
});
