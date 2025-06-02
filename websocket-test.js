const { io } = require('socket.io-client');

// Connect to the WebSocket server
const socket = io('http://localhost:3000');

// Listen for connection
socket.on('connect', () => {
  console.log('Connected to server');
  
  // Request initial update
  socket.emit('client_message', { type: 'request_update' });
});

// Listen for aggregated data updates
socket.on('aggregated_data', (data) => {
  console.log('Received aggregated data:', data);
});

// Listen for any errors
socket.on('error', (error) => {
  console.error('Socket error:', error);
});

// Handle disconnection
socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

// Keep the process running
process.on('SIGINT', () => {
  console.log('Disconnecting...');
  socket.disconnect();
  process.exit();
}); 