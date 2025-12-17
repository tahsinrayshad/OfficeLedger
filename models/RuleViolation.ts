import mongoose, { Schema, Document } from 'mongoose';

export interface IRuleViolationDocument extends Document {
  violatorId: string;
  ruleId: string;
  additionalAmount: number;
  updatedBy: string;
  note?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ruleViolationSchema = new Schema<IRuleViolationDocument>(
  {
    violatorId: {
      type: String,
      required: [true, 'Violator ID is required'],
    },
    ruleId: {
      type: String,
      required: [true, 'Rule ID is required'],
    },
    additionalAmount: {
      type: Number,
      required: [true, 'Additional amount is required'],
      min: [0, 'Additional amount cannot be negative'],
    },
    updatedBy: {
      type: String,
      required: [true, 'Updated by user ID is required'],
    },
    note: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the model
// Check if model already exists to prevent "Cannot overwrite model" error during hot reload
const RuleViolation = mongoose.models.RuleViolation || mongoose.model<IRuleViolationDocument>('RuleViolation', ruleViolationSchema);

export default RuleViolation;
