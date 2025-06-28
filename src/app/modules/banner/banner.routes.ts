import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BannerController } from './banner.controller';
import { createBannerZodSchema } from './banner.validation';

const router = express.Router();

router.route('/')
    .post(
        validateRequest(createBannerZodSchema), 
        BannerController.createBanner
    )
    .get(
        BannerController.getAllBanners
    );
router.delete('/:id', BannerController.deleteBanner);


export const BannerRoutes = router;
