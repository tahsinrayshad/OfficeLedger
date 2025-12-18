import mongoose, { Document, Schema } from 'mongoose';

export interface ITeamMemberDocument extends Document {
  teamId: string;
  userId: string;
  isTeamLead: boolean;
  isFundManager: boolean;
  isFoodManager: boolean;
  isActive: boolean;
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const teamMemberSchema = new Schema(
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
    isTeamLead: {
      type: Boolean,
      default: false,
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
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent duplicate team-user combinations
teamMemberSchema.index({ teamId: 1, userId: 1 }, { unique: true });

const TeamMember =
  mongoose.models.TeamMember ||
  mongoose.model<ITeamMemberDocument>('TeamMember', teamMemberSchema);

export default TeamMember;
