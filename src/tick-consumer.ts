import { io, Socket } from 'socket.io-client';
import { AggregatedData } from './types';

class TickDataConsumer {
  private socket: Socket;

  constructor(serverUrl: string) {
    this.socket = io(serverUrl);
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    // Listen for aggregated data updates from the server
    this.socket.on('aggregated_data', (data: AggregatedData) => {
      console.log('Received aggregated data:', {
        timestamp: new Date(data.minuteTimestamp).toISOString(),
        open: data.openPrice,
        high: data.highPrice,
        low: data.lowPrice,
        close: data.closePrice,
        volume: data.totalVolume,
        tickCount: data.tickCount
      });
    });

    // Handle connection events
    this.socket.on('connect', () => {
      console.log('Connected to server');
      // Request the latest aggregated data when connecting
      this.requestLatestData();
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  // Request the latest aggregated data from the server
  public requestLatestData() {
    this.socket.emit('client_message', { type: 'request_update' });
  }

  // Disconnect from the server
  public disconnect() {
    this.socket.disconnect();
  }
}

// Example of querying historical aggregated data
async function getHistoricalData(timestamp: number) {
  try {
    const response = await fetch(`http://localhost:3000/aggregated/${timestamp}`);
    const data = await response.json();
    console.log('Historical data:', data);
  } catch (error) {
    console.error('Error fetching historical data:', error);
  }
}

// Start the consumer
console.log('Starting tick data consumer...');
const consumer = new TickDataConsumer('http://localhost:3000');

// Query historical data for current minute every 5 seconds
const interval = setInterval(() => {
  const currentMinute = Math.floor(Date.now() / (60 * 1000)) * (60 * 1000);
  getHistoricalData(currentMinute);
}, 5000);

// Clean up on exit
process.on('SIGINT', () => {
  console.log('Stopping tick consumer...');
  clearInterval(interval);
  consumer.disconnect();
  process.exit();
}); 