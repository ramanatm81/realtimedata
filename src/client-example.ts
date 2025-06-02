import { io, Socket } from 'socket.io-client';
import { AggregatedData } from './types';

class TickDataClient {
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

// Example usage
const client = new TickDataClient('http://localhost:3000');

// Example of sending tick data
async function sendTickData(price: number, volume: number) {
  try {
    const response = await fetch('http://localhost:3000/tick', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price,
        volume,
        timestamp: new Date().toISOString()
      }),
    });
    const result = await response.json();
    console.log('Tick data sent:', result);
  } catch (error) {
    console.error('Error sending tick data:', error);
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

// Example usage
console.log('Starting tick data client...');

// Send some example tick data
setTimeout(() => {
  sendTickData(100.50, 100);
}, 1000);

setTimeout(() => {
  sendTickData(101.25, 50);
}, 2000);

setTimeout(() => {
  sendTickData(99.75, 75);
}, 3000);

// Query historical data for current minute
setTimeout(() => {
  const currentMinute = Math.floor(Date.now() / (60 * 1000)) * (60 * 1000);
  getHistoricalData(currentMinute);
}, 4000);

// Keep the process running
process.on('SIGINT', () => {
  console.log('Disconnecting client...');
  client.disconnect();
  process.exit();
}); 