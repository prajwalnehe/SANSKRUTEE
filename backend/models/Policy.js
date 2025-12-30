import mongoose from 'mongoose';

const PolicySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['privacy', 'terms', 'shipping', 'returns'],
      unique: true,
      lowercase: true
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export const Policy = mongoose.models.Policy || mongoose.model('Policy', PolicySchema);
export default Policy;







