import io from 'socket.io-client';
const socket = io();

export default function() {
  return socket;
}
