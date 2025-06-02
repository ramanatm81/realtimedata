import { Server, Socket } from 'socket.io';
import { DataUpdate, ClientMessage, AggregatedData } from '../types';
import { tickService } from '../services/tickService';

class SocketHandler {
  private io: Server;
  private latestUpdate: DataUpdate | null = null;

  constructor(io: Server) {
    this.io = io;
    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    this.io.on('connection', (socket: Socket) => {
      console.log('Client connected:', socket.id);

      // Send the latest update to newly connected clients
      if (this.latestUpdate) {
        socket.emit('data_update', this.latestUpdate);
      }

      // Handle client messages
      socket.on('client_message', (message: ClientMessage) => {
        switch (message.type) {
          case 'request_update':
            // Get the current minute's data
            const now = new Date();
            const currentMinute = Math.floor(now.getTime() / (60 * 1000)) * (60 * 1000);
            const data = tickService.getAggregatedData(currentMinute);
            if (data) {
              socket.emit('aggregated_data', data);
            }
            break;
          case 'acknowledge_update':
            console.log(`Client ${socket.id} acknowledged update ${message.updateId}`);
            break;
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  public emitDataUpdate(update: DataUpdate) {
    this.latestUpdate = update;
    this.io.emit('data_update', update);
  }

  public emitAggregatedData(data: AggregatedData) {
    this.io.emit('aggregated_data', data);
  }
}

export default SocketHandler; 