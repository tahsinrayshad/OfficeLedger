import mongoose, { Schema, Document } from 'mongoose';

export interface IUserDocument extends Document {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  dob: Date;
  isFundManager: boolean;
  isFoodManager: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserDocument>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^[0-9\-\+\(\)\s]{10,}$/, 'Please provide a valid phone number'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't return password by default
    },
    dob: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    isFundManager: {
      type: Boolean,
      default: false,
    },
    isFoodManager: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the model
// Check if model already exists to prevent "Cannot overwrite model" error during hot reload
const User = mongoose.models.User || mongoose.model<IUserDocument>('User', userSchema);

export default User;
