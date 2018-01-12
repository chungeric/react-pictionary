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

app.use(express.static(path.join(__dirname, '/dist')));
app.use(webpackDevMiddleware(webpack(webpackConfig)));
app.use(bodyParser.urlencoded({ extended: false }));

io.on('connection', (socket) => {
  console.log("a user connected");
  socket.on('draw', (data) => {
    console.log("draw event triggered in server");
    socket.broadcast.emit('draw', { x: data.x, y: data.y, e: data.e });
  });
});

server.listen(3000, function(){
  console.log('listening on port 3000');
});
