import { Server, Socket } from 'socket.io';
import { Message } from '../app/modules/message/message.model';
import { Notification } from '../app/modules/notification/notification.model';
import { errorLogger, logger } from '../shared/logger';

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

        // Save the message
        const message = await Message.create({ chatId, senderId, text });

        // Emit message to both users
        SocketHelper.io.to(senderId).emit('receive_message', message);
        SocketHelper.io.to(receiverId).emit('receive_message', message);

        // Create the notification
        const notification = await Notification.create({
          userId: receiverId,
          message: 'You received a new message!',
          type: 'message',
        });

        // Emit the notification to the receiver
        SocketHelper.io.to(receiverId).emit('receive_notification', notification);
      } catch (err) {
        errorLogger.error('❌ Error saving message or notification:', err);
      }
    });

    socket.on('disconnect', () => {
      logger.info(`❌ Socket disconnected: ${socket.id}`);
    });
  }
}

export default SocketHelper;
