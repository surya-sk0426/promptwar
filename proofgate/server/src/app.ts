import express from 'express';
import cors from 'cors';
import { apiRouter } from './routes/api';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;
