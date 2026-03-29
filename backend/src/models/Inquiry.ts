import mongoose, { Schema, Document } from 'mongoose';

export interface IInquiry extends Document {
  name: string;
  phone: string;
  email: string;
  message: string;
  productRef: string;
  status: 'new' | 'read' | 'replied';
  createdAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    name:       { type: String, required: true, trim: true, maxlength: 100 },
    phone:      { type: String, required: true, trim: true, maxlength: 15 },
    email:      { type: String, trim: true, lowercase: true, maxlength: 200, default: '' },
    message:    { type: String, required: true, trim: true, maxlength: 1000 },
    productRef: { type: String, trim: true, default: '' },
    status:     { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
  },
  { timestamps: true }
);

InquirySchema.index({ status: 1, createdAt: -1 });

export default mongoose.model<IInquiry>('Inquiry', InquirySchema);
