import express from 'express';
import colors from 'colors';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import config from './config';
import app from './app';
import { seedSuperAdmin } from './DB/seedAdmin';
import { errorLogger, logger } from './shared/logger';
import SocketHelper from './helpers/socketHelper'; // Updated import

process.on('uncaughtException', error => {
  errorLogger.error('Uncaught Exception Detected', error);
  process.exit(1);
});

let server: http.Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    logger.info(colors.green('🚀 Database connected successfully'));

    await seedSuperAdmin();

    app.get('/', (_req, res) => {
      res.send('API is running...');
    });

    const port = typeof config.port === 'number' ? config.port : Number(config.port);
    server = http.createServer(app);

    // Socket.IO setup
    const io = new Server(server, {
      pingTimeout: 60000,
      cors: {
        origin: config.client_url,
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    // Initialize sockets
    SocketHelper.initialize(io);

    server.listen(port, config.ip_address as string, () => {
      logger.info(colors.yellow(`🚀 Server running on port: ${port}`));
      logger.info(colors.blue(`🌐 Socket.IO running at ws://${config.ip_address}:${port}`));
    });

  } catch (error) {
    errorLogger.error(colors.red('🤢 Failed to start server:'), error);
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