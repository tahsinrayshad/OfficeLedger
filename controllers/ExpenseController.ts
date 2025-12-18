import { connectDB } from '@/utils/db';
import Expense from '@/models/Expense';
import User from '@/models/Users';

export async function addExpense(
  userId: string,
  teamId: string,
  amount: number,
  reason: string,
  date?: Date
) {
  try {
    await connectDB();

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        message: 'User not found',
        statusCode: 404,
      };
    }

    // Validate amount
    if (amount < 0) {
      return {
        success: false,
        message: 'Amount must be non-negative',
        statusCode: 400,
      };
    }

    const expense = new Expense({
      teamId,
      userId,
      amount,
      reason,
      date: date || new Date(),
    });

    const savedExpense = await expense.save();

    // Get user info for response
    const expenseUser = await User.findById(savedExpense.userId).select('-password').lean();

    return {
      success: true,
      message: 'Expense added successfully',
      statusCode: 201,
      data: {
        ...savedExpense.toObject(),
        user: expenseUser,
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

export async function getAllExpenses(teamId: string) {
  try {
    await connectDB();

    const expenses = await Expense.find({ teamId }).lean();

    // Enrich with user data
    const enrichedExpenses = await Promise.all(
      expenses.map(async (expense: any) => {
        const user = await User.findById(expense.userId).select('-password').lean();
        return {
          ...expense,
          user,
        };
      })
    );

    return {
      success: true,
      message: 'Expenses retrieved successfully',
      statusCode: 200,
      data: enrichedExpenses,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
      statusCode: 500,
    };
  }
}

export async function getExpenseById(expenseId: string, teamId: string) {
  try {
    await connectDB();

    const expense = await Expense.findOne({ _id: expenseId, teamId }).lean();
    if (!expense) {
      return {
        success: false,
        message: 'Expense not found',
        statusCode: 404,
      };
    }

    // Get user info
    const user = await User.findById((expense as any).userId).select('-password').lean();

    return {
      success: true,
      message: 'Expense retrieved successfully',
      statusCode: 200,
      data: {
        ...expense,
        user,
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

export async function getExpensesByUser(userId: string, teamId: string) {
  try {
    await connectDB();

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        message: 'User not found',
        statusCode: 404,
      };
    }

    const expenses = await Expense.find({ userId, teamId }).lean();

    // Enrich with user data
    const enrichedExpenses = await Promise.all(
      expenses.map(async (expense: any) => {
        const expenseUser = await User.findById(expense.userId).select('-password').lean();
        return {
          ...expense,
          user: expenseUser,
        };
      })
    );

    return {
      success: true,
      message: 'Expenses retrieved successfully',
      statusCode: 200,
      data: enrichedExpenses,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
      statusCode: 500,
    };
  }
}

export async function updateExpense(
  expenseId: string,
  teamId: string,
  amount?: number,
  reason?: string,
  date?: Date
) {
  try {
    await connectDB();

    const expense = await Expense.findOne({ _id: expenseId, teamId });
    if (!expense) {
      return {
        success: false,
        message: 'Expense not found',
        statusCode: 404,
      };
    }

    if (amount !== undefined) {
      if (amount < 0) {
        return {
          success: false,
          message: 'Amount must be non-negative',
          statusCode: 400,
        };
      }
      (expense as any).amount = amount;
    }

    if (reason) (expense as any).reason = reason;
    if (date) (expense as any).date = date;

    const updatedExpense = await expense.save();

    // Get user info for response
    const user = await User.findById((updatedExpense as any).userId).select('-password').lean();

    return {
      success: true,
      message: 'Expense updated successfully',
      statusCode: 200,
      data: {
        ...(updatedExpense as any).toObject(),
        user,
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

export async function deleteExpense(expenseId: string, teamId: string) {
  try {
    await connectDB();

    const expense = await Expense.findOneAndDelete({ _id: expenseId, teamId }).lean();
    if (!expense) {
      return {
        success: false,
        message: 'Expense not found',
        statusCode: 404,
      };
    }

    // Get user info for response
    const user = await User.findById((expense as any).userId).select('-password').lean();

    return {
      success: true,
      message: 'Expense deleted successfully',
      statusCode: 200,
      data: {
        ...expense,
        user,
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