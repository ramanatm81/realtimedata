import { TickData, AggregatedData } from '../types';

type AggregatedDataCallback = (data: AggregatedData) => void;

class TickService {
  private aggregatedDataMap: Map<number, AggregatedData> = new Map();
  private onAggregatedDataUpdate: AggregatedDataCallback | null = null;

  constructor() {
    // Set up interval to emit updates every minute
    setInterval(() => {
      const now = new Date();
      const currentMinute = this.getMinuteTimestamp(now);
      const data = this.aggregatedDataMap.get(currentMinute);
      if (data && this.onAggregatedDataUpdate) {
        this.onAggregatedDataUpdate(data);
      }
    }, 60000); // Run every minute
  }

  public setAggregatedDataCallback(callback: AggregatedDataCallback) {
    this.onAggregatedDataUpdate = callback;
  }

  private getMinuteTimestamp(date: Date): number {
    const timestamp = date.getTime();
    return Math.floor(timestamp / (60 * 1000)) * (60 * 1000);
  }

  private emitUpdate(data: AggregatedData) {
    if (this.onAggregatedDataUpdate) {
      this.onAggregatedDataUpdate(data);
    }
  }

  public processTick(tick: TickData): AggregatedData | null {
    const minuteTimestamp = this.getMinuteTimestamp(tick.timestamp);
    const existingData = this.aggregatedDataMap.get(minuteTimestamp);

    if (existingData) {
      existingData.closePrice = tick.price;
      existingData.highPrice = Math.max(existingData.highPrice, tick.price);
      existingData.lowPrice = Math.min(existingData.lowPrice, tick.price);
      existingData.totalVolume += tick.volume;
      existingData.tickCount += 1;
      
      // Emit update immediately after modifying the data
      this.emitUpdate(existingData);
    } else {
      const newData: AggregatedData = {
        minuteTimestamp,
        openPrice: tick.price,
        closePrice: tick.price,
        highPrice: tick.price,
        lowPrice: tick.price,
        totalVolume: tick.volume,
        tickCount: 1
      };
      this.aggregatedDataMap.set(minuteTimestamp, newData);
      
      // Emit update immediately for new data
      this.emitUpdate(newData);
    }

    return this.aggregatedDataMap.get(minuteTimestamp) || null;
  }

  public getAggregatedData(timestamp: number): AggregatedData | null {
    return this.aggregatedDataMap.get(timestamp) || null;
  }
}

export const tickService = new TickService(); 