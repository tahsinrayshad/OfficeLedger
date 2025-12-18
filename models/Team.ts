import mongoose, { Document, Schema } from 'mongoose';

export interface ITeamDocument extends Document {
  teamName: string;
  description?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const teamSchema = new Schema(
  {
    teamName: {
      type: String,
      required: [true, 'Team name is required'],
      unique: true,
      trim: true,
      minlength: [2, 'Team name must be at least 2 characters'],
    },
    description: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Team =
  mongoose.models.Team ||
  mongoose.model<ITeamDocument>('Team', teamSchema);

export default Team;
