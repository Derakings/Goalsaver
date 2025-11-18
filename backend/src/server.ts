import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/database';
import { logger } from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Import routes
import authRoutes from './routes/auth.routes';
import groupRoutes from './routes/group.routes';
import contributionRoutes from './routes/contribution.routes';
import purchaseRoutes from './routes/purchase.routes';
import notificationRoutes from './routes/notification.routes';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Goalsaver API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/contributions', contributionRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/notifications', notificationRoutes);

// Root endpoint
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Goalsaver API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      groups: '/api/groups',
      contributions: '/api/contributions',
      purchases: '/api/purchases',
      notifications: '/api/notifications',
    },
  });
});

// Error handlers (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`🚀 Goalsaver API server is running on port ${PORT}`);
  logger.info(`📍 Environment: ${config.nodeEnv}`);
  logger.info(`🏥 Health check: http://localhost:${PORT}/health`);
});

export default app;
