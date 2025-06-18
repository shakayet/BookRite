import { IBanner } from './banner.interface';
import { Banner } from './banner.model';

const createBanner = async (payload: IBanner): Promise<IBanner> => {
  const result = await Banner.create(payload);
  return result;
};

const getAllBanners = async (): Promise<IBanner[]> => {
  const result = await Banner.find().sort('-createdAt');
  return result;
};

export const BannerService = {
  createBanner,
  getAllBanners,
};
