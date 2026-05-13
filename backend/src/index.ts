import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Kite Trading Bot Backend is running' });
});

app.listen(config.PORT, () => {
  console.log(`🚀 Server running on port ${config.PORT}`);
});

export default app;