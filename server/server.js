const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('../webpack.config.js');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../dist')));
app.use(webpackDevMiddleware(webpack(webpackConfig)));
app.use(bodyParser.urlencoded({ extended: false }));

// On init socket connection
io.on('connection', (socket) => {
  console.log('%s sockets connected.', io.engine.clientsCount);
  // Current socket's socket ID
  const mySessionId = socket.client.id;
  // Total number of web sockets / clients connected
  var total = io.engine.clientsCount;
  // Update all sockets playerCount when new player connects
  io.sockets.emit('update-player-count', total);
  // Emit connected event so all sockets can see a new person has connected
  socket.broadcast.emit('connected', { sessionId: mySessionId });
  // When the current web socket disconnects, emit disconnected event to let
  // other sockets know and remove one from the player count in firebase
  io.on('disconnect', () => {
    socket.broadcast.emit('disconnected', { sessionId: mySessionId });
  });

  // Emit event for every stroke movement made by the player
  socket.broadcast.emit('share-strokes', { sessionId: mySessionId });
  // Emit the draw event so all sockets see the drawing being drawn
  // concurrently
  socket.on('draw', ({ x, y, e }) => {
    socket.broadcast.emit('draw', { x, y, e });
  });
  // When someone sends a message, update all sockets with the message in chat
  socket.on('message-sent', ({message, sessionId}) => {
    socket.broadcast.emit('message-sent', { message, sessionId });
  });
  // Clear canvas event
  socket.on('clear-canvas', () => {
    socket.broadcast.emit('clear-canvas');
  });
  // Timer event
  socket.on('timer', ( timer ) => {
    socket.broadcast.emit('timer', timer);
  });
});

server.listen(PORT, function(){
  console.log(`listening on port: ${PORT}`);
});
