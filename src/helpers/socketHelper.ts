import { Server, Socket } from 'socket.io';
import { Message } from '../app/modules/message/message.model';
import { Notification } from '../app/modules/notification/notification.model';
import { errorLogger, logger } from '../shared/logger';

class SocketHelper {
  private static io: Server;

  static initialize(ioInstance: Server) {
    this.io = ioInstance;
    this.io.on('connection', this.handleConnection.bind(this));
  }

  private static handleConnection(socket: Socket) {
    logger.info(`✅ Socket connected: ${socket.id}`);

    socket.on('join', (userId: string) => this.handleJoin(socket, userId));
    socket.on('send_message', (data) => this.handleSendMessage(socket, data));
    socket.on('disconnect', () => this.handleDisconnect(socket));
  }

  private static handleJoin(socket: Socket, userId: string) {
    socket.join(userId);
    logger.info(`🔔 User ${userId} joined room`);
  }

  private static async handleSendMessage(
    socket: Socket,
    data: {
      chatId: string;
      senderId: string;
      receiverId: string;
      text: string;
    }
  ) {
    try {
      const { chatId, senderId, receiverId, text } = data;

      // 1. Save message
      const message = await Message.create({ chatId, senderId, text });

      // 2. Emit message to sender & receiver
      this.io.to(senderId).emit('receive_message', message);
      this.io.to(receiverId).emit('receive_message', message);

      // 3. Create and emit notification to receiver
      const notification = await Notification.create({
        userId: receiverId,
        message: 'You received a new message!',
        type: 'message',
      });

      this.io.to(receiverId).emit('receive_notification', notification);
    } catch (err) {
      errorLogger.error('❌ Error handling message:', err);
    }
  }

  private static handleDisconnect(socket: Socket) {
    logger.info(`❌ Socket disconnected: ${socket.id}`);
  }
}

export default SocketHelper;
