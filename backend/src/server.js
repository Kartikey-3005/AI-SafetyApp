import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/index.js';
import { initRedis } from './config/redis.js';
import { checkDatabaseConnection } from './config/prisma.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Standard Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'HEALTHY',
    service: 'SafeKids AI Neural Defense API',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api', apiRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.originalUrl });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Exception:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Initialize and Start Server
async function startServer() {
  try {
    await initRedis();
    await checkDatabaseConnection();
    app.listen(PORT, () => {
      console.log(`\n🛡️ ============================================`);
      console.log(`🛡️ SafeKids AI Backend API live on port ${PORT}`);
      console.log(`🛡️ Health Check: http://localhost:${PORT}/health`);
      console.log(`🛡️ Core Scan: POST http://localhost:${PORT}/api/scan`);
      console.log(`🛡️ Dashboard: GET http://localhost:${PORT}/api/dashboard/summary`);
      console.log(`🛡️ ============================================\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
