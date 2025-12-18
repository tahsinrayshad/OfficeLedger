import mongoose, { Document, Schema } from 'mongoose';

export interface IBankAccountDocument extends Document {
  teamId: string;
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
    teamId: {
      type: String,
      required: true,
      trim: true,
    },
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
