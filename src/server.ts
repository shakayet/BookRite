import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { errorLogger, logger } from './shared/logger';
import socketHelper from './helpers/socketHelper';
import { seedSuperAdmin } from './DB/seedAdmin';
import config from './config';
import app from './app';

process.on('uncaughtException', error => {
  errorLogger.error('Uncaught Exception Detected', error);
  process.exit(1);
});

let server: http.Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    logger.info('🚀 Database connected successfully');

    await seedSuperAdmin();

    app.get('/', (_req, res) => {
      res.send('API is running...');
    });

    const port = typeof config.port === 'number' ? config.port : Number(config.port);
    server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
    socketHelper.initialize(io);
    (global as any).io = io;

    server.listen(port, config.ip_address as string, () => {
      logger.info(`🚀 Server running on port: ${port}`);
      logger.info(`🌐 Socket.IO running at ws://${config.ip_address}:${port}`);
    });
  } catch (error) {
    errorLogger.error('🤢 Failed to start server:', error);
  }

  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        errorLogger.error('Unhandled Rejection Detected', error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

main();

process.on('SIGTERM', () => {
  logger.info('SIGTERM RECEIVED');
  server?.close();
});