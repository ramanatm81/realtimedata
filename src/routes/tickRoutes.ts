import { Router, Request, Response } from 'express';
import { TickData } from '../types';
import { tickService } from '../services/tickService';

const router = Router();

// REST endpoint to receive tick data
router.post('/tick', (req: Request, res: Response) => {
  const tick: TickData = {
    price: req.body.price,
    volume: req.body.volume,
    timestamp: new Date(req.body.timestamp)
  };

  const aggregatedData = tickService.processTick(tick);
  res.json({ success: true });
});

// REST endpoint to get aggregated data for a specific minute
router.get('/aggregated/:timestamp', (req: Request, res: Response) => {
  const timestamp = parseInt(req.params.timestamp);
  const data = tickService.getAggregatedData(timestamp);
  res.json(data || { message: 'No data available for this minute' });
});

export default router; 