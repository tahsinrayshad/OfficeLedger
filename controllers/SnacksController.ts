import Snack, { ISnackDocument, IContribution } from '@/models/Snacks';
import User from '@/models/Users';
import { connectDB } from '@/utils/db';

/**
 * SnacksController
 * Handles snacks related operations
 */
export class SnacksController {
  /**
   * Add a new snack
   * Creates a new snack record with contributions
   * Only food managers can add snacks
   * 
   * @param userId - User ID of the person adding the snack
   * @param foodItem - Name of the food item
   * @param expense - Total expense amount
   * @param contributions - Array of contributions with userId and amount
   * @param date - Date of the snack event
   * @param note - Optional notes
   * @returns Promise<ISnackDocument> - The created snack object
   * @throws Error if validation fails or user is not a food manager
   */
  async addSnacks(
    userId: string,
    foodItem: string,
    expense: number,
    contributions: IContribution[],
    date: Date,
    note?: string
  ): Promise<ISnackDocument> {
    // Connect to database
    await connectDB();

    // Check if user is a food manager
    await this.checkFoodManagerPermission(userId);

    // Validate inputs
    this.validateSnackInputs(foodItem, expense, contributions, date);

    // Calculate total contribution
    const totalContribution = contributions.reduce((sum, contrib) => sum + contrib.amount, 0);

    // Create new snack record
    const newSnack = await Snack.create({
      foodItem,
      expense,
      contributions,
      totalContribution,
      date,
      note: note || '',
    });

    return newSnack;
  }

  /**
   * Validate snack input data
   * 
   * @param foodItem - Name of the food item
   * @param expense - Total expense amount
   * @param contributions - Array of contributions
   * @param date - Date of the snack event
   * @throws Error if any validation fails
   */
  private validateSnackInputs(
    foodItem: string,
    expense: number,
    contributions: IContribution[],
    date: Date
  ): void {
    if (!foodItem || foodItem.trim().length === 0) {
      throw new Error('Food item name is required');
    }

    if (typeof expense !== 'number' || expense < 0) {
      throw new Error('Valid expense amount is required');
    }

    if (!Array.isArray(contributions) || contributions.length === 0) {
      throw new Error('At least one contribution is required');
    }

    // Validate each contribution
    for (const contribution of contributions) {
      if (!contribution.userId || contribution.userId.trim().length === 0) {
        throw new Error('Each contribution must have a valid user ID');
      }

      if (typeof contribution.amount !== 'number' || contribution.amount < 0) {
        throw new Error('Each contribution must have a valid amount');
      }
    }

    if (!date || !(date instanceof Date)) {
      throw new Error('Valid date is required');
    }

    // Check if date is not in the future
    const today = new Date();
    if (date > today) {
      throw new Error('Date cannot be in the future');
    }
  }

  /**
   * Get all snacks
   * 
   * @returns Promise<ISnackDocument[]> - Array of all snacks
   */
  async getAllSnacks(): Promise<ISnackDocument[]> {
    await connectDB();
    return await Snack.find().sort({ date: -1 });
  }

  /**
   * Get snack by ID
   * 
   * @param snackId - Snack ID to retrieve
   * @returns Promise<ISnackDocument | null> - The snack object or null if not found
   */
  async getSnackById(snackId: string): Promise<ISnackDocument | null> {
    await connectDB();
    return await Snack.findById(snackId);
  }

  /**
   * Get snacks by date range
   * 
   * @param startDate - Start date for the range
   * @param endDate - End date for the range
   * @returns Promise<ISnackDocument[]> - Array of snacks within the date range
   */
  async getSnacksByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<ISnackDocument[]> {
    await connectDB();
    return await Snack.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ date: -1 });
  }

  /**
   * Update snack
   * Only food managers can update snacks
   * 
   * @param userId - User ID of the person updating the snack
   * @param snackId - Snack ID to update
   * @param updateData - Data to update
   * @returns Promise<ISnackDocument | null> - The updated snack object
   * @throws Error if user is not a food manager
   */
  async updateSnack(
    userId: string,
    snackId: string,
    updateData: Partial<ISnackDocument>
  ): Promise<ISnackDocument | null> {
    await connectDB();

    // Check if user is a food manager
    await this.checkFoodManagerPermission(userId);

    return await Snack.findByIdAndUpdate(snackId, updateData, { new: true });
  }

  /**
   * Delete snack
   * Only food managers can delete snacks
   * 
   * @param userId - User ID of the person deleting the snack
   * @param snackId - Snack ID to delete
   * @returns Promise<ISnackDocument | null> - The deleted snack object
   * @throws Error if user is not a food manager
   */
  async deleteSnack(userId: string, snackId: string): Promise<ISnackDocument | null> {
    await connectDB();

    // Check if user is a food manager
    await this.checkFoodManagerPermission(userId);

    return await Snack.findByIdAndDelete(snackId);
  }

  /**
   * Check if user has food manager permission
   * 
   * @param userId - User ID to check
   * @throws Error if user is not a food manager
   */
  private async checkFoodManagerPermission(userId: string): Promise<void> {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.isFoodManager) {
      throw new Error('Only food managers can perform this action');
    }
  }
}
