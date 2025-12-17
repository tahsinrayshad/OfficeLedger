import User, { IUserDocument } from '@/models/Users';
import { connectDB } from '@/utils/db';
import { hashPassword, generateToken, comparePassword } from '@/utils/auth';

/**
 * AuthController
 * Handles authentication related operations
 */
export class AuthController {
  /**
   * Signup function
   * Creates a new user account with the provided credentials
   * 
   * @param fullName - User's full name
   * @param email - User's email address
   * @param phone - User's phone number
   * @param password - User's password (will be hashed before storage)
   * @param dob - User's date of birth
   * @param isFundManager - Whether user is a fund manager
   * @param isFoodManager - Whether user is a food manager
   * @param isTeamLead - Whether user is a team lead
   * @returns Promise<{user: IUserDocument, token: string}> - The created user object and JWT token
   * @throws Error if validation fails or user already exists
   */
  async signup(
    fullName: string,
    email: string,
    phone: string,
    password: string,
    dob: Date,
    isFundManager: boolean = false,
    isFoodManager: boolean = false,
    isTeamLead: boolean = false,
    team?: string
  ): Promise<{ user: IUserDocument; token: string }> {
    // Validate inputs
    this.validateSignupInputs(fullName, email, phone, password, dob);

    // Connect to database
    await connectDB();

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create new user in database
    const newUser = await User.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
      dob,
      isFundManager,
      isFoodManager,
      isTeamLead,
      team: team || '',
      isActive: true, // isActive defaults to true for new users
    });

    // Generate JWT token
    const token = generateToken(newUser._id.toString(), newUser.email);

    return { user: newUser, token };
  }

  /**
   * Signin function
   * Authenticates a user with email and password
   * 
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise<{user: IUserDocument, token: string}> - The authenticated user object and JWT token
   * @throws Error if validation fails or credentials are invalid
   */
  async signin(
    email: string,
    password: string
  ): Promise<{ user: IUserDocument; token: string }> {
    // Validate inputs
    if (!email || !this.isValidEmail(email)) {
      throw new Error('Valid email is required');
    }

    if (!password) {
      throw new Error('Password is required');
    }

    // Connect to database
    await connectDB();

    // Find user by email and include password field (since it's set to select: false by default)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('User not found');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('User account is inactive');
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.email);

    return { user, token };
  }

  /**
   * Update user profile
   * Users can update their own profile, fund managers can update any user
   * 
   * @param userId - User ID of the person making the request
   * @param targetUserId - User ID of the user to update
   * @param updateData - Data to update
   * @returns Promise<IUserDocument> - The updated user object
   * @throws Error if user doesn't have permission or user not found
   */
  async updateUser(
    userId: string,
    targetUserId: string,
    updateData: Partial<IUserDocument>
  ): Promise<IUserDocument | null> {
    // Connect to database
    await connectDB();

    // Check if user is trying to update their own profile or is a fund manager
    if (userId !== targetUserId) {
      const requestingUser = await User.findById(userId);
      if (!requestingUser || !requestingUser.isFundManager) {
        throw new Error('You can only update your own profile');
      }
    }

    // Find user to update
    const user = await User.findById(targetUserId);
    if (!user) {
      throw new Error('User not found');
    }

    // Validate email if being updated
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await User.findOne({ email: updateData.email });
      if (existingUser) {
        throw new Error('Email is already in use');
      }
    }

    // Update allowed fields
    if (updateData.fullName) user.fullName = updateData.fullName;
    if (updateData.email) user.email = updateData.email;
    if (updateData.phone) user.phone = updateData.phone;
    if (updateData.team !== undefined) user.team = updateData.team;

    // Only fund managers can update these fields
    const requestingUser = await User.findById(userId);
    if (requestingUser?.isFundManager) {
      if (updateData.isFundManager !== undefined) user.isFundManager = updateData.isFundManager;
      if (updateData.isFoodManager !== undefined) user.isFoodManager = updateData.isFoodManager;
      if (updateData.isTeamLead !== undefined) user.isTeamLead = updateData.isTeamLead;
      if (updateData.isActive !== undefined) user.isActive = updateData.isActive;
    }

    await user.save();
    return user;
  }

  /**
   * Validate signup input data
   * 
   * @param fullName - User's full name
   * @param email - User's email address
   * @param phone - User's phone number
   * @param password - User's password
   * @param dob - User's date of birth
   * @throws Error if any validation fails
   */
  private validateSignupInputs(
    fullName: string,
    email: string,
    phone: string,
    password: string,
    dob: Date
  ): void {
    if (!fullName || fullName.trim().length === 0) {
      throw new Error('Full name is required');
    }

    if (!email || !this.isValidEmail(email)) {
      throw new Error('Valid email is required');
    }

    if (!phone || !this.isValidPhone(phone)) {
      throw new Error('Valid phone number is required');
    }

    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    if (!dob || !(dob instanceof Date)) {
      throw new Error('Valid date of birth is required');
    }

    // Check if user is at least 18 years old
    const age = this.calculateAge(dob);
    if (age < 18) {
      throw new Error('User must be at least 18 years old');
    }
  }

  /**
   * Validate email format
   * 
   * @param email - Email address to validate
   * @returns boolean - True if email is valid
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format
   * 
   * @param phone - Phone number to validate
   * @returns boolean - True if phone is valid
   */
  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[0-9\-\+\(\)\s]{10,}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Calculate age from date of birth
   * 
   * @param dob - Date of birth
   * @returns number - Age in years
   */
  private calculateAge(dob: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return age;
  }

  /**
   * Request password reset
   * Generates a reset token and stores it with expiry
   * 
   * @param email - User's email address
   * @returns Promise<{success: boolean, message: string, statusCode: number}>
   */
  async requestPasswordReset(email: string): Promise<{
    success: boolean;
    message: string;
    statusCode: number;
    data?: { resetToken: string; expiresIn: string };
  }> {
    try {
      if (!email || !this.isValidEmail(email)) {
        return {
          success: false,
          message: 'Valid email is required',
          statusCode: 400,
        };
      }

      await connectDB();

      const user = await User.findOne({ email });
      if (!user) {
        return {
          success: false,
          message: 'User with this email not found',
          statusCode: 404,
        };
      }

      // Generate reset token (random 32 character string)
      const resetToken = Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

      // Set token expiry to 1 hour from now
      const expiryTime = new Date(Date.now() + 3600000);

      // Update user with reset token and expiry
      user.resetToken = resetToken;
      user.resetTokenExpiry = expiryTime;
      await user.save();

      return {
        success: true,
        message: 'Password reset token generated successfully',
        statusCode: 200,
        data: {
          resetToken,
          expiresIn: '1 hour',
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
   * Reset password using reset token
   * Validates token and updates password
   * 
   * @param email - User's email address
   * @param resetToken - Reset token from password reset request
   * @param newPassword - New password
   * @returns Promise<{success: boolean, message: string, statusCode: number}>
   */
  async resetPassword(
    email: string,
    resetToken: string,
    newPassword: string
  ): Promise<{
    success: boolean;
    message: string;
    statusCode: number;
  }> {
    try {
      if (!email || !this.isValidEmail(email)) {
        return {
          success: false,
          message: 'Valid email is required',
          statusCode: 400,
        };
      }

      if (!resetToken || resetToken.trim() === '') {
        return {
          success: false,
          message: 'Reset token is required',
          statusCode: 400,
        };
      }

      if (!newPassword || newPassword.length < 8) {
        return {
          success: false,
          message: 'Password must be at least 8 characters long',
          statusCode: 400,
        };
      }

      await connectDB();

      const user = await User.findOne({ email }).select('+resetToken +resetTokenExpiry');
      if (!user) {
        return {
          success: false,
          message: 'User with this email not found',
          statusCode: 404,
        };
      }

      // Check if reset token is valid and not expired
      if (!user.resetToken || user.resetToken !== resetToken) {
        return {
          success: false,
          message: 'Invalid reset token',
          statusCode: 400,
        };
      }

      if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
        return {
          success: false,
          message: 'Reset token has expired',
          statusCode: 400,
        };
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);

      // Update user with new password and clear reset token
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();

      return {
        success: true,
        message: 'Password reset successfully',
        statusCode: 200,
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
   * Get current logged in user info
   * 
   * @param userId - User ID from JWT token
   * @returns Promise<{success: boolean, message: string, statusCode: number, data?: object}>
   */
  async getCurrentUser(userId: string): Promise<{
    success: boolean;
    message: string;
    statusCode: number;
    data?: IUserDocument;
  }> {
    try {
      if (!userId) {
        return {
          success: false,
          message: 'User ID is required',
          statusCode: 400,
        };
      }

      await connectDB();

      const user = await User.findById(userId).select('-password');
      if (!user) {
        return {
          success: false,
          message: 'User not found',
          statusCode: 404,
        };
      }

      return {
        success: true,
        message: 'User information retrieved successfully',
        statusCode: 200,
        data: user,
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
