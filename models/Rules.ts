import mongoose, { Schema, Document } from 'mongoose';

export interface IRulesDocument extends Document {
  title: string;
  amount: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const rulesSchema = new Schema<IRulesDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the model
// Check if model already exists to prevent "Cannot overwrite model" error during hot reload
const Rules = mongoose.models.Rules || mongoose.model<IRulesDocument>('Rules', rulesSchema);

export default Rules;
