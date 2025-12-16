import mongoose, { Schema, Document } from 'mongoose';

export interface IContribution {
  userId: string;
  amount: number;
}

export interface ISnackDocument extends Document {
  contributions: IContribution[];
  totalContribution: number;
  foodItem: string;
  expense: number;
  note?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const contributionSchema = new Schema<IContribution>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
  },
  { _id: false }
);

const snackSchema = new Schema<ISnackDocument>(
  {
    contributions: {
      type: [contributionSchema],
      default: [],
    },
    totalContribution: {
      type: Number,
      default: 0,
      min: [0, 'Total contribution cannot be negative'],
    },
    foodItem: {
      type: String,
      required: [true, 'Food item is required'],
      trim: true,
    },
    expense: {
      type: Number,
      required: [true, 'Expense is required'],
      min: [0, 'Expense cannot be negative'],
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
const Snack = mongoose.models.Snack || mongoose.model<ISnackDocument>('Snack', snackSchema);

export default Snack;
