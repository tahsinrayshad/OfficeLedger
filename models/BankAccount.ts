import mongoose, { Document, Schema } from 'mongoose';

export interface IBankAccountDocument extends Document {
  userId: string;
  bankName: string;
  branch: string;
  accountNo: string;
  accountTitle: string;
  routingNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const bankAccountSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    bankName: {
      type: String,
      required: true,
      trim: true,
    },
    branch: {
      type: String,
      required: true,
      trim: true,
    },
    accountNo: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    accountTitle: {
      type: String,
      required: true,
      trim: true,
    },
    routingNumber: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const BankAccount =
  mongoose.models.BankAccount ||
  mongoose.model<IBankAccountDocument>('BankAccount', bankAccountSchema);

export default BankAccount;
