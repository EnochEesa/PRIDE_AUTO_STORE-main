import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  sku: string;
  images: { url: string; alt: string }[];
  inStock: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name:        { type: String, required: true, trim: true, maxlength: 200 },
    slug:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, maxlength: 2000, default: '' },
    category: {
      type: String,
      required: true,
      enum: ['Engine', 'Brakes', 'Electrical', 'Body', 'Suspension', 'Tyres', 'Filters', 'Other'],
    },
    brand:    { type: String, trim: true, default: '' },
    price:    { type: Number, min: 0, default: 0 },
    sku:      { type: String, unique: true, sparse: true, trim: true },
    images:   [{ url: { type: String }, alt: { type: String, default: '' } }],
    inStock:  { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ProductSchema.index({ category: 1, inStock: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ name: 'text', description: 'text', brand: 'text' });

export default mongoose.model<IProduct>('Product', ProductSchema);
