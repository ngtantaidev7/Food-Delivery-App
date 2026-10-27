import { Request, Response } from 'express';
import { Category } from '../models/Category';

/** GET /api/categories — Get all active categories ordered by displayOrder */
export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ displayOrder: 1 })
      .lean();
    res.json({ success: true, count: categories.length, data: categories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** GET /api/categories/:slug — Get category by slug */
export const getCategoryBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug: slug?.toLowerCase(), isActive: true }).lean();
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }
    res.json({ success: true, data: category });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
