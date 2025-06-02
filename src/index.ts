import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import tickRoutes from './routes/tickRoutes';
import SocketHandler from './websocket/socketHandler';
import { tickService } from './services/tickService';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins in development
    methods: ["GET", "POST"]
  }
});

const port: number = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize WebSocket handler
const socketHandler = new SocketHandler(io);

// Connect tickService with socketHandler
tickService.setAggregatedDataCallback((data) => {
  socketHandler.emitAggregatedData(data);
});

// Register routes
app.use('/', tickRoutes);

// Start the server
httpServer.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`WebSocket server is running on ws://localhost:${port}`);
}); 