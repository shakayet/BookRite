import { Server, Socket } from 'socket.io';
import { Message } from '../app/modules/message/message.model';
import { errorLogger, logger } from '../shared/logger';
import { Notification } from '../app/modules/notification/notification.model';

class SocketHelper {
  private static io: Server;

  static initialize(ioInstance: Server) {
    SocketHelper.io = ioInstance;
    ioInstance.on('connection', SocketHelper.handleConnection);
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

        // Use the stored static `io` reference
        SocketHelper.io.to(senderId).emit('receive_message', message);
        SocketHelper.io.to(receiverId).emit('receive_message', message);

        // Added for notification
        await Notification.create({
          userId: receiverId,
          message: 'You received a new message!',
          type: 'message',
        });
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
