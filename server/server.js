const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const initExpressServer = require('./init/express');
const initSocketIoEvents = require('./init/socket');

const app = express();

// Configure express server
initExpressServer(app);
// Init http server
const httpServer = http.createServer(app);
// Create socket.io instance
const io = socketIo(httpServer, {
  pingTimeout: 60000,
});
// Initialise socket events
initSocketIoEvents(io);

httpServer.listen(process.env.PORT || 3000, () => {
  console.log(`listening on port: ${process.env.PORT || 3000}`);
});
