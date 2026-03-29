import mongoose, { Schema } from 'mongoose'

const LogSchema = new Schema({
  level:     { type: String, enum: ['info','warn','error'], required: true },
  message:   { type: String, required: true },
  meta:      { type: Schema.Types.Mixed },
  ip:        { type: String },
  route:     { type: String },
  createdAt: { type: Date, default: Date.now, index: { expires: '60d' } },
})

export default mongoose.model('Log', LogSchema)