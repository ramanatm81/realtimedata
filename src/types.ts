export interface DataUpdate {
  id: string;
  timestamp: number;
  data: any;
}

export interface ClientMessage {
  type: 'request_update' | 'acknowledge_update';
  updateId?: string;
}

export interface TickData {
  price: number;
  volume: number;
  timestamp: Date;
}

export interface AggregatedData {
  minuteTimestamp: number;
  openPrice: number;
  closePrice: number;
  highPrice: number;
  lowPrice: number;
  totalVolume: number;
  tickCount: number;
} 