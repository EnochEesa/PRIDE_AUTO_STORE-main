import { Request, Response } from 'express';
import Product from '../models/Product';
import { logger } from '../config/logger';

// GET /api/products
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, inStock, featured, search, page = '1', limit = '20' } = req.query;

    const filter: Record<string, unknown> = {};
    if (category)          filter.category = category;
    if (inStock !== undefined) filter.inStock = inStock === 'true';
    if (featured !== undefined) filter.featured = featured === 'true';
    if (search) filter.$text = { $search: search as string };

    const pageNum  = Math.max(parseInt(page as string, 10), 1);
    const limitNum = Math.min(parseInt(limit as string, 10), 100);
    const skip     = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter).sort({ featured: -1, createdAt: -1 }).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    logger.error('getProducts error:', error);
    res.status(500).json({ success: false, error: 'Server error fetching products.' });
  }
};

// GET /api/products/:slug
export const getProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      res.status(404).json({ success: false, error: 'Product not found.' });
      return;
    }
    res.json({ success: true, data: product });
  } catch (error) {
    logger.error('getProduct error:', error);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};

// POST /api/products  (admin only)
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('duplicate key')) {
      res.status(400).json({ success: false, error: 'A product with this slug or SKU already exists.' });
      return;
    }
    logger.error('createProduct error:', error);
    res.status(500).json({ success: false, error: 'Server error creating product.' });
  }
};

// PUT /api/products/:id  (admin only)
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!product) {
      res.status(404).json({ success: false, error: 'Product not found.' });
      return;
    }
    res.json({ success: true, data: product });
  } catch (error) {
    logger.error('updateProduct error:', error);
    res.status(500).json({ success: false, error: 'Server error updating product.' });
  }
};

// DELETE /api/products/:id  (admin only)
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, error: 'Product not found.' });
      return;
    }
    res.json({ success: true, message: 'Product deleted.' });
  } catch (error) {
    logger.error('deleteProduct error:', error);
    res.status(500).json({ success: false, error: 'Server error deleting product.' });
  }
};
