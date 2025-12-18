import Rules, { IRulesDocument } from '@/models/Rules';
import User from '@/models/Users';
import { connectDB } from '@/utils/db';

/**
 * RulesController
 * Handles rules related operations
 */
export class RulesController {
  /**
   * Add a new rule
   * Creates a new rule record
   * Only fund managers can add rules
   * 
   * @param userId - User ID of the person adding the rule
   * @param teamId - Team ID
   * @param title - Title of the rule
   * @param amount - Amount associated with the rule
   * @param description - Optional description of the rule
   * @returns Promise<IRulesDocument> - The created rule object
   * @throws Error if validation fails or user is not a fund manager
   */
  async addRule(
    userId: string,
    teamId: string,
    title: string,
    amount: number,
    description?: string
  ): Promise<IRulesDocument> {
    // Connect to database
    await connectDB();

    // Check if user is a fund manager
    await this.checkFundManagerPermission(userId, teamId);

    // Validate inputs
    this.validateRuleInputs(title, amount);

    // Create new rule record
    const newRule = await Rules.create({
      teamId,
      title,
      amount,
      description: description || '',
    });

    return newRule;
  }

  /**
   * Validate rule input data
   * 
   * @param title - Title of the rule
   * @param amount - Amount associated with the rule
   * @throws Error if any validation fails
   */
  private validateRuleInputs(title: string, amount: number): void {
    if (!title || title.trim().length === 0) {
      throw new Error('Rule title is required');
    }

    if (typeof amount !== 'number' || amount < 0) {
      throw new Error('Valid amount is required');
    }
  }

  /**
   * Get all rules for team
   * 
   * @param teamId - Team ID
   * @returns Promise<IRulesDocument[]> - Array of all rules in team
   */
  async getAllRules(teamId: string): Promise<IRulesDocument[]> {
    await connectDB();
    return await Rules.find({ teamId }).sort({ createdAt: -1 });
  }

  /**
   * Get rule by ID
   * 
   * @param ruleId - Rule ID to retrieve
   * @param teamId - Team ID for verification
   * @returns Promise<IRulesDocument | null> - The rule object or null if not found
   */
  async getRuleById(ruleId: string, teamId: string): Promise<IRulesDocument | null> {
    await connectDB();
    return await Rules.findOne({ _id: ruleId, teamId });
  }

  /**
   * Update rule
   * Only fund managers can update rules
   * 
   * @param userId - User ID of the person updating the rule
   * @param teamId - Team ID
   * @param ruleId - Rule ID to update
   * @param updateData - Data to update
   * @returns Promise<IRulesDocument | null> - The updated rule object
   * @throws Error if user is not a fund manager
   */
  async updateRule(
    userId: string,
    teamId: string,
    ruleId: string,
    updateData: Partial<IRulesDocument>
  ): Promise<IRulesDocument | null> {
    await connectDB();

    // Check if user is a fund manager
    await this.checkFundManagerPermission(userId, teamId);

    // Validate inputs if title or amount are being updated
    if (updateData.title || updateData.amount !== undefined) {
      this.validateRuleInputs(
        updateData.title || '',
        updateData.amount !== undefined ? updateData.amount : 0
      );
    }

    return await Rules.findOneAndUpdate({ _id: ruleId, teamId }, updateData, { new: true });
  }

  /**
   * Delete rule
   * Only fund managers can delete rules
   * 
   * @param userId - User ID of the person deleting the rule
   * @param teamId - Team ID
   * @param ruleId - Rule ID to delete
   * @returns Promise<IRulesDocument | null> - The deleted rule object
   * @throws Error if user is not a fund manager
   */
  async deleteRule(userId: string, teamId: string, ruleId: string): Promise<IRulesDocument | null> {
    await connectDB();

    // Check if user is a fund manager
    await this.checkFundManagerPermission(userId, teamId);

    return await Rules.findOneAndDelete({ _id: ruleId, teamId });
  }

  /**
   * Check if user has fund manager permission in team
   * 
   * @param userId - User ID to check
   * @param teamId - Team ID
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
