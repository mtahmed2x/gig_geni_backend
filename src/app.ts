import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { StatusCodes } from 'http-status-codes';
import routes from './routes';
import { notFoundHandler } from './middlewares/notFoundHandler';
import { errorHandler } from './middlewares/errorHandler';
import rateLimit from 'express-rate-limit';
import { pinoHttp } from 'pino-http';
import { logger } from './utils/logger';

const allowedOrigins = [
  'https://giggeni.com',
  'https://www.giggeni.com',
  'https://admin.giggeni.com',
];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

const pinoHttpOptions = {
  logger: logger,
  serializers: {
    req(req: any) {
      return {
        id: req.id,
        method: req.method,
        url: req.url,
        remoteAddress: req.remoteAddress,
      };
    },
    res(res: any) {
      return {
        statusCode: res.statusCode,
      };
    },
  },
};

const app: Application = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors(corsOptions));
app.use(limiter);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(pinoHttp(pinoHttpOptions));

app.get('/', (_req, res) => {
  res.status(StatusCodes.OK).json({ message: 'API is healthy 🚀' });
});

app.get('/health', (_req, res) => {
  res.status(StatusCodes.OK).json({ message: 'API is healthy 🚀' });
});

app.use('/api/v1', routes);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
