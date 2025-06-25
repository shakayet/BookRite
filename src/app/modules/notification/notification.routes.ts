import express from 'express';
import { NotificationController } from './notification.controller';

const router = express.Router();

router.get('/:userId', NotificationController.getUserNotifications);
router.patch('/mark-as-read/:id', NotificationController.markAsRead);

export const NotificationRoutes = router;
