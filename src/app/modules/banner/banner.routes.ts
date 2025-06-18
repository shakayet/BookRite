import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BannerController } from './banner.controller';
import { createBannerZodSchema } from './banner.validation';

const router = express.Router();

router.post('/', validateRequest(createBannerZodSchema), BannerController.createBanner);
router.get('/', BannerController.getAllBanners);

export const BannerRoutes = router;
