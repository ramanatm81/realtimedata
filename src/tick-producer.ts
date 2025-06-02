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
    console.log('Tick data sent:', { price, volume, result });
  } catch (error) {
    console.error('Error sending tick data:', error);
  }
}

// Example usage
console.log('Starting tick data producer...');

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

// Keep sending random tick data every 2 seconds
const interval = setInterval(() => {
  const price = 100 + (Math.random() * 2 - 1); // Random price between 99 and 101
  const volume = Math.floor(Math.random() * 100); // Random volume between 0 and 100
  sendTickData(price, volume);
}, 2000);

// Clean up on exit
process.on('SIGINT', () => {
  console.log('Stopping tick producer...');
  clearInterval(interval);
  process.exit();
}); 