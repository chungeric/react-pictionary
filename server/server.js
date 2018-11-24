const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const initExpress = require('./init/express');
const initSocketEvents = require('./init/socket');

const app = express();
// Configure express server
initExpress(app);
// Create http server instance for socket.io
const server = http.createServer(app);
// Create socket.io instance
const io = socketIo(server);
// Initialize socket events
initSocketEvents(io);

server.listen(app.get('port'), function(){
  console.log(`listening on port: ${app.get('port')}`);
});
