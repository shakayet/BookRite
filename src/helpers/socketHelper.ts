import { Server, Socket } from 'socket.io';
import { Message } from '../app/modules/message/message.model';
import { errorLogger, logger } from '../shared/logger';

class SocketHelper {
  private static io: Server;

  static initialize(ioInstance: Server) {
    this.io = ioInstance;
    this.io.on('connection', this.handleConnection);
  }

  private static handleConnection(socket: Socket) {
    logger.info(`✅ Socket connected: ${socket.id}`);

    socket.on('join', (userId: string) => {
      socket.join(userId);
      logger.info(`🔔 User ${userId} joined`);
    });

    socket.on('send_message', async (data) => {
      try {
        const { chatId, senderId, receiverId, text } = data;
        const message = await Message.create({ chatId, senderId, text });
        
        // Emit to both sender and receiver
        this.io.to(senderId).emit('receive_message', message);
        this.io.to(receiverId).emit('receive_message', message);
      } catch (err) {
        errorLogger.error('❌ Error saving message:', err);
      }
    });

    socket.on('disconnect', () => {
      logger.info(`❌ Socket disconnected: ${socket.id}`);
    });
  }
}

export default SocketHelper;