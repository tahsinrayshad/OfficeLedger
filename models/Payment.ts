import mongoose, { Schema, Document } from 'mongoose';

export interface IPaymentDocument extends Document {
  payedBy: string;
  amount: number;
  date: Date;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPaymentDocument>(
  {
    payedBy: {
      type: String,
      required: [true, 'Payer user ID is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    note: {
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
const Payment = mongoose.models.Payment || mongoose.model<IPaymentDocument>('Payment', paymentSchema);

export default Payment;
