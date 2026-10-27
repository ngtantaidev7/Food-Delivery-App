import { Request, Response } from 'express';
import { Banner } from '../models/Banner';

/** GET /api/banners — Get active banners by placement or categorySlug */
export const getBanners = async (req: Request, res: Response): Promise<void> => {
  try {
    const { placement, categorySlug } = req.query;

    const filter: Record<string, any> = { isActive: true };
    if (placement && typeof placement === 'string') {
      filter.placement = placement;
    }
    if (categorySlug && typeof categorySlug === 'string') {
      filter.categorySlug = categorySlug.toLowerCase();
    }

    const banners = await Banner.find(filter)
      .sort({ order: 1 })
      .lean();

    res.json({ success: true, count: banners.length, data: banners });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
