import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { json } from 'body-parser';
import { Ledger } from './core/ledger';
import { pool } from './db';
import Redis from 'ioredis';
import { logger } from './logger';
import authRouter from './routes/auth';
import patientsRouter from './routes/patients';
import { config } from './config';
import { verifyEnvironment } from './utils/env-verify';

// Verify environment on startup
const envCheck = verifyEnvironment();
if (!envCheck.valid) {
  logger.warn('Environment issues detected:', { issues: envCheck.issues });
}

const PORT = config.port || 4000;

const app = express();
app.use(helmet());
app.use(cors());
app.use(json());
app.disable('x-powered-by');

// Rate limiter
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120,
});
app.use(limiter);

// Import record and lab routers
import recordsRouter from './routes/records';
import labsRouter from './routes/labs';

// Attach routers
app.use('/api/auth', authRouter);
app.use('/api/patients', patientsRouter);
app.use('/api/records', recordsRouter);
app.use('/api/labs', labsRouter);

// Health
app.get('/health', (req: Request, res: Response) => res.json({ status: 'ok' }));

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error', { err });
  res.status(500).json({ error: 'internal' });
});

app.listen(PORT, () => {
  logger.info(`Backend running on port ${PORT}`);
});
