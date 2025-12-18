import { connectDB } from '@/utils/db';
import BankAccount from '@/models/BankAccount';
import User from '@/models/Users';

export async function addBankAccount(
  userId: string,
  teamId: string,
  authUserId: string,
  bankName: string,
  branch: string,
  accountNo: string,
  accountTitle: string,
  routingNumber: string
) {
  try {
    await connectDB();

    // Check if user is fund manager
    const authUser = await User.findById(authUserId);
    if (!authUser || !authUser.isFundManager) {
      return {
        success: false,
        message: 'Only fund managers can add bank accounts',
        statusCode: 403,
      };
    }

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        message: 'User not found',
        statusCode: 404,
      };
    }

    // Check if account already exists for user in this team
    const existingAccount = await BankAccount.findOne({ userId, teamId });
    if (existingAccount) {
      return {
        success: false,
        message: 'User already has a bank account registered for this team',
        statusCode: 400,
      };
    }

    const bankAccount = new BankAccount({
      teamId,
      userId,
      bankName,
      branch,
      accountNo,
      accountTitle,
      routingNumber,
    });

    const savedAccount = await bankAccount.save();

    return {
      success: true,
      message: 'Bank account added successfully',
      statusCode: 201,
      data: savedAccount.toObject(),
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
      statusCode: 500,
    };
  }
}

export async function getBankAccount(accountId: string, teamId: string) {
  try {
    await connectDB();

    const bankAccount = await BankAccount.findOne({ _id: accountId, teamId }).lean();
    if (!bankAccount) {
      return {
        success: false,
        message: 'Bank account not found',
        statusCode: 404,
      };
    }

    return {
      success: true,
      message: 'Bank account retrieved successfully',
      statusCode: 200,
      data: bankAccount,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
      statusCode: 500,
    };
  }
}

export async function updateBankAccount(
  accountId: string,
  teamId: string,
  authUserId: string,
  bankName?: string,
  branch?: string,
  accountTitle?: string,
  routingNumber?: string
) {
  try {
    await connectDB();

    // Check if user is fund manager
    const authUser = await User.findById(authUserId);
    if (!authUser || !authUser.isFundManager) {
      return {
        success: false,
        message: 'Only fund managers can update bank accounts',
        statusCode: 403,
      };
    }

    const bankAccount = await BankAccount.findOne({ _id: accountId, teamId });
    if (!bankAccount) {
      return {
        success: false,
        message: 'Bank account not found',
        statusCode: 404,
      };
    }

    if (bankName) (bankAccount as any).bankName = bankName;
    if (branch) (bankAccount as any).branch = branch;
    if (accountTitle) (bankAccount as any).accountTitle = accountTitle;
    if (routingNumber) (bankAccount as any).routingNumber = routingNumber;

    const updatedAccount = await bankAccount.save();

    return {
      success: true,
      message: 'Bank account updated successfully',
      statusCode: 200,
      data: updatedAccount.toObject(),
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
      statusCode: 500,
    };
  }
}

export async function deleteBankAccount(
  accountId: string,
  teamId: string,
  authUserId: string
) {
  try {
    await connectDB();

    // Check if user is fund manager
    const authUser = await User.findById(authUserId);
    if (!authUser || !authUser.isFundManager) {
      return {
        success: false,
        message: 'Only fund managers can delete bank accounts',
        statusCode: 403,
      };
    }

    const bankAccount = await BankAccount.findOneAndDelete({ _id: accountId, teamId }).lean();
    if (!bankAccount) {
      return {
        success: false,
        message: 'Bank account not found',
        statusCode: 404,
      };
    }

    return {
      success: true,
      message: 'Bank account deleted successfully',
      statusCode: 200,
      data: bankAccount,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
      statusCode: 500,
    };
  }
}
