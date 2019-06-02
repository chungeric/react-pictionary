module.exports = (io) => {
  // On init socket connection
  io.of('/game').on('connection', async (socket) => {
    console.log('%s sockets connected.', io.engine.clientsCount);
    // Current socket's socket ID
    const sessionId = socket.client.id;
    // Total number of web sockets / clients connected
    const total = io.engine.clientsCount;
    // Update all sockets playerCount when new player connects
    io.of('/game').emit('update-player-count', total);
    // When the current web socket disconnects, emit disconnected event to let
    // other sockets know and remove one from the player count in firebase
    socket.on('disconnect', () => {
      socket.broadcast.emit('disconnected', { total, sessionId });
      console.log('Socket: %s disconnected.', socket.id);
    });
    // Emit connected event so all sockets can see a new person has connected
    socket.broadcast.emit('connected', { sessionId });
    // Emit event for every stroke movement made by the player
    socket.broadcast.emit('share-strokes', { sessionId });
    // Emit the draw event so all sockets see the drawing being drawn
    // concurrently
    socket.on('draw', ({ x, y, e }) => {
      socket.broadcast.emit('draw', { x, y, e });
    });
    // When someone sends a message, update all sockets with the message in chat
    socket.on('message-sent', ({ message, sessionId: senderId }) => {
      socket.broadcast.emit('message-sent', { message, senderId });
    });
    // Clear canvas event
    socket.on('clear-canvas', () => {
      socket.broadcast.emit('clear-canvas');
    });
    // Timer event
    socket.on('timer', (timer) => {
      socket.broadcast.emit('timer', timer);
    });
  });
};
