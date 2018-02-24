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
/* SSL redirect did not work (copy pasta) */
// app.configure('production', => {
//   app.use((req, res, next) => {
//     if (req.header 'x-forwarded-proto' !== 'https') {
//       res.redirect(`https://${req.header('host')}${req.url}`);
//     } else {
//       next();
//     }
//   });
// });

io.on('connection', (socket) => {
  const mySessionId = socket.client.id;

  socket.broadcast.emit('connected', { sessionId: mySessionId });

  socket.on('draw', ({ x, y, e }) => {
    socket.broadcast.emit('draw', { x, y, e });
  });
  socket.on('message-sent', ({message, sessionId}) => {
    socket.broadcast.emit('message-sent', {message, sessionId});
  });
  socket.on('share-numplayers', ({ numPlayers }) => {
    socket.broadcast.emit('update-numplayers', { numPlayers });
  });
  socket.on('disconnect', () => {
    socket.broadcast.emit('disconnected', { sessionId: mySessionId });
  });
  socket.on('clear-canvas', () => {
    socket.broadcast.emit('clear-canvas');
  });

  socket.on('timer', ({ timer }) => {
    socket.broadcast.emit('timer', { timer });
  });

  socket.on('new-player-connected', ({ time }) => {
    socket.emit('new-player-connected', { time });
  });
});

server.listen(PORT, function(){
  console.log(`listening on port: ${PORT}`);
});
