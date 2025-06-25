import { Request, Response } from 'express';
import { Notification } from './notification.model';

export const NotificationController = {
  async getUserNotifications(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch notifications', error });
    }
  },

  async markAsRead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await Notification.findByIdAndUpdate(id, { isRead: true });
      res.status(200).json({ message: 'Marked as read' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update notification', error });
    }
  }
};
