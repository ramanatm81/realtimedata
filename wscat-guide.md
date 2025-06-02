# Testing WebSocket Connection with wscat

## Installation
```bash
npm install -g wscat
```

## Connecting to the Server
```bash
wscat -c ws://localhost:3000
```

## Subscribing to Aggregated Data
Once connected, you'll see a `>` prompt. Type or paste this message to request the current minute's aggregated data:
```json
{"type": "request_update"}
```

## Expected Output
You should see messages like this when aggregated data is received:
```json
< {"minuteTimestamp":1710930600000,"openPrice":100.50,"closePrice":99.75,"highPrice":101.25,"lowPrice":99.75,"totalVolume":225,"tickCount":3}
```

## Testing Flow
1. Start the server (if not already running)
2. Open a terminal and run `wscat -c ws://localhost:3000`
3. Send the subscription message to get the current minute's data
4. In another terminal, run the test-commands.sh script to send tick data
5. Watch the wscat terminal for real-time updates

## Notes
- The connection will stay open until you press Ctrl+C
- You'll receive updates:
  - When new ticks are processed (automatically)
  - Every minute for the current minute's aggregated data (automatically)
  - When you send the request_update message (on demand)
- To test the connection is working, you can run the test-commands.sh script in another terminal 