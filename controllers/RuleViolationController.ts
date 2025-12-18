import RuleViolation, { IRuleViolationDocument } from '@/models/RuleViolation';
import User from '@/models/Users';
import Rules from '@/models/Rules';
import { connectDB } from '@/utils/db';

/**
 * RuleViolationController
 * Handles rule violation related operations
 */
export class RuleViolationController {
  /**
   * Add a new rule violation
   * Records a rule violation for a user
   * Only fund managers can add violations
   * 
   * @param userId - User ID of the fund manager adding the violation
   * @param teamId - Team ID for team-based data isolation
   * @param violatorId - User ID of the person who violated the rule
   * @param ruleId - ID of the rule that was violated
   * @param additionalAmount - Additional amount to charge
   * @param date - Date when the violation occurred
   * @param note - Optional notes about the violation
   * @returns Promise<IRuleViolationDocument> - The created violation record
   * @throws Error if validation fails or user is not a fund manager
   */
  async addViolation(
    userId: string,
    teamId: string,
    violatorId: string,
    ruleId: string,
    additionalAmount: number,
    date: Date,
    note?: string
  ): Promise<IRuleViolationDocument> {
    // Connect to database
    await connectDB();

    // Check if user is a fund manager
    await this.checkFundManagerPermission(userId, teamId);

    // Validate inputs
    this.validateViolationInputs(violatorId, ruleId, additionalAmount, date);

    // Create new violation record
    const newViolation = await RuleViolation.create({
      teamId,
      violatorId,
      ruleId,
      additionalAmount,
      updatedBy: userId,
      date,
      note: note || '',
    });

    return newViolation;
  }

  /**
   * Validate violation input data
   * 
   * @param violatorId - User ID of the violator
   * @param ruleId - ID of the rule
   * @param additionalAmount - Additional amount to charge
   * @param date - Date of the violation
   * @throws Error if any validation fails
   */
  private validateViolationInputs(
    violatorId: string,
    ruleId: string,
    additionalAmount: number,
    date?: Date
  ): void {
    if (!violatorId || violatorId.trim().length === 0) {
      throw new Error('Violator ID is required');
    }

    if (!ruleId || ruleId.trim().length === 0) {
      throw new Error('Rule ID is required');
    }

    if (typeof additionalAmount !== 'number' || additionalAmount < 0) {
      throw new Error('Valid additional amount is required');
    }

    if (date && !(date instanceof Date)) {
      throw new Error('Valid date is required');
    }
  }

  /**
   * Get all rule violations
   * 
   * @param teamId - Team ID for team-based data isolation
   * @returns Promise<IRuleViolationDocument[]> - Array of all violations
   */
  async getAllViolations(teamId: string): Promise<IRuleViolationDocument[]> {
    await connectDB();
    return await RuleViolation.find({ teamId }).sort({ createdAt: -1 });
  }

  /**
   * Get violation by ID
   * 
   * @param violationId - Violation ID to retrieve
   * @param teamId - Team ID for team-based data isolation
   * @returns Promise<IRuleViolationDocument | null> - The violation object or null if not found
   */
  async getViolationById(violationId: string, teamId: string): Promise<IRuleViolationDocument | null> {
    await connectDB();
    return await RuleViolation.findOne({ _id: violationId, teamId });
  }

  /**
   * Get violations by violator ID
   * 
   * @param violatorId - Violator user ID
   * @param teamId - Team ID for team-based data isolation
   * @returns Promise<IRuleViolationDocument[]> - Array of violations for the user
   */
  async getViolationsByViolator(violatorId: string, teamId: string): Promise<IRuleViolationDocument[]> {
    await connectDB();
    return await RuleViolation.find({ violatorId, teamId }).sort({ createdAt: -1 });
  }

  /**
   * Get violations by rule ID
   * 
   * @param ruleId - Rule ID
   * @param teamId - Team ID for team-based data isolation
   * @returns Promise<IRuleViolationDocument[]> - Array of violations for the rule
   */
  async getViolationsByRule(ruleId: string, teamId: string): Promise<IRuleViolationDocument[]> {
    await connectDB();
    return await RuleViolation.find({ ruleId, teamId }).sort({ createdAt: -1 });
  }

  /**
   * Update violation
   * Only fund managers can update violations
   * 
   * @param userId - User ID of the fund manager updating the violation
   * @param teamId - Team ID for team-based data isolation
   * @param violationId - Violation ID to update
   * @param updateData - Data to update
   * @returns Promise<IRuleViolationDocument | null> - The updated violation object
   * @throws Error if user is not a fund manager
   */
  async updateViolation(
    userId: string,
    teamId: string,
    violationId: string,
    updateData: Partial<IRuleViolationDocument>
  ): Promise<IRuleViolationDocument | null> {
    await connectDB();

    // Check if user is a fund manager
    await this.checkFundManagerPermission(userId, teamId);

    // Validate inputs if violatorId, ruleId, or additionalAmount are being updated
    if (updateData.violatorId || updateData.ruleId || updateData.additionalAmount !== undefined) {
      this.validateViolationInputs(
        updateData.violatorId || '',
        updateData.ruleId || '',
        updateData.additionalAmount !== undefined ? updateData.additionalAmount : 0,
        updateData.date
      );
    }

    // Update the updatedBy field to current user
    updateData.updatedBy = userId;

    return await RuleViolation.findOneAndUpdate({ _id: violationId, teamId }, updateData, { new: true });
  }

  /**
   * Delete violation
   * Only fund managers can delete violations
   * 
   * @param userId - User ID of the fund manager deleting the violation
   * @param teamId - Team ID for team-based data isolation
   * @param violationId - Violation ID to delete
   * @returns Promise<IRuleViolationDocument | null> - The deleted violation object
   * @throws Error if user is not a fund manager
   */
  async deleteViolation(userId: string, teamId: string, violationId: string): Promise<IRuleViolationDocument | null> {
    await connectDB();

    // Check if user is a fund manager
    await this.checkFundManagerPermission(userId, teamId);

    return await RuleViolation.findOneAndDelete({ _id: violationId, teamId });
  }

  /**
   * Check if user has fund manager permission
   * 
   * @param userId - User ID to check
   * @param teamId - Team ID for team-based permission check
   * @throws Error if user is not a fund manager
   */
  private async checkFundManagerPermission(userId: string, teamId: string): Promise<void> {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.isFundManager) {
      throw new Error('Only fund managers can perform this action');
    }
  }
}
