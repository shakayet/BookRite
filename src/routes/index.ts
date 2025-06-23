import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { ClothRoutes } from '../app/modules/cloth/cloth.routes';
import { ServiceRoutes } from '../app/modules/service/service.routes';
import { CategoryRoutes } from '../app/modules/category/category.routes';
import { BannerRoutes } from '../app/modules/banner/banner.routes';
import paymentRoutes from '../app/modules/payment/payment.routes';
import { ChatRoutes } from "../app/modules/chat/chat.route";
import { MessageRoutes } from "../app/modules/message/message.routes";


const router = express.Router();

router.use("/chat", ChatRoutes);
router.use("/message", MessageRoutes);


const apiRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/cloths',
    route: ClothRoutes,
  },
  {
    path: '/service',
    route: ServiceRoutes,
  },
  {
    path: '/categories',
    route: CategoryRoutes,
  },
  {
    path: '/banners',
    route: BannerRoutes,
  },
  {
    path: '/payments',
    route: paymentRoutes,
  }
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
