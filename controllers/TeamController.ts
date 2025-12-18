import { connectDB } from '@/utils/db';
import Team from '@/models/Team';
import TeamMember from '@/models/TeamMember';
import User from '@/models/Users';

export class TeamController {
  /**
   * Create a new team
   * The creator becomes team lead, fund manager, and food manager
   */
  async createTeam(
    teamName: string,
    createdBy: string,
    description?: string
  ) {
    try {
      await connectDB();

      // Validate user exists
      const user = await User.findById(createdBy);
      if (!user) {
        return {
          success: false,
          message: 'User not found',
          statusCode: 404,
        };
      }

      // Check if team name already exists
      const existingTeam = await Team.findOne({ teamName });
      if (existingTeam) {
        return {
          success: false,
          message: 'Team name already exists',
          statusCode: 400,
        };
      }

      // Create team
      const team = new Team({
        teamName,
        description,
        createdBy,
      });

      const savedTeam = await team.save();

      // Add creator as team member with all roles
      const teamMember = new TeamMember({
        teamId: savedTeam._id.toString(),
        userId: createdBy,
        isTeamLead: true,
        isFundManager: true,
        isFoodManager: true,
        isActive: true,
      });

      await teamMember.save();

      // Set as current team for user
      user.currentTeamId = savedTeam._id.toString();
      await user.save();

      return {
        success: true,
        message: 'Team created successfully',
        statusCode: 201,
        data: {
          team: savedTeam.toObject(),
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
        statusCode: 500,
      };
    }
  }

  /**
   * Get team by ID with members
   */
  async getTeamById(teamId: string) {
    try {
      await connectDB();

      const team = await Team.findById(teamId).lean();
      if (!team) {
        return {
          success: false,
          message: 'Team not found',
          statusCode: 404,
        };
      }

      // Get team members with user details
      const members = await TeamMember.find({ teamId }).lean();
      const enrichedMembers = await Promise.all(
        members.map(async (member: any) => {
          const userData = await User.findById(member.userId).select('-password').lean();
          return {
            ...member,
            user: userData,
          };
        })
      );

      return {
        success: true,
        message: 'Team retrieved successfully',
        statusCode: 200,
        data: {
          ...team,
          members: enrichedMembers,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
        statusCode: 500,
      };
    }
  }

  /**
   * Get all teams for a user
   */
  async getUserTeams(userId: string) {
    try {
      await connectDB();

      // Verify user exists
      const user = await User.findById(userId);
      if (!user) {
        return {
          success: false,
          message: 'User not found',
          statusCode: 404,
        };
      }

      // Get all teams user belongs to
      const membershipRecords = await TeamMember.find({ userId }).lean();
      const teamIds = membershipRecords.map((m: any) => m.teamId);

      const teams = await Team.find({ _id: { $in: teamIds } }).lean();

      // Enrich with membership info
      const enrichedTeams = teams.map((team: any) => {
        const memberRecord = membershipRecords.find((m: any) => m.teamId === team._id.toString());
        return {
          ...team,
          membership: memberRecord,
        };
      });

      return {
        success: true,
        message: 'Teams retrieved successfully',
        statusCode: 200,
        data: enrichedTeams,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
        statusCode: 500,
      };
    }
  }

  /**
   * Add new user to team (team lead only)
   */
  async addTeamMember(
    teamId: string,
    newUserId: string,
    requestingUserId: string
  ) {
    try {
      await connectDB();

      // Check if requesting user is team lead
      const requesterMembership = await TeamMember.findOne({
        teamId,
        userId: requestingUserId,
      });

      if (!requesterMembership || !requesterMembership.isTeamLead) {
        return {
          success: false,
          message: 'Only team leads can add members',
          statusCode: 403,
        };
      }

      // Check if new user exists
      const newUser = await User.findById(newUserId);
      if (!newUser) {
        return {
          success: false,
          message: 'User not found',
          statusCode: 404,
        };
      }

      // Check if user already in team
      const existingMembership = await TeamMember.findOne({
        teamId,
        userId: newUserId,
      });

      if (existingMembership) {
        return {
          success: false,
          message: 'User is already a member of this team',
          statusCode: 400,
        };
      }

      // Add user to team as regular member
      const teamMember = new TeamMember({
        teamId,
        userId: newUserId,
        isTeamLead: false,
        isFundManager: false,
        isFoodManager: false,
        isActive: true,
      });

      await teamMember.save();

      // Set as current team if user doesn't have one
      if (!newUser.currentTeamId) {
        newUser.currentTeamId = teamId;
        await newUser.save();
      }

      return {
        success: true,
        message: 'User added to team successfully',
        statusCode: 201,
        data: teamMember.toObject(),
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
        statusCode: 500,
      };
    }
  }

  /**
   * Deactivate team member (team lead only)
   */
  async deactivateTeamMember(
    teamId: string,
    memberId: string,
    requestingUserId: string
  ) {
    try {
      await connectDB();

      // Check if requesting user is team lead
      const requesterMembership = await TeamMember.findOne({
        teamId,
        userId: requestingUserId,
      });

      if (!requesterMembership || !requesterMembership.isTeamLead) {
        return {
          success: false,
          message: 'Only team leads can deactivate members',
          statusCode: 403,
        };
      }

      // Find member to deactivate
      const memberToDeactivate = await TeamMember.findOne({
        teamId,
        userId: memberId,
      });

      if (!memberToDeactivate) {
        return {
          success: false,
          message: 'Member not found in team',
          statusCode: 404,
        };
      }

      // Cannot deactivate yourself
      if (memberId === requestingUserId) {
        return {
          success: false,
          message: 'You cannot deactivate yourself',
          statusCode: 400,
        };
      }

      // Deactivate member
      memberToDeactivate.isActive = false;
      await memberToDeactivate.save();

      return {
        success: true,
        message: 'Team member deactivated successfully',
        statusCode: 200,
        data: memberToDeactivate.toObject(),
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
        statusCode: 500,
      };
    }
  }

  /**
   * Assign roles to team member
   * Team lead can assign all roles
   * Fund manager can assign fund manager role
   * Food manager can assign food manager role
   */
  async assignRole(
    teamId: string,
    memberId: string,
    requestingUserId: string,
    roleData: {
      isTeamLead?: boolean;
      isFundManager?: boolean;
      isFoodManager?: boolean;
    }
  ) {
    try {
      await connectDB();

      // Check requester's permissions
      const requesterMembership = await TeamMember.findOne({
        teamId,
        userId: requestingUserId,
      });

      if (!requesterMembership) {
        return {
          success: false,
          message: 'You are not a member of this team',
          statusCode: 403,
        };
      }

      // Find member to update
      const memberToUpdate = await TeamMember.findOne({
        teamId,
        userId: memberId,
      });

      if (!memberToUpdate) {
        return {
          success: false,
          message: 'Member not found in team',
          statusCode: 404,
        };
      }

      // Check permissions for each role
      if (roleData.isTeamLead !== undefined && !requesterMembership.isTeamLead) {
        return {
          success: false,
          message: 'Only team leads can assign team lead role',
          statusCode: 403,
        };
      }

      if (roleData.isFundManager !== undefined) {
        if (!requesterMembership.isTeamLead && !requesterMembership.isFundManager) {
          return {
            success: false,
            message: 'Only fund managers or team leads can assign fund manager role',
            statusCode: 403,
          };
        }
      }

      if (roleData.isFoodManager !== undefined) {
        if (!requesterMembership.isTeamLead && !requesterMembership.isFoodManager) {
          return {
            success: false,
            message: 'Only food managers or team leads can assign food manager role',
            statusCode: 403,
          };
        }
      }

      // Update roles
      if (roleData.isTeamLead !== undefined) memberToUpdate.isTeamLead = roleData.isTeamLead;
      if (roleData.isFundManager !== undefined) memberToUpdate.isFundManager = roleData.isFundManager;
      if (roleData.isFoodManager !== undefined) memberToUpdate.isFoodManager = roleData.isFoodManager;

      await memberToUpdate.save();

      return {
        success: true,
        message: 'Roles assigned successfully',
        statusCode: 200,
        data: memberToUpdate.toObject(),
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
        statusCode: 500,
      };
    }
  }

  /**
   * Switch current team for user
   */
  async switchTeam(userId: string, teamId: string) {
    try {
      await connectDB();

      // Check if user is member of this team
      const membership = await TeamMember.findOne({
        teamId,
        userId,
        isActive: true,
      });

      if (!membership) {
        return {
          success: false,
          message: 'You are not an active member of this team',
          statusCode: 403,
        };
      }

      // Update user's current team
      const user = await User.findById(userId);
      if (!user) {
        return {
          success: false,
          message: 'User not found',
          statusCode: 404,
        };
      }

      user.currentTeamId = teamId;
      await user.save();

      return {
        success: true,
        message: 'Team switched successfully',
        statusCode: 200,
        data: {
          currentTeamId: teamId,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
        statusCode: 500,
      };
    }
  }
}
