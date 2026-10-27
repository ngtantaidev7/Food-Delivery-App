import { Request, Response } from 'express';
import { Banner } from '../models/Banner';

export const getBanners = async (req: Request, res: Response): Promise<void> => {
  try {
    const { placement, categorySlug } = req.query;

    const filter: any = { isActive: true };
    if (placement) {
      filter.placement = placement;
    }
    if (categorySlug) {
      filter.categorySlug = categorySlug;
    }

    const banners = await Banner.find(filter).sort({ order: 1 });
    res.json({ success: true, count: banners.length, data: banners });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
