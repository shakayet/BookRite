import express from 'express';
import colors from 'colors';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import config from './config';
import app from './app'; // Express instance
import { seedSuperAdmin } from './DB/seedAdmin';
import { errorLogger, logger } from './shared/logger';
import { Message } from './app/modules/message/message.model'; // Adjust path if needed

// Handle uncaught exceptions
process.on('uncaughtException', error => {
  errorLogger.error('Uncaught Exception Detected', error);
  process.exit(1);
});

let server: http.Server;

async function main() {
  try {
    // DB Connection
    await mongoose.connect(config.database_url as string);
    logger.info(colors.green('🚀 Database connected successfully'));

    // Seed Super Admin
    await seedSuperAdmin();

    // Apply middleware if not already in app.ts
    app.use(cors());
    app.use(express.json());

    // Test route
    app.get('/', (_req, res) => {
      res.send('API is running...');
    });

    const port = typeof config.port === 'number' ? config.port : Number(config.port);
    server = http.createServer(app);

    // Socket.IO Initialization
    const io = new Server(server, {
      pingTimeout: 60000,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', socket => {
      logger.info(`✅ Socket connected: ${socket.id}`);

      socket.on('join', (userId: string) => {
        socket.join(userId);
        logger.info(`🔔 User ${userId} joined`);
      });

      socket.on('send_message', async data => {
        const { sender, receiver, content } = data;
        logger.info(`📩 Message from ${sender} to ${receiver}: ${content}`);

        try {
          const message = await Message.create({ sender, receiver, content });
          io.to(receiver).emit('receive_message', {
            sender,
            receiver,
            content,
            timestamp: new Date(),
            _id: message._id,
          });
        } catch (err) {
          errorLogger.error('❌ Error saving message:', err);
        }
      });

      socket.on('disconnect', () => {
        logger.info(`❌ Socket disconnected: ${socket.id}`);
      });
    });

    // @ts-ignore
    global.io = io;

    server.listen(port, config.ip_address as string, () => {
      logger.info(colors.yellow(`🚀 Server running on port: ${port}`));
    });

  } catch (error) {
    errorLogger.error(colors.red('🤢 Failed to start server:'), error);
  }

  // Handle unhandled promise rejections
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

// SIGTERM
process.on('SIGTERM', () => {
  logger.info('SIGTERM RECEIVED');
  if (server) {
    server.close();
  }
});
