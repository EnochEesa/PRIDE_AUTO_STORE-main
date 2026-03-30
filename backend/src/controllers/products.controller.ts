import { Request, Response } from 'express';
import Product from '../models/Product';
import { logger } from '../config/logger';
import {
  getBody,
  getBooleanQuery,
  getOptionalBodyString,
  getPositiveIntQuery,
  getQuery,
  getQueryString,
} from '../utils/validate';

// GET /api/products
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = getQuery(req.query);
    if (!query) {
      res.status(400).json({ success: false, error: 'Invalid query string.' });
      return;
    }

    const category = getQueryString(query.category);
    const inStock = getBooleanQuery(query.inStock);
    const featured = getBooleanQuery(query.featured);
    const search = getQueryString(query.search);
    const pageNum = getPositiveIntQuery(query.page, 1, Number.MAX_SAFE_INTEGER);
    const limitNum = getPositiveIntQuery(query.limit, 20, 100);

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (typeof inStock === 'boolean') filter.inStock = inStock;
    if (typeof featured === 'boolean') filter.featured = featured;
    if (search) filter.$text = { $search: search };
    const skip = (pageNum - 1) * limitNum;

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
    const body = getBody(req.body);
    if (!body) {
      res.status(400).json({ success: false, error: 'Invalid request body.' });
      return;
    }

    const product = await Product.create({
      name: getOptionalBodyString(body, 'name'),
      slug: getOptionalBodyString(body, 'slug'),
      description: getOptionalBodyString(body, 'description'),
      category: getOptionalBodyString(body, 'category'),
      brand: getOptionalBodyString(body, 'brand'),
      price: typeof body.price === 'number' ? body.price : undefined,
      sku: getOptionalBodyString(body, 'sku'),
      images: Array.isArray(body.images) ? body.images : undefined,
      inStock: typeof body.inStock === 'boolean' ? body.inStock : undefined,
      featured: typeof body.featured === 'boolean' ? body.featured : undefined,
    });
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
    const body = getBody(req.body);
    if (!body) {
      res.status(400).json({ success: false, error: 'Invalid request body.' });
      return;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, {
      name: getOptionalBodyString(body, 'name'),
      slug: getOptionalBodyString(body, 'slug'),
      description: getOptionalBodyString(body, 'description'),
      category: getOptionalBodyString(body, 'category'),
      brand: getOptionalBodyString(body, 'brand'),
      price: typeof body.price === 'number' ? body.price : undefined,
      sku: getOptionalBodyString(body, 'sku'),
      images: Array.isArray(body.images) ? body.images : undefined,
      inStock: typeof body.inStock === 'boolean' ? body.inStock : undefined,
      featured: typeof body.featured === 'boolean' ? body.featured : undefined,
    }, {
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
