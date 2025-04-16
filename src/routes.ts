import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { logger, LogLevel } from './common/helpers/logger';
import authRoutes from './routes/Auth';
import userRoutes from './routes/User';

dayjs.extend(utc);

const router = express.Router();

router.get('/api-check', (_req, res) => {
  res.send('Project Name API OK !!');
});

router.use(
  express.json({
    verify: (req, res, buf) => {
      req['rawBody'] = buf;
    },
  })
);

if (process.env.NODE_ENV === 'development') {
  const stream = {
    write: (message: string) =>
      logger.log({
        message: message.trim(),
        level: LogLevel.Info,
      }),
  };
  router.use(morgan('dev', { stream }));
}

router.use(bodyParser.json({ limit: '1mb' }));
router.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
