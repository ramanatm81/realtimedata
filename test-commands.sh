#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Testing Tick Data Endpoints${NC}\n"

# Test 1: Send a tick with current timestamp
echo -e "${GREEN}Test 1: Sending a tick with current timestamp${NC}"
curl -X POST http://localhost:3000/tick \
  -H "Content-Type: application/json" \
  -d '{
    "price": 100.50,
    "volume": 100,
    "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"
  }'

echo -e "\n\n${GREEN}Test 2: Sending another tick in the same minute${NC}"
curl -X POST http://localhost:3000/tick \
  -H "Content-Type: application/json" \
  -d '{
    "price": 101.25,
    "volume": 50,
    "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"
  }'

# Test 3: Query aggregated data for current minute
echo -e "\n\n${GREEN}Test 3: Querying aggregated data for current minute${NC}"
CURRENT_MINUTE=$(date -u +%s | awk '{print int($1/60)*60*1000}')
curl -X GET "http://localhost:3000/aggregated/$CURRENT_MINUTE"

# Test 4: Send a tick with a different price to test high/low
echo -e "\n\n${GREEN}Test 4: Sending a tick with different price${NC}"
curl -X POST http://localhost:3000/tick \
  -H "Content-Type: application/json" \
  -d '{
    "price": 99.75,
    "volume": 75,
    "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"
  }'

# Test 5: Query aggregated data again to see updates
echo -e "\n\n${GREEN}Test 5: Querying aggregated data again${NC}"
curl -X GET "http://localhost:3000/aggregated/$CURRENT_MINUTE"

echo -e "\n\n${BLUE}WebSocket Testing Instructions:${NC}"
echo "To test WebSocket connections, install wscat and run:"
echo "wscat -c ws://localhost:3000"
echo "Then subscribe to 'aggregated_data' events"
echo "You should receive updates every minute and when new ticks arrive" 